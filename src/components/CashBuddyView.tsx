import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getGeminiResponse } from '../services/geminiService';
import { SendIcon, SparklesIcon, TrashIcon } from './icons';

export const initialBotMessage: ChatMessage = { id: '1', role: 'model', text: "Hej där! Jag är CashBuddy, din AI-finansiella assistent. Be mig om spartips, budgetråd eller hjälp med att hantera studentekonomin!" };

interface CashBuddyViewProps {
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const CashBuddyView: React.FC<CashBuddyViewProps> = ({ messages, setMessages }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await getGeminiResponse(updatedMessages);
            const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIconClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
        }, 800); // Duration matches CSS animation
    };

    const handleClearChat = () => {
        setMessages([initialBotMessage]);
    };

    return (
        <div className="h-full flex flex-col p-4">
            <header className="relative text-center mb-4">
                <button
                    onClick={handleClearChat}
                    aria-label="Clear chat history"
                    className="absolute top-0 right-0 p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <TrashIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={handleIconClick} 
                    aria-label="Animate CashBuddy icon"
                    className="inline-block mb-2 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    <SparklesIcon className={`w-10 h-10 text-blue-500 ${isAnimating ? 'sparkle-animate' : ''}`} />
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    CashBuddy AI
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Din personliga ekonomi-assistent.</p>
            </header>
            
            <div className="flex-grow overflow-y-auto space-y-4 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xs p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask for savings tips..."
                    className="flex-grow p-3 border-2 border-transparent rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200">
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CashBuddyView;