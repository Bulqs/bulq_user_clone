// "use client"
// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import driverbanner from '../../../public/images/driverbanner.png';
// import driverbanner2 from '../../../public/images/driverbanner2.png';
// import driverbanner3 from '../../../public/images/driverbanner3.png';
// import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// const DriverBanner: React.FC = () => {
//   const images = [driverbanner, driverbanner2, driverbanner3];
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   // Auto-rotate slides
//   useEffect(() => {
//     if (!isAutoPlaying) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % images.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [images.length, isAutoPlaying]);

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % images.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const goToSlide = (index: number) => {
//     setCurrentSlide(index);
//   };

//   return (
//     <div className="relative w-full h-[600px] overflow-hidden group">
//       {/* Slider Background */}
//       <div
//         className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
//         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//       >
//         {images.map((image, index) => (
//           <div key={index} className="relative w-full h-full flex-shrink-0">
//             <Image
//               src={image}
//               alt={`Driver banner ${index + 1}`}
//               fill
//               className="object-cover"
//               priority={index === 0}
//             />
//             {/* Gradient overlay for better text readability */}
//             <div className="absolute inset-0 bg-gradient-to-r from-appTitleBgColor/70 via-appTitleBgColor/50 to-appTitleBgColor/30"></div>
//           </div>
//         ))}
//       </div>

//       {/* Navigation Arrows */}
//       <button
//         onClick={prevSlide}
//         className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
//         aria-label="Previous slide"
//       >
//         <ChevronLeft className="w-6 h-6 text-white" />
//       </button>

//       <button
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
//         aria-label="Next slide"
//       >
//         <ChevronRight className="w-6 h-6 text-white" />
//       </button>

//       {/* Content Overlay - enhanced layout */}
//       <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 text-center">
//         <div className="max-w-4xl mx-auto space-y-6">
//           {/* Animated badge */}
//           <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 animate-fade-in">
//             <div className="w-2 h-2 bg-appNav rounded-full animate-pulse"></div>
//             <span className="text-sm font-semibold">BULQ LOGISTICS</span>
//           </div>

//           {/* Main heading with animation */}
//           <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
//             DRIVING THE{' '}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-appNav">
//               FUTURE
//             </span>{' '}
//             OF LOGISTICS
//           </h1>

//           {/* Enhanced description */}
//           <div className="space-y-2 mb-8 animate-slide-up delay-200">
//             <p className="text-xl md:text-2xl font-light opacity-90">
//               Connecting professional drivers with premium logistics opportunities
//             </p>
//             <p className="text-lg md:text-xl font-light opacity-80">
//               Seamless journey from pickup to delivery
//             </p>
//           </div>

//           {/* Enhanced CTA Button */}
//           <div className="animate-slide-up delay-300">
//             <button className="group relative bg-appNav hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden">
//               <span className="relative z-10 flex items-center gap-2">
//                 Find Jobs
//                 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
//             </button>
//           </div>

//           {/* Stats bar */}
//           <div className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in delay-500">
//             <div className="text-center">
//               <div className="text-2xl md:text-3xl font-bold">500+</div>
//               <div className="text-sm opacity-80">Active Drivers</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl md:text-3xl font-bold">1K+</div>
//               <div className="text-sm opacity-80">Jobs Completed</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl md:text-3xl font-bold">24/7</div>
//               <div className="text-sm opacity-80">Support</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Slide Controls */}
//       <div className="absolute bottom-8 left-0 right-0 z-20">
//         <div className="flex flex-col items-center gap-4">
//           {/* Play/Pause button */}
//           <button
//             onClick={() => setIsAutoPlaying(!isAutoPlaying)}
//             className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
//             aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
//           >
//             {isAutoPlaying ? (
//               <Pause className="w-4 h-4 text-white" />
//             ) : (
//               <Play className="w-4 h-4 text-white" />
//             )}
//           </button>

//           {/* Slide indicators */}
//           <div className="flex justify-center gap-3">
//             {images.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => goToSlide(index)}
//                 className={`flex items-center transition-all duration-300 ${currentSlide === index
//                     ? 'w-8 bg-white'
//                     : 'w-3 bg-white/50 hover:bg-white/70'
//                   } h-1 rounded-full`}
//                 aria-label={`Go to slide ${index + 1}`}
//               >
//                 {currentSlide === index && (
//                   <div className="w-full h-full bg-white rounded-full animate-pulse"></div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Progress bar */}
//       <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
//         <div
//           className="h-full bg-appNav transition-all duration-1000 ease-linear"
//           style={{
//             width: isAutoPlaying ? '100%' : '0%',
//             animation: isAutoPlaying ? 'progress 5s linear' : 'none'
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default DriverBanner;






"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import driverbanner from '../../../public/images/driverbanner.png';
import driverbanner2 from '../../../public/images/driverbanner2.png';
import driverbanner3 from '../../../public/images/driverbanner3.png';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const DriverBanner: React.FC = () => {
  const images = [driverbanner, driverbanner2, driverbanner3];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      {/* Slider Background */}
      <div
        className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <Image
              src={image}
              alt={`Driver banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-appTitleBgColor/70 to-appTitleBgColor/40"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center text-white px-6 md:px-12 max-w-7xl mx-auto">
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
            Premium Logistics Solutions
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Driving The Future Of{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
            Logistics
          </span>
        </h1>

        {/* Description */}
        <div className="space-y-3 mb-8">
          <p className="text-xl md:text-2xl text-white/90 font-light">
            Connecting professional drivers with premium logistics opportunities
          </p>
          <div className="flex items-center justify-start gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>From pickup to delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Competitive rates</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="bg-white text-appTitleBgColor hover:bg-blue-50 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            Find Jobs Now
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm">
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl">
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
            <div className="text-white/80 text-sm">Active Drivers</div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-3xl font-bold text-white">1K+</div>
            <div className="text-white/80 text-sm">Jobs Completed</div>
          </div>
          <div className="text-center md:text-left col-span-2 md:col-span-1">
            <div className="text-2xl md:text-3xl font-bold text-white">98%</div>
            <div className="text-white/80 text-sm">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Controls Container */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoPlay}
          className="text-white hover:text-blue-200 transition-colors"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-white text-sm font-medium min-w-[60px]">
          {currentSlide + 1} / {images.length}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-appTitleBgColor/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default DriverBanner;