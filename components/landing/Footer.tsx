"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="w-full bg-muted/20 pt-24 pb-12 border-t border-border/50">
            <div className="container mx-auto px-4">

                {/* Final CTA */}
                <div className="flex flex-col items-center text-center mb-24 max-w-2xl mx-auto space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">Ready to secure your email forms?</h2>
                    <p className="text-muted-foreground text-lg">Create your first SBBS project and get a full security dashboard in minutes.</p>
                    <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-xl shadow-primary/20">
                        Create a project
                    </Button>
                </div>

                <div className="border-t border-border/50 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">

                    <div className="flex flex-col gap-2 md:items-start items-center">
                        <Image src="/assets/logo/embedd-logo.png" alt="Logo" width={150} height={150} />
                        <p className="text-sm text-muted-foreground">© 2025 SBBS Inc. All rights reserved.</p>
                    </div>

                    <div className="flex gap-8 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                            <Twitter className="w-5 h-5 opacity-70" />
                        </a>
                        <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                            <Github className="w-5 h-5 opacity-70" />
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}
