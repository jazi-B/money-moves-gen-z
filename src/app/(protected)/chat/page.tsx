"use strict";
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendAIChatMessage, type ChatMessage } from "@/lib/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: "user", parts: [{ text: input }] };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        const responseText = await sendAIChatMessage(messages, input);

        const aiMsg: ChatMessage = { role: "model", parts: [{ text: responseText }] };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col relative z-0">
            <div className="mb-4 md:mb-6 shrink-0">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Financial Bestie 🤖
                </h1>
                <p className="text-sm md:text-base text-slate-400">Ask me about your spending, savings, or just roast me.</p>
            </div>

            <Card className="flex-1 bg-slate-900/50 border-slate-800 p-4 overflow-y-auto mb-4 backdrop-blur-xl relative z-0 scrollbar-hide rounded-2xl">
                <div className="space-y-4 pb-20">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-500 mt-20">
                            <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No messages yet. Say "Hi"!</p>
                        </div>
                    )}

                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "model" && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                                        <Bot size={18} />
                                    </div>
                                )}

                                <div
                                    className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === "user"
                                            ? "bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-900/20"
                                            : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700 shadow-lg"
                                        }`}
                                >
                                    {msg.parts[0].text}
                                </div>

                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                                        <User size={18} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                                <Bot size={18} />
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-2xl rounded-tl-none border border-slate-700/50 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                <span className="text-xs text-slate-400">Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </Card>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
                className="flex gap-2 sticky bottom-0 bg-slate-950/90 backdrop-blur-md p-3 -mx-4 md:mx-0 rounded-t-2xl border-t border-slate-800/50 z-50 shadow-2xl"
            >
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    autoFocus
                    className="bg-slate-900 border-slate-700 focus-visible:ring-emerald-500/50 text-base"
                />
                <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] aspect-square p-0 w-10 shrink-0"
                >
                    <Send size={18} />
                </Button>
            </form>
        </div>
    );
}
