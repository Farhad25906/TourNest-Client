import { getCookie } from "@/services/auth/tokenHandlers";
import {
  Menu,
  LayoutDashboard,
  LogOut,
  User,
  MapPin,
  Shield,
  BookOpen,
  Info,
  CreditCard,
  HelpCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LogoutButton from "./LogoutButton";
import Image from "next/image";
import logo from "../../assets/logo/logo.png";
import { UserInfo } from "@/types/user.interface";
import { getUserInfo } from "@/services/auth/auth.services";
import { UserRole } from "@/lib/auth-utils";

const PublicNavbar = async () => {
  const navItems = [
    { href: "/destinations", label: "Destinations", icon: MapPin },
    { href: "/tours", label: "Tours", icon: MapPin },
    { href: "/blogs", label: "Blogs", icon: BookOpen },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  const userInfo = (await getUserInfo()) as unknown as UserInfo;
  const accessToken = await getCookie("accessToken");

  const getDashboardRoute = () => {
    if (!userInfo?.role) return "/dashboard";
    switch (userInfo.role) {
      case "ADMIN": return "/admin/dashboard";
      case "HOST": return "/host/dashboard";
      case "TOURIST": return "/user/dashboard";
      default: return "/dashboard";
    }
  };

  const getUserInitials = () => {
    if (!userInfo?.name) return "U";
    return userInfo.name.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2);
  };

  const getDisplayName = () => userInfo?.name || userInfo?.user?.name || "User";
  const getDisplayEmail = () => userInfo?.email || userInfo?.user?.email || "";
  const getProfilePhoto = () => userInfo?.user?.profilePhoto || undefined;

  const getRoleIcon = () => {
    if (!userInfo?.role) return null;
    switch (userInfo.role) {
      case "ADMIN": return <Shield className="w-4 h-4 text-red-600" />;
      case "HOST": return <MapPin className="w-4 h-4 text-green-600" />;
      case "TOURIST": return <User className="w-4 h-4 text-[#138bc9]" />;
      default: return null;
    }
  };

  const dashboardRoute = getDashboardRoute();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-7xl">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-3xl px-6 h-18 flex items-center justify-between transition-all duration-300">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-36 h-36 overflow-hidden transform group-hover:rotate-12 transition-transform duration-500">
            <Image
              src={logo}
              fill
              className="object-contain"
              alt="TourNest Logo"
            />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-2 bg-gray-100/50 p-1 rounded-2xl">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-[#138bc9] rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 flex items-center gap-2"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {accessToken && userInfo ? (
            <div className="flex items-center gap-2">
              <Link href={dashboardRoute} className="hidden md:block">
                <Button variant="ghost" className="rounded-xl font-bold text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors border border-gray-200">
                    <span className="text-xs font-bold text-gray-600 hidden sm:block">{getDisplayName()}</span>
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                      <AvatarImage src={getProfilePhoto()} />
                      <AvatarFallback className="bg-[#138bc9] text-white text-[10px]">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-4 p-2 rounded-2xl border-white/20 shadow-2xl backdrop-blur-xl bg-white/95">
                  <div className="p-3 mb-2 bg-gray-50/50 rounded-xl">
                    <p className="text-sm font-black text-gray-900">{getDisplayName()}</p>
                    <p className="text-[10px] text-gray-500 truncate">{getDisplayEmail()}</p>
                    <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-white rounded-lg shadow-sm w-fit border border-gray-100">
                      {getRoleIcon()}
                      <span className="text-[10px] uppercase tracking-widest font-black text-gray-600">
                        {userInfo.role}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-100 mb-1" />
                  <DropdownMenuItem asChild>
                    <Link href="/my-profile" className="rounded-lg py-2.5 cursor-pointer">
                      <User className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="font-semibold text-sm">My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={dashboardRoute} className="rounded-lg py-2.5 cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="font-semibold text-sm">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 my-1" />
                  <DropdownMenuItem className="text-red-600 focus:text-red-700 bg-red-50/50 hover:bg-red-50 focus:bg-red-50 rounded-lg py-2.5 mt-1 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-3" />
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl font-bold text-gray-700">Log In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#138bc9] hover:bg-[#0e6ba3] rounded-xl font-bold shadow-lg shadow-[#138bc9]/20 px-6 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  Start Free
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="w-6 h-6 text-[#138bc9]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-0 rounded-l-[2rem] bg-white/95 backdrop-blur-xl">
                <SheetTitle className="flex items-center gap-3 px-2 mb-10">
                  <div className="w-8 h-8 relative">
                    <Image src={logo} fill alt="Logo" className="object-contain" />
                  </div>
                  <span className="text-xl font-black text-[#138bc9]">TourNest</span>
                </SheetTitle>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-[#138bc9]/5 text-gray-600 hover:text-[#138bc9] font-bold transition-all"
                    >
                      <item.icon className="w-5 h-5 opacity-60" />
                      {item.label}
                    </Link>
                  ))}

                  <div className="my-6 border-t border-gray-100 mx-4" />

                  {accessToken ? (
                    <Link
                      href={dashboardRoute}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#138bc9] text-white font-bold shadow-lg shadow-[#138bc9]/20"
                    >
                      <LayoutDashboard className="w-5 h-5 text-white/70" />
                      Dashboard
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-3 p-2">
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full rounded-2xl h-14 font-black border-2">Log In</Button>
                      </Link>
                      <Link href="/register" className="w-full">
                        <Button className="w-full rounded-2xl h-14 font-black bg-[#138bc9] shadow-xl">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
