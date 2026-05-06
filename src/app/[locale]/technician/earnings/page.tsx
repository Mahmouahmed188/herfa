'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TechnicianEarningsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Earnings & Payouts</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track your completed jobs and withdraw funds.
                    </p>
                </div>
                <Button>Withdraw Funds</Button>
            </div>

            {/* Balance cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
                    <div className="flex items-start justify-between mb-4">
                        <p className="text-white/70 text-sm font-medium">Available to Withdraw</p>
                        <Wallet className="w-5 h-5 text-white/60" />
                    </div>
                    <p className="text-4xl font-bold mb-1">$850.00</p>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>Ready for transfer</span>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <p className="text-sm font-medium text-muted-foreground">This Month</p>
                            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-3xl font-bold">$1,240.50</p>
                        <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Pending Clearance</p>
                            <DollarSign className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-3xl font-bold">$320.00</p>
                        <p className="text-xs text-muted-foreground mt-1">From 3 recent jobs</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Payouts */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { id: 1, title: 'Job #4829 - Kitchen Sink Repair', date: 'Oct 24, 2024', amount: '+ $120.00', type: 'earning' },
                            { id: 2, title: 'Job #4815 - Light Fixture Install', date: 'Oct 22, 2024', amount: '+ $85.00', type: 'earning' },
                            { id: 3, title: 'Withdrawal to Bank Account', date: 'Oct 20, 2024', amount: '- $500.00', type: 'withdrawal' },
                            { id: 4, title: 'Job #4790 - Pipe Leak Fix', date: 'Oct 18, 2024', amount: '+ $210.00', type: 'earning' },
                        ].map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'earning' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {tx.type === 'earning' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{tx.title}</p>
                                        <p className="text-sm text-muted-foreground">{tx.date}</p>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.type === 'earning' ? 'text-emerald-600' : ''}`}>
                                    {tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
