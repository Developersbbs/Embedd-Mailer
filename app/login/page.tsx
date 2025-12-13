"use client"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"




export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-between">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image src="/assets/logo/embedd-logo.png" alt="Logo" width={150} height={150} />
          </Link>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="hidden dark:block rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
            <Moon className="block dark:hidden rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/login-feature-bg.png"
          alt="Secure Email Infrastructure"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  )
}
