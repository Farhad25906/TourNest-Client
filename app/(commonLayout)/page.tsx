import { Destinations } from "@/components/module/Home/Destinations";

import { HowItWorks } from "@/components/module/Home/HowItWorks";
import { Testimonials } from "@/components/module/Home/Testimonials";
import { FAQ } from "@/components/module/Home/FAQ";
import { Newsletter } from "@/components/module/Home/Newsletter";
import { Hero } from "@/components/module/Home/Hero";
import { ExploreAmazingPlaces } from "@/components/module/Home/ExploreAmazingPlaces";


export default function Home() {
  return (
    <main>
      <Hero />
      {/* <ExploreAmazingPlaces /> */}
      <Destinations />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </main>
  );
}