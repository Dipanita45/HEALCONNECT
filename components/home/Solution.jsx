export default function Solution() {
  return (
    <div
      id="solution"
      className="min-h-screen flex items-center bg-gray-100 dark:bg-gray-900"
    >
      <section className="container mx-auto px-6 text-center">
        {/* Heading */}
        <h1 className="bg-gradient-to-r from-yellow-600 to-yellow-300 inline-block px-6 py-3 text-lg md:text-2xl shadow-lg mb-16 rounded-lg text-white font-bold">
          Solution
        </h1>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-3">
              Remote Health Monitoring
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Measure and track critical patient health parameters remotely,
              enabling doctors to monitor conditions anytime, anywhere.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">
              Centralized Data Access
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Securely store and manage patient data in one place, ensuring
              seamless access for authorized healthcare professionals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
              End-to-End Security
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Maintain strict security and privacy standards for doctors and
              patients with encrypted, end-to-end data protection.
            </p>
          </div>
        </div>

        {/* CTA */}
        <a
          href="#kit"
          className="inline-block mt-16 text-blue-600 dark:text-blue-400 text-lg hover:underline"
        >
          How you get monitored? 🧐
        </a>
      </section>
    </div>
  );
}
