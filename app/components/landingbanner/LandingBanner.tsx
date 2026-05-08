"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import LandingBannerCard from './LandingBannerCard';
import { IoMdCloseCircle } from "react-icons/io";
import {  FiArrowRight, FiShield } from "react-icons/fi";
import LandingBannerCard2 from './LandingBannerCard2';
import BannerStepForm from '../bannerform/BannerStepForm';
import BannerStepForm2 from '../bannerform/BannerStepForm2';
import BannerStepForm3 from '../bannerform/BannerStepForm3';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { getKYCStatus } from '@/lib/user/kyc.actions';

// ✅ IMPORT KYC API (Adjust path if your function is located elsewhere)
// import { getKYCStatus } from '@/lib/user/actions'; 

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.15, 
            delayChildren: 0.3    
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        transition: { type: "spring", stiffness: 150, damping: 20 } 
    }
};

const modalBackdrop: Variants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    show: { opacity: 1, backdropFilter: "blur(8px)", transition: { duration: 0.3 } }
};

const modalContent: Variants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }
};

const LandingBanner: React.FC = () => {
  const router = useRouter();

  // --- KYC COMPLIANCE STATE ---
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [showKycWarning, setShowKycWarning] = useState(false);
  const [isCheckingKyc, setIsCheckingKyc] = useState(true);

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  
  const [activeForm, setActiveForm] = useState<'FORM_1' | 'FORM_2' | null>(null);
  const [isSpecificAddress, setIsSpecificAddress] = useState(false);

  const [selectedCard, setSelectedCard] = useState<{ title: string; description: string } | null>(null);
  const [selectedCard2, setSelectedCard2] = useState<{ title: string; description: string } | null>(null);
  const [selectedCard3, setSelectedCard3] = useState<{ title: string; description: string } | null>(null);
  
  // PATH TO VIDEO
  const BG_VIDEO = "/videos/backgroundvideo.mp4"; 

  // --- FETCH KYC STATUS ON MOUNT ---
  useEffect(() => {
      const fetchStatus = async () => {
          setIsCheckingKyc(true);
          try {
              const res = await getKYCStatus();
              
              // 🔥 DEBUGGING: Check your browser console to see exactly what is returned
              console.log("Raw KYC Response from API:", res); 

              // ✅ SAFEGUARD: Check if the backend wrapped the response in a 'data' or 'content' object
              const payload = (res as any).data || (res as any).content || res;
              
              const status = payload.kycStatus || 'UNVERIFIED';
              setKycStatus(status.toUpperCase());
          } catch (error) {
              console.error("KYC Check Failed (User might be logged out):", error);
              setKycStatus('UNVERIFIED'); // Failsafe fallback
          } finally {
              setIsCheckingKyc(false);
          }
      };
      fetchStatus();
  }, []);

  // --- INTERCEPTOR LOGIC ---
  const handleProtectedAction = (actionCallback: () => void) => {
      if (isCheckingKyc) {
          // Prevent action if the API hasn't finished checking yet
          console.log("Please wait, still verifying KYC status...");
          return; 
      }
      
      if (kycStatus === 'APPROVED') {
          actionCallback();
      } else {
          setShowKycWarning(true);
      }
  };

  // --- WRAPPED HANDLERS ---
  const openModal = (t:string, d:string) => { 
      handleProtectedAction(() => {
          setSelectedCard({title:t,description:d}); 
          setIsModalOpen(true); 
      });
  };
  const openModal2 = (t:string, d:string) => { 
      handleProtectedAction(() => {
          setSelectedCard2({title:t,description:d}); 
          setIsModalOpen2(true); 
      });
  };
  const openModal3 = (t:string, d:string) => { 
      handleProtectedAction(() => {
          setSelectedCard3({title:t,description:d}); 
          setIsModalOpen3(true); 
      });
  };
  
  const closeModal = () => { setIsModalOpen(false); setActiveForm(null); };
  const closeModal2 = () => { setIsModalOpen2(false); setActiveForm(null); };
  const closeModal3 = () => setIsModalOpen3(false);

  const handleMeToAnother = () => { setIsSpecificAddress(false); setActiveForm('FORM_1'); };
  const handleSpecificAddress = () => { setIsSpecificAddress(true); setActiveForm('FORM_1'); };
  const handleAnotherToMe = () => { setActiveForm('FORM_2'); };
  const handlePickupOnly = () => { setActiveForm('FORM_2'); };

  return (
    <div className='relative w-full z-20 pb-10'>
      
      {/* 4D ANIMATED GRID CONTAINER */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-11/12 max-w-5xl mx-auto'
      >
        <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <LandingBannerCard title="Pick up Package" description="Request Pick off and Drop off" imageSrc="/images/package_pickup.png" onClick={openModal} />
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <LandingBannerCard title="Delivery Package" description="Request delivery to doorstep" imageSrc="/images/package_delivery.png" onClick={openModal2} />
        </motion.div>

        <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <LandingBannerCard title="Book a Drop Off" description="Drop off items at hub" imageSrc="/images/drop_off.png" onClick={openModal3} />
        </motion.div>
      </motion.div>

      {/* --- KYC WARNING MODAL --- */}
      <AnimatePresence>
          {showKycWarning && (
              <motion.div 
                  variants={modalBackdrop} 
                  initial="hidden" 
                  animate="show" 
                  exit="hidden" 
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
              >
                  <motion.div 
                      variants={modalContent} 
                      className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative text-center overflow-hidden"
                  >
                      {/* Decorative Background */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <button 
                          onClick={() => setShowKycWarning(false)} 
                          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-10"
                      >
                          <IoMdCloseCircle size={24} />
                      </button>

                      <div className="relative z-10 flex flex-col items-center">
                          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
                              <FiShield className="w-10 h-10 text-amber-500" />
                          </div>
                          
                          <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
                              Verification Required
                          </h3>
                          
                          <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
                              Due to strict policy and regulatory conditions, you must complete your identity verification (KYC) or await your application's approval before logging a booking.
                          </p>
                          
                          <div className="flex flex-col w-full gap-3">
                              <button 
                                  onClick={() => router.push('/newuser/settings')} 
                                  className="w-full bg-appTitleBgColor hover:bg-appNav text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                              >
                                  Go to Profile <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                              </button>
                              <button 
                                  onClick={() => setShowKycWarning(false)} 
                                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl transition-colors"
                              >
                                  Close
                              </button>
                          </div>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* --- MODAL 1: PICK UP --- */}
      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
          <div className="relative bg-white w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* BACKGROUND VIDEO */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
                    <source src={BG_VIDEO} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
            </div>

            <div className="relative z-10 w-full bg-white/90 border-b border-gray-100 p-4 md:p-5 flex justify-between items-center shrink-0">
                <h3 className="text-lg md:text-xl font-bold text-appBanner">Pick Up Package</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors"><IoMdCloseCircle size={28}/></button>
            </div>
            
            <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-10 flex items-center justify-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <LandingBannerCard2 title="From Me to Another" description="Request Service" onClick={handleMeToAnother} />
                    <LandingBannerCard2 title="From Another to Me" description="Request Service" onClick={handleAnotherToMe} />
                    <LandingBannerCard2 title="Specific Address" description="To Specific Address" onClick={handleSpecificAddress} />
                    <LandingBannerCard2 title="Pick up only" description="Request Service" onClick={handlePickupOnly} />
                </div>
            </div>

            {/* INNER FORM */}
            {activeForm && (
              <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col animate-in slide-in-from-bottom-10">
                 <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shrink-0 z-20">
                      <span className="font-bold text-gray-600 text-sm">Booking Form</span>
                      <button onClick={()=>setActiveForm(null)} className="flex items-center gap-1 text-red-500 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-md transition-colors"><IoMdCloseCircle size={20}/> Close</button>
                 </div>
                 <div className="flex-1 overflow-hidden relative z-10">
                    {activeForm==='FORM_1'?<BannerStepForm isSenderEditable={isSpecificAddress}/>:<BannerStepForm2/>}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 2: DELIVERY --- */}
      {isModalOpen2 && selectedCard2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
          <div className="relative bg-white w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* BACKGROUND VIDEO */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
                    <source src={BG_VIDEO} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
            </div>

            <div className="relative z-10 w-full bg-white/90 border-b border-gray-100 p-4 md:p-5 flex justify-between items-center shrink-0">
                <h3 className="text-lg md:text-xl font-bold text-appBanner">Delivery Package</h3>
                <button onClick={closeModal2} className="text-gray-400 hover:text-red-500 transition-colors"><IoMdCloseCircle size={28}/></button>
            </div>
            
            <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-10 flex items-center justify-center">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <LandingBannerCard2 title="From Me to Another" description="Request Service" onClick={handleMeToAnother} />
                    <LandingBannerCard2 title="From Another to Me" description="Request Service" onClick={handleAnotherToMe} />
                    <LandingBannerCard2 title="Specific Address" description="To Specific Address" onClick={handleSpecificAddress} />
                    <LandingBannerCard2 title="Pick up only" description="Request Service" onClick={handlePickupOnly} />
                </div>
            </div>

            {/* INNER FORM */}
            {activeForm && (
              <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col animate-in slide-in-from-bottom-10">
                 <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shrink-0 z-20">
                      <span className="font-bold text-gray-600 text-sm">Booking Form</span>
                      <button onClick={()=>setActiveForm(null)} className="flex items-center gap-1 text-red-500 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-md transition-colors"><IoMdCloseCircle size={20}/> Close</button>
                 </div>
                 <div className="flex-1 overflow-hidden relative z-10">
                    {activeForm==='FORM_1'?<BannerStepForm isSenderEditable={isSpecificAddress}/>:<BannerStepForm2/>}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 3: DROP OFF --- */}
      {isModalOpen3 && selectedCard3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
           <div className="relative bg-white w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              
              <div className="absolute top-3 right-3 z-50">
                  <button onClick={closeModal3} className="text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-md transition-colors">
                      <IoMdCloseCircle size={28}/>
                  </button>
              </div>
              
              {/* BannerStepForm3 handles its own background internally now */}
              <div className="flex-1 overflow-hidden relative z-10">
                 <BannerStepForm3 />
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
export default LandingBanner;

// "use client"
// import React, { useState } from 'react'
// import LandingBannerCard from './LandingBannerCard';
// import { IoMdCloseCircle } from "react-icons/io";
// import LandingBannerCard2 from './LandingBannerCard2';
// import BannerStepForm from '../bannerform/BannerStepForm';
// import BannerStepForm2 from '../bannerform/BannerStepForm2';
// import BannerStepForm3 from '../bannerform/BannerStepForm3';
// import { motion, Variants } from 'framer-motion';

// // --- ANIMATION VARIANTS ---
// const containerVariants: Variants = {
//     hidden: { opacity: 0 },
//     show: {
//         opacity: 1,
//         transition: { 
//             staggerChildren: 0.15, // Delay between each card popping in
//             delayChildren: 0.3    // Waits for the main text in BannerWithTracking to load first
//         }
//     }
// };

// const cardVariants: Variants = {
//     hidden: { opacity: 0, y: 30, scale: 0.9 },
//     show: { 
//         opacity: 1, 
//         y: 0, 
//         scale: 1, 
//         transition: { type: "spring", stiffness: 150, damping: 20 } 
//     }
// };

// const LandingBanner: React.FC = () => {

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isModalOpen2, setIsModalOpen2] = useState(false);
//   const [isModalOpen3, setIsModalOpen3] = useState(false);
  
//   const [activeForm, setActiveForm] = useState<'FORM_1' | 'FORM_2' | null>(null);
//   const [isSpecificAddress, setIsSpecificAddress] = useState(false);

//   const [selectedCard, setSelectedCard] = useState<{ title: string; description: string } | null>(null);
//   const [selectedCard2, setSelectedCard2] = useState<{ title: string; description: string } | null>(null);
//   const [selectedCard3, setSelectedCard3] = useState<{ title: string; description: string } | null>(null);
  
//   // PATH TO VIDEO
//   const BG_VIDEO = "/videos/backgroundvideo.mp4"; 

//   const openModal = (t:string,d:string) => { setSelectedCard({title:t,description:d}); setIsModalOpen(true); };
//   const openModal2 = (t:string,d:string) => { setSelectedCard2({title:t,description:d}); setIsModalOpen2(true); };
//   const openModal3 = (t:string,d:string) => { setSelectedCard3({title:t,description:d}); setIsModalOpen3(true); };
  
//   const closeModal = () => { setIsModalOpen(false); setActiveForm(null); };
//   const closeModal2 = () => { setIsModalOpen2(false); setActiveForm(null); };
//   const closeModal3 = () => setIsModalOpen3(false);

//   const handleMeToAnother = () => { setIsSpecificAddress(false); setActiveForm('FORM_1'); };
//   const handleSpecificAddress = () => { setIsSpecificAddress(true); setActiveForm('FORM_1'); };
//   const handleAnotherToMe = () => { setActiveForm('FORM_2'); };
//   const handlePickupOnly = () => { setActiveForm('FORM_2'); };

//   return (
//     <div className='relative w-full z-20 pb-10'>
      
//       {/* 4D ANIMATED GRID CONTAINER */}
//       <motion.div 
//         variants={containerVariants}
//         initial="hidden"
//         animate="show"
//         className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-11/12 max-w-5xl mx-auto'
//       >
//         <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
//             <LandingBannerCard title="Pick up Package" description="Request Pick off and Drop off" imageSrc="/images/package_pickup.png" onClick={openModal} />
//         </motion.div>

//         <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
//             <LandingBannerCard title="Delivery Package" description="Request delivery to doorstep" imageSrc="/images/package_delivery.png" onClick={openModal2} />
//         </motion.div>

//         <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
//             <LandingBannerCard title="Book a Drop Off" description="Drop off items at hub" imageSrc="/images/drop_off.png" onClick={openModal3} />
//         </motion.div>
//       </motion.div>

//       {/* --- MODAL 1: PICK UP --- */}
//       {isModalOpen && selectedCard && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
//           <div className="relative bg-white w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
//             {/* BACKGROUND VIDEO */}
//             <div className="absolute inset-0 z-0">
//                 <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
//                     <source src={BG_VIDEO} type="video/mp4" />
//                 </video>
//                 <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
//             </div>

//             <div className="relative z-10 w-full bg-white/90 border-b border-gray-100 p-4 md:p-5 flex justify-between items-center shrink-0">
//                 <h3 className="text-lg md:text-xl font-bold text-appBanner">Pick Up Package</h3>
//                 <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors"><IoMdCloseCircle size={28}/></button>
//             </div>
            
//             <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-10 flex items-center justify-center">
//                 <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <LandingBannerCard2 title="From Me to Another" description="Request Service" onClick={handleMeToAnother} />
//                     <LandingBannerCard2 title="From Another to Me" description="Request Service" onClick={handleAnotherToMe} />
//                     <LandingBannerCard2 title="Specific Address" description="To Specific Address" onClick={handleSpecificAddress} />
//                     <LandingBannerCard2 title="Pick up only" description="Request Service" onClick={handlePickupOnly} />
//                 </div>
//             </div>

//             {/* INNER FORM */}
//             {activeForm && (
//               <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col animate-in slide-in-from-bottom-10">
//                  <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shrink-0 z-20">
//                       <span className="font-bold text-gray-600 text-sm">Booking Form</span>
//                       <button onClick={()=>setActiveForm(null)} className="flex items-center gap-1 text-red-500 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-md transition-colors"><IoMdCloseCircle size={20}/> Close</button>
//                  </div>
//                  <div className="flex-1 overflow-hidden relative z-10">
//                     {activeForm==='FORM_1'?<BannerStepForm isSenderEditable={isSpecificAddress}/>:<BannerStepForm2/>}
//                  </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 2: DELIVERY --- */}
//       {isModalOpen2 && selectedCard2 && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
//           <div className="relative bg-white w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
//             {/* BACKGROUND VIDEO */}
//             <div className="absolute inset-0 z-0">
//                 <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20">
//                     <source src={BG_VIDEO} type="video/mp4" />
//                 </video>
//                 <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
//             </div>

//             <div className="relative z-10 w-full bg-white/90 border-b border-gray-100 p-4 md:p-5 flex justify-between items-center shrink-0">
//                 <h3 className="text-lg md:text-xl font-bold text-appBanner">Delivery Package</h3>
//                 <button onClick={closeModal2} className="text-gray-400 hover:text-red-500 transition-colors"><IoMdCloseCircle size={28}/></button>
//             </div>
            
//             <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-10 flex items-center justify-center">
//                 <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <LandingBannerCard2 title="From Me to Another" description="Request Service" onClick={handleMeToAnother} />
//                     <LandingBannerCard2 title="From Another to Me" description="Request Service" onClick={handleAnotherToMe} />
//                     <LandingBannerCard2 title="Specific Address" description="To Specific Address" onClick={handleSpecificAddress} />
//                     <LandingBannerCard2 title="Pick up only" description="Request Service" onClick={handlePickupOnly} />
//                 </div>
//             </div>

//             {/* INNER FORM */}
//             {activeForm && (
//               <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col animate-in slide-in-from-bottom-10">
//                  <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shrink-0 z-20">
//                       <span className="font-bold text-gray-600 text-sm">Booking Form</span>
//                       <button onClick={()=>setActiveForm(null)} className="flex items-center gap-1 text-red-500 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-md transition-colors"><IoMdCloseCircle size={20}/> Close</button>
//                  </div>
//                  <div className="flex-1 overflow-hidden relative z-10">
//                     {activeForm==='FORM_1'?<BannerStepForm isSenderEditable={isSpecificAddress}/>:<BannerStepForm2/>}
//                  </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 3: DROP OFF --- */}
//       {isModalOpen3 && selectedCard3 && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-300">
//            <div className="relative bg-white w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              
//               <div className="absolute top-3 right-3 z-50">
//                   <button onClick={closeModal3} className="text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-md transition-colors">
//                       <IoMdCloseCircle size={28}/>
//                   </button>
//               </div>
              
//               {/* BannerStepForm3 handles its own background internally now */}
//               <div className="flex-1 overflow-hidden relative z-10">
//                  <BannerStepForm3 />
//               </div>
//            </div>
//         </div>
//       )}
//     </div>
//   )
// }
// export default LandingBanner;