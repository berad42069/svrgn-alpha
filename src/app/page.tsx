"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (status !== "streaming" && status !== "submitted") {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage({ text });
  };

  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-screen bg-black text-white font-mono text-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20 select-none gap-2">
            <span className="text-2xl tracking-[0.3em] uppercase">SVRGN</span>
            <span className="text-xs tracking-widest">TERMINAL v0</span>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? (
              <div className="text-white/40">
                <span className="text-white/20 mr-2">&gt;</span>
                {m.parts
                  .filter((p) => p.type === "text")
                  .map((p) => p.text)
                  .join("")}
              </div>
            ) : (
              <div className="whitespace-pre-wrap leading-relaxed">
                {m.parts
                  .filter((p) => p.type === "text")
                  .map((p) => p.text)
                  .join("")}
              </div>
            )}
          </div>
        ))}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-white/70 animate-pulse" />
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 p-4 shrink-0"
      >
        <div className="flex items-center gap-2">
          <span className="text-white/30 select-none">&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isStreaming ? "" : "..."}
            autoFocus
            disabled={isStreaming}
            className="flex-1 bg-transparent outline-none caret-white placeholder:text-white/10"
          />
        </div>
      </form>
    </div>
  );
}
