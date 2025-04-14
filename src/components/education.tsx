"use client";

import { Button } from "./ui/button";
import { MessageCircle, Paintbrush, Smartphone, Users, BellRing, Music, Image } from "lucide-react";
import { useState } from "react";
import { Timeline } from "./Timeline";

export const EducationAndLinks = () => {
  const [isDesignOpen, setIsDesignOpen] = useState(false);
  const [isRomsOpen, setIsRomsOpen] = useState(false);

  return (
    <div className="px-5 py-3 space-y-3">
      <Timeline />

      <div className="rounded-lg border">
        <Button 
          variant="ghost" 
          className="w-full justify-between px-4 py-6 rounded-t-lg hover:bg-muted/50"
          onClick={() => setIsDesignOpen(!isDesignOpen)}
        >
          <div className="flex items-center gap-2">
            <Paintbrush className="size-4" />
            <span className="font-semibold">Design Community</span>
          </div>
        </Button>
        <div className={`${isDesignOpen ? '' : 'hidden'} p-5 space-y-3`}>
          <Button variant="outline" size="sm" className="gap-2 w-full justify-start" asChild>
            <a href="https://t.me/designverse_zero" target="_blank" rel="noopener noreferrer">
              <BellRing className="size-4" />
              Channel Updates
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 w-full justify-start" asChild>
            <a href="https://t.me/designverse_chat" target="_blank" rel="noopener noreferrer">
              <Users className="size-4" />
              Community Chat
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Button 
          variant="ghost" 
          className="w-full justify-between px-4 py-6 rounded-t-lg hover:bg-muted/50"
          onClick={() => setIsRomsOpen(!isRomsOpen)}
        >
          <div className="flex items-center gap-2">
            <Smartphone className="size-4" />
            <span className="font-semibold">ROMs & Support</span>
          </div>
        </Button>
        <div className={`${isRomsOpen ? '' : 'hidden'} p-5 space-y-3`}>
          <Button variant="outline" size="sm" className="gap-2 w-full justify-start" asChild>
            <a href="https://t.me/ayan_builds" target="_blank" rel="noopener noreferrer">
              <BellRing className="size-4" />
              ROM Updates
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 w-full justify-start" asChild>
            <a href="https://t.me/ayanot69" target="_blank" rel="noopener noreferrer">
              <Users className="size-4" />
              Support Chat
            </a>
          </Button>
        </div>
      </div>

      <Button variant="outline" className="gap-2 w-full justify-start py-6" asChild>
        <a href="https://t.me/ayandumps_music" target="_blank" rel="noopener noreferrer">
          <Music className="size-4" />
          <span>Music Collection</span>
        </a>
      </Button>

      <Button variant="outline" className="gap-2 w-full justify-start py-6" asChild>
        <a href="https://t.me/wallwidgy" target="_blank" rel="noopener noreferrer">
          <Image className="size-4" />
          <span>Wallpaper Collection</span>
        </a>
      </Button>
    </div>
  );
}; 