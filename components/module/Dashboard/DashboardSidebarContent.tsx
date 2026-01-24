"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/assets/logo/logo.png";

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-[#138bc9]/10 bg-gradient-to-b from-white to-[#138bc9]/5">
      {/* Logo/Brand */}
      <div className="flex h-20 items-center justify-center border-b border-[#138bc9]/10 px-6 bg-white shrink-0">
        <Link href={dashboardHome} className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#138bc9] rounded-xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <Image
              src={logo}
              width={120}
              height={120}
              alt="TourNest Logo"
              className="relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      </div>

      {/* Navigation - Scrollable Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <nav className="space-y-6 px-4 py-6">
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
                      <Icon
                        className={cn(
                          "h-5 w-5 relative z-10 transition-transform duration-300",
                          isActive ? "scale-110" : "group-hover:translate-x-0.5"
                        )}
                      />
                      <span className="flex-1 relative z-10">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className={cn(
                            "ml-auto relative z-10 rounded-full text-[10px] px-2",
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
      </div>

      {/* User Info at Bottom */}
      <div className="border-t border-[#138bc9]/10 p-4 bg-white/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#138bc9]/5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
          <Avatar className="h-9 w-9 border-2 border-[#138bc9]/10">
            <AvatarImage src={userInfo?.profilePhoto || undefined} />
            <AvatarFallback className="bg-[#138bc9]/10 text-[#138bc9] font-bold text-xs">
              {userInfo?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold truncate text-gray-900 leading-tight">
              {userInfo?.name}
            </p>
            <p className="text-[10px] text-[#138bc9] font-semibold uppercase tracking-wider mt-0.5">
              {userInfo.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DashboardSidebarContent;