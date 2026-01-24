import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from "@/components/ui/Button";

export default function Hero({ scrollToSection }) {
    return (
        <section id="hero" className="min-h-screen flex items-center relative px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background with animated circles */}
            <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
                <motion.div
                    className="absolute rounded-full bg-gradient-radial from-blue-500/10 to-transparent"
                    style={{ width: '300px', height: '300px', top: '-10%', right: '-10%' }}
                    animate={{ scale: [1, 1.1], opacity: [0.3, 0.6] }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.div
                    className="absolute rounded-full bg-gradient-radial from-blue-500/10 to-transparent"
                    style={{ width: '400px', height: '400px', bottom: '-20%', left: '-20%' }}
                    animate={{ scale: [1, 1.15], opacity: [0.3, 0.6] }}
                    transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", delay: 2 }}
                />
            </div>

            <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
                <div className="max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 text-slate-800 leading-tight"
                    >
                        HealConnect <span className="bg-gradient-to-br from-blue-500 to-emerald-500 bg-clip-text text-transparent">System</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg sm:text-xl text-slate-500 mb-6 sm:mb-8 leading-relaxed"
                    >
                        This system is a <span className="bg-amber-100 text-amber-800 px-1 rounded">virtual</span> platform to{' '}
                        <span className="bg-pink-100 text-pink-700 px-1 rounded">monitor</span> health anytime and anywhere.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                    >
                        <Button variant="primary" onClick={() => scrollToSection('problem')} className="w-full sm:w-auto">
                            Explore Features
                        </Button>
                        <Button variant="secondary" onClick={() => scrollToSection('doctors')} className="w-full sm:w-auto">
                            Meet Our Doctors
                        </Button>
                    </motion.div>
                </div>

                <div className="flex justify-center relative order-first lg:order-last">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-xl overflow-hidden shadow-2xl shadow-blue-500/20 w-full max-w-md"
                    >
                        <Image
                            src="/dashboard.svg"
                            alt="Healthcare dashboard illustration"
                            width={600}
                            height={400}
                            priority
                            className="w-full h-auto object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 mix-blend-overlay"></div>
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10" onClick={() => scrollToSection('problem')}>
                <span className="text-slate-400 text-xs sm:text-sm font-medium">Discover More</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center"
                >
                    <div className="w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-b-2 border-slate-400 rotate-45"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-b-2 border-slate-400 rotate-45 -mt-1 sm:-mt-1.5 opacity-50"></div>
                </motion.div>
            </div>
        </section>
    );
}
