import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { useAxionData, formatDate, formatFileSize } from '../hooks/useAxionData';

type Post = {
  id: string;
  type: 'article' | 'rom';
  category: string;
  title: string;
  subtitle?: string;
  date: string;
  readTime?: string;
  excerpt: string;
  image?: string;
  content?: string;
  resources?: {
    title: string;
    links: { label: string; href: string }[];
  }[];
};

const BLOG_POSTS: Post[] = [
  {
    id: 'reverse-engineering-aula-f75',
    type: 'article',
    category: 'Reverse Engineering',
    title: 'Reverse Engineering the AULA F75: From Decompiled Bloatware to an Open Web Controller',
    date: 'Sep 22, 2026',
    readTime: '10 min read',
    excerpt: 'How we reverse-engineered the AULA F75\'s proprietary USB protocol from scratch—decompiling official software, capturing USB traffic with Wireshark, decoding the MCU\'s memory maps, and building OpenAULA Web with WebHID.',
    content: `When you buy an enthusiast budget mechanical keyboard like the **AULA F75** (or its sister board, the F87), you get gasket-mounted typing, pre-lubed switches, and solid wireless/wired capabilities. But you also inherit the dark side of PC peripherals: **OEM configuration software**.

The official driver is a Windows-only Electron/C++ app. It demands administrative privileges, runs background telemetry services, takes up hundreds of megabytes of disk space, and refuses to run on Linux, macOS, or Chromebooks.

This is the complete technical story of how we reverse-engineered the AULA F75's proprietary USB protocol from scratch—decompiling the official desktop client, capturing raw USB traffic with Wireshark, decoding the MCU's memory maps and packet structures, fixing deep hardware quirks, and building **OpenAULA Web**, a zero-install WebHID controller that runs entirely inside any modern web browser.

> **Live App**: [openaula.vercel.app](https://openaula.vercel.app) — no install, no driver, open in any Chromium-based browser with your keyboard plugged in.

---

## 1. The Target: Hardware & Architecture

Before diving into packet captures, we needed to know what microcontroller (MCU) was driving the board.

- **Device Name**: AULA F75 Mechanical Keyboard
- **USB Vendor ID (VID)**: \`0x258A\` (Sinowealth / SinoWealth Electronic Ltd.)
- **USB Product ID (PID)**: \`0x010C\` (Common Sinowealth Gaming Keyboard Controller)
- **HID Interface**: Interface \`1\` (\`MI_01\`), Usage Page \`0xFF00\` / Usage \`0x0001\` (Vendor-defined HID communication interface)
- **Report Size**: 520 bytes (Report ID \`0x06\` / \`0x0A\`) & 136-byte device configuration blocks

Sinowealth MCUs (like the SH68F88/SH68F90 family) are widely used across budget gaming peripherals (EPOMAKER, AULA, Royal Kludge, Redragon). Instead of standard QMK/VIA firmware, these chips run proprietary vendor firmware with rigid USB HID Feature Report commands.

---

## 2. Decompiling the Official Software

Our first step was static analysis of the official AULA distribution installer.

Extracting the application bundle revealed an Electron shell wrapping a native backend with packed configuration files and dynamic libraries (\`.dll\`).

### Discovering \`KB.ini\`
Buried inside the software assets was \`KB.ini\`, the master hardware descriptor used by the desktop app:

\`\`\`ini
[Device]
VID=0x258A
PID=0x010C
Name=AULA F75
Layout=75Key
ReportID=6
ReportLen=520
ConfigLen=136

[Effects]
Count=18
0=Off
1=Static
2=Breathing
3=Wave
4=Spectrum
5=Rain
7=Ripple
8=Starlight
10=Snake
11=Aurora
12=Reactive
13=Marquee
15=Circle
16=RainDown
17=CenterRipple
18=Custom
\`\`\`

This configuration file provided vital clues:
1. **Missing Effect IDs**: Notice that IDs \`6\`, \`9\`, and \`14\` were omitted from the list. The firmware skips these IDs internally. Attempting to set effect ID \`6\` causes the MCU to either reject the command or fall back into an undefined hardware lockup.
2. **Packet Boundaries**: The hardware communicated using 520-byte HID Feature Reports on Report ID \`0x06\`.
3. **Configuration Structure**: The keyboard stored its persistent profile in a 136-byte memory table.

---

## 3. USB Protocol Analysis & Traffic Captures

With static targets established, we connected the keyboard through a USB analyzer and used Wireshark with USBPcap to capture live traffic from the OEM app across several test scenarios:

### Capture 1: Baseline Handshake & Static Colors (\`capture.pcap\`)
- When the desktop software connects, it first sends a 14-byte handshake query:
\`\`\`
Host -> Device (CMD 0x82):
06 82 00 00 00 00 00 00 00 00 00 00 00 00

Device -> Host (Model Response):
06 82 01 00 01 00 06 00 03 00 00 00 03 66
\`\`\`
- Sending a static color (e.g. Pure Red \`#FF0000\`) revealed that the keyboard does not update lighting with a single packet. Instead, it follows a **4-step atomic commit transaction**.

### Capture 2: Dynamic Effects & Color Channels (\`capture2.pcap\`)
- Toggling between Rainbow Wave, Breathing, and Static modes proved that dynamic hardware effects and custom per-key lighting use completely distinct packet structures:
  - **Dynamic Shaders**: Controlled via a 136-byte device configuration block (\`CMD 0x04\`).
  - **Custom Per-Key RGB**: Transmitted as a 520-byte planar frame (\`CMD 0x06\`) or grouped color bank (\`CMD 0x0A\`).

### Capture 3: Speeds, Brightness, and Keystroke Response (\`capture3.pcap\`)
- Dissected the sub-registers for effect speed (5 levels: 0x00 to 0x04) and brightness (5 levels: 0x00 to 0x04), confirming their offsets inside the 136-byte configuration payload.

---

## 4. Cracking the Protocol

### 4.1 The 4-Step Hardware Commit Transaction
One of the most critical discoveries was that simply writing RGB data to the keyboard does **not** persist it. The Sinowealth MCU requires a strict 4-step sequence:

\`\`\`
1. Send Feature Report (520 bytes: CMD 0x06 or 0x0A)
   └─ Staged in volatile frame buffer
2. Commit Trigger (CMD 0x84)
   └─ Flash write latch enabled
3. Read Device Config (GET_REPORT 136 bytes)
   └─ Validates hardware state and offsets
4. Writeback Config (CMD 0x04 with custom_flag = 1)
   └─ Lighting active and stored to EEPROM
\`\`\`

If any step is skipped or executed out of order, the MCU discards the payload, resulting in unresponsive keys or flashing glitch artifacts.

---

### 4.2 The Two Lighting Modes

The AULA F75 supports two distinct ways to paint its LEDs:

#### A. Planar RGB Mode (\`CMD 0x06\`)
Instead of standard interleaved RGB (\`[R, G, B, R, G, B...]\`), the F75's frame buffer organizes colors into three independent 126-byte color planes:

| Byte Offset | Plane Length | Description |
| :--- | :--- | :--- |
| \`0x00\` | 1 byte | Report ID (\`0x06\`) |
| \`0x01\` | 1 byte | Command Code (\`0x06\` = Per-Key Planar) |
| \`0x02 - 0x06\` | 5 bytes | Reserved / Zero Padding |
| \`0x07 - 0x84\` | 126 bytes | **Red Plane** (Red channel for keys 0..125) |
| \`0x85 - 0x102\`| 126 bytes | **Green Plane** (Green channel for keys 0..125) |
| \`0x103 - 0x180\`| 126 bytes | **Blue Plane** (Blue channel for keys 0..125) |
| \`0x181 - 0x207\`| 135 bytes | Tail Padding (Zeros) |

#### B. Custom Profile Mode & The 21-Byte Hardware Alignment Gap (\`CMD 0x0A\`)
When saving custom static presets across key banks, \`CMD 0x0A\` packages LEDs in groups of 7 (21 bytes per group: 7 LEDs × 3 colors).

However, during testing we encountered an unexpected bug: **saturated colors (like \`#F01D0E\`) caused random key flicker across the bottom row.**

Disassembling the memory mapping revealed that the physical PCB layout contains **three 21-byte hardware gap offsets**. The firmware reserves space for a full 108-key matrix; on a 75% board, these unpopulated physical switches leave dummy memory addresses:

\`\`\`typescript
// Hardware Alignment Table: Groups must be injected with 21-byte zero padding
// at specific intervals to keep LED indices aligned with physical switches.
const HARDWARE_GAP_OFFSETS = [
  4 * 21,  // Gap after Group 4 (Function row transition)
  8 * 21,  // Gap after Group 8 (Nav cluster transition)
  12 * 21  // Gap after Group 12 (Numpad omission transition)
];
\`\`\`

Without these padding intervals, every key after the function row would shift out of phase, causing red and green bytes to misalign.

---

### 4.3 Direct Streaming Mode (\`CMD 0x08\`) & The Keepalive Requirement
For real-time screen ambilight or audio visualizers:
- Direct mode accepts interleaved RGB payloads via \`CMD 0x08\`.
- **The Catch**: The keyboard hardware features a hardware watchdog. If a new frame is not received within **800ms**, the keyboard assumes the host software crashed and automatically reverts to its default hardware wave animation.
- To maintain software control, the driver must maintain a heartbeat pulse every ~500ms.

---

## 5. Building the WebHID Controller

With the hardware protocol decoded, we implemented a full browser-based web application using **React 18**, **TypeScript**, **Tailwind CSS**, and the browser's native **WebHID API**.

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                     OpenAULA Web UI                     │
├──────────────────────────┬──────────────────────────────┤
│  Hardware Effects Panel  │    Per-Key RGB Painter       │
│  - 15 Dynamic Effects    │    - Visual Keyboard Matrix  │
│  - Brightness & Speed    │    - Color Palette & Hex     │
│  - Single/Multi Color    │    - Zone & Key Selection    │
├──────────────────────────┴──────────────────────────────┤
│               WebHID Hardware Driver Layer              │
│  - 4-Step Transaction Pipeline (CMD 0x06 / 0x0A / 0x04) │
│  - Mutex Queue & Concurrency Lock                       │
│  - 21-Byte Matrix Alignment Transformer                 │
│  - PWM Channel Color Calibration                        │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Why WebHID?
- **Zero Installation**: No \`.exe\`, no background services, no drivers needed.
- **Cross-Platform**: Works identically on Windows, macOS, Linux, and ChromeOS.
- **Security**: Direct USB access sandboxed by explicit browser permission prompts.

---

## 6. The Gauntlet of Bugs & Engineering Fixes

Bringing reverse-engineered code to production stability required diagnosing and fixing tricky edge cases:

### 1. The Ghost Effect Lockup
- **Problem**: Selecting certain effect presets caused the keyboard to freeze or revert to static white.
- **Root Cause**: The firmware omits IDs \`6\`, \`9\`, and \`14\`.
- **Fix**: Remapped all UI selectors to the verified 15-effect hardware table:
\`\`\`typescript
export const EFFECT_IDS = {
  OFF: 0,
  STATIC: 1,
  BREATHING: 2,
  WAVE: 3,
  SPECTRUM: 4,
  RAIN: 5,
  RIPPLE: 7,
  STARLIGHT: 8,
  SNAKE: 10,
  AURORA: 11,
  REACTIVE: 12,
  MARQUEE: 13,
  CIRCLE: 15,
  RAIN_DOWN: 16,
  CENTER_RIPPLE: 17,
  CUSTOM: 18,
} as const;
\`\`\`

### 2. USB Concurrency Races
- **Problem**: Dragging the brightness or color slider rapidly caused \`DOMException: The device is already open\` or failed transfers.
- **Root Cause**: WebHID \`sendFeatureReport\` calls cannot be overlapped on the same endpoint.
- **Fix**: Implemented a serialized promise queue with automatic request collapsing, ensuring only the latest frame is transmitted once the previous USB transaction completes.

### 3. The Mythical "Side Light Strip"
- **Problem**: Early protocol notes suggested controls for a side underglow RGB strip (common in F87 models).
- **Reality**: The AULA F75 physical chassis does not have side LED diffusion strips. Sending side-strip channel commands polluted configuration byte \`0x19\`, resetting user brightness. We removed all phantom strip code.

### 4. Hex Color \`#\` Prefix Handling
- **Problem**: Pasting standard 6-character hex strings (\`ff0055\`) into the custom color input broke validation unless users manually typed \`#\`.
- **Fix**: Added an input sanitizer that auto-detects raw hex values and prepends \`#\`.

### 5. Color Selection Dropping Dynamic Animations
- **Problem**: When changing effect color schemes, the keyboard would occasionally fall back to a static single-color flood, ignoring the chosen animation.
- **Root Cause**: Setting color and effect in the same packet triggered a race in the MCU's flash memory writer.
- **Fix**: Added a 60ms hardware settling delay between updating the color palette sub-register and firing the \`0x84\` commit pulse.

### 6. The Red Hue Bleed Underneath Cool Tones
- **Problem**: Selecting pure Cyan (\`#00FFFF\`) or Cool Blue resulted in keys showing a faint red tint underneath the backlight.
- **Root Cause**: The AULA F75's hardware LED driver uses a non-linear PWM duty cycle that overdrives the red channel at low voltages.
- **Fix**: Implemented a calibration curve in the color transformation layer that dampens secondary red PWM bias when blue/green channels dominate.

### 7. \`formatComboLabel\` & Short Config Crashes
- **Problem**: Users on specific firmware builds experienced \`Uncaught TypeError: Cannot read properties of undefined (reading 'toString')\` when opening the matrix view.
- **Root Cause**: Some firmware versions return configuration packets shorter than 136 bytes (132–134 bytes), leaving combo mapping arrays undefined.
- **Fix**: Added safe bounds checking and padded undersized HID reports with baseline defaults.

---

## 7. Current Project State & Architecture

The project now stands as a complete, lightweight alternative to proprietary OEM software:

- **Hardware Effects Tab**: Full control over all 15 native animations, multi-color & single-color modes, 5-level speed and brightness adjustments.
- **Per-Key RGB Painter**: Visual 75% interactive matrix allowing users to click and paint individual switches, select standard functional zones (WASD, Arrows, Numbers, Modifiers), and save directly to onboard hardware memory.
- **Clean Architecture**:
  - \`src/lib/webhid.ts\` — WebHID connection management, report parsing, and device descriptor matching.
  - \`src/lib/rgbService.ts\` — 4-step commit pipeline, planar color conversion, and hardware gap padding.
  - \`src/lib/f75Constants.ts\` — Effect maps, matrix layout coordinates, and key index lookups.
  - \`src/components/KeyboardGrid.tsx\` — Dynamic SVG/CSS mechanical keyboard rendering.

---

## 8. Acknowledgments & Upstream Research

This project stands on the shoulders of the open-source hardware community:
- **\`veysiemrah/aula-rgb-controller\`**: Foundational work decoding the Sinowealth 520-byte feature report structures.
- **\`rodrigost23/OpenRGB\`**: SinowealthKeyboard10c drivers that documented the direct streaming protocol and keepalive behavior.

---

## 9. Conclusion

Peripheral hardware should belong to the user who purchased it, not locked behind proprietary, platform-exclusive software suites. By decoding the USB communication layer and using modern open web standards like WebHID, we can replace bloatware with elegant, accessible tools that run on any machine with a browser.`,
    resources: [
      {
        title: 'Upstream Projects',
        links: [
          { label: 'veysiemrah/aula-rgb-controller', href: 'https://github.com/veysiemrah/aula-rgb-controller' },
          { label: 'rodrigost23/OpenRGB', href: 'https://gitlab.com/rodrigost23/OpenRGB' }
        ]
      },
      {
        title: 'Web Standards',
        links: [
          { label: 'MDN WebHID API Documentation', href: 'https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API' },
          { label: 'W3C WebHID Specification', href: 'https://wicg.github.io/webhid/' }
        ]
      }
    ]
  },
  {
    id: 'font-pairing-guide',
    type: 'article',
    category: 'Typography',
    title: 'Font Pairing Guide',
    date: 'Jun 20, 2023',
    readTime: '5 min read',
    excerpt: 'A comprehensive guide to combining typefaces and establishing typographic hierarchy in design projects.',
    content: `
      Before pairing fonts, it is important to understand the main typeface categories:
      
      ### 1. Typeface Categories
      - **Serif**: Traditional, formal fonts with decorative strokes (e.g. Merriweather, Georgia).
      - **Sans-serif**: Clean, modern fonts without decorative strokes (e.g. Inter, Roboto).
      - **Script**: Decorative, handwritten-style typefaces.
      - **Display**: Bold, attention-grabbing headlines.
      - **Monospace**: Fixed-width typefaces, great for code layouts.
      
      ### 2. Basic Principles
      - **Contrast**: Pair fonts with distinct differences (e.g., a bold serif heading with a neutral sans-serif body).
      - **Hierarchy**: Use size weights, line spacing, and sizes effectively.
      - **Readability**: Ensure the body font is highly legible at smaller scales.
      
      ### 3. Popular Combinations
      - Serif + Sans-serif (e.g. Playfair Display + Inter)
      - Display + Sans-serif (e.g. Syne + Outfit)
    `,
    resources: [
      {
        title: 'Font Resources',
        links: [
          { label: 'Google Fonts', href: 'https://fonts.google.com' },
          { label: 'Adobe Fonts', href: 'https://fonts.adobe.com' }
        ]
      },
      {
        title: 'Interactive Tools',
        links: [
          { label: 'Type Scale Calculator', href: 'https://type-scale.com' },
          { label: 'Font Pair', href: 'https://fontpair.co' }
        ]
      }
    ]
  },
  {
    id: 'vector-art-tips',
    type: 'article',
    category: 'Illustrations',
    title: 'Vector Art Tips',
    date: 'Jun 15, 2023',
    readTime: '6 min read',
    excerpt: 'Mastering paths, anchor points, shape builders, and shading techniques to create clean vector illustrations.',
    content: `
      Vector art uses mathematical equations to create scalable graphics. Here are some essential tips for creating vector illustrations:
      
      ### 1. Essential Tools
      - **Adobe Illustrator**: Industry standard vector editor.
      - **Figma**: Modern design tool with advanced vector networks.
      - **Inkscape**: Free open-source alternative.
      
      ### 2. Best Practices
      - **Pen Tool Mastery**: Use the fewest possible anchor points to maintain smooth, clean curves.
      - **Handles & Nodes**: Keep handle directions consistent to prevent weird crimping.
      - **Organized Layers**: Always name your vectors and group shapes logically.
    `,
    resources: [
      {
        title: 'Assets & Libraries',
        links: [
          { label: 'SVG Repo', href: 'https://www.svgrepo.com' },
          { label: 'Undraw Illustrations', href: 'https://undraw.co' }
        ]
      }
    ]
  },
  {
    id: 'ui-components',
    type: 'article',
    category: 'Design Kits',
    title: 'UI Components Design',
    date: 'Jun 10, 2023',
    readTime: '7 min read',
    excerpt: 'Detailed guidelines for structuring and designing clean, accessible, and responsive user interface components.',
    content: `
      Every digital application relies on a solid component foundation. Follow these guides to structure yours:
      
      ### 1. Core Component Blueprint
      - **Buttons**: Define clear primary, secondary, and ghost variants.
      - **Inputs**: Build responsive text boxes with error, focus, and disabled states.
      - **Cards**: Contain information uniformly with fixed padding and borders.
      
      ### 2. Accessible Design
      - Ensure a color contrast ratio of at least 4.5:1 for text blocks.
      - Map keyboard navigation states (focus indicators) clearly.
    `,
    resources: [
      {
        title: 'Libraries & Systems',
        links: [
          { label: 'Radix Primitives', href: 'https://www.radix-ui.com' },
          { label: 'Tailwind UI', href: 'https://tailwindui.com' }
        ]
      }
    ]
  },
  {
    id: 'fluid-animations',
    type: 'article',
    category: 'Development',
    title: 'Building Fluid Micro-Animations in React',
    date: 'Jul 8, 2026',
    readTime: '4 min read',
    excerpt: 'How to utilize CSS variables, springs, and Framer Motion to build animations that feel organic and extremely responsive.',
    content: `
      Designing high-quality web interfaces requires going beyond static assets. The difference between a good interface and a premium interface is how it moves.
      
      ### 1. Spring Physics
      Static linear transitions (e.g. \`transition: all 0.3s linear\`) often feel artificial. Real-world objects have weight and momentum. By using spring configurations, elements accelerate and decelerate with fluid inertia.
      
      ### 2. Utilizing Framer Motion
      In React, libraries like Framer Motion allow developer-friendly access to spring physics:
      \`\`\`jsx
      <motion.button
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      />
      \`\`\`
    `
  }
];

function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="copyable-command-container">
      <span className="command-text-span">{command}</span>
      <button className="copy-icon-btn" onClick={handleCopy} title="Copy command">
        {copied ? (
          <span style={{ fontSize: '10px', color: 'var(--accent)' }}>Copied!</span>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

function CollapsiblePanel({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="collapsible-panel">
      <button className="collapsible-trigger-btn" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="collapsible-panel-content">{children}</div>}
    </div>
  );
}

function parseChangelog(raw: string) {
  if (!raw) return null;
  const lines = raw.split('\n');
  const items = lines.filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim());

  let version = "";
  let buildDate = "";
  let credits = "";

  for (const line of lines) {
    if (line.includes('Version:')) {
      version = line.split('Version:')[1].trim();
    } else if (line.includes('Build Date:')) {
      buildDate = line.split('Build Date:')[1].trim();
    } else if (line.includes('Credits:')) {
      credits = line.split('Credits:')[1].trim();
    }
  }

  return { version, buildDate, credits, items };
}

function renderMarkdown(raw: string): string {
  if (!raw) return '';
  // Dedent leading whitespace from template literals
  const lines = raw.split('\n');
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      if (indent < minIndent) minIndent = indent;
    }
  }
  const cleanContent = minIndent !== Infinity && minIndent > 0
    ? lines.map(line => (line.length >= minIndent ? line.slice(minIndent) : line.trimStart())).join('\n').trim()
    : raw.trim();

  return marked.parse(cleanContent, { async: false, breaks: true, gfm: true }) as string;
}

function ShareButton({ postId, label = "COPY LINK" }: { postId: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#blogs/${postId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className={`blog-share-btn ${copied ? 'copied' : ''}`}
      onClick={handleShare}
      title="Copy link to this blog post"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>COPIED!</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

function getPostIdFromHash(): string | null {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('blogs/')) {
    return hash.replace(/^blogs\//, '') || null;
  }
  if (hash.startsWith('blog/')) {
    return hash.replace(/^blog\//, '') || null;
  }
  return null;
}

export function BlogsPage() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(() => getPostIdFromHash());
  const { data: axionData } = useAxionData();

  useEffect(() => {
    const handleHashChange = () => {
      const postId = getPostIdFromHash();
      setSelectedPostId(postId);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
    window.location.hash = `blogs/${postId}`;
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleBack = () => {
    setSelectedPostId(null);
    window.location.hash = 'blogs';
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  //  If a post is selected, render its detail view
  if (selectedPostId) {
    if (selectedPostId === 'axion-aosp') {
      const changelog = axionData?.changelog ? parseChangelog(axionData.changelog) : null;
      const changelogItems = changelog?.items && changelog.items.length > 0
        ? changelog.items
        : [
          'Update Wi-Fi HAL interfaces combination to match MediaTek BSP behaviour.',
          'Kernel compiled at O3 level optimization for Cancunf.',
          'GMS updates and battery optimizations.'
        ];

      return (
        <div className="page-view-container fade-in">
          <div className="blog-top-bar">
            <button className="back-btn" onClick={handleBack}>
              ← BACK TO LOGS
            </button>
            <ShareButton postId="axion-aosp" label="SHARE BUILD" />
          </div>

          <article className="blog-article">
            <header className="page-header" style={{ marginBottom: '24px' }}>
              <span className="page-label">
                Official Build for Moto G54 (cancunf) • {axionData?.gms ? formatDate(axionData.gms.datetime) : 'Dec 13, 2025'}
              </span>
              <h1 className="page-title">
                Axion AOSP {axionData?.gms?.version ? `v${axionData.gms.version}` : 'v2.2.1'}
              </h1>
            </header>

            {/* ROM Info Card */}
            <div className="rom-info-card" style={{ marginTop: '24px' }}>
              <div className="rom-info-header">
                <div className="rom-thumb-icon">AX</div>
                <div>
                  <h2 className="card-section-title">Device & Build Information</h2>
                  <div className="rom-meta-rows">
                    <span className="rom-meta-item">
                      <span className="rom-meta-bullet"></span>Android 15
                    </span>
                    <span className="rom-meta-item">
                      <span className="rom-meta-bullet"></span>Official ROM
                    </span>
                    <span className="rom-meta-item">
                      <span className="rom-meta-bullet"></span>OTA Supported
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Downloads Grid */}
              <div className="rom-download-grid">
                {/* GMS Build */}
                <div className="rom-download-subcard">
                  <div className="rom-subcard-header">
                    <div className="rom-subcard-icon">G</div>
                    <div>
                      <h3 className="rom-subcard-title">GMS Build</h3>
                      <p className="rom-subcard-subtitle">Google Play Services Pre-loaded</p>
                    </div>
                  </div>
                  <div className="rom-subcard-specs">
                    <div className="rom-spec-row">
                      <span className="rom-spec-key">File Size</span>
                      <span className="rom-spec-val">
                        {axionData?.gms ? formatFileSize(axionData.gms.size) : '2.09 GB'}
                      </span>
                    </div>
                    <div className="rom-spec-row">
                      <span className="rom-spec-key">Date</span>
                      <span className="rom-spec-val">
                        {axionData?.gms ? formatDate(axionData.gms.datetime) : '13/12/2025'}
                      </span>
                    </div>
                  </div>
                  <a href={axionData?.gms?.url || '#'} target="_blank" rel="noopener noreferrer" className="rom-download-action-btn">
                    Download GMS Build ↗
                  </a>
                </div>

                {/* Vanilla Build */}
                <div className="rom-download-subcard">
                  <div className="rom-subcard-header">
                    <div className="rom-subcard-icon">V</div>
                    <div>
                      <h3 className="rom-subcard-title">Vanilla Build</h3>
                      <p className="rom-subcard-subtitle">Clean Minimal AOSP Core</p>
                    </div>
                  </div>
                  <div className="rom-subcard-specs">
                    <div className="rom-spec-row">
                      <span className="rom-spec-key">File Size</span>
                      <span className="rom-spec-val">
                        {axionData?.vanilla ? formatFileSize(axionData.vanilla.size) : '1.65 GB'}
                      </span>
                    </div>
                    <div className="rom-spec-row">
                      <span className="rom-spec-key">Date</span>
                      <span className="rom-spec-val">
                        {axionData?.vanilla ? formatDate(axionData.vanilla.datetime) : '13/12/2025'}
                      </span>
                    </div>
                  </div>
                  <a href={axionData?.vanilla?.url || '#'} target="_blank" rel="noopener noreferrer" className="rom-download-action-btn secondary-btn">
                    Download Vanilla ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Changelog panel */}
            <div className="rom-info-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="card-section-title" style={{ margin: 0 }}>
                  {changelog?.version || 'v2.2.1'} Changelog
                </h2>
                <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
                  {changelog?.buildDate || 'Build Date: 13/12/2025'}
                </span>
              </div>
              <p className="body-para" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Credits: <span style={{ color: 'var(--text-dark)', fontWeight: '500' }}>{changelog?.credits || '@cyberknight777 & @sarthakroy2002'}</span>
              </p>
              <div className="article-body" style={{ gap: '10px' }}>
                {changelogItems.map((line, idx) => (
                  <p key={idx} className="body-para" style={{ display: 'flex', gap: '8px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--accent)' }}>•</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
              <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <a href="https://github.com/AxionAOSP/axion_changelogs" target="_blank" rel="noopener noreferrer" className="game-link-badge-modern" style={{ width: 'fit-content' }}>
                  View Full Changelog GitHub ↗
                </a>
              </div>
            </div>

            {/* Collapsible installation instructions */}
            <CollapsiblePanel title="Flashing Custom Recovery Instructions">
              <span className="instruction-subhead">PREREQUISITES:</span>
              <p className="body-para" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>
                Unlock bootloader, enable USB debugging, and ensure Android 14 firmware (U1TD34M.94-12-7) is loaded.
              </p>
              <span className="instruction-subhead">STEPS:</span>
              <ol className="instructions-list">
                <li>Power off device and enter bootloader (Volume Down + Power).</li>
                <li>Connect device to PC via USB.</li>
                <li>Execute the fastboot bootloader commands in terminal:</li>
              </ol>
              <CopyableCommand command="fastboot reboot fastboot&#10;fastboot flash vendor_boot vendor_boot.img" />
            </CollapsiblePanel>

            <CollapsiblePanel title="Sideloading ROM Zip File via Recovery">
              <span className="instruction-subhead">STEPS:</span>
              <ol className="instructions-list">
                <li>Enter Custom Recovery from bootloader.</li>
                <li>Navigate to "Factory Reset" / "Format Data" and confirm.</li>
                <li>Go back and select "Apply Update" → "Apply from ADB Sideload".</li>
                <li>Run sideload command on your host PC:</li>
              </ol>
              <CopyableCommand command="adb sideload rom-build.zip" />
              <p className="body-para" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                * Replace <code>rom-build.zip</code> with your downloaded GMS or Vanilla zip file.
              </p>
            </CollapsiblePanel>

            {/* Support Development */}
            <div className="rom-info-card">
              <h2 className="card-section-title">Support Project</h2>
              <p className="body-para" style={{ fontSize: '14px', margin: '8px 0 16px 0' }}>
                Keep ROM development and test builds alive. Support AOSP building:
              </p>
              <div className="support-actions">
                <a href="https://paypal.me/ayanbiswas" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  PayPal ↗
                </a>
                <a href="https://upi.com/ayanbiswas" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  UPI / QR ↗
                </a>
                <a href="https://github.com/AxionAOSP" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  GitHub Organization ↗
                </a>
              </div>
            </div>
          </article>
        </div>
      );
    }

    if (selectedPostId === 'lineageos-ext') {
      return (
        <div className="page-view-container fade-in">
          <div className="blog-top-bar">
            <button className="back-btn" onClick={handleBack}>
              ← BACK TO LOGS
            </button>
            <ShareButton postId="lineageos-ext" label="SHARE BUILD" />
          </div>

          <article className="blog-article">
            <header className="page-header" style={{ marginBottom: '24px' }}>
              <span className="page-label">
                Custom ROM • Android 15 Build
              </span>
              <h1 className="page-title">
                LineageOS Extended
              </h1>
            </header>

            {/* Download and Info */}
            <div className="rom-info-card" style={{ marginTop: '24px' }}>
              <div className="rom-info-header">
                <div className="rom-thumb-icon">LOS</div>
                <div>
                  <h3 className="card-section-title">Cancunf Extended</h3>
                  <p className="body-para" style={{ fontSize: '13px', margin: '4px 0' }}>
                    Standard Lineage core with custom scheduling and hardware improvements.
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="rom-download-action-btn">
                  Download Release ZIP ↗
                </a>
              </div>
            </div>

            {/* Changelog panel */}
            <div className="rom-info-card">
              <h2 className="card-section-title" style={{ marginBottom: '16px' }}>Changelogs</h2>
              <div className="support-actions" style={{ marginTop: '8px' }}>
                <a href="https://github.com/LineageOS/android" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  Source Changelog ↗
                </a>
                <a href="https://github.com/LineageOS/android_device_motorola_cancunf" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  Device Changelog ↗
                </a>
              </div>
            </div>

            {/* Instructions */}
            <CollapsiblePanel title="Flashing Instructions">
              <span className="instruction-subhead">PREREQUISITES:</span>
              <p className="body-para" style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 12px 0' }}>
                Unlock bootloader, enable USB debugging, and ensure Android 14 firmware (U1TD34M.94-12-7) is loaded.
              </p>
              <span className="instruction-subhead">STEPS:</span>
              <ol className="instructions-list">
                <li>Power off device and enter bootloader (Volume Down + Power).</li>
                <li>Connect device to PC via USB.</li>
                <li>Execute fastboot recovery commands:</li>
              </ol>
              <CopyableCommand command="fastboot reboot fastboot&#10;fastboot flash vendor_boot vendor_boot.img" />

              <span className="instruction-subhead" style={{ marginTop: '20px' }}>SIDELOADING:</span>
              <ol className="instructions-list" style={{ marginTop: '4px' }}>
                <li>Select recovery and boot into it.</li>
                <li>Format user data partition.</li>
                <li>Go to "Apply update" → "ADB Sideload" and run:</li>
              </ol>
              <CopyableCommand command="adb sideload rom.zip" />
            </CollapsiblePanel>

            {/* Support Development */}
            <div className="rom-info-card">
              <h2 className="card-section-title">Support Project</h2>
              <p className="body-para" style={{ fontSize: '14px', margin: '8px 0 16px 0' }}>
                Consider supporting the developers to keep the project alive:
              </p>
              <div className="support-actions">
                <a href="https://paypal.me/ayanbiswas" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  PayPal ↗
                </a>
                <a href="https://upi.com/ayanbiswas" target="_blank" rel="noopener noreferrer" className="support-action-btn">
                  UPI ↗
                </a>
              </div>
            </div>
          </article>
        </div>
      );
    }

    // Otherwise it is a standard article
    const article = BLOG_POSTS.find(p => p.id === selectedPostId);
    return (
      <div className="page-view-container fade-in">
        <div className="blog-top-bar">
          <button className="back-btn" onClick={handleBack}>
            ← BACK TO LOGS
          </button>
          {article && <ShareButton postId={article.id} label="SHARE ARTICLE" />}
        </div>

        <article className="blog-article">
          <header className="page-header" style={{ marginBottom: '24px' }}>
            <span className="page-label">
              {article?.category} • {article?.date} {article?.readTime ? `• ${article.readTime}` : ''}
            </span>
            <h1 className="page-title">
              {article?.title}
            </h1>
          </header>

          {article?.content && (
            <div className="article-body">
              <div
                className="blog-markdown-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
              />

              {article.resources && (
                <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <h3 className="body-heading" style={{ marginTop: 0 }}>Resources & Links</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    {article.resources.map((res, i) => (
                      <div key={i} className="rom-download-subcard" style={{ padding: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', display: 'block', color: 'var(--text-dark)', marginBottom: '8px' }}>{res.title}</span>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {res.links.map((link, idx) => (
                            <li key={idx}>
                              <a href={link.href} target="_blank" rel="noopener noreferrer" className="read-more-link" style={{ fontSize: '12px' }}>
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    );
  }

  // Render the list of posts grouped by type
  return (
    <div className="page-view-container fade-in">
      <header className="page-header">
        <h1 className="page-title">eh i do shitty stuff</h1>
      </header>

      {/* ROMs and Systems Section */}
      <h2 className="category-title" style={{ marginTop: '24px' }}>PINNED SYSTEM BUILDS</h2>
      <div className="about-games-grid" style={{ marginBottom: '40px' }}>
        {/* Dynamic Axion build card */}
        <div className="game-card-modern game-theme-ww" style={{ cursor: 'pointer' }} onClick={() => handleSelectPost('axion-aosp')}>
          <div className="game-card-badge-modern">Android 15 ROM</div>
          <h3 className="game-card-title-modern">
            Axion AOSP {axionData?.gms?.version ? `v${axionData.gms.version}` : 'v2.2.1'}
          </h3>
          <p className="game-card-desc-modern">
            Official system build for Moto G54 (cancunf). Engineered for maximum battery efficiency, governor tuning, and high frame rates.
          </p>
          <div className="project-tech-tags">
            <span className="tech-tag">Kernel 5.15</span>
            <span className="tech-tag">MediaTek</span>
            <span className="tech-tag">AOSP</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <span className="read-more-link">VIEW DETAILS & DOWNLOADS ↗</span>
            <ShareButton postId="axion-aosp" label="COPY LINK" />
          </div>
        </div>

        {/* LineageOS Extended build card */}
        <div className="game-card-modern game-theme-lineage" style={{ cursor: 'pointer' }} onClick={() => handleSelectPost('lineageos-ext')}>
          <div className="game-card-badge-modern">Android 15 ROM</div>
          <h3 className="game-card-title-modern">LineageOS Extended</h3>
          <p className="game-card-desc-modern">
            Clean Lineage build featuring extended toggles, custom ROM modifications, and core kernel scheduling tweaks.
          </p>
          <div className="project-tech-tags">
            <span className="tech-tag">LineageOS</span>
            <span className="tech-tag">Cancunf</span>
            <span className="tech-tag">Vanilla</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            <span className="read-more-link">VIEW DETAILS & DOWNLOADS ↗</span>
            <ShareButton postId="lineageos-ext" label="COPY LINK" />
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <h2 className="category-title" style={{ marginTop: '24px' }}>GUIDES & ARCHIVES</h2>
      <div className="blog-posts-list">
        {BLOG_POSTS.filter(p => p.type === 'article').map((post) => (
          <div key={post.id} className="blog-summary-card" onClick={() => handleSelectPost(post.id)}>
            <div className="blog-meta-row">
              <span className="blog-date">{post.date}</span>
              <span className="meta-divider">•</span>
              <span className="blog-readtime">{post.readTime}</span>
              <span className="meta-divider">•</span>
              <span style={{ color: 'var(--accent)' }}>{post.category}</span>
            </div>
            <h2 className="blog-summary-title">{post.title}</h2>
            <p className="blog-summary-excerpt">{post.excerpt}</p>
            <div className="blog-card-footer">
              <span className="read-more-link">READ LOG ↗</span>
              <ShareButton postId={post.id} label="COPY LINK" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
