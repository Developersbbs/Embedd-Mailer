"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ShieldAlert, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

const ACTIVITIES = [
    { type: 'blocked', message: 'Signup from throwaway domain', time: '2s ago' },
    { type: 'delivered', message: 'Password reset to user@company.com', time: '14s ago' },
    { type: 'quarantined', message: 'High‑risk link detected in contact form', time: '42s ago' },
    { type: 'delivered', message: 'Welcome email to new-user@gmail.com', time: '1m ago' },
    { type: 'blocked', message: 'Excessive requests from IP 192.168.x.x', time: '2m ago' },
];

export default function SecurityHighlight() {
    return (
        <div className="w-full py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Content */}
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-primary bg-primary/10 mb-4">
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Security First
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                                Security signals, not just send status
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                See blocked attempts, threats and quarantined messages, so your team can respond instead of guessing.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Spam & threat counts per project",
                                    "Quarantine queue for suspicious messages",
                                    "Per‑event metadata: IP, domain, transport response"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                        <span className="text-foreground/80">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right Visual: Activity Feed */}
                    <div className="flex-1 w-full max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Decoration */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20"></div>

                            <Card className="relative bg-card/90 backdrop-blur border-border p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Search className="w-4 h-4 text-muted-foreground" />
                                        Live Security Log
                                    </h3>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {ACTIVITIES.map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.15 }}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 group"
                                        >
                                            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${activity.type === 'blocked' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                                                    activity.type === 'quarantined' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
                                                        'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                                }`}></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${activity.type === 'blocked' ? 'text-red-500' :
                                                            activity.type === 'quarantined' ? 'text-yellow-500' :
                                                                'text-green-500'
                                                        }`}>{activity.type}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{activity.time}</span>
                                                </div>
                                                <p className="text-sm truncate text-foreground/90 group-hover:text-foreground transition-colors">{activity.message}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
