"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

export default function TutorialsPage() {
    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Tutorials</h2>
                </div>
                <p className="text-muted-foreground">
                    Step-by-step guides to configure your projects and integrate them with your applications.
                </p>

                <Tabs defaultValue="quickstart" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                        <TabsTrigger value="configuration">Configuration</TabsTrigger>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="integration">Integration</TabsTrigger>
                    </TabsList>

                    <TabsContent value="quickstart" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Create a Project</CardTitle>
                                <CardDescription>Get started by creating a new project container.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>
                                    Navigate to the <strong>Projects</strong> dashboard and click the <strong>Create Project</strong> button.
                                    Give your project a name and a description.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>2. Get your API Key</CardTitle>
                                <CardDescription>You need this key to authenticate your submissions.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>
                                    Once your project is created, open it. You will see your <strong>API Key</strong> on the dashboard.
                                    Keep this key secret! It allows applications to submit data to your project.
                                </p>
                                <div className="bg-muted p-2 rounded-md font-mono text-sm">
                                    x-api-key: your_api_key_here
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="configuration" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>SMTP Configuration</CardTitle>
                                <CardDescription>Send emails when a form is submitted.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>
                                    Go to <strong>Settings &gt; SMTP Configuration</strong>. Enter your SMTP details (Host, Port, User, Password).
                                    This allows the system to forward submissions to your inbox or send auto-replies.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Allowed Domains</CardTitle>
                                <CardDescription>Secure your form from unauthorized usage.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>
                                    Go to <strong>Settings &gt; Security & Domains</strong>. Add the domains where your form will be hosted (e.g., <code>https://myapp.com</code>).
                                    Requests from other origins will be rejected.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Form Schema</CardTitle>
                                <CardDescription>Validate specific fields.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>
                                    Go to <strong>Settings &gt; Form Schema</strong>. Define the fields you expect (e.g., 'email', 'age').
                                    The API will validate incoming data against this schema and reject invalid requests.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="templates" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Creating Mail Templates</CardTitle>
                                <CardDescription>Design beautiful emails using HTML and dynamic placeholders.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>
                                    Templates allow you to define the structure of the emails sent when a form is submitted.
                                    You can create reusable templates in the <strong>Templates</strong> section or use Global System templates.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Dynamic Placeholders</CardTitle>
                                <CardDescription>Inject form data into your email subject and body.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>
                                    Use the <code>{`{{key}}`}</code> syntax to insert values from your form submission.
                                    The keys are <strong>case-insensitive</strong>.
                                </p>
                                <div className="grid gap-2 text-sm border p-4 rounded-md">
                                    <div className="grid grid-cols-2 border-b pb-2 font-semibold">
                                        <span>Placeholder</span>
                                        <span>Matches Form Field</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <code className="bg-muted px-1 rounded">{`{{name}}`}</code>
                                        <span>name, Name, NAME</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <code className="bg-muted px-1 rounded">{`{{email}}`}</code>
                                        <span>email, Email</span>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <code className="bg-muted px-1 rounded">{`{{message}}`}</code>
                                        <span>message, msg, etc.</span>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    Any field sent in your JSON payload can be accessed. If a field is missing, it will be replaced with an empty string.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Styling & Best Practices</CardTitle>
                                <CardDescription>Ensure your emails look good in all clients.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li><strong>Use Inline CSS:</strong> Email clients (like Gmail) often strip <code>&lt;style&gt;</code> tags. Write styles directly on elements (e.g., <code>&lt;div style=&quot;color:blue;&quot;&gt;</code>).</li>
                                    <li><strong>Tables for Layout:</strong> For maximum compatibility, use generic HTML tables for structure instead of Flexbox/Grid.</li>
                                    <li><strong>Images:</strong> Use absolute URLs for images.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="integration" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>HTML Form Integration</CardTitle>
                                <CardDescription>Simple fetch API example.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                    {`<script>
  async function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('https://your-app-url.com/api/forms/{PROJECT_ID}/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Success!');
    } else {
      alert('Error!');
    }
  }
</script>

<form onsubmit="submitForm(event)">
  <input name="email" type="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send</button>
</form>`}
                                </pre>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>React / Next.js Integration</CardTitle>
                                <CardDescription>Using modern functional components.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                    {`const handleSubmit = async (data) => {
  try {
    const res = await fetch('https://your-app-url.com/api/forms/{PROJECT_ID}/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY'
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error('Failed');
    console.log('Submitted!');
  } catch (err) {
    console.error(err);
  }
};`}
                                </pre>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>cURL Example</CardTitle>
                                <CardDescription>Test from your terminal.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                                    {`curl -X POST https://your-app-url.com/api/forms/{PROJECT_ID}/submit \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"email": "test@example.com", "message": "Hello world"}'`}
                                </pre>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    );
}
