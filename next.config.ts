import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  reactStrictMode: true,

  experimental: {
    cacheLife: {
      "my-tours": {
        stale: 0, // seconds to consider cache stale
        revalidate: 0, // seconds to revalidate when stale
        expire: 60, // seconds to expire cache (1 hour)
      },
      "my-tour-stats": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "tours-list": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      
      "all-tours-admin": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "featured-tours": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "upcoming-tours": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "search-tours": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "my-bookings": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "my-booking-stats": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "host-bookings": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "host-bookings-stats": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      // Review-related tags
      "my-reviews": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "all-reviews-admin": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "recent-reviews": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "top-rated-reviews": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "search-reviews": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      // Pattern matching for dynamic tags
      "tour-*": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "my-tour-*": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "tours-category-*": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "review-*": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "tour-reviews-*": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "host-reviews-*": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "booking-*": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
      "review-stats-*": {
        stale: 0,
        revalidate: 0,
        expire: 60,
      },
    },
  },
};

export default nextConfig;