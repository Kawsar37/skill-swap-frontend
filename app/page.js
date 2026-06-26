import ExtraSections from "@/components/ExtraSections";
import FeaturedTasks from "@/components/FeaturedTasks";

import Hero from "@/components/Hero";

import TopFreelancers from "@/components/TopFreelancers";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <Hero />
      <FeaturedTasks />
      <TopFreelancers />
      <ExtraSections />
    </main>
  );
}
