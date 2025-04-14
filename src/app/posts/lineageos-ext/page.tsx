"use client";

import { ArrowLeft, Github, Download, Plus, Info, Smartphone } from "lucide-react";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Image from "next/image";
import LineageOSImage from "@/public/images/lineageos.png";

interface Post {
  category: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string | any;
  href: string;
  date: string;
  author?: {
    name: string;
    image: string;
    initials: string;
  };
}

export default function LineageOSExt() {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full flex justify-center">
        <div className="w-[80%] lg:w-[60%]">
          {/* Page Title */}
          <div className="mb-6 pt-8 pb-4">
            <Button variant="outline" className="gap-2 bg-background/50 hover:bg-background" asChild>
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to posts
              </Link>
            </Button>
          </div>

          {/* Device Info */}
          <div className="mb-8">
            <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Smartphone className="size-4" aria-hidden="true" />
                  <span className="text-sm font-mono">INFO.md</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-[42px] h-[42px] bg-muted rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={LineageOSImage}
                        alt="LineageOS Extended"
                        fill
                        className="object-cover"
                        sizes="42px"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-base leading-none mb-1">LineageOS Extended</h3>
                      <span className="text-sm text-muted-foreground">Latest Build</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm bg-secondary/30 px-3 py-1 rounded-lg">Custom ROM</span>
                    <span className="text-sm bg-secondary/30 px-3 py-1 rounded-lg">Android 14</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-medium">Download</span>
                    <Button variant="default" size="sm" className="h-9 px-4 rounded-xl">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Changelogs */}
          <div className="mb-8">
            <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Info className="size-4" aria-hidden="true" />
                  <span className="text-sm font-mono">CHANGELOGS.md</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Changelogs</h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl" asChild>
                      <Link href="https://github.com/LineageOS/android" target="_blank" rel="noopener noreferrer">
                        Source Changelog
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl" asChild>
                      <Link href="https://github.com/LineageOS/android_device_motorola_cancunf" target="_blank" rel="noopener noreferrer">
                        Device Changelog
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Info className="size-4" aria-hidden="true" />
                  <span className="text-sm font-mono">INSTRUCTIONS.md</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Steps to flash Custom ROMs:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Unlock bootloader</li>
                      <li>Flash recovery</li>
                      <li>Format data</li>
                      <li>Flash ROM</li>
                      <li>Flash GApps (optional)</li>
                      <li>Reboot</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">For sideloading zip files (e.g. Magisk, custom ROM):</h3>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Enable ADB debugging</li>
                      <li>Connect device to PC</li>
                      <li>Run: adb sideload filename.zip</li>
                      <li>Wait for completion</li>
                      <li>Reboot</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div>
            <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Info className="size-4" aria-hidden="true" />
                  <span className="text-sm font-mono">SUPPORT.md</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Support Development</h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl" asChild>
                      <Link href="https://paypal.me/ayanbiswas" target="_blank" rel="noopener noreferrer">
                        PayPal
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl" asChild>
                      <Link href="https://upi.com/ayanbiswas" target="_blank" rel="noopener noreferrer">
                        UPI
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 