'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { PaymentHistoryTable } from '@/features/finance/components/PaymentHistoryTable';
import { PaymentFilterBar } from '@/features/finance/components/PaymentFilterBar';
import { useTranslations } from 'next-intl';

export default function TechnicianEarningsPage() {
    const t = useTranslations('Finance');

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('earnings')}</h1>
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

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('paymentHistory')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <PaymentFilterBar />
                    <PaymentHistoryTable type="provider" />
                </CardContent>
            </Card>
        </div>
    );
}
