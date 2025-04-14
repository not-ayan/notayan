"use client";

import { Button } from "./ui/button";
import { MessageCircle, Paintbrush, Smartphone, Users, BellRing, Music, Image as ImageIcon, ChevronRight } from "lucide-react";
import { Timeline } from "./Timeline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const EducationAndLinks = () => {
  return (
    <div className="px-5 py-3 space-y-3">
      <Timeline />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="design" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-6 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <Paintbrush className="size-4" aria-hidden="true" />
              <span className="font-semibold">Design Community</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 space-y-3">
            <Button variant="outline" size="sm" className="gap-2 w-full justify-start" asChild>
              <a href="https://t.me/designverse_zero" target="_blank" rel="noopener noreferrer">
                <BellRing className="size-4" aria-hidden="true" />
                Channel Updates
              </a>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 w-full justify-start" asChild>
              <a href="https://t.me/designverse_chat" target="_blank" rel="noopener noreferrer">
                <Users className="size-4" aria-hidden="true" />
                Community Chat
              </a>
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="roms" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-6 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <Smartphone className="size-4" aria-hidden="true" />
              <span className="font-semibold">ROMs & Support</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 space-y-3">
            <Button variant="outline" size="sm" className="gap-2 w-full justify-start" asChild>
              <a href="https://t.me/ayan_builds" target="_blank" rel="noopener noreferrer">
                <BellRing className="size-4" aria-hidden="true" />
                ROM Updates
              </a>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 w-full justify-start" asChild>
              <a href="https://t.me/ayanot69" target="_blank" rel="noopener noreferrer">
                <Users className="size-4" aria-hidden="true" />
                Support Chat
              </a>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="gap-2 w-full justify-start py-6" asChild>
        <a href="https://t.me/ayandumps_music" target="_blank" rel="noopener noreferrer">
          <Music className="size-4" aria-hidden="true" />
          <span>Music Collection</span>
        </a>
      </Button>

      <Button variant="outline" className="gap-2 w-full justify-start py-6" asChild>
        <a href="https://t.me/wallwidgy" target="_blank" rel="noopener noreferrer">
          <ImageIcon className="size-4" aria-hidden="true" />
          <span>Wallpaper Collection</span>
        </a>
      </Button>
    </div>
  );
}; 