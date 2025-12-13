"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
    {
        question: "What is Embedd?",
        answer: "A security‑focused mail gateway for form submissions and transactional emails. We sit between your forms and your SMTP provider to block spam, log threats, and give you full visibility."
    },
    {
        question: "Do I have to change my current SMTP provider?",
        answer: "No. You bring your own SMTP configuration (Postmark, SES, SendGrid, etc.); Embedd acts as a secure proxy layer adding spam filtering and logging."
    },
    {
        question: "How is spam & abuse handled?",
        answer: "We inspect IP, user agent, origin and content, and can block or quarantine suspicious messages per project based on rules you define."
    },
    {
        question: "Where is my data stored?",
        answer: "We store logs and metadata in secure, compliant infrastructure. Detailed data residency options will be available in the Pro plan."
    }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
    return (
        <div className="border-b border-border/50 last:border-0">
            <button
                onClick={onClick}
                className="flex w-full items-center justify-between py-6 text-left text-lg font-medium hover:text-primary transition-colors focus:outline-none"
            >
                {question}
                <div className={`ml-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    <Plus className="h-5 w-5 opacity-50" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-muted-foreground leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="w-full py-24 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Frequently asked questions
                    </h2>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-2 md:p-8 shadow-sm">
                    {FAQS.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(index === openIndex ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
