import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const featuredTechs = [
    { name: 'Ahmed H.', role: 'Electrical Engineer', rating: 4.9, reviews: 124, skills: ['Wiring', 'Installations'] },
    { name: 'Sarah J.', role: 'Civil Engineer', rating: 4.8, reviews: 89, skills: ['Structural', 'Design'] },
    { name: 'Mike C.', role: 'HVAC Specialist', rating: 5.0, reviews: 27, skills: ['AC Repair', 'Heating'] },
    { name: 'David M.', role: 'Plumbing Expert', rating: 4.7, reviews: 156, skills: ['Repairs', 'Installations'] },
];

export function TechnicianPreview() {
    return (
        <section id="technicians" className="py-20">
            <div className="container px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Trusted Technicians</h2>
                        <p className="text-muted-foreground">Verified professionals ready for your next project.</p>
                    </div>
                    <Button variant="link" className="text-primary hidden md:block">View All Experts &rarr;</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredTechs.map((tech, i) => (
                        <Card key={i} className="bg-card border-border/50 overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden relative">
                                        {/* Placeholder for avatar */}
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold bg-muted text-muted-foreground">
                                            {tech.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{tech.name}</h3>
                                        <p className="text-xs text-primary">{tech.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mb-4">
                                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    <span className="text-sm font-medium">{tech.rating}</span>
                                    <span className="text-xs text-muted-foreground">({tech.reviews} reviews)</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tech.skills.map(skill => (
                                        <span key={skill} className="text-[10px] bg-secondary px-2 py-1 rounded text-secondary-foreground">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button variant="outline" className="w-full text-xs h-8">View Profile</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="mt-8 text-center md:hidden">
                    <Button variant="link" className="text-primary">View All Experts &rarr;</Button>
                </div>
            </div>
        </section>
    )
}
