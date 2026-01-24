"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardMobileSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardMobileSidebar = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardMobileSidebarContentProps) => {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#138bc9]/10 px-6">
        <Link href={dashboardHome} className="flex items-center gap-2">
          <span className="text-xl font-black text-gray-900 tracking-tight">
            Tour<span className="text-[#138bc9]">Nest</span>
          </span>
        </Link>
      </div>
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-6">
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && (
                <h4 className="mb-3 px-3 text-[10px] font-bold text-[#138bc9]/60 uppercase tracking-widest">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                        isActive
                          ? "bg-[#138bc9] text-white shadow-lg shadow-[#138bc9]/20"
                          : "text-gray-600 hover:bg-[#138bc9]/10 hover:text-[#138bc9]"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className={cn(
                            "ml-auto text-[10px] px-2 rounded-full",
                            isActive
                              ? "bg-white/20 text-white border-white/20"
                              : "bg-[#138bc9]/10 text-[#138bc9] border-transparent"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
              {sectionIdx < navItems.length - 1 && (
                <Separator className="my-6 bg-[#138bc9]/5" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info at Bottom */}
      <div className="border-t border-[#138bc9]/10 p-4 bg-white/50 backdrop-blur-sm shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#138bc9]/5 shadow-sm">
          <div className="h-9 w-9 rounded-full bg-[#138bc9]/10 flex items-center justify-center border-2 border-[#138bc9]/10 shrink-0">
            <span className="text-xs font-black text-[#138bc9]">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-gray-900 leading-tight">{userInfo.name}</p>
            <p className="text-[10px] text-[#138bc9] font-semibold uppercase tracking-wider mt-0.5">
              {userInfo.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DashboardMobileSidebar;
