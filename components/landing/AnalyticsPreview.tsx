"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const STATS = [
    { label: "Delivery Rate (24h)", value: "98.4%", change: "+0.2%" },
    { label: "Spam Blocked (24h)", value: "842", change: "+12%" },
    { label: "Quarantined", value: "63", change: "-5%" },
    { label: "Errors (24h)", value: "32", change: "-2%" },
];

export default function AnalyticsPreview() {
    return (
        <div className="w-full py-24 bg-muted/10">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Project‑level analytics at a glance
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Each project surfaces email volume, delivery rates, spam blocked and threat activity, powered by live mail logs.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {STATS.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-border/60">
                                <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2 truncate">
                                    {stat.label}
                                </div>
                                <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
                                    {stat.value}
                                </div>
                                <div className={`text-xs mt-2 font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.change} <span className="text-muted-foreground font-normal">vs last period</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Mini Charts Visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {['Daily Sends', 'Spam vs Clean Traffic'].map((title, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + (i * 0.2) }}
                        >
                            <Card className="p-6 h-64 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-semibold text-sm">{title}</h4>
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        <span className="px-2 py-0.5 rounded-full bg-muted">7d</span>
                                        <span className="px-2 py-0.5 rounded-full hover:bg-muted cursor-pointer">30d</span>
                                    </div>
                                </div>
                                <div className="flex-1 w-full flex items-end gap-2 relative overflow-hidden">
                                    {/* Mock Chart Bars */}
                                    {Array.from({ length: 24 }).map((_, idx) => {
                                        const height = Math.random() * 80 + 20;
                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ height: 0 }}
                                                whileInView={{ height: `${height}%` }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.5 + (idx * 0.02), duration: 0.5 }}
                                                className={`flex-1 rounded-t-sm ${i === 0 ? 'bg-primary/80' : idx % 3 === 0 ? 'bg-red-500/60' : 'bg-green-500/60'}`}
                                            ></motion.div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
