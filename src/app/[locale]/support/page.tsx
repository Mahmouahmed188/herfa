'use client';

import { useState } from 'react';
import { Send, Paperclip, X, Bot, ChevronRight } from 'lucide-react';

const conversations = [
    {
        id: 1,
        name: 'Ahmed Support',
        ticket: 'Plumbing Repair Issue #4092',
        preview: 'Typing...',
        typing: true,
        unread: 2,
        avatar: '👨‍🔧',
    },
    {
        id: 2,
        name: 'Sarah (Billing)',
        ticket: 'Payment Question #3821',
        preview: 'Ticket Resolved. Thank you!',
        typing: false,
        unread: 0,
        avatar: '👩‍💼',
    },
    {
        id: 3,
        name: 'Herfa Bot',
        ticket: 'Welcome to Herfa',
        preview: 'How can we help you today?',
        typing: false,
        unread: 0,
        avatar: '🤖',
    },
];

const messages = [
    { from: 'agent', text: "Hello! I see you're having an issue with a recent plumbing repair. I'd be happy to help look into this for you.", time: '2:30 PM' },
    { from: 'user', text: "Hi Ahmed, yes. The craftsman came yesterday but the leak started again this morning.", time: '2:32 PM' },
    { from: 'agent', text: "I'm sorry to hear that. That definitely shouldn't happen. Let me contact the craftsman immediately and arrange a re-visit.", time: '2:33 PM' },
];

export default function SupportPage() {
    const [selectedConv, setSelectedConv] = useState(1);
    const [message, setMessage] = useState('');

    return (
        <div className="flex h-[calc(100vh-8rem)] rounded-2xl overflow-hidden border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
            {/* Sidebar */}
            <div className="w-72 shrink-0 border-r border-slate-200 dark:border-surface-border flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-surface-border">
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white">Messages</h1>
                </div>
                <div className="overflow-y-auto flex-1">
                    {conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConv(conv.id)}
                            className={`w-full text-left p-4 border-b border-slate-100 dark:border-surface-border hover:bg-slate-50 dark:hover:bg-background-dark transition-colors ${selectedConv === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-background-dark flex items-center justify-center text-xl shrink-0">
                                    {conv.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{conv.name}</p>
                                        {conv.unread > 0 && (
                                            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0 ml-1">
                                                {conv.unread}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-gray-500 truncate mt-0.5">{conv.ticket}</p>
                                    <p className={`text-xs truncate mt-0.5 ${conv.typing ? 'text-primary italic' : 'text-slate-400 dark:text-gray-500'}`}>
                                        {conv.preview}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
                {/* Chat header */}
                <div className="p-4 border-b border-slate-200 dark:border-surface-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-background-dark flex items-center justify-center text-xl">
                        👨‍🔧
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Ahmed Support</p>
                        <p className="text-xs text-slate-400">Ticket #4092 · Plumbing Repair Issue</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-background-dark">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md ${msg.from === 'user' ? 'order-1' : 'order-2'}`}>
                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.from === 'user'
                                        ? 'bg-primary text-white rounded-br-sm'
                                        : 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white rounded-bl-sm shadow-sm border border-slate-100 dark:border-surface-border'
                                    }`}>
                                    {msg.text}
                                </div>
                                <p className={`text-xs text-slate-400 mt-1 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-surface-dark px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-surface-border">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-400 dark:text-gray-500 py-2">
                        Replies are typically within 5 minutes during business hours.
                    </p>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-background-dark text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <div className="flex-1 relative">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-background-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && setMessage('')}
                            />
                        </div>
                        <button
                            onClick={() => setMessage('')}
                            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Ticket details panel */}
            <div className="hidden xl:flex w-64 shrink-0 border-l border-slate-200 dark:border-surface-border flex-col p-5 space-y-5">
                <h3 className="font-bold text-slate-900 dark:text-white">Ticket Details</h3>
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">STATUS</p>
                        <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">Open</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">TICKET ID</p>
                        <p className="text-sm text-slate-700 dark:text-gray-300 font-mono">#4092</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">CRAFTSMAN ASSIGNED</p>
                        <p className="text-sm text-slate-700 dark:text-gray-300 font-semibold">John Doe</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs text-slate-400 font-medium mb-3">ATTACHMENTS</p>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-surface-border flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-600">PDF</div>
                        <div className="min-w-0">
                            <p className="font-medium text-slate-800 dark:text-gray-200 truncate text-xs">Warranty_Policy.pdf</p>
                            <p className="text-slate-400 text-xs">2.4 MB</p>
                        </div>
                    </div>
                </div>

                <button className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    Close Ticket
                </button>
            </div>
        </div>
    );
}
