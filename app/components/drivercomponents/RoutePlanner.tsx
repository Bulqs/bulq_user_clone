// import React from 'react'

// const RoutePlanner: React.FC = () => {
//     return (
//         <div className="w-full bg-appTitleBgColor">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="text-center">
//                     {/* Main Title */}
//                     <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
//                         ROUTE PLANNER
//                     </h1>

//                     {/* Description */}
//                     <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
//                         Optimize your delivery routes and plan efficient paths for assigned jobs
//                     </p>

//                     {/* Features Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
//                         <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                             <div className="text-white font-semibold mb-2">Efficient Routing</div>
//                             <div className="text-white/80 text-sm">Find the most optimal paths for multiple deliveries</div>
//                         </div>
//                         <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                             <div className="text-white font-semibold mb-2">Time Saving</div>
//                             <div className="text-white/80 text-sm">Reduce travel time and fuel consumption</div>
//                         </div>
//                         <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                             <div className="text-white font-semibold mb-2">Real-time Updates</div>
//                             <div className="text-white/80 text-sm">Get live traffic and route adjustments</div>
//                         </div>
//                     </div>

//                     {/* CTA Button */}
//                     <button className="inline-flex items-center justify-center px-8 py-3 bg-appNav text-white font-bold rounded-lg hover:bg-appNav/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[140px]">
//                         <span>Plan Route</span>
//                         <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                         </svg>
//                     </button>

//                     {/* Additional Info */}
//                     <p className="text-white/70 text-sm mt-4">
//                         Start planning and optimize your delivery efficiency
//                     </p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default RoutePlanner




import React from 'react'

const RoutePlanner: React.FC = () => {
    return (
        <div className="w-full bg-appTitleBgColor relative overflow-hidden border-t border-b border-white/20">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/4 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
                <div className="text-center">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg border border-white/20 mb-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">
                            Route Planner
                        </h1>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-white to-white/50 rounded-full mx-auto mb-3"></div>
                        <p className="text-base text-white/90 max-w-xl mx-auto">
                            Intelligent route optimization for maximum delivery efficiency
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                        <div className="group relative">
                            <div className="relative bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all duration-200 h-full">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Smart Routing</h3>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Advanced algorithms find the most efficient paths for your deliveries
                                </p>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="relative bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all duration-200 h-full">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Time Optimization</h3>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Minimize travel time and reduce operational costs
                                </p>
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="relative bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all duration-200 h-full">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Live Updates</h3>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Real-time adjustments based on traffic conditions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="max-w-sm mx-auto">
                        <button className="w-full bg-white text-appTitleBgColor font-semibold text-base py-3 px-5 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                            <span>Start Planning Routes</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        <p className="text-white/60 text-xs mt-3">
                            Optimize your delivery operations today
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoutePlanner