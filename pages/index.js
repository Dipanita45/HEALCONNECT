import Head from "next/head";
import { useEffect } from "react";
import Footer from "./footer";
import Faq from "../components/Faq";
import Image from 'next/image';



export default function Home() {
  useEffect(() => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    });
    const hiddenElements = document.querySelectorAll(".animation");
    hiddenElements.forEach((el) => observer.observe(el));

    // Service Worker registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
        .catch((err) =>
          console.error("❌ Service Worker registration failed:", err)
        );
    }

    // Offline banner toggle
    const updateOnlineStatus = () => {
      const banner = document.getElementById("offline-banner");
      if (!navigator.onLine) {
        banner.style.display = "block";
      } else {
        banner.style.display = "none";
      }
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();
  }, []);

  return (
    <div>
      <Head>
        <title>HEALCONNECT</title>
      </Head>
      <main className="bg-gray-100 dark:bg-gray-900">
        {/* Offline Banner */}
        <div
          id="offline-banner"
          style={{
            display: "none",
            background: "#ffcc00",
            color: "#000",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          ⚠️ You are offline – showing last cached data.
        </div>

        {/* Hero Section */}
        <section className="container h-screen flex flex-col justify-evenly">
          <div className="flex flex-col md:flex-row md:pt-24">
            <div className="basis-1/2">
              <div className="flex flex-col justify-center items-center h-3/4 my-16">
                <article className="flex flex-col prose lg:prose-xl dark:prose-invert text-center w-4/5">
                  <h1>
                    HealConnect <span className="gradient-text">System</span>
                  </h1>
                  <p className="padding-horizontal-2">
                    This system is a{" "}
                    <span className="text-yellow-500 font-bold">virtual</span>{" "}
                    platform to{" "}
                    <span className="text-pink-500 font-bold">monitor</span>{" "}
                    health anytime and anywhere.
                  </p>
                </article>
              </div>
            </div>
            <div className="basis-1/2">
              <div className="flex flex-col w-auto h-full justify-center">
                <div className="mx-auto my-auto object-center sm:w-4/6 w-3/4 h-full">
                  
                 <Image
  src="https://firebasestorage.googleapis.com/v0/b/health-monitoring-system-7885c.appspot.com/o/Images%2Fdashboard.svg?alt=media&token=cc76d1e6-55bf-42f0-8c75-07fff53993bf"
  alt="Dashboard illustration"
  width={600} // Adjust based on your layout
  height={400}
  priority // Optional: loads image immediately
/>

                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-16 snap-proximity">
            <a href="" className="no-underline">
              <h2 className="animation bg-red-500 inline-block text-gray1 px-6 py-4 text-base md:text-4xl shadow-xl">
                {"Today's "}Healthcare
              </h2>
              <span className="animate-bounce text-5xl block mt-12 mb-6">👇</span>
            </a>
          </div>
        </section>

        {/* Problem Section */}
        <div className="h-screen flex flex-col justify-center bg-gray-100 dark:bg-gray-900">
          <section className="animation container md:w-1/2 text-center place-content-center prose dark:prose-invert md:prose-lg lg:prose-lg sm:prose-sm">
            <h1 className="animation bg-green-600 inline-block px-6 py-3 text-lg md:text-2xl shadow-lg mb-12">
              Problem
            </h1>
      fix/button-style-consistency
            <p className=" animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 text-center w-3/4 mx-auto">
              Getting the real time health <span className="text-orange-600 font-display animate-pulse"> parameters </span>
              at no time ensures treatment as quick as possible.</p>
            <p className=" animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 w-3/4 mx-auto">
              {"It's "}not posible to get<span className="text-blue-500 font-display animate-pulse"> patients history. </span>for further handling of treatment as soon as possible.</p>
            <span className=" animation">
            <a className="btn-global animate-bounce block mt-12" href="">
              How you get monitored? 🧐
           </a>


            <p className="animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 text-center w-3/4 mx-auto">
              Getting the real time health{" "}
              <span className="text-orange-600 font-display animate-pulse">
                parameters
              </span>{" "}
              at no time ensures treatment as quick as possible.
            </p>
            <p className="animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 w-3/4 mx-auto">
              {"It's "}not possible to get
              <span className="text-blue-500 font-display animate-pulse">
                patients history
              </span>{" "}
              for further handling of treatment as soon as possible.
            </p>
            <span className="animation">
              <a
                className="animate-bounce no-underline block mt-12 md:text-xl text-base"
                href=""
              >
                how can get? 🤔
              </a>
 main
            </span>
          </section>
        </div>

        {/* Solution Section */}
        <div className="h-screen flex flex-col justify-center bg-gray-100 dark:bg-gray-900">
          <section className="animation container md:w-1/2 text-center place-content-center prose dark:prose-invert md:prose-lg lg:prose-lg sm:prose-sm">
            <h1 className="animation bg-gradient-to-r from-yellow-600 to-yellow-300 inline-block px-6 py-3 text-lg md:text-2xl shadow-lg mb-12">
              Solution
            </h1>
fix/button-style-consistency
            <p className=" animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 text-center w-3/4 mx-auto">
            This system will let the organization meet their requirement of measuring patient
              <span className="text-yellow-600 font-display animate-pulse"> health parameters </span>and make this data is available and accessible to doctors remotely<span className="text-orange-600 font-display animate-pulse"> anytime anywhere</span>.</p>
            <p className=" animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 w-3/4 mx-auto">
            This system will let the organization manage their<span className="text-blue-500 font-display animate-pulse"> doctors and patients </span>data and maintains security end to end.</p>
            <a className="btn-global animate-bounce block mt-12" href="">

            <p className="animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 text-center w-3/4 mx-auto">
              This system will let the organization meet their requirement of
              measuring patient
              <span className="text-yellow-600 font-display animate-pulse">
                health parameters
              </span>{" "}
              and make this data available and accessible to doctors remotely
              <span className="text-orange-600 font-display animate-pulse">
                anytime anywhere
              </span>
              .
            </p>
            <p className="animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 w-3/4 mx-auto">
              This system will let the organization manage their
              <span className="text-blue-500 font-display animate-pulse">
                doctors and patients
              </span>{" "}
              data and maintains security end to end.
            </p>
            <a
              className="animate-bounce no-underline block mt-12 md:text-xl text-base"
              href=""
            >
 main
              How you get monitored? 🧐
            </a>

          </section>
        </div>

        {/* Kit Section */}
        <div className="h-screen flex flex-col justify-center bg-gray-100 dark:bg-gray-900">
          <section className="animation container md:w-1/2 text-center place-content-center prose dark:prose-invert md:prose-lg lg:prose-lg sm:prose-sm">
            <h1 className="animation bg-gradient-to-r from-blue-600 to-blue-300 inline-block px-6 py-3 text-lg md:text-2xl shadow-lg mb-12">
              Our Kit :
            </h1>
 fix/button-style-consistency
            <p className=" animation py-2 text-md:text-2xl text-gray5 dark:text-gray3 text-center w-3/4 mx-auto">
            This system is established with a health monitoring Kit which enables the doctors to measure
              <span className="text-blue-600 font-display animate-pulse"> body temperature, heart rate and pulse rate </span>in a single device.</p>
            <p className=" animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 w-3/4 mx-auto">
            The parameter measured using the kit is shown to appropriate doctor through the website. The<span className="text-green-600 font-display animate-pulse"> doctor as well as patient </span>can monitor the information by visiting to the website.</p>
           <a className="btn-global animate-bounce block mt-12" href="">
           How you get monitored? 🧐
           </a>


            <p className="animation py-2 text-md:text-2xl text-gray5 dark:text-gray3 text-center w-3/4 mx-auto">
              This system is established with a health monitoring Kit which enables
              the doctors to measure
              <span className="text-blue-600 font-display animate-pulse">
                body temperature, heart rate and pulse rate
              </span>{" "}
              in a single device.
            </p>
            <p className="animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 w-3/4 mx-auto">
              The parameter measured using the kit is shown to appropriate doctor
              through the website. The
              <span className="text-green-600 font-display animate-pulse">
                doctor as well as patient
              </span>{" "}
              can monitor the information by visiting to the website.
            </p>
            <a
              className="animate-bounce no-underline block mt-12 md:text-xl text-base"
              href=""
            >
              How you get monitored? 🧐
            </a>
main
          </section>
        </div>

        <Faq />

        {/* Footer Section */}
        <Footer />
      </main>
    </div>
  );
}