import Head from "next/head";
import Footer from "./footer";
import Hero from "@/components/home/Hero";
import Problem from "@/components/home/Problem";
import Solution from "@/components/home/Solution";
import KitSimulation from "@/components/home/KitSimulation";
import Doctors from "@/components/home/Doctors";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    // Service Worker registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
        .catch((err) =>
          console.error("❌ Service Worker registration failed:", err)
        );
    }
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Head>
        <title>HEALCONNECT - Modern Healthcare Platform</title>
        <meta name="description" content="HEALCONNECT - Bridging healthcare and technology to deliver smarter, faster, and secure patient solutions." />
      </Head>

      <main>
        <Hero scrollToSection={scrollToSection} />
        <Problem scrollToSection={scrollToSection} />
        <Solution />
        <KitSimulation />
        <Doctors />
        <Footer />
      </main>
    </div>
  );
}
