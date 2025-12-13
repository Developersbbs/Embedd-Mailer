"use client";

import React from 'react';
import { motion } from 'framer-motion';
import LightRays from '@/components/LightRays';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';
import FloatingHeader from './FloatingHeader';


export default function Hero() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <FloatingHeader />
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff" // Cyan/Teal to match the 'secure' vibe
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.05}
          distortion={0.1}
          className="custom-rays opacity-50 dark:opacity-30"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 flex flex-col items-center text-center space-y-8 mt-16 md:mt-24">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="px-3 py-1 text-sm bg-background/50 backdrop-blur-sm border-primary/20 text-primary rounded-full">
            <span className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v1.0 Public Beta
            </span>
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl"
        >
          Secure email infrastructure <br className="hidden md:block" />
          with <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">real‑time</span> spam intelligence
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Embedd helps teams send transactional emails safely, track delivery, and block threats before they reach inboxes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <div className="flex flex-col items-center gap-2">
            <Link href="/app">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <span className="text-xs text-muted-foreground">No credit card required.</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-transparent select-none">Spacer</span>
          </div>
        </motion.div>

        {/* Visual Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          className="w-full max-w-3xl mt-12 relative"
        >
          {/* Glow effect behind card */}
          <div className="absolute inset-0 -z-10 bg-primary/20 blur-3xl rounded-full opacity-50 transform scale-90 translate-y-4"></div>

          <Card className="p-6 bg-card/80 backdrop-blur-md border-primary/10 shadow-2xl overflow-hidden relative">
            <div className="flex flex-col gap-6">

              {/* Top Row: Stats & Status */}
              <div className="flex flex-row justify-between items-center border-b border-border/50 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Today's Volume</span>
                    <span className="text-2xl font-bold font-mono">1,028</span>
                  </div>
                  <div className="h-8 w-px bg-border/50"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Delivery Rate</span>
                    <span className="text-2xl font-bold font-mono text-green-500">99.4%</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 rounded-md px-3 py-1 mt-10">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  System Healthy
                </Badge>
              </div>

              {/* Middle Row: Visual Bars (Mockup) */}
              <div className="w-full flex items-end gap-1 h-24 pt-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95, 80, 65, 70, 85, 90, 75, 60, 80, 95, 70, 60, 50].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: 0.5 + (i * 0.02) }}
                    className={`flex-1 rounded-t-[2px] ${i > 18 ? 'bg-primary' : 'bg-primary/20'}`}
                  />
                ))}
              </div>

              {/* Bottom Row: Log Log */}
              <div className="flex items-center gap-3 text-sm bg-muted/50 p-2 rounded-lg border border-border/50">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-mono text-xs text-muted-foreground">10:42:31</span>
                <span className="font-semibold text-foreground">Delivered</span>
                <span className="text-muted-foreground hidden sm:inline">New signup confirmation</span>
                <span className="ml-auto flex items-center gap-1 text-xs opacity-60">
                  <Mail className="h-3 w-3" /> user@domain.com
                </span>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm"
              >
                <ShieldCheck className="w-3 h-3" /> Spam blocked: 842
              </motion.div>

            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
