import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Ayan Biswas",
  description: "My projects and works",
};

export default function Projects() {
  return (
    <div className="w-full flex justify-center py-6">
      <div className="w-[80%] lg:w-[60%] space-y-4">
        <Button variant="ghost" className="gap-2 -ml-2" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Info className="size-4" />
              <span className="text-sm font-mono">PROJECTS.md</span>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-medium">work in progress :p</p>
              <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                <Image
                  src="https://media.tenor.com/x8v1oNUOmg4AAAAd/rickroll-roll.gif"
                  alt="Never gonna give you up"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 