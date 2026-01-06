"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current values from URL or defaults
    const range = searchParams.get("range") || "24h";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    const [selectedRange, setSelectedRange] = React.useState(range);
    const [customFrom, setCustomFrom] = React.useState(from);
    const [customTo, setCustomTo] = React.useState(to);

    // Update local state when URL changes
    React.useEffect(() => {
        setSelectedRange(range);
        setCustomFrom(from);
        setCustomTo(to);
    }, [range, from, to]);

    const handleRangeChange = (value: string) => {
        setSelectedRange(value);

        if (value !== "custom") {
            const params = new URLSearchParams(searchParams.toString());
            params.set("range", value);
            params.delete("from");
            params.delete("to");
            router.push(`?${params.toString()}`);
        }
    };

    const applyCustomRange = () => {
        if (!customFrom || !customTo) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("range", "custom");
        params.set("from", customFrom);
        params.set("to", customTo);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-[180px]">
                <Select value={selectedRange} onValueChange={handleRangeChange}>
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 3 Months</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selectedRange === "custom" && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="from" className="sr-only">From</Label>
                        <Input
                            id="from"
                            type="date"
                            className="h-8 w-auto text-xs"
                            value={customFrom}
                            onChange={(e) => setCustomFrom(e.target.value)}
                            max={customTo || undefined}
                        />
                        <span className="text-muted-foreground text-xs">–</span>
                        <Label htmlFor="to" className="sr-only">To</Label>
                        <Input
                            id="to"
                            type="date"
                            className="h-8 w-auto text-xs"
                            value={customTo}
                            onChange={(e) => setCustomTo(e.target.value)}
                            min={customFrom || undefined}
                        />
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={applyCustomRange}
                        disabled={!customFrom || !customTo}
                    >
                        Apply
                    </Button>
                </div>
            )}
        </div>
    );
}
