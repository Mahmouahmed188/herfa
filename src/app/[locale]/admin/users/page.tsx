'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, User as UserIcon, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
    const { data: response, isLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => api.getUsers(),
    });

    const users = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
                <Button>Export Data</Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : users.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <UserIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">No users found</h2>
                        <p className="text-muted-foreground">The platform currently has no registered users.</p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Registered Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">User</th>
                                        <th className="px-6 py-3 font-semibold">Contact</th>
                                        <th className="px-6 py-3 font-semibold">Role</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold">Joined</th>
                                        <th className="px-6 py-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user: any) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/20">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {user.name?.charAt(0)?.toUpperCase() || user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{user.name || `${user.firstName || ''} ${user.lastName || ''}`}</div>
                                                        <div className="text-xs text-muted-foreground">{user.id.substring(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {user.email}
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                            {user.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="capitalize px-2 py-1 bg-secondary rounded text-xs font-medium flex w-fit items-center gap-1">
                                                    {user.role === 'provider' || user.role === 'technician' ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                    user.status === 'SUSPENDED' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                                                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                    {user.status || 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button variant="outline" size="sm" className="text-xs h-8">View Profile</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
