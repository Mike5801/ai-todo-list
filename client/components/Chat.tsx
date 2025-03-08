"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { SendHorizonal, X } from "lucide-react";
import { postToGpt } from "@/services/openai.service";

interface ChatProps {
  closeChat: () => void;
}

export const Chat = ({ closeChat }: ChatProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  
  const handleSubmit = async (formData: FormData) => {
    const userMessage = formData.get("userMessage") as string;
    setMessages([...messages, userMessage]);
    try {
      const response = await postToGpt();
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      console.log(data)

    } catch (error: any) {
      console.log(`error: ${error.message}`);
    }
  };
  return (
    <div className="absolute bottom-14 right-14 h-72 rounded-sm shadow-sm w-72 bg-slate-50 p-3">
      <div className="flex justify-end items-center relative">
        <Button className="w-5 h-5 absolute" variant={"outline"} onClick={closeChat}>
          <X />
        </Button>
      </div>
      <div className="h-full flex flex-col gap-3 justify-between">
        {/* Messages */}
        <div className="flex flex-col gap-1 overflow-y-auto justify-center">
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        {/* Input chat */}
        <form action={handleSubmit} className="flex gap-2">
          <input
            name="userMessage"
            className="border w-full px-1"
            type="text"
            placeholder="enter message"
          />
          <Button size={"sm"} variant={"action"} type="submit">
            <SendHorizonal />
          </Button>
        </form>
      </div>
    </div>
  );
};
