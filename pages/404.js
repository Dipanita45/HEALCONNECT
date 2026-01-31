import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | HEALCONNECT</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-[100vh] px-8 py-8 bg-[#f8f9fa] dark:bg-gray-900 text-[#2d3748] dark:text-gray-100 font-sans">
        <div className="text-center max-w-[600px] p-12 bg-white dark:bg-gray-800 rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-gray-900/50">
          <h1 className="text-6xl sm:text-7xl font-extrabold m-0 text-[#2d3748] dark:text-gray-100 leading-none">
            404
          </h1>
          <h2 className="text-2xl font-semibold mt-2 mb-6 text-[#4a5568] dark:text-gray-400">
            Page Not Found
          </h2>
          <p className="text-lg text-[#718096] dark:text-gray-400 my-4 leading-relaxed">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <p className="text-base text-[#a0aec0] dark:text-gray-500 mb-10">
            Please check the URL or use the navigation below.
          </p>

          <div className="flex gap-4 justify-center my-8 flex-wrap">
            <Link
              href="/"
              className="px-8 py-3 bg-[#4299e1] hover:bg-[#3182ce] dark:bg-blue-600 dark:hover:bg-blue-700 text-white no-underline rounded-[6px] font-semibold text-base transition-[background-color] duration-200 inline-block"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-[#e2e8f0] hover:bg-[#cbd5e0] dark:bg-gray-700 dark:hover:bg-gray-600 text-[#4a5568] dark:text-gray-300 no-underline rounded-[6px] font-semibold text-base transition-[background-color] duration-200 inline-block"
            >
              Login
            </Link>
            <Link
              href="/appointments"
              className="px-6 py-3 bg-[#e2e8f0] hover:bg-[#cbd5e0] dark:bg-gray-700 dark:hover:bg-gray-600 text-[#4a5568] dark:text-gray-300 no-underline rounded-[6px] font-semibold text-base transition-[background-color] duration-200 inline-block"
            >
              Appointments
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#e2e8f0] hover:bg-[#cbd5e0] dark:bg-gray-700 dark:hover:bg-gray-600 text-[#4a5568] dark:text-gray-300 no-underline rounded-[6px] font-semibold text-base transition-[background-color] duration-200 inline-block"
            >
              Contact
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[#e2e8f0] dark:border-gray-700">
            <Link
              href="/about"
              className="text-[#4299e1] hover:text-[#3182ce] dark:text-blue-400 dark:hover:text-blue-300 no-underline text-sm mx-2"
            >
              About
            </Link>
            <span className="text-[#cbd5e0] dark:text-gray-500 mx-2" aria-hidden="true">
              •
            </span>
            <Link
              href="/faq"
              className="text-[#4299e1] hover:text-[#3182ce] dark:text-blue-400 dark:hover:text-blue-300 no-underline text-sm mx-2"
            >
              FAQ
            </Link>
            <span className="text-[#cbd5e0] dark:text-gray-500 mx-2" aria-hidden="true">
              •
            </span>
            <Link
              href="/monitoring"
              className="text-[#4299e1] hover:text-[#3182ce] dark:text-blue-400 dark:hover:text-blue-300 no-underline text-sm mx-2"
            >
              Monitoring
            </Link>
            <span className="text-[#cbd5e0] dark:text-gray-500 mx-2" aria-hidden="true">
              •
            </span>
            <Link
              href="/prescriptions"
              className="text-[#4299e1] hover:text-[#3182ce] dark:text-blue-400 dark:hover:text-blue-300 no-underline text-sm mx-2"
            >
              Prescriptions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}