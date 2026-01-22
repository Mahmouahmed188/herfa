import { Wrench, Zap, Droplets, Hammer, Paintbrush, Truck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const services = [
    { icon: Wrench, title: 'Plumbing', desc: 'Leakages, installations, and repairs.' },
    { icon: Zap, title: 'Electrical', desc: 'Wiring, fixtures, and appliances.' },
    { icon: Droplets, title: 'HVAC', desc: 'AC repair, heating, and ventilation.' },
    { icon: Hammer, title: 'Carpentry', desc: 'Custom furniture and wood repairs.' },
    { icon: Paintbrush, title: 'Painting', desc: 'Interior and exterior detailing.' },
    { icon: Truck, title: 'Moving', desc: 'Safe and secure relocation.' },
];

export function Services() {
    return (
        <section id="services" className="py-20 bg-secondary/20">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Our Services</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need for your home and office maintenance, all in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <Card key={index} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors group cursor-pointer">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <service.icon className="h-6 w-6 text-primary group-hover:text-current" />
                                </div>
                                <CardTitle>{service.title}</CardTitle>
                                <CardDescription>{service.desc}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
