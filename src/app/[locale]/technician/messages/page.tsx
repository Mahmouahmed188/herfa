'use client';

import React, { useState } from 'react';
import { 
    Search, MessageSquare, Send, 
    User, Clock, Loader2, 
    MoreVertical, Phone, Video
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function TechnicianMessagesPage() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messageInput, setMessageInput] = useState('');

    const { data: conversations = [], isLoading: loadingConvs } = useQuery({
        queryKey: ['conversations'],
        queryFn: () => api.getMyMessages(),
    });

    const { data: messages = [], isLoading: loadingMessages } = useQuery({
        queryKey: ['conversation', selectedUser?.id],
        queryFn: () => api.getConversation(selectedUser.id),
        enabled: !!selectedUser,
    });

    const sendMutation = useMutation({
        mutationFn: (content: string) => api.sendMessage(selectedUser.id, content),
        onSuccess: () => {
            setMessageInput('');
            queryClient.invalidateQueries({ queryKey: ['conversation', selectedUser?.id] });
        }
    });

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim() && selectedUser) {
            sendMutation.mutate(messageInput);
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex bg-surface-dark border border-surface-border rounded-[32px] overflow-hidden">
            {/* Sidebar: Conversations */}
            <div className="w-80 border-r border-surface-border flex flex-col">
                <div className="p-6 border-b border-surface-border">
                    <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search chats..."
                            className="w-full bg-surface-light border border-surface-border rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-primary transition-all"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {loadingConvs ? (
                        <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                    ) : conversations.length > 0 ? (
                        conversations.map((conv: any) => {
                            const otherUser = conv.senderId === user?.id ? conv.receiver : conv.sender;
                            const isActive = selectedUser?.id === otherUser?.id;
                            return (
                                <button 
                                    key={conv.id}
                                    onClick={() => setSelectedUser(otherUser)}
                                    className={`w-full p-4 flex items-center gap-3 transition-colors border-b border-surface-border/50 ${isActive ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/5'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-surface-light border border-surface-border overflow-hidden shrink-0">
                                        <img src={`https://i.pravatar.cc/100?u=${otherUser?.id}`} alt="User" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                            <p className="text-sm font-bold text-white truncate">{otherUser?.firstName || 'Client'}</p>
                                            <span className="text-[10px] text-gray-500">{new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{conv.content}</p>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">No conversations yet.</div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-surface-light/30">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-surface-border bg-surface-dark flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-surface-light border border-surface-border overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${selectedUser.id}`} alt="User" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                    <p className="text-[10px] text-primary flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"><Phone className="w-4 h-4" /></button>
                                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"><Video className="w-4 h-4" /></button>
                                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg: any) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-dark text-gray-200 rounded-tl-none'}`}>
                                            {msg.content}
                                            <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-gray-500'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {loadingMessages && <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-surface-dark border-t border-surface-border flex items-center gap-3">
                            <input 
                                type="text" 
                                placeholder="Type a message..."
                                className="flex-1 bg-surface-light border border-surface-border rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-primary transition-all"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            />
                            <button 
                                type="submit"
                                disabled={!messageInput.trim() || sendMutation.isPending}
                                className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-600 mb-6">
                            <MessageSquare className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Select a Conversation</h3>
                        <p className="text-gray-500 max-w-xs">Choose a client from the list to start or continue your conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
