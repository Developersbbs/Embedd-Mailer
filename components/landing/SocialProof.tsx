"use client";

import React from 'react';
import { motion } from 'framer-motion';

const LOGOS = [
    "Startup Labs",
    "Fintech Core",
    "DevOps Studio",
    "Cloud Systems",
    "Secure Net",
];

export default function SocialProof() {
    return (
        <div className="w-full py-12 border-y border-border/40 bg-muted/20">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">
                    Trusted by security‑minded teams and indie builders
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
                    {LOGOS.map((logo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground grayscale hover:grayscale-0 transition-all duration-300"
                        >
                            {logo}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
