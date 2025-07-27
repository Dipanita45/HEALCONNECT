import Head from "next/head"; import { useEffect, useState } from "react"; import Footer from "./footer";

export default function Home() { const [isDarkMode, setIsDarkMode] = useState(false);

useEffect(() => { const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("show"); } else { entry.target.classList.remove("show"); } }); });

const hiddenElements = document.querySelectorAll(".animation");
hiddenElements.forEach((el) => observer.observe(el));

}, []);

useEffect(() => { if (isDarkMode) { document.documentElement.classList.add("dark"); } else { document.documentElement.classList.remove("dark"); } }, [isDarkMode]);

const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

return ( <div> <Head> <title>HEALCONNECT</title> </Head> <main className="bg-gray-100 dark:bg-gray-900"> <div className="text-right p-4"> <button
onClick={toggleDarkMode}
className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
> Toggle {isDarkMode ? "Light" : "Dark"} Mode </button> </div>

{/* --- Existing content remains unchanged below --- */}
    <section className="container h-screen flex flex-col justify-evenly">
      {/* --- Intro Section --- */}
      {/* ... */}
    </section>

    {/* Mid Section */}
    {/* ... */}

    {/* Solution Section */}
    {/* ... */}

    {/* Kit Section */}
    {/* ... */}

    {/* Footer Section */}
    <Footer />
  </main>
</div>

); }
