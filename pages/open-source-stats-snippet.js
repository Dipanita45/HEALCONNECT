
{/* Repository Stats */ }
<motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    viewport={{ once: true }}
    className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16 px-4"
>
    {[
        { label: "Stars", value: repoStats.stars, icon: <FaStar />, color: "text-yellow-500" },
        { label: "Forks", value: repoStats.forks, icon: <FaCodeBranch />, color: "text-blue-500" },
        { label: "Open Issues", value: repoStats.issues, icon: <FaExclamationCircle />, color: "text-red-500" },
        { label: "Active PRs", value: repoStats.prs, icon: <FaCode />, color: "text-green-500" }
    ].map((stat, index) => (
        <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center"
        >
            <div className={`text-4xl ${stat.color} mb-3`}>
                {stat.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
            </div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {stat.label}
            </div>
        </div>
    ))}
</motion.div>
