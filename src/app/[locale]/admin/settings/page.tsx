'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Shield, CreditCard, Bell, Save } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage global configurations, fees, and security policies.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            General Platform
                        </CardTitle>
                        <CardDescription>Basic application settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="platformName">Platform Name</Label>
                            <Input id="platformName" defaultValue="Herfa Marketplace" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supportEmail">Support Email</Label>
                            <Input id="supportEmail" defaultValue="support@herfa.app" />
                        </div>
                        <Button className="w-full mt-2"><Save className="w-4 h-4 mr-2" /> Save General</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Financial & Fees
                        </CardTitle>
                        <CardDescription>Configure commission rates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="commissionRate">Platform Commission (%)</Label>
                            <Input id="commissionRate" type="number" defaultValue="15" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minWithdrawal">Minimum Withdrawal ($)</Label>
                            <Input id="minWithdrawal" type="number" defaultValue="50" />
                        </div>
                        <Button className="w-full mt-2"><Save className="w-4 h-4 mr-2" /> Save Financials</Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Security Policies
                        </CardTitle>
                        <CardDescription>User verification and access control</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">Require Provider KYC Validation</p>
                                <p className="text-sm text-muted-foreground">Providers must upload ID before accepting jobs</p>
                            </div>
                            <Button variant="outline">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">Force 2FA for all admin accounts</p>
                            </div>
                            <Button variant="outline">Enabled</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
