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
    { href: "/tours", label: "Tours", icon: MapPin },
    { href: "/blogs", label: "Blogs", icon: BookOpen },
    // { href: "/about", label: "About", icon: Info },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
    // { href: "/contact", label: "Contact", icon: Mail },
  ];

  const userInfo = (await getUserInfo()) as unknown as UserInfo;
  const accessToken = await getCookie("accessToken");

  // Get dashboard route based on role
  const getDashboardRoute = () => {
    if (!userInfo?.role) return "/dashboard";

    switch (userInfo.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "HOST":
        return "/host/dashboard";
      case "TOURIST":
        return "/user/dashboard";
      default:
        return "/dashboard";
    }
  };

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    if (!userInfo?.name) return "U";
    return userInfo.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get display name (use userInfo.name if available, otherwise user.name)
  const getDisplayName = () => {
    return userInfo?.name || userInfo?.user?.name || "User";
  };

  // Get display email
  const getDisplayEmail = () => {
    return userInfo?.email || userInfo?.user?.email || "";
  };

  // Get profile photo if available
  const getProfilePhoto = () => {
    return userInfo?.user?.profilePhoto || undefined;
  };

  // Get role badge icon
  const getRoleIcon = () => {
    if (!userInfo?.role) return null;

    switch (userInfo.role) {
      case "ADMIN":
        return <Shield className="w-4 h-4 text-red-600" />;
      case "HOST":
        return <MapPin className="w-4 h-4 text-green-600" />;
      case "TOURIST":
        return <User className="w-4 h-4 text-[#138bc9]" />;
      default:
        return null;
    }
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (!userInfo?.role) return "";

    // Add type assertion if needed
    const role = userInfo.role as UserRole | string;

    switch (role) {
      case "ADMIN":
        return "Administrator";
      case "HOST":
        return "Tour Guide";
      case "TOURIST":
        return "Tourist";
      default:
        // Now TypeScript knows role is string
        return role.toLowerCase().replace("_", " ");
    }
  };
  const dashboardRoute = getDashboardRoute();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#138bc9]/10 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#138bc9]/30 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            <Image
              src={logo}
              width={140}
              height={140}
              alt="TourNest Logo"
              className="relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#138bc9] transition-colors duration-200 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </span>
              <span className="absolute inset-0 bg-[#138bc9]/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200" />
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-3">
          {accessToken && userInfo ? (
            <div className="flex items-center gap-3">
              <Link href={dashboardRoute}>
                <Button
                  variant="outline"
                  className="border-[#138bc9] text-[#138bc9] hover:bg-[#138bc9]/10 rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                  {getRoleIcon()}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-[#138bc9]/10 hover:ring-[#138bc9]/30 transition-all duration-200"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getProfilePhoto()} />
                      <AvatarFallback className="bg-[#138bc9] text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getProfilePhoto()} />
                      <AvatarFallback className="bg-[#138bc9] text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500">
                        {getDisplayEmail()}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {getRoleIcon()}
                        <span className="text-xs font-medium text-gray-600">
                          {getRoleDisplay()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={dashboardRoute} className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                      <span className="ml-auto text-xs text-gray-500">
                        {userInfo?.role?.toLowerCase().replace("_", " ")}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-[#138bc9] text-[#138bc9] hover:bg-[#138bc9]/10 rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#138bc9] hover:bg-[#138bc9]/90 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-[#138bc9] text-[#138bc9] hover:bg-[#138bc9]/10 rounded-full"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              {/* Mobile User Info */}
              {accessToken && userInfo && (
                <div className="flex items-center gap-3 pb-6 border-b border-[#138bc9]/10">
                  <Avatar className="h-12 w-12 ring-2 ring-[#138bc9]/20">
                    <AvatarImage src={getProfilePhoto()} />
                    <AvatarFallback className="bg-[#138bc9] text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">{getDisplayName()}</p>
                    <p className="text-xs text-gray-500">{getDisplayEmail()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getRoleIcon()}
                      <span className="text-xs font-medium text-gray-600">
                        {getRoleDisplay()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex flex-col space-y-2 mt-6">
                {accessToken && userInfo && (
                  <Link
                    href={dashboardRoute}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#138bc9]/10 hover:text-[#138bc9] rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                    <span className="ml-auto text-xs px-2 py-1 bg-[#138bc9]/10 text-[#138bc9] rounded-full">
                      {userInfo?.role?.toLowerCase().replace("_", " ")}
                    </span>
                  </Link>
                )}

                {navItems.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#138bc9]/10 hover:text-[#138bc9] rounded-lg transition-colors"
                  >
                    {link.icon && <link.icon className="w-5 h-5" />}
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-[#138bc9]/10 pt-4 mt-4 flex flex-col space-y-2">
                  {accessToken && userInfo ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#138bc9]/10 hover:text-[#138bc9] rounded-lg transition-colors"
                      >
                        <User className="w-5 h-5" />
                        Profile
                      </Link>
                      <button className="flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left">
                        <LogOut className="w-5 h-5" />
                        <LogoutButton />
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full border-[#138bc9] text-[#138bc9] hover:bg-[#138bc9]/10 rounded-full"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register" className="w-full">
                        <Button className="w-full bg-[#138bc9] hover:bg-[#138bc9]/90 rounded-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
