import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from "@/components/ui/Button";

export default function Hero({ scrollToSection }) {
    return (
        <section id="hero" className="min-h-screen flex items-center relative px-6 sm:px-12 lg:px-32 overflow-hidden bg-slate-50 dark:bg-[#050a15] pt-28 pb-12 lg:pt-32 lg:pb-24 transition-colors duration-500">
            {/* Background Decorations */}
            <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-600/5 dark:bg-emerald-600/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-16 items-center">
                <div className="relative z-10 text-center lg:text-left">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white leading-[1.1] tracking-normal font-poppins"
                    >
                        <span className="block">Your Health</span>
                        <span className="block whitespace-nowrap">Monitored Anywhere</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed font-inter font-medium max-w-xl mx-auto lg:mx-0 px-4 sm:px-0"
                    >
                        Connect with world class healthcare providers and track your vital signs in real-time with our secure, virtual monitoring platform
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap gap-5 justify-center lg:justify-start"
                    >
                        <button
                            onClick={() => scrollToSection('problem')}
                            className="px-9 py-4 bg-[#2563eb] text-white rounded-full font-inter font-medium text-lg hover:bg-blue-700 transition-all hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)] active:scale-95"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => scrollToSection('doctors')}
                            className="px-9 py-4 border-2 border-[#10b981] text-[#10b981] dark:text-white rounded-full font-inter font-medium text-lg hover:bg-[#10b981]/10 transition-all active:scale-95"
                        >
                            Meet Our Doctors
                        </button>
                    </motion.div>
                </div>

                <div className="relative flex justify-center lg:justify-end items-center mt-8 lg:mt-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <div className="relative inline-block">
                            {/* Doctor Image Container */}
                            <div className="relative w-[280px] sm:w-[340px] lg:w-[380px] aspect-[4/5] rounded-[32px] sm:rounded-[48px] overflow-hidden bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 shadow-2xl">
                                <Image
                                    src="/doctor.png"
                                    alt="Healthcare professional"
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                            </div>

                            {/* Floating Badges */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-[25%] -right-4 sm:-right-6 lg:-right-8 translate-y-[-50%] z-20 scale-[0.7] sm:scale-85 lg:scale-90"
                            >
                                <div className="bg-gradient-to-r from-[#7c3aed] to-[#db2777] text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full shadow-xl text-xs sm:text-sm font-semibold whitespace-nowrap border-[1.5px] border-white/20 backdrop-blur-sm">
                                    24/7 Support
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-[25%] -left-4 sm:-left-6 lg:-left-8 z-20 scale-[0.7] sm:scale-85 lg:scale-90"
                            >
                                <div className="bg-[#10b981] text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full shadow-xl text-xs sm:text-sm font-semibold whitespace-nowrap border-[1.5px] border-white/20 backdrop-blur-sm">
                                    Real-Time Care
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}