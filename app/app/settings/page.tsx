"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [emailDigest, setEmailDigest] = useState(false);
    const [securityAlerts, setSecurityAlerts] = useState(true);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
        fetch("/api/account")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load");
                return res.json();
            })
            .then((data) => {
                if (data.preferences?.notifications) {
                    setEmailDigest(data.preferences.notifications.emailDigest);
                    setSecurityAlerts(data.preferences.notifications.securityAlerts);
                }
                // Optionally sync theme from DB if needed:
                // if (data.preferences?.theme && data.preferences.theme !== "system") {
                //     setTheme(data.preferences.theme);
                // }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const updatePreference = async (key: string, value: boolean) => {
        // Optimistic update
        if (key === "emailDigest") setEmailDigest(value);
        if (key === "securityAlerts") setSecurityAlerts(value);

        try {
            await fetch("/api/account", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    preferences: {
                        notifications: {
                            [key]: value
                        }
                    }
                }),
            });
            toast.success("Settings saved");
        } catch {
            toast.error("Failed to save settings");
            // Revert on error (simplified)
        }
    };

    if (!mounted) return null;

    return (
        <ContentLayout title="Settings">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>
                            Customize the look and feel of the application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Toggle dark mode on or off.
                                </p>
                            </div>
                            <Switch
                                checked={theme === "dark"}
                                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Configure how you want to receive alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Digest</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive a weekly summary of your project activity.
                                </p>
                            </div>
                            <Switch
                                checked={emailDigest}
                                onCheckedChange={(checked) => updatePreference("emailDigest", checked)}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Security Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified about suspicious login attempts.
                                </p>
                            </div>
                            <Switch
                                checked={securityAlerts}
                                onCheckedChange={(checked) => updatePreference("securityAlerts", checked)}
                                disabled={loading}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible actions for your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" onClick={() => toast("Delete functionality coming soon!", { icon: "🚧" })}>
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    );
}
