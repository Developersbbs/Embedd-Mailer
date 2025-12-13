"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { FileCode2, ArrowRight, ShieldCheck, Settings } from 'lucide-react';

export default function Steps() {
    const steps = [
        {
            title: "Create a secure project",
            description: "Create a project, copy your API key and choose how you want to send: SMTP or provider.",
            icon: Settings
        },
        {
            title: "Drop in the form endpoint",
            description: "Point your form to Embedd. We validate, sanitize and run spam checks on every submission.",
            icon: FileCode2
        },
        {
            title: "Review logs & alerts",
            description: "Track deliveries, blocked attempts and quarantined messages in a single security‑first dashboard.",
            icon: ShieldCheck
        }
    ];

    return (
        <div className="w-full py-24 bg-muted/10 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How it works</h2>
                    <p className="text-lg text-muted-foreground">Get up and running in less than 5 minutes.</p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex flex-col items-center text-center relative"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center mb-6 z-10 relative">
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
                                    {index + 1}
                                </div>
                                <step.icon className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground max-w-sm">{step.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Code Snippet Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <Card className="bg-[#1e1e1e] border-0 shadow-2xl overflow-hidden text-sm">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-400 font-mono">example-request.sh</span>
                        </div>
                        <div className="p-6 font-mono text-gray-300 overflow-x-auto">
                            <div className="flex">
                                <span className="text-purple-400 mr-2">POST</span>
                                <span className="text-green-400">https://embedd.sbbs.co.in/api/forms/{`{projectId}`}/submit</span>
                            </div>
                            <div className="mt-2 text-gray-500">Headers:</div>
                            <div className="pl-4">
                                <span className="text-blue-300">"Content-Type"</span>: <span className="text-orange-300">"application/json"</span>,
                            </div>
                            <div className="pl-4 w-full">
                                <span className="text-blue-300">"X-API-Key"</span>: <span className="text-orange-300">"proj_xxx..."</span>
                            </div>
                            <div className="mt-2 text-gray-500">Body:</div>
                            <div className="pl-4 text-yellow-300">{"{"}</div>
                            <div className="pl-8">
                                <span className="text-blue-300">"email"</span>: <span className="text-orange-300">"user@example.com"</span>,
                            </div>
                            <div className="pl-8">
                                <span className="text-blue-300">"message"</span>: <span className="text-orange-300">"Hello from SBBS"</span>
                            </div>
                            <div className="pl-4 text-yellow-300">{"}"}</div>
                        </div>
                    </Card>
                </motion.div>

            </div>
        </div>
    );
}
