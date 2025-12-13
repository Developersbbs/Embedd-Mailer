"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Pricing() {
    return (
        <div className="w-full py-24 bg-muted/10">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Start free, scale when you’re ready
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Simple, transparent pricing for teams of all sizes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="p-8 h-full flex flex-col border-border/50 hover:border-primary/50 transition-colors relative overflow-hidden">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">Developer</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold">$0</span>
                                    <span className="text-muted-foreground">/mo</span>
                                </div>
                                <p className="text-muted-foreground mt-4 text-sm">Perfect for hobby projects and small apps.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "10,000 events / month",
                                    "All core features",
                                    "Basic logging (3 day retention)",
                                    "Community support"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full" variant="outline">Get Started</Button>
                        </Card>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="p-8 h-full flex flex-col border-primary bg-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-bl-lg">
                                RECOMMENDED
                            </div>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">Coming Soon</span>
                                </div>
                                <p className="text-muted-foreground mt-4 text-sm">For growing teams and businesses.</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {[
                                    "Unlimited events (usage based)",
                                    "90-day log retention",
                                    "Priority support",
                                    "Advanced export & reporting",
                                    "Team collaboration"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full" disabled>Join Waitlist</Button>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
