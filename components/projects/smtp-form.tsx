"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeClosed } from "lucide-react";


const smtpSchema = z.object({
    host: z.string().min(1, "Host is required"),
    port: z.number().min(1, "Port is required"),
    username: z.string().optional(),
    password: z.string().optional(),
    secure: z.boolean(),
    fromEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    toEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    ccEmail: z.string().optional().or(z.literal("")).refine((val) => {
        if (!val) return true;
        const emails = val.split(",").map(e => e.trim());
        return emails.every(e => z.string().email().safeParse(e).success);
    }, "Invalid email format. Use commas to separate multiple emails."),
});

type SmtpFormValues = z.infer<typeof smtpSchema>;

interface SmtpFormProps {
    projectId: string;
    initialData?: any;
}

export function SmtpForm({ projectId, initialData }: SmtpFormProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<SmtpFormValues>({
        resolver: zodResolver(smtpSchema),
        defaultValues: {
            host: initialData?.host || "",
            port: initialData?.port || 587,
            username: initialData?.username || "",
            password: initialData?.password || "",
            secure: initialData?.secure || false,
            fromEmail: initialData?.fromEmail || "",
            toEmail: initialData?.toEmail || "",
            ccEmail: initialData?.ccEmail || "",
        },
    });

    async function onSubmit(data: SmtpFormValues) {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ smtpSettings: data }),
            });

            if (!res.ok) throw new Error("Failed to save settings");

            toast.success("SMTP settings saved");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="host"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SMTP Host</FormLabel>
                                <FormControl>
                                    <Input placeholder="smtp.example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="port"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Port</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="587"
                                        {...field}
                                        onChange={e => {
                                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                                            field.onChange(val);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? (
                                                <Eye className="h-4 w-4" />
                                            ) : (
                                                <EyeClosed className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="secure"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        if (checked === true) {
                                            form.setValue("port", 465);
                                        } else if (checked === false) {
                                            form.setValue("port", 587);
                                        }
                                    }}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Secure (SSL/TLS)</FormLabel>
                                <FormDescription>
                                    Check this if your SMTP server requires a secure connection (usually port 465).
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fromEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>From Email (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="noreply@example.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Override the default sender address.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="toEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>To Email (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="admin@example.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Where to send submissions (defaults to your account email).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="ccEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CC Email (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="manager@example.com, team@example.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Send a copy to multiple addresses (comma-separated).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save SMTP Settings"}
                </Button>
            </form>
        </Form>
    );
}
