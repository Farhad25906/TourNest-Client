import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);

    return [
        {
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home",
                    roles: ["TOURIST", "ADMIN", "HOST"],
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                    roles: ["TOURIST", "ADMIN", "HOST"],
                },
                {
                    title: "My Profile",
                    href: "/my-profile",
                    icon: "User",
                    roles: ["TOURIST", "ADMIN", "HOST"],
                },
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/change-password",
                    icon: "Settings",
                    roles: ["TOURIST", "ADMIN", "HOST"],
                },
            ],
        },
    ]
}

export const getUserNavItems = async (): Promise<NavSection[]> => {
    return [
        {
            title: "Travel Management",
            items: [
                {
                    title: "My Reviews",
                    href: "/user/dashboard/my-reviews",
                    icon: "Compass",
                    roles: ["TOURIST"],
                },
                {
                    title: "Book a Tour",
                    href: "/tours",
                    icon: "MapPin",
                    roles: ["TOURIST"],
                },
                {
                    title: "My Bookings",
                    href: "/user/dashboard/my-bookings",
                    icon: "Calendar",
                    roles: ["TOURIST"],
                },
            ],
        },
        {
            title: "Preferences",
            items: [
                {
                    title: "Favorite Tours",
                    href: "/user/dashboard/favorites",
                    icon: "Heart",
                    roles: ["TOURIST"],
                },
                {
                    title: "Payment History",
                    href: "/user/dashboard/paymentHistory",
                    icon: "History",
                    roles: ["TOURIST"],
                },
            ],
        },
    ]
}

export const getHostNavItems = async (): Promise<NavSection[]> => {
    return [
        {
            title: "Tour Management",
            items: [
                {
                    title: "My Tours",
                    href: "/host/dashboard/tours",
                    icon: "Map",
                    roles: ["HOST"],
                },
                {
                    title: "Create Tour",
                    href: "/host/dashboard/create-tour",
                    icon: "PlusCircle",
                    roles: ["HOST"],
                },
                {
                    title: "Tour Bookings",
                    href: "/host/dashboard/bookings",
                    icon: "CalendarCheck",
                    roles: ["HOST"],
                },
            ],
        },
        {
            title: "Analytics",
            items: [
                {
                    title: "Earnings",
                    href: "/host/dashboard/earnings",
                    icon: "DollarSign",
                    roles: ["HOST"],
                },
                {
                    title: "Reviews",
                    href: "/host/dashboard/reviews",
                    icon: "Star",
                    roles: ["HOST"],
                },
                {
                    title: "Tour Blogs",
                    href: "/host/dashboard/blogs",
                    icon: "TrendingUp",
                    roles: ["HOST"],
                },
            ],
        },
        {
            title: "Subscription",
            items: [
                {
                    title: "Buy Subscription",
                    href: "/host/dashboard/buy-subscription",
                    icon: "DollarSign",
                    roles: ["HOST"],
                },
                // {
                //     title: "Reviews",
                //     href: "/host/dashboard/reviews",
                //     icon: "Star",
                //     roles: ["HOST"],
                // },
                // {
                //     title: "Tour Blogs",
                //     href: "/host/dashboard/blogs",
                //     icon: "TrendingUp",
                //     roles: ["HOST"],
                // },
            ],
        },
    ]
}

export const adminNavItems: NavSection[] = [
    {
        title: "Tour Management",
        items: [
            {
                title: "All Tours",
                href: "/admin/dashboard/tours-management",
                icon: "Map",
                roles: ["ADMIN"],
            },
            {
                title: "All Payments",
                href: "/admin/dashboard/payments-management",
                icon: "Tag",
                roles: ["ADMIN"],
            },
            {
                title: "Destinations",
                href: "/admin/dashboard/destinations-management",
                icon: "MapPin",
                roles: ["ADMIN"],
            },
            {
                title: "Bookings",
                href: "/admin/dashboard/bookings-management",
                icon: "CalendarCheck",
                roles: ["ADMIN"],
            },
            {
                title: "Reviews",
                href: "/admin/dashboard/reviews-management",
                icon: "Star",
                roles: ["ADMIN"],
            },
        ],
    },
    {
        title: "User Management",
        items: [
            {
                title: "All Users",
                href: "/admin/dashboard/users-management",
                icon: "Users",
                roles: ["ADMIN"],
            },
            {
                title: "Hosts",
                href: "/admin/dashboard/hosts-management",
                icon: "Home",
                roles: ["ADMIN"],
            },
            
        ],
    },
    {
        title: "Platform Management",
        items: [
            {
                title: "Site Settings",
                href: "/admin/dashboard/settings",
                icon: "Settings",
                roles: ["ADMIN"],
            },
            {
                title: "Subscription",
                href: "/admin/dashboard/subscription-management",
                icon: "BarChart",
                roles: ["ADMIN"],
            },
        ],
    }
]

export const getNavItemsByRole = async (role: UserRole): Promise<NavSection[]> => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];
        case "TOURIST":
            return [...commonNavItems, ...await getUserNavItems()];
        case "HOST":
            return [...commonNavItems, ...await getHostNavItems()];
        default:
            return [];
    }
}
