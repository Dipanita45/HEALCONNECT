import Head from "next/head";
import { motion } from "framer-motion";
import { FaGithub, FaCode, FaUsers, FaStar, FaRocket, FaHeart, FaExternalLinkAlt, FaBook, FaBug, FaLightbulb, FaCodeBranch, FaExclamationCircle } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { useState, useEffect } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function OpenSource() {
  const [repoStats, setRepoStats] = useState({
    stars: 0,
    forks: 0,
    issues: 0,
    prs: 0
  });
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContributors();
    fetchRepoStats();
  }, []);

  const fetchRepoStats = async () => {
    try {
      setStatsLoading(true);
      const [repoRes, prRes] = await Promise.all([
        fetch('https://api.github.com/repos/Dipanita45/HEALCONNECT'),
        fetch('https://api.github.com/search/issues?q=repo:Dipanita45/HEALCONNECT+type:pr+state:open')
      ]);

      if (!repoRes.ok || !prRes.ok) throw new Error('Failed to fetch repo stats');

      const repoData = await repoRes.json();
      const prData = await prRes.json();

      setRepoStats({
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count - prData.total_count,
        prs: prData.total_count
      });
    } catch (err) {
      console.error('Error fetching repo stats:', err);
      // Fallback data
      setRepoStats({ stars: 12, forks: 5, issues: 8, prs: 2 });
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchContributors = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.github.com/repos/Dipanita45/HEALCONNECT/contributors');
      if (!response.ok) {
        throw new Error('Failed to fetch contributors');
      }
      const data = await response.json();
      setContributors(data.slice(0, 12)); // Show top 12 contributors
    } catch (err) {
      console.error('Error fetching contributors:', err);
      setError(err.message);
      // Fallback contributors for demo
      setContributors([
        { id: 1, login: 'Dipanita45', avatar_url: 'https://avatars.githubusercontent.com/u/12345678?v=4', html_url: 'https://github.com/Dipanita45', contributions: 150 },
        { id: 2, login: 'contributor1', avatar_url: 'https://avatars.githubusercontent.com/u/87654321?v=4', html_url: 'https://github.com/contributor1', contributions: 75 },
        { id: 3, login: 'contributor2', avatar_url: 'https://avatars.githubusercontent.com/u/11223344?v=4', html_url: 'https://github.com/contributor2', contributions: 50 },
        { id: 4, login: 'contributor3', avatar_url: 'https://avatars.githubusercontent.com/u/55667788?v=4', html_url: 'https://github.com/contributor3', contributions: 25 },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const features = [
    {
      icon: <FaGithub />,
      title: "Open Source",
      description: "Our code is available on GitHub for transparency and collaboration"
    },
    {
      icon: <FaUsers />,
      title: "Community Driven",
      description: "Built with contributions from healthcare professionals and developers"
    },
    {
      icon: <FaCode />,
      title: "Developer Friendly",
      description: "Well-documented APIs and easy-to-understand codebase"
    },
    {
      icon: <FaStar />,
      title: "Quality Assured",
      description: "Rigorous testing and code reviews ensure reliability"
    }
  ];

  const contributions = [
    {
      title: "Code Contributions",
      description: "Submit pull requests to improve features and fix bugs",
      icon: <FaCode />,
      color: "blue"
    },
    {
      title: "Issue Reporting",
      description: "Help us identify and resolve issues through detailed bug reports",
      icon: <FaBug />,
      color: "red"
    },
    {
      title: "Documentation",
      description: "Improve our documentation to make it more accessible",
      icon: <FaBook />,
      color: "green"
    },
    {
      title: "Feature Ideas",
      description: "Share your innovative ideas for new healthcare features",
      icon: <FaLightbulb />,
      color: "yellow"
    }
  ];

  return (
    <>
      <Head>
        <title>Open Source | HealConnect</title>
        <meta name="description" content="Learn about HealConnect's open source project and how you can contribute to better healthcare technology" />
      </Head>

      <main className="bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 relative overflow-hidden">
        {/* Background with animated bubbles */}
        <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
          <div
            className="absolute rounded-full"
            style={{
              width: '300px',
              height: '300px',
              top: '-100px',
              left: '-100px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              animation: 'float 20s infinite ease-in-out',
              animationDelay: '0s',
              zIndex: 0
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '200px',
              height: '200px',
              bottom: '50px',
              right: '10%',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              animation: 'float 20s infinite ease-in-out',
              animationDelay: '-7s',
              zIndex: 0
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '150px',
              height: '150px',
              top: '30%',
              right: '-50px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              animation: 'float 20s infinite ease-in-out',
              animationDelay: '-14s',
              zIndex: 0
            }}
          />
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(30px, -30px) rotate(60deg);
            }
            66% {
              transform: translate(-20px, 20px) rotate(-30deg);
            }
          }
        `}</style>

        <div className="container mx-auto px-6 py-16 relative" style={{ zIndex: 1 }}>
          <motion.header
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <FaGithub className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <Typewriter
                words={["Open Source"]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              HealConnect is built with transparency and collaboration in mind. Join our community to make healthcare technology accessible to everyone.
            </p>
            <div className="mx-auto w-24 h-1 mt-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl text-center text-white shadow-2xl">
              <div className="flex justify-center mb-4">
                <FaGithub className="text-5xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Available on GitHub
              </h2>
              <p className="mb-6 text-gray-300">
                Explore our source code, report issues, and contribute to the future of healthcare technology
              </p>
              <motion.a
                href="https://github.com/Dipanita45/HEALCONNECT"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <FaGithub className="mr-2" />
                View on GitHub
                <FaExternalLinkAlt className="ml-2 text-sm" />
              </motion.a>
            </div>
          </motion.section>

          {/* Repository Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16 px-4"
          >
            {[
              { label: "Stars", value: statsLoading ? "..." : repoStats.stars, icon: <FaStar className="text-4xl text-yellow-500" /> },
              { label: "Forks", value: statsLoading ? "..." : repoStats.forks, icon: <FaCodeBranch className="text-4xl text-blue-500" /> },
              { label: "Open Issues", value: statsLoading ? "..." : repoStats.issues, icon: <FaExclamationCircle className="text-4xl text-red-500" /> },
              { label: "Active PRs", value: statsLoading ? "..." : repoStats.prs, icon: <FaCode className="text-4xl text-green-500" /> }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-3">
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

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
              Why Open Source?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="text-blue-600 dark:text-blue-400 text-3xl mb-3 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
              How You Can Contribute
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contributions.map((contribution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: index % 2 === 0 ? 5 : -5 }}
                  className={`
                    ${contribution.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
                    ${contribution.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}
                    ${contribution.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}
                    ${contribution.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : ''}
                    p-6 rounded-xl border-2 shadow-lg flex items-start space-x-4
                  `}
                >
                  <div className={`
                    ${contribution.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : ''}
                    ${contribution.color === 'red' ? 'text-red-600 dark:text-red-400' : ''}
                    ${contribution.color === 'green' ? 'text-green-600 dark:text-green-400' : ''}
                    ${contribution.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : ''}
                    text-2xl flex-shrink-0
                  `}>
                    {contribution.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg mb-2 ${contribution.color === 'blue' ? 'text-blue-800 dark:text-blue-200' : ''
                      }${contribution.color === 'red' ? 'text-red-800 dark:text-red-200' : ''
                      }${contribution.color === 'green' ? 'text-green-800 dark:text-green-200' : ''
                      }${contribution.color === 'yellow' ? 'text-yellow-800 dark:text-yellow-200' : ''
                      }`}>
                      {contribution.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {contribution.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-center text-white shadow-2xl">
              <div className="flex justify-center mb-4">
                <FaRocket className="text-4xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Ready to Make an Impact?
              </h2>
              <p className="mb-6 text-blue-100">
                Join our community of developers and healthcare professionals working together to improve lives
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://github.com/Dipanita45/HEALCONNECT"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <FaGithub className="mr-2" />
                  Start Contributing
                </motion.a>
                <motion.a
                  href="https://github.com/Dipanita45/HEALCONNECT/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                >
                  <FaBug className="mr-2" />
                  Report an Issue
                </motion.a>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </>
  );
}