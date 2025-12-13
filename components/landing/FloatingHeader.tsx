"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";



export default function FloatingHeader() {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(true);
    const { theme, setTheme } = useTheme();

    // Optional: Hide on scroll down, show on scroll up logic can be added here
    // For now, keeping it always visible but perhaps changing style on scroll

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        >
            <div className="pointer-events-auto flex items-center justify-between gap-4 bg-background/60 backdrop-blur-xl border border-primary/10 pl-6 pr-2 py-2 rounded-full shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300 w-full max-w-2xl">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
                    <Image src="/assets/logo/embedd-logo.png" alt="Logo" width={150} height={150} />
                </Link>

                {/* Navigation - Hidden on mobile, visible on desktop */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                    <Link href="/docs/lander.md" className="hover:text-primary transition-colors">Docs</Link>
                </nav>

                {/* CTA */}
                <div className='flex items-center gap-2'>
                    <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        <SunIcon className="rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
                        <MoonIcon className="absolute w-3 h-3 rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
                    </Button>
                    <Link href="/app">
                        <Button size="sm" className="rounded-full px-5 h-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
