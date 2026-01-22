// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Service {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface Technician {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    image: string;
    available: boolean;
}

export const mockServices: Service[] = [
    { id: '1', name: 'Plumbing', description: 'Fix leaks and pipes', icon: 'wrench' },
    { id: '2', name: 'Electrical', description: 'Wiring and repairs', icon: 'zap' },
    { id: '3', name: 'HVAC', description: 'Heating and cooling', icon: 'thermometer' },
    { id: '4', name: 'Cleaning', description: 'Deep cleaning services', icon: 'sparkles' },
];

export const mockTechnicians: Technician[] = [
    { id: 't1', name: 'Ahmed H.', specialty: 'Electrical', rating: 4.8, reviews: 124, image: '/api/placeholder/150/150', available: true },
    { id: 't2', name: 'Sarah J.', specialty: 'Plumbing', rating: 4.9, reviews: 89, image: '/api/placeholder/150/150', available: true },
    { id: 't3', name: 'Mike C.', specialty: 'HVAC', rating: 4.7, reviews: 56, image: '/api/placeholder/150/150', available: false },
];

export const mockApi = {
    getServices: async () => {
        await delay(500);
        return mockServices;
    },
    getTechnicians: async () => {
        await delay(800);
        return mockTechnicians;
    },
    login: async (email: string) => {
        await delay(1000);
        // Mock login logic
        if (email.includes('client')) {
            return {
                id: 'c1',
                name: 'John Client',
                email,
                role: 'client' as const,
                token: 'mock-jwt-token-client',
            };
        } else if (email.includes('tech')) {
            return {
                id: 't1',
                name: 'Ahmed Tech',
                email,
                role: 'technician' as const,
                token: 'mock-jwt-token-tech',
            };
        } else {
            // Default to client
            return {
                id: 'c1',
                name: 'User',
                email,
                role: 'client' as const,
                token: 'mock-jwt-token-user'
            }
        }
    }
};
