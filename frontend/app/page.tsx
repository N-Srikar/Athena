import Link from "next/link"
import { BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Main content centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-center">
            <div className="bg-primary h-20 w-20 rounded-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Athena</h1>
          <p className="text-xl md:text-2xl text-muted-foreground">Library Management System</p>

          {/* Login/signup buttons centered below the title */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Simple footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Athena Library Management System</p>
      </footer>
    </div>
  )
}
