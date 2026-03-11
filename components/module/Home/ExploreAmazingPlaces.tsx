"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "../../ui/SectionHeading";

const places = [
    {
        title: "Tropical Paradise",
        location: "Maldives",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
        size: "large",
    },
    {
        title: "Mountain Serenity",
        location: "Swiss Alps",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
        size: "small",
    },
    {
        title: "Romantic City",
        location: "Paris, France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000",
        size: "small",
    },
    {
        title: "Breathtaking Views",
        location: "Santorini, Greece",
        image: "https://images.unsplash.com/photo-1504198453319-5ce911baf2ef?auto=format&fit=crop&q=80&w=1000",
        size: "small",
    },
    {
        title: "Mystic Forest",
        location: "Black Forest, Germany",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000",
        size: "large",
    },
    {
        title: "Golden Dunes",
        location: "Sahara Desert",
        image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=1000",
        size: "small",
    },
];

export const ExploreAmazingPlaces = () => {
    return (
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Explore Amazing Places"
                    subtitle="Discover the world's most breathtaking destinations curated just for you."
                    badge="Gallery"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {places.map((place, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative overflow-hidden rounded-2xl group cursor-pointer ${place.size === "large" ? "md:row-span-2 h-[400px] md:h-auto" : "h-[300px]"
                                }`}
                        >
                            <Image
                                src={place.image}
                                alt={place.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                            <div className="absolute bottom-0 left-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-[#138bc9] font-medium text-sm mb-1">{place.location}</p>
                                <h3 className="text-xl md:text-2xl font-bold">{place.title}</h3>
                                <div className="w-12 h-1 bg-[#138bc9] mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
