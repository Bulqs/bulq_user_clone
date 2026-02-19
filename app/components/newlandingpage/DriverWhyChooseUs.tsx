import React from "react";
import Image from "next/image";

const DriverWhyChooseUs: React.FC = () => {
    return (
        <section className="w-full bg-[#055b43]">
            <div className="max-w-7xl mx-auto px-6 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* LEFT CONTENT */}
                    <div className="text-white py-12 md:py-20">
                        <p className="uppercase text-sm tracking-widest mb-2">
                            Why choose us?
                        </p>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            BulQ Logistics
                        </h2>

                        <p className="text-sm md:text-base leading-relaxed max-w-xl mb-10 opacity-95">
                            At BulQ, we don't just move packages, we move possibilities. Our
                            logistics drivers are the heartbeat of our operations, delivering
                            with precision, passion, and a commitment to excellence. Here's
                            why drivers and clients choose BulQ every day.
                        </p>

                        {/* BENEFITS */}
                        <div className="space-y-8">

                            {/* ITEM 1 */}
                            <div className="flex gap-4">
                                <div className="text-white mt-1">✓</div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-1">
                                        Benefit for Drivers
                                    </h4>
                                    <p className="text-sm leading-relaxed opacity-90 max-w-md">
                                        BulQ gives drivers better earnings, flexible schedules,
                                        steady delivery opportunities, and the support they need to
                                        work confidently and succeed.
                                    </p>
                                </div>
                            </div>

                            {/* ITEM 2 */}
                            <div className="flex gap-4">
                                <div className="text-white mt-1">✓</div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-1">
                                        Technology and Innovation
                                    </h4>
                                    <p className="text-sm leading-relaxed opacity-90 max-w-md">
                                        BulQ uses smart technology to make deliveries faster and
                                        easier, from real-time tracking to efficient routing and a
                                        seamless app that keeps drivers in control.
                                    </p>
                                </div>
                            </div>

                            {/* ITEM 3 */}
                            <div className="flex gap-4">
                                <div className="text-white mt-1">✓</div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-1">
                                        Reliability & Support
                                    </h4>
                                    <p className="text-sm leading-relaxed opacity-90 max-w-md">
                                        BulQ ensures every driver has the backing they need, with
                                        consistent delivery opportunities, responsive support, and
                                        a platform designed to make every trip safe, smooth, and
                                        stress-free.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="relative w-full h-full">
                        <Image
                            src="/images/salesimage.png"
                            alt="BulQ delivery man"
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DriverWhyChooseUs;