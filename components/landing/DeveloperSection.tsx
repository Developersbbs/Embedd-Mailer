"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check } from 'lucide-react';

const CODE_EXAMPLES = {
    curl: `curl -X POST https://embedd.sbbs.co.in/api/v1/send \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "user@example.com",
    "from": "noreply@myapp.com",
    "subject": "Hello world",
    "text": "Sent securely with Embedd"
  }'`,
    react: `const handleSubmit = async (data) => {
  const response = await fetch('https://embedd.sbbs.co.in/api/forms/abc-123/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (response.ok) {
    console.log('Email queued successfully');
  }
};`,
    nextjs: `// app/actions.ts
'use server'

export async function sendEmail(formData: FormData) {
  const sbbs = new SBBSClient(process.env.SBBS_API_KEY);
  
  await sbbs.send({
    to: formData.get('email'),
    subject: 'Welcome!',
    template: 'welcome-v1'
  });
}`
};

export default function DeveloperSection() {
    return (
        <div className="w-full py-24 bg-background border-t border-border/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-start gap-16">

                    {/* Left Content */}
                    <div className="flex-1 space-y-8 lg:sticky lg:top-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                                Built for developers
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Embedd plugs into your existing stack with minimal friction. Use simple HTTP endpoints, clean TypeScript types and clear error responses.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Next.js route examples",
                                    "Copy‑paste React form snippet",
                                    "Webhook‑ready log events (planned)"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-foreground/80">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right Content: Code Tabs */}
                    <div className="flex-1 w-full">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Tabs defaultValue="curl" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/50">
                                    <TabsTrigger value="curl">cURL</TabsTrigger>
                                    <TabsTrigger value="react">React</TabsTrigger>
                                    <TabsTrigger value="nextjs">Next.js</TabsTrigger>
                                </TabsList>

                                <div className="relative group">
                                    {/* Glow */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                                    <div className="relative rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden shadow-2xl">
                                        <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                            </div>
                                        </div>

                                        <div className="p-4 overflow-x-auto min-h-[300px]">
                                            {Object.entries(CODE_EXAMPLES).map(([key, code]) => (
                                                <TabsContent key={key} value={key} className="mt-0">
                                                    <pre className="text-sm font-mono leading-relaxed text-[#c9d1d9]">
                                                        <code>{code}</code>
                                                    </pre>
                                                </TabsContent>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Tabs>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
