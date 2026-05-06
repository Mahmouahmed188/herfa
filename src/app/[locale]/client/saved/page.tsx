'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClientSavedPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Saved Technicians</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Your favorite professionals for quick booking.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {[
                    { id: 1, name: 'Alex Johnson', role: 'Master Plumber', rating: 4.9, jobs: 124, location: 'Downtown' },
                    { id: 2, name: 'Sarah Miller', role: 'Electrician', rating: 4.8, jobs: 89, location: 'Northside' },
                ].map((tech) => (
                    <Card key={tech.id}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {tech.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{tech.name}</h3>
                                        <p className="text-sm text-muted-foreground">{tech.role}</p>
                                    </div>
                                </div>
                                <Heart className="w-5 h-5 text-red-500 fill-current cursor-pointer" />
                            </div>
                            
                            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    {tech.rating}
                                </span>
                                <span>•</span>
                                <span>{tech.jobs} Jobs completed</span>
                            </div>
                            
                            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" /> {tech.location}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t flex gap-2">
                                <Button className="flex-1">Book Again</Button>
                                <Button variant="outline" className="flex-1">View Profile</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
