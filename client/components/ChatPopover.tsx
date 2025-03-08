"use client";
import { useState } from "react";
import { Chat } from "./Chat";
import { Button } from "./ui/button";

export const ChatPopover = () => {
  const [open, setOpen] = useState(false);
  const closeChat = () => {
    setOpen(false);
  }
  const toggleChat = () => {
    setOpen(!open);
  }
  return (
    <div className="absolute top-[85%] left-[85%]">
      <Button className="rounded-full w-14 h-14" variant={"action"} onClick={toggleChat}>
        Chat
      </Button>
      {
        open 
        ? (<Chat closeChat={closeChat} />)
        : null
      }
    </div>
  );
};
