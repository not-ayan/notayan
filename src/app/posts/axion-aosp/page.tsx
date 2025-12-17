"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Download, Github, Info, Plus, Smartphone } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { useAxionData, formatFileSize, formatDate, parseChangelog } from "@/hooks/useAxionData";
import AxionImage from "@/assets/img/axion.png";
import { CopyableCommand } from "@/components/ui/copyable-command";

export default function AxionAOSP() {
  const { data: axionData, loading, error } = useAxionData();
  const changelog = axionData?.changelog ? parseChangelog(axionData.changelog) : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Loading Axion AOSP data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">Failed to load Axion AOSP data</p>
          <p className="mt-2 text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageContainer>
        {/* Page Title */}
        <div className="mb-8 pt-8 pb-4">
          <Button variant="ghost" className="gap-2 mb-6 hover:bg-accent/50 -ml-2" asChild>
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to posts
            </Link>
          </Button>
          
          {/* Hero Banner */}
          {axionData?.bannerUrl && (
            <div className="relative w-full aspect-[3/1] max-h-[240px] rounded-xl overflow-hidden border border-border/60 mb-6">
              <Image
                src={axionData.bannerUrl}
                alt={`Axion AOSP ${axionData?.gms?.version || 'v2.2.1'} Banner`}
                fill
                className="object-cover object-center opacity-90"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 md:bottom-6 md:left-6 md:right-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1.5">
                  Axion AOSP {axionData?.gms?.version ? `v${axionData.gms.version}` : 'v2.2.1'}
                </h1>
                <p className="text-white/80 text-xs md:text-sm">
                  Official Build for Moto G54 (cancunf) • {axionData?.gms ? formatDate(axionData.gms.datetime) : 'December 13, 2025'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Device Info */}
        <div className="mb-6">
          <div className="w-full bg-card rounded-xl border border-border/60 overflow-hidden">
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-5">
                <Smartphone className="size-4" aria-hidden="true" />
                <span className="text-xs font-mono">DEVICE_INFO.md</span>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-[48px] h-[48px] bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={AxionImage}
                      alt="Axion AOSP"
                      fill
                      className="object-cover p-2"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg md:text-xl leading-none mb-1.5">
                      Axion AOSP {axionData?.gms?.version ? `v${axionData.gms.version}` : 'v2.2.1'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-foreground/40" />
                        Moto G54 (cancunf)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-foreground/40" />
                        {axionData?.gms ? formatDate(axionData.gms.datetime) : 'December 13, 2025'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-muted/60 border border-border/40 px-3 py-1.5 rounded-lg">
                    Android 15
                  </span>
                  <span className="text-xs bg-muted/60 border border-border/40 px-3 py-1.5 rounded-lg">
                    Official Build
                  </span>
                  <span className="text-xs bg-muted/60 border border-border/40 px-3 py-1.5 rounded-lg">
                    OTA Supported
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mt-5">
                  {/* GMS Download Card */}
                  <div className="group rounded-xl bg-muted/30 border border-border/60 hover:border-border transition-all duration-200">
                    <div className="p-4 md:p-5">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="p-2 rounded-lg bg-foreground/5">
                          <Download className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">GMS Build</h4>
                          <p className="text-xs text-muted-foreground">With Google Services</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">File Size</span>
                          <span className="font-mono font-medium">
                            {axionData?.gms ? formatFileSize(axionData.gms.size) : '2.09 GB'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Version</span>
                          <span className="font-mono font-medium">
                            {axionData?.gms?.version || '2.2.1'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Build Type</span>
                          <span className="px-2 py-0.5 rounded bg-foreground/5 text-xs">
                            OFFICIAL
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        className="w-full h-9 rounded-lg font-medium" 
                        asChild
                      >
                        <Link 
                          href={axionData?.gms?.url || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download GMS
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Vanilla Download Card */}
                  <div className="group rounded-xl bg-muted/30 border border-border/60 hover:border-border transition-all duration-200">
                    <div className="p-4 md:p-5">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="p-2 rounded-lg bg-foreground/5">
                          <Download className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Vanilla Build</h4>
                          <p className="text-xs text-muted-foreground">Pure AOSP Experience</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">File Size</span>
                          <span className="font-mono font-medium">
                            {axionData?.vanilla ? formatFileSize(axionData.vanilla.size) : '1.65 GB'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Version</span>
                          <span className="font-mono font-medium">
                            {axionData?.vanilla?.version || '2.2.1'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Build Type</span>
                          <span className="px-2 py-0.5 rounded bg-foreground/5 text-xs">
                            OFFICIAL
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        variant="outline"
                        className="w-full h-9 rounded-lg font-medium" 
                        asChild
                      >
                        <Link 
                          href={axionData?.vanilla?.url || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download Vanilla
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Changelogs */}
        <div className="mb-6">
          <div className="w-full bg-card rounded-xl border border-border/60 overflow-hidden">
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-5">
                <Info className="size-4" aria-hidden="true" />
                <span className="text-xs font-mono">CHANGELOG.md</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base md:text-lg font-semibold">
                      {changelog?.version || 'AxionAosp v2.2.1'} Changelog
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                      {changelog?.buildDate || 'Build Date: 14/12/2025'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mb-3 text-xs">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-medium">
                      {changelog?.credits || '@cyberknight777 & @sarthakroy2002'}
                    </span>
                  </div>
                  
                  <div className="bg-muted/30 border border-border/40 p-4 rounded-lg space-y-2">
                    {changelog?.items && changelog.items.length > 0 ? (
                      changelog.items.map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-2 text-xs md:text-sm leading-relaxed"
                        >
                          <span className="text-muted-foreground mt-1 flex-shrink-0">•</span>
                          <span>{item}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-start gap-2 text-xs md:text-sm leading-relaxed">
                          <span className="text-muted-foreground mt-1 flex-shrink-0">•</span>
                          <span>Update Wi-Fi HAL interfaces combination to match MediaTek BSP behaviour.</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs md:text-sm leading-relaxed">
                          <span className="text-muted-foreground mt-1 flex-shrink-0">•</span>
                          <span>Kernel state at r2a1.</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="pt-1">
                  <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-xs" asChild>
                    <Link href="https://github.com/AxionAOSP/axion_changelogs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <Github className="size-3.5" />
                      <span>View Full Changelog</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <div className="w-full bg-card rounded-xl border border-border/60 overflow-hidden">
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-5">
                <Info className="size-4" aria-hidden="true" />
                <span className="text-xs font-mono">INSTALLATION.md</span>
              </div>
              <div className="space-y-3">
                <Collapsible>
                  <CollapsibleTrigger className="w-full">
                    <Button variant="ghost" className="w-full justify-between p-4 group rounded-lg hover:bg-muted/50 transition-all" asChild>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Steps to Flash Custom ROM</span>
                        <Plus className="size-4 transition-transform group-data-[state=open]:rotate-45" />
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-4 mt-2">
                      <div className="bg-muted/40 border border-border/40 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 text-xs">⚠️</div>
                          <div>
                            <h5 className="font-medium text-xs mb-1">Required Firmware</h5>
                            <p className="text-xs text-muted-foreground">
                              Android 14 U1TD34M.94-12-7 or newer
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-xs mb-2">Prerequisites</h5>
                        <ol className="list-decimal list-inside text-xs space-y-1.5 ml-2 text-muted-foreground">
                          <li>Unlock the bootloader</li>
                          <li>Enable USB debugging in Developer Options</li>
                        </ol>
                      </div>

                      <div className="bg-muted/40 border border-border/40 p-3 rounded-lg">
                        <strong className="text-xs block mb-1">Important Note:</strong>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Any slot must not be empty. If you have ever used blankflash or flashed stock ROM using RSA, make sure you got any OTA update. Otherwise don&apos;t flash.
                        </p>
                      </div>

                      <div>
                        <h5 className="font-medium text-xs mb-2">Flash Custom Recovery</h5>
                        <ol className="list-decimal list-inside text-xs space-y-2 ml-2 text-muted-foreground">
                          <li>Connect your phone to the PC</li>
                          <li>Power off the device</li>
                          <li>Press <strong>volume down</strong> + <strong>power</strong> to enter fastboot</li>
                          <li>Open the command prompt or terminal</li>
                          <li>
                            Execute the following commands:
                            <CopyableCommand 
                              command="fastboot reboot fastboot&#10;fastboot flash vendor_boot vendor_boot.img" 
                              className="mt-2"
                            />
                          </li>
                          <li>Wait for the process to complete</li>
                        </ol>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="w-full">
                    <Button variant="ghost" className="w-full justify-between p-4 group rounded-lg hover:bg-muted/50 transition-all" asChild>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium text-sm text-left">Sideload ROM via ADB</span>
                        <Plus className="size-4 flex-shrink-0 transition-transform group-data-[state=open]:rotate-45" />
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-4 mt-2">
                      <ol className="list-decimal list-inside text-xs space-y-2.5 ml-2 text-muted-foreground">
                        <li>Enter fastboot mode</li>
                        <li>Use <strong>volume keys</strong> to select <strong>Recovery</strong> and press <strong>power</strong></li>
                        <li>After recovery is shown, proceed to next steps</li>
                        <li>
                          <div className="bg-muted/40 border border-border/40 p-2 rounded-lg mt-1.5">
                            <strong className="text-xs">Format Data</strong>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Required for first time or when switching ROMs
                            </p>
                          </div>
                        </li>
                        <li>Select the <strong>&quot;Apply update&quot;</strong> option</li>
                        <li>
                          <span className="block mb-2">Select either method:</span>
                          <div className="space-y-2 ml-4">
                            <div className="bg-muted/40 border border-border/40 p-2.5 rounded-lg">
                              <h6 className="font-medium text-xs mb-1.5">Option A: ADB Sideload</h6>
                              <p className="text-[10px] text-muted-foreground mb-2">Connect phone to PC and run:</p>
                              <CopyableCommand 
                                command="adb sideload axion-2.2.1-NIGHTLY-20251213-OFFICIAL-GMS-cancunf.zip" 
                                className="mt-1"
                              />
                            </div>
                            <div className="bg-muted/40 border border-border/40 p-2.5 rounded-lg">
                              <h6 className="font-medium text-xs mb-1">Option B: External Storage</h6>
                              <p className="text-[10px] text-muted-foreground">
                                Navigate to ROM file location and select it to flash
                              </p>
                            </div>
                          </div>
                        </li>
                        <li>Wait for installation to complete</li>
                        <li>Reboot and enjoy Axion AOSP</li>
                      </ol>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div>
          <div className="w-full bg-card rounded-xl border border-border/60 overflow-hidden">
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-5">
                <Info className="size-4" aria-hidden="true" />
                <span className="text-xs font-mono">SUPPORT.md</span>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-1.5">Support Development</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    Consider supporting the developers to keep the project alive.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-4 rounded-lg" 
                    asChild
                  >
                    <Link href="https://paypal.me/ayanbiswas" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.633h8.42c2.985 0 5.037 1.462 5.302 3.874.165 1.518-.226 2.747-.975 3.65-.732.884-1.831 1.49-3.17 1.76-1.044.21-2.19.315-3.416.315H9.93l-.76 4.89a.651.651 0 0 1-.644.532zm3.124-12.31h1.665c1.37 0 2.438-.21 3.088-.606.65-.397.93-1.02.818-1.843-.113-.823-.713-1.222-1.78-1.222H9.784l-.584 3.671z"/>
                      </svg>
                      <span className="text-xs font-medium">PayPal</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-4 rounded-lg" 
                    asChild
                  >
                    <Link href="https://upi.com/ayanbiswas" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.5 14h-17A1.5 1.5 0 0 0 2 15.5v3A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5zm-17-4h17A1.5 1.5 0 0 0 22 8.5v-3A1.5 1.5 0 0 0 20.5 4h-17A1.5 1.5 0 0 0 2 5.5v3A1.5 1.5 0 0 0 3.5 10z"/>
                      </svg>
                      <span className="text-xs font-medium">UPI</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-4 rounded-lg" 
                    asChild
                  >
                    <Link href="https://github.com/AxionAOSP" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <Github className="size-3.5" />
                      <span className="text-xs font-medium">GitHub</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
