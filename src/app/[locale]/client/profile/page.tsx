'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import * as api from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export default function ClientProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = React.useState(false);

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => api.getCurrentUser(),
    });

    const handleSave = () => {
        // Implement save logic here to update profile using API
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const currentProfile = profileData || user;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button variant={isEditing ? "default" : "outline"} onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                        {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-border">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                            {currentProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{currentProfile?.name || 'User'}</h2>
                            <p className="text-muted-foreground">{currentProfile?.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold capitalize">
                                {currentProfile?.role || 'Customer'}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="name" 
                                    defaultValue={currentProfile?.name || ''} 
                                    disabled={!isEditing}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="email" 
                                    type="email" 
                                    defaultValue={currentProfile?.email || ''} 
                                    disabled={true} 
                                    className="pl-9 bg-muted/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="phone" 
                                    defaultValue={currentProfile?.phone || ''} 
                                    disabled={!isEditing}
                                    className="pl-9"
                                    placeholder="+1234567890"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Default Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="address" 
                                    defaultValue={currentProfile?.address || ''} 
                                    disabled={!isEditing}
                                    className="pl-9"
                                    placeholder="Enter your address"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h4 className="font-semibold">Password</h4>
                            <p className="text-sm text-muted-foreground">Change your password</p>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20 bg-destructive/5">
                        <div>
                            <h4 className="font-semibold text-destructive">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
