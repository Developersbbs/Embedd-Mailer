"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fieldSchema = z.object({
    id: z.string().min(1, "ID is required").regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric only"),
    label: z.string().min(1, "Label is required"),
    type: z.enum(["text", "email", "number", "textarea", "checkbox", "select"]),
    required: z.boolean(),
    placeholder: z.string().optional(),
    options: z.array(z.string()), // For select
});

const schemaSchema = z.object({
    formSchema: z.array(fieldSchema),
});

type SchemaFormValues = z.infer<typeof schemaSchema>;

interface FormBuilderProps {
    projectId: string;
    initialSchema?: any[];
}

export function FormBuilder({ projectId, initialSchema = [] }: FormBuilderProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<SchemaFormValues>({
        resolver: zodResolver(schemaSchema),
        defaultValues: {
            formSchema: initialSchema.map(f => ({
                ...f,
                required: f.required ?? false,
                options: f.options || [], // Ensure options is array
            })),
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "formSchema",
    });

    async function onSubmit(data: SchemaFormValues) {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formSchema: data.formSchema }),
            });

            if (!res.ok) throw new Error("Failed to save schema");

            toast.success("Form schema saved");
        } catch (error) {
            toast.error("Failed to save schema");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id}>
                            <CardContent className="p-4 flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                        <FormField
                                            control={form.control}
                                            name={`formSchema.${index}.id`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Field ID (key)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`formSchema.${index}.label`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Label</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Email Address" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`formSchema.${index}.type`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="text">Text</SelectItem>
                                                            <SelectItem value="email">Email</SelectItem>
                                                            <SelectItem value="number">Number</SelectItem>
                                                            <SelectItem value="textarea">Textarea</SelectItem>
                                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                                            <SelectItem value="select">Select</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/90 mt-6"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`formSchema.${index}.required`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal text-xs">Required</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`formSchema.${index}.placeholder`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Placeholder text..." className="h-8 text-xs" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ id: "", label: "", type: "text", required: false, placeholder: "", options: [] })}
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                </Button>

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Schema"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
