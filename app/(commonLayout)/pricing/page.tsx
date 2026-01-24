import { Pricing } from "@/components/module/Home/Pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing | TourNest",
    description: "Flexible host pricing plans for creating and managing your tours with ease.",
};

export default function PricingPage() {
    return (
        <main className="min-h-screen">
            <Pricing />
        </main>
    );
}
