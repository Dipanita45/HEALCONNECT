import dynamic from "next/dynamic";
import Head from "next/head";

const AuthCheck = dynamic(() => import("@components/Auth/AuthCheck"), { ssr: false });
const PatientSidebar = dynamic(() => import("@components/Sidebar/PatientSidebar"), { ssr: false });
const DoctorFinder = dynamic(() => import("@components/DoctorComponents/DoctorFinder"), { ssr: false });

export default function FindDoctors() {
  return (
    <AuthCheck>
      <Head>
        <title>Find Doctors - HealConnect</title>
        <meta name="description" content="Find doctors in your area with HealConnect" />
      </Head>

      <PatientSidebar>
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
          <div className="container mx-auto py-8">
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Find Healthcare Providers
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover qualified doctors and healthcare professionals in your area.
                Search by name, speciality, or location to find the right care for your needs.
              </p>
            </header>

            <DoctorFinder />
          </div>
        </div>
      </PatientSidebar>
    </AuthCheck>
  );
}
