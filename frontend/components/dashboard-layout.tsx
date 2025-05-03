"use client";

import type React from "react";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  BookCopy,
  Users,
  ChevronDown,
  LayoutDashboard,
  BookMarked,
  Library,
  FileText,
  BookText,
  Layers,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  role: "student" | "librarian" | "admin";
};

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isCollapsedReady, setIsCollapsedReady] = useState(false);
  const userName = Cookies.get("userName") || "User";
  const userRole = Cookies.get("role") || role;

  // Check if screen is mobile on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      setCollapsed(saved === "true");
      setIsCollapsedReady(true);
    }
  }, []);

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", newState.toString());
  };

  const studentNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
    { title: "Browse Books", href: "/dashboard/student/books", icon: BookText },
    {
      title: "My Borrowings",
      href: "/dashboard/student/borrowings",
      icon: BookMarked,
    },
  ];

  const librarianNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard/librarian", icon: LayoutDashboard },
    {
      title: "Manage Books",
      href: "/dashboard/librarian/books",
      icon: Library,
    },
    {
      title: "Manage Requests",
      href: "/dashboard/librarian/requests",
      icon: FileText,
    },
    {
      title: "Manage Returns",
      href: "/dashboard/librarian/returns",
      icon: BookCopy,
    },
  ];

  const adminNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    {
      title: "Manage Librarians",
      href: "/dashboard/admin/librarians",
      icon: Users,
    },
  ];

  const navItems =
    role === "student"
      ? studentNavItems
      : role === "librarian"
        ? librarianNavItems
        : adminNavItems;

  const handleLogout = () => {
    // Remove auth cookies
    Cookies.remove("token", { path: "/" });
    Cookies.remove("role", { path: "/" });
    Cookies.remove("userName", { path: "/" });
    // Send to home
    router.push("/");
  };

  // const userName = role === "student" ? "Alex Johnson" : role === "librarian" ? "Sarah Smith" : "Admin User"

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Sidebar for desktop */}
      {isCollapsedReady && (
        <aside
          className={cn(
            "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out relative",
            collapsed ? "w-[80px]" : "w-[300px]"
          )}
        >
          <div className="p-4 border-b border-border flex items-center justify-between h-16"></div>

          {/* Add a tab on the side for toggling the sidebar */}
          <button
            onClick={toggleCollapsed}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-card border border-border rounded-full p-1 shadow-md z-10 hover:bg-muted transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronDown
              className={`h-4 w-4 ${collapsed ? "-rotate-90" : "rotate-90"} transition-transform`}
            />
          </button>

          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <TooltipProvider key={item.href} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        tabIndex={collapsed ? -1 : undefined}
                        onFocus={
                          collapsed ? (e) => e.currentTarget.blur() : undefined
                        }
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative group",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="truncate">{item.title}</span>
                            {item.badge && (
                              <Badge
                                className={cn(
                                  "ml-auto",
                                  pathname === item.href
                                    ? "bg-primary-foreground text-primary"
                                    : "bg-muted-foreground/20 text-foreground"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.title} {/* show text on hover */}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-border mt-auto">
            <div
              className={cn(
                "flex items-center justify-center gap-3 mb-4",
                collapsed && "flex-col items-center"
              )}
            >
              <User className="h-6 w-6 text-black dark:text-white" />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {role}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className={cn("w-full justify-center gap-2", collapsed)}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </div>
        </aside>
      )}

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <div className="p-4 border-b border-border flex items-center justify-center">
            <div className="flex items-center align-middle"></div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full h-full"
            >
              <div className="flex items-center justify-center w-full h-full border-2 border-gray-400 rounded-md p-1">
                <X className="h-5 w-5" />
              </div>
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge
                      className={cn(
                        "ml-auto",
                        pathname === item.href
                          ? "bg-primary-foreground text-primary"
                          : "bg-muted-foreground/20 text-foreground"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-black dark:text-white" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-background border-b border-border h-16 sticky top-0 z-10 flex items-center px-4 lg:px-6">
          <div className="w-full flex items-center justify-between">
            <div className="w-8" /> {/* Spacer for left side */}
            <div className="flex items-center">
              <Layers className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">Athena</h1>
            </div>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
