import Image from 'next/image';
import { doctors } from '@/data/doctors';

export default function Doctors() {
    return (
        <div id="doctors" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
            <section className="max-w-7xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <span className="inline-block bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
                        Our Medical Team
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Meet Our Specialists</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
                        Our platform connects you with leading medical professionals from around the world,
                        ready to provide expert care and monitoring.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-black">
                    {doctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-top transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1">{doctor.name}</h3>
                                <p className="text-blue-500 font-medium mb-2 sm:mb-3 text-sm sm:text-base">{doctor.specialty}</p>
                                <div className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">{doctor.experience} experience</div>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                    {doctor.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
