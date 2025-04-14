"use client";

import Container from "@/components/container";
import { MoreVertical, ArrowLeft, Info, Smartphone } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AxionThumb from "@/assets/img/axion.png";
import LineageThumb from "@/assets/img/lineage.png";
import { Button } from "@/components/ui/button";

interface Post {
  category: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string | StaticImageData;
  href: string;
  date: string;
  author?: {
    name: string;
    image: string;
    initials: string;
  };
}

const pinnedPosts: Post[] = [
  {
    category: "Custom ROM",
    title: "AXION.md",
    subtitle: "Axion Aosp for cancunf",
    description: "A clean and optimized AOSP-based custom ROM",
    image: AxionThumb,
    href: "/posts/axion-aosp",
    date: "10:30 PM Monday",
  },
  {
    category: "Custom ROM",
    title: "LOS-EXT.md",
    subtitle: "LOS EXT for cancunf",
    description: "Extended version of LineageOS with additional features",
    image: LineageThumb,
    href: "/posts/lineageos-ext",
    date: "10:30 PM Monday",
  },
];

const posts: Post[] = [
  {
    category: "Typography",
    title: "Font Pairing Guide",
    description: "A comprehensive guide to combining typefaces in design projects",
    image: "/lamp.jpg",
    href: "/posts/font-pairing-guide",
    date: "Jun 20, 2023",
    author: {
      name: "Ayan Biswas",
      image: "/profpic.png",
      initials: "AB"
    }
  },
  {
    category: "Illustrations",
    title: "Vector Art Tips",
    description: "Creating beautiful vector illustrations from scratch",
    image: "/lamp.jpg",
    href: "/posts/vector-art-tips",
    date: "Jun 15, 2023",
    author: {
      name: "Ayan Biswas",
      image: "/profpic.png",
      initials: "AB"
    }
  },
  {
    category: "Design Kits",
    title: "UI Components",
    description: "Ready-to-use design components for your next project",
    image: "/lamp.jpg",
    href: "/posts/ui-components",
    date: "Jun 10, 2023",
    author: {
      name: "Ayan Biswas",
      image: "/profpic.png",
      initials: "AB"
    }
  },
];

export default function Posts() {
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full flex justify-center">
        <div className="w-[80%] lg:w-[60%]">
          {/* Page Title */}
          <div className="mb-6 pt-8 pb-4">
            <Button variant="outline" className="gap-2 bg-background/50 hover:bg-background" asChild>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to home
              </Link>
            </Button>
          </div>

          {/* Pinned Posts */}
          <div className="mb-8">
            <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Smartphone className="size-4" aria-hidden="true" />
                  <span className="text-sm font-mono">PINNED.md</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-[80%]">
                  {pinnedPosts.map((post, index) => (
                    <Link
                      key={index}
                      href={post.href}
                      className="group bg-background hover:bg-secondary/5 rounded-[1.25rem] border border-border overflow-hidden transition-colors"
                      style={{ viewTransitionName: `pinned-post-${index}` }}
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-[42px] h-[42px] bg-muted rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={post.image}
                              alt={post.subtitle || post.title}
                              fill
                              className="object-cover"
                              sizes="42px"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-base leading-none mb-1">{post.subtitle || post.title}</h3>
                            <span className="text-sm text-muted-foreground">5 days ago</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm bg-secondary/30 px-3 py-1 rounded-lg">{post.category}</span>
                          <span className="text-sm bg-secondary/30 px-3 py-1 rounded-lg">Android 14</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-base font-medium">Latest Build</span>
                          <Button variant="default" size="sm" className="h-9 px-4 rounded-xl">
                            Download
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Other Posts */}
          <div>
            <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Info className="size-4" aria-hidden="true" />
                  <span className="text-sm font-mono">POSTS.md</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                  {posts.map((post, index) => (
                    <Link
                      key={index}
                      href={post.href}
                      className="group bg-background hover:bg-secondary/5 rounded-lg border border-border overflow-hidden transition-colors"
                      style={{ viewTransitionName: `post-${index}` }}
                    >
                      <div className="w-full flex items-center gap-3 text-muted-foreground px-3 py-1.5 border-b border-border">
                        <Info className="size-4" aria-hidden="true" />
                        <span className="text-sm font-mono">INFO.md</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="relative w-full h-[100px] sm:h-[120px] bg-muted rounded-lg overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">{post.category}</span>
                          <h3 className="text-sm font-medium mt-0.5 mb-0.5">{post.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{post.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-4 sm:size-5">
                              <AvatarImage src={post.author?.image || ""} alt={post.author?.name || ""} />
                              <AvatarFallback>{post.author?.initials || "AB"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-medium">{post.author?.name || "Ayan Biswas"}</p>
                              <p className="text-xs text-muted-foreground">{post.date}</p>
                            </div>
                          </div>
                          <button 
                            className="opacity-0 group-hover:opacity-100"
                            aria-label="More options"
                          >
                            <MoreVertical className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 