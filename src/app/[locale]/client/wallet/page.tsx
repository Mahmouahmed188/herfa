'use client';

import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, Gift, Plus } from 'lucide-react';
import { PaymentHistoryTable } from '@/features/finance/components/PaymentHistoryTable';
import { PaymentFilterBar } from '@/features/finance/components/PaymentFilterBar';
import { useTranslations } from 'next-intl';

export default function WalletPage() {
    const t = useTranslations('Finance');

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('title')}</h1>
                <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
                    Manage your balance, payment methods, and transaction history.
                </p>
            </div>

            {/* Balance cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
                    <div className="flex items-start justify-between mb-4">
                        <p className="text-white/70 text-sm font-medium">Total Balance</p>
                        <Wallet className="w-5 h-5 text-white/60" />
                    </div>
                    <p className="text-4xl font-bold mb-1">$1,250.00</p>
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12% from last month</span>
                    </div>
                    <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors">
                        <Plus className="w-4 h-4" /> Top Up
                    </button>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
                    <div className="flex items-start justify-between mb-4">
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Total Spent</p>
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">$4,320.50</p>
                    <p className="text-xs text-slate-400 mt-1">All time</p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark">
                    <div className="flex items-start justify-between mb-4">
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Pending Income</p>
                        <ArrowDownLeft className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">$150.00</p>
                    <p className="text-xs text-slate-400 mt-1">Processing</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transactions */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-slate-900 dark:text-white">{t('paymentHistory')}</h2>
                    </div>
                    <div className="space-y-4">
                        <PaymentFilterBar />
                        <PaymentHistoryTable type="customer" />
                    </div>
                </div>

                {/* Cards & Referral */}
                <div className="space-y-6">
                    {/* Payment Methods */}
                    <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                        <h2 className="font-bold text-slate-900 dark:text-white mb-4">Cards & Accounts</h2>
                        <div className="space-y-3">
                            {/* Visa card */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 text-white">
                                <p className="text-xs text-white/60 mb-3">Visa</p>
                                <p className="font-mono text-sm tracking-widest">•••• •••• •••• 4242</p>
                                <p className="text-xs text-white/60 mt-2">Expires 12/27</p>
                            </div>
                            {/* Mastercard */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-900 to-red-900 text-white">
                                <p className="text-xs text-white/60 mb-3">Mastercard</p>
                                <p className="font-mono text-sm tracking-widest">•••• •••• •••• 8834</p>
                                <p className="text-xs text-white/60 mt-2">Expires 09/26</p>
                            </div>
                        </div>
                        <button className="w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-slate-200 dark:border-surface-border text-slate-500 dark:text-gray-400 text-sm font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Add Card
                        </button>
                    </div>

                    {/* Referral */}
                    <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 text-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <Gift className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">Refer a Friend & Earn $20</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 mb-4">
                            Invite friends and you&apos;ll both get $20 when they complete their first service.
                        </p>
                        <button className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                            Share Invite Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
