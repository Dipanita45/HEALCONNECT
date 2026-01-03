export default function Solution() {
    return (
        <div id="solution" className="min-h-screen flex flex-col justify-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <section className="container mx-auto px-4 md:px-0 md:w-1/2 text-center place-content-center prose dark:prose-invert md:prose-lg lg:prose-lg sm:prose-sm">
                <h1 className="bg-gradient-to-r from-yellow-600 to-yellow-300 inline-block px-6 py-3 text-lg md:text-2xl shadow-lg mb-12 rounded-lg text-white font-bold">
                    Solution
                </h1>
                <p className="py-2 text-lg md:text-2xl text-gray-700 dark:text-gray-300 text-center w-3/4 mx-auto leading-relaxed">
                    This system will let the organization meet their requirement of
                    measuring patient{' '}
                    <span className="text-yellow-600 font-display animate-pulse font-bold">
                        health parameters
                    </span>{' '}
                    and make this data available and accessible to doctors remotely{' '}
                    <span className="text-orange-600 font-display animate-pulse font-bold">
                        anytime anywhere
                    </span>
                    .
                </p>
                <p className="py-2 text-lg md:text-2xl text-gray-700 dark:text-gray-300 w-3/4 mx-auto leading-relaxed">
                    This system will let the organization manage their{' '}
                    <span className="text-blue-500 font-display animate-pulse font-bold">
                        doctors and patients
                    </span>{' '}
                    data and maintains security end to end.
                </p>
                <a
                    className="animate-bounce no-underline block mt-12 md:text-xl text-base text-blue-600 hover:text-blue-800 transition-colors"
                    href="#kit"
                >
                    How you get monitored? 🧐
                </a>
            </section>
        </div>
    );
}
