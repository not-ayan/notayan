import os
import sys
import argparse
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed

# Optional JXL support via pillow-jxl-plugin
# Install with: pip install pillow-jxl-plugin
try:
    import pillow_jxl  # noqa: F401 — patches PIL with JXL codec
    JXL_AVAILABLE = True
except ImportError:
    JXL_AVAILABLE = False

def get_size_format(b, factor=1024, suffix="B"):
    """Scale bytes to its proper format (e.g. 1024 -> 1.00KB)"""
    for unit in ["", "K", "M", "G", "T", "P"]:
        if b < factor:
            return f"{b:.2f}{unit}{suffix}"
        b /= factor
    return f"{b:.2f}Y{suffix}"

def update_code_references(project_root, conversion_map):
    """
    Scans the codebase for references to the converted images and replaces
    them with their WebP equivalents.
    """
    extensions_to_scan = {'.tsx', '.ts', '.css', '.json', '.html', '.js', '.jsx'}
    exclude_dirs = {'.git', 'node_modules', 'dist', '.next', 'build'}
    
    print("\nScanning codebase for image references to update...")
    
    updated_files_count = 0
    total_replacements = 0
    
    # Sort keys by length descending to replace longer paths first and avoid partial matches
    sorted_keys = sorted(conversion_map.keys(), key=len, reverse=True)

    for root, dirs, files in os.walk(project_root):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() not in extensions_to_scan:
                continue
                
            if file_path.name == 'convert_images.py':
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                original_content = content
                file_replacements = 0
                
                for old_path in sorted_keys:
                    new_path = conversion_map[old_path]
                    
                    # Convert to forward slashes for URLs / paths in code
                    web_path_abs = f"/{old_path.replace(os.sep, '/')}"
                    new_web_path_abs = f"/{new_path.replace(os.sep, '/')}"
                    
                    if web_path_abs in content:
                        count = content.count(web_path_abs)
                        content = content.replace(web_path_abs, new_web_path_abs)
                        file_replacements += count
                        
                    web_path_rel = old_path.replace(os.sep, '/')
                    new_web_path_rel = new_path.replace(os.sep, '/')
                    if web_path_rel in content:
                        count = content.count(web_path_rel)
                        content = content.replace(web_path_rel, new_web_path_rel)
                        file_replacements += count

                if file_replacements > 0:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"  Updated {file_replacements} reference(s) in: {file_path.relative_to(project_root)}")
                    total_replacements += file_replacements
                    updated_files_count += 1
                    
            except Exception as e:
                print(f"  Error updating references in {file}: {e}")
                
    print(f"Updated {total_replacements} references across {updated_files_count} files.")

def convert_single_image(img_path, target_dir, delete_original, quality):
    """Worker function to convert a single image to WebP (and optionally JXL)."""
    results = []
    try:
        original_size = img_path.stat().st_size
        webp_path = img_path.with_suffix('.webp')

        with Image.open(img_path) as img:
            img_rgb = img.convert('RGB') if img.mode not in ('RGB', 'RGBA') else img

            # --- WebP ---
            img_rgb.save(webp_path, format='WEBP', quality=quality, optimize=True)
            webp_size = webp_path.stat().st_size

            # --- JPEG XL ---
            jxl_size = None
            if JXL_AVAILABLE:
                jxl_path = img_path.with_suffix('.jxl')
                img_rgb.save(jxl_path, format='JXL', quality=quality)
                jxl_size = jxl_path.stat().st_size

        if delete_original:
            img_path.unlink()

        return {
            'status': 'success',
            'img_path': img_path,
            'webp_path': webp_path,
            'original_size': original_size,
            'webp_size': webp_size,
            'jxl_size': jxl_size,
            'savings_pct': (original_size - webp_size) / original_size * 100 if original_size else 0,
            'deleted': delete_original,
        }
    except Exception as e:
        return {
            'status': 'error',
            'img_path': img_path,
            'error': str(e)
        }

def convert_images(delete_original=False, quality=85, update_refs=False):
    script_dir = Path(__file__).resolve().parent
    print(f"Scanning directory: {script_dir}")
    if not JXL_AVAILABLE:
        print("⚠  JXL support not available. Install with: pip install pillow-jxl-plugin")
    else:
        print("✓  JXL support enabled (pillow-jxl-plugin)")
    
    extensions = {'.png', '.jpg', '.jpeg','.webp'}
    image_paths = []
    
    exclude_dirs = {'.git', 'node_modules', 'dist', '.next', 'build'}
    
    # Gather all images recursively within the script's directory (excluding build/dependency dirs)
    for root, dirs, files in os.walk(script_dir):
        # Pruning the search to avoid scanning dependency and build folders
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in extensions:
                image_paths.append(Path(root) / file)

    if not image_paths:
        print("No JPG, JPEG, or PNG images found in this folder.")
        return

    print(f"Found {len(image_paths)} images to convert.")
    
    conversion_map = {}
    total_original_size = 0
    total_webp_size = 0
    total_jxl_size = 0
    converted_count = 0
    failed_count = 0
    deleted_count = 0
    
    # Run conversion in parallel using a ThreadPoolExecutor
    max_workers = min(32, (os.cpu_count() or 1) + 4)
    print(f"Converting in parallel using {max_workers} threads...")
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_path = {
            executor.submit(convert_single_image, path, script_dir, delete_original, quality): path 
            for path in image_paths
        }
        
        for future in as_completed(future_to_path):
            img_path = future_to_path[future]
            try:
                res = future.result()
                if res['status'] == 'success':
                    original_size = res['original_size']
                    webp_size = res['webp_size']
                    jxl_size = res.get('jxl_size')
                    total_original_size += original_size
                    total_webp_size += webp_size
                    if jxl_size:
                        total_jxl_size += jxl_size
                    converted_count += 1
                    if res['deleted']:
                        deleted_count += 1

                    jxl_info = f" | JXL {get_size_format(jxl_size)}" if jxl_size else ""
                    print(f"Converted: {img_path.relative_to(script_dir)} -> WebP {get_size_format(webp_size)}{jxl_info} "
                          f"(was {get_size_format(original_size)}, saved {res['savings_pct']:.1f}%)")

                    conversion_map[str(img_path.relative_to(script_dir))] = str(res['webp_path'].relative_to(script_dir))
                else:
                    print(f"Failed to convert {img_path.name}: {res['error']}")
                    failed_count += 1
            except Exception as e:
                print(f"Exception during conversion of {img_path.name}: {e}")
                failed_count += 1

    print("\n" + "="*50)
    print("Conversion Summary")
    print("="*50)
    print(f"Successfully converted: {converted_count}/{len(image_paths)}")
    if failed_count > 0:
        print(f"Failed conversions: {failed_count}")
    print(f"Original total size:  {get_size_format(total_original_size)}")
    print(f"WebP total size:      {get_size_format(total_webp_size)}")
    if total_jxl_size:
        print(f"JXL total size:       {get_size_format(total_jxl_size)}")
    if total_original_size > 0:
        total_savings = total_original_size - total_webp_size
        savings_pct = (total_savings / total_original_size) * 100
        print(f"Total space saved:    {get_size_format(total_savings)} ({savings_pct:.1f}%)")
        
    if delete_original:
        print(f"Deleted {deleted_count} original files.")
    else:
        print("Original files were kept.")
        
    # Update codebase references if requested
    if update_refs and conversion_map:
        update_code_references(script_dir, conversion_map)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert JPG, JPEG, and PNG images to WebP recursively within the script's directory.")
    parser.add_argument("--delete", action="store_true", help="Delete original images after successful conversion")
    parser.add_argument("--quality", type=int, default=85, help="WebP quality (1-100, default: 85)")
    parser.add_argument("--update-refs", action="store_true", help="Update references in the codebase to point to webp")
    args = parser.parse_args()

    convert_images(
        delete_original=args.delete, 
        quality=args.quality,
        update_refs=args.update_refs
    )
