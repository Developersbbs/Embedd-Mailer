"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldAlert, Zap, LayoutDashboard, Code2, LucideIcon } from 'lucide-react';

interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
    bullets: string[];
}

const FEATURES: Feature[] = [
    {
        title: "Real‑time spam & threat filtering",
        description: "Automatically detect suspicious submissions, honeypots, and bad domains before email is even sent.",
        icon: ShieldAlert,
        bullets: ["Honeypot field detection", "Domain allow‑lists", "IP, user agent checks"],
    },
    {
        title: "Connect any SMTP in minutes",
        description: "Bring your own SMTP provider—Postmark, SES, custom relays—and manage everything in a single dashboard.",
        icon: Zap,
        bullets: ["Per‑project SMTP config", "Zero‑code form endpoint", "JSON/HTML payloads"],
    },
    {
        title: "Per‑project dashboards",
        description: "Every project gets its own overview: delivery, bounces, spam blocks and recent activity logs.",
        icon: LayoutDashboard,
        bullets: ["24h and 7‑day trends", "Security & spam widgets", "Per‑project API keys"],
    },
    {
        title: "Developer‑first API",
        description: "Drop‑in endpoints for forms and programmatic triggers, with clean TypeScript types.",
        icon: Code2,
        bullets: ["REST endpoints", "Typed SDK (planned)", "CLI for local testing"],
    },
];

export default function WebFeatureGrid() {
    return (
        <div className="w-full py-24 bg-background">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Built for secure form handling
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-muted-foreground"
                    >
                        Everything you need to handle forms securely without building your own backend.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="h-full border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-colors duration-300 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="leading-tight">{feature.title}</CardTitle>
                                    <CardDescription className="pt-2">{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        {feature.bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary/50"></div>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
