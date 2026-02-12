import Image from "next/image";
import { useEffect, useState } from "react";

export default function Contributors() {

  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
 
     fetch("https://api.github.com/repos/Dipanita45/HEALCONNECT/contributors")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched contributors:", data);
                setContributors(data);
                setLoading(false);
            })
            .catch(err => {
                console.log("Error fetching contributors:",err);
                setLoading(false);
            });
  },[]);

  return (
    <div className="min-h-screen my-10 overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Our Contributors
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet the amazing team behind HEALCONNECT - passionate developers making healthcare accessible for everyone
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center mt-20">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading contributors...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {contributors.map((contributor) => {
              return (
                <a
                  key={contributor.id}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
                >
                  <div className="relative mb-4">
                    <Image
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full ring-4 ring-blue-100 dark:ring-blue-900 group-hover:ring-blue-400 dark:group-hover:ring-blue-500 transition-all duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-green-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                      {contributor.contributions}
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-center">
                    {contributor.login}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {contributor.contributions} contribution{contributor.contributions !== 1 ? 's' : ''}
                  </p>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
