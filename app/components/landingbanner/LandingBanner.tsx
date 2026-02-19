"use client"
import React, { useEffect, useState } from 'react'
import LandingBannerCard from './LandingBannerCard';
import { IoMdCloseCircle } from "react-icons/io";
import LandingBannerCard2 from './LandingBannerCard2';
import BannerStepForm from '../bannerform/BannerStepForm';
import BannerStepForm2 from '../bannerform/BannerStepForm2';
import BannerStepForm3 from '../bannerform/BannerStepForm3';

const LandingBanner: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  
  const [activeForm, setActiveForm] = useState<'FORM_1' | 'FORM_2' | null>(null);
  const [isSpecificAddress, setIsSpecificAddress] = useState(false);

  const [selectedCard, setSelectedCard] = useState<{ title: string; description: string } | null>(null);
  const [selectedCard2, setSelectedCard2] = useState<{ title: string; description: string } | null>(null);
  const [selectedCard3, setSelectedCard3] = useState<{ title: string; description: string } | null>(null);

  const [firstText, setFirstText] = useState('');
  const [secondText, setSecondText] = useState('');
  const firstString = 'Ship To Any Part Of The World';
  const secondString = 'With Peace Of Mind';
  
  // PATH TO VIDEO
  const BG_VIDEO = "/videos/backgroundvideo.mp4"; 

  useEffect(() => {
    let isMounted = true;
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    const type1 = (i=0) => { if(isMounted && i<firstString.length) { setFirstText(p=>p+firstString[i]); t1=setTimeout(()=>type1(i+1),100); } else if(isMounted) type2(); };
    const type2 = (i=0) => { if(isMounted && i<secondString.length) { setSecondText(p=>p+secondString[i]); t2=setTimeout(()=>type2(i+1),100); } else if(isMounted) setTimeout(()=>{setFirstText('');setSecondText('');type1()},2000); };
    type1(); return ()=>{isMounted=false;clearTimeout(t1);clearTimeout(t2);};
  }, []);

  const openModal = (t:string,d:string) => { setSelectedCard({title:t,description:d}); setIsModalOpen(true); };
  const openModal2 = (t:string,d:string) => { setSelectedCard2({title:t,description:d}); setIsModalOpen2(true); };
  const openModal3 = (t:string,d:string) => { setSelectedCard3({title:t,description:d}); setIsModalOpen3(true); };
  const closeModal = () => { setIsModalOpen(false); setActiveForm(null); };
  const closeModal2 = () => { setIsModalOpen2(false); setActiveForm(null); };
  const closeModal3 = () => setIsModalOpen3(false);

  const handleMeToAnother = () => { setIsSpecificAddress(false); setActiveForm('FORM_1'); };
  const handleSpecificAddress = () => { setIsSpecificAddress(true); setActiveForm('FORM_1'); };
  const handleAnotherToMe = () => { setActiveForm('FORM_2'); };
  const handlePickupOnly = () => { setActiveForm('FORM_2'); };

  return (
    <div className='relative min-h-[60vh] flex flex-col items-center justify-center mt-0 pt-48 md:pt-60 pb-20 overflow-hidden'>
      
      

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
          <div className="text-center mb-12 h-24 px-4 mt-4">
            <h1 className="text-3xl md:text-5xl font-bold text-appBlack mb-2 tracking-tight">{firstText}<span className="animate-pulse text-appBanner">|</span></h1>
            <p className="text-xl md:text-2xl text-gray-500 font-medium h-8">{secondText}</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-11/12 max-w-6xl mx-auto'>
            <LandingBannerCard title="Pick up Package" description="Request Pick off and Drop off" imageSrc="/images/package_pickup.png" onClick={openModal} />
            <LandingBannerCard title="Delivery Package" description="Request delivery to doorstep" imageSrc="/images/package_delivery.png" onClick={openModal2} />
            <LandingBannerCard title="Book a Drop Off" description="Drop off items at hub" imageSrc="/images/drop_off.png" onClick={openModal3} />
          </div>
      </div>

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
            
            {/* FIXED: Added Background Video Here */}
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
              
              <div className="absolute top-3 right-3 z-50"><button onClick={closeModal3} className="text-gray-400 hover:text-red-500 bg-white rounded-full p-1 shadow-md transition-colors"><IoMdCloseCircle size={28}/></button></div>
              
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
// import React, { useEffect, useState } from 'react'
// import LandingBannerCard from './LandingBannerCard';
// import { IoMdCloseCircle } from "react-icons/io";
// import LandingBannerCard2 from './LandingBannerCard2';
// import BannerStepForm from '../bannerform/BannerStepForm';
// import BannerStepForm2 from '../bannerform/BannerStepForm2';
// import BannerStepForm3 from '../bannerform/BannerStepForm3';

// const LandingBanner: React.FC = () => {

//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);
//   const [isModalOpen3, setIsModalOpen3] = useState<boolean>(false);
  
//   const [isInnerModalOpen, setIsInnerModalOpen] = useState<boolean>(false);
//   const [isInnerModalOpen2, setIsInnerModalOpen2] = useState<boolean>(false);
  
//   const [selectedCard, setSelectedCard] = useState<{ title: string; description: string } | null>(null);
//   const [selectedCard2, setSelectedCard2] = useState<{ title: string; description: string } | null>(null);
//   const [selectedCard3, setSelectedCard3] = useState<{ title: string; description: string } | null>(null);

//   const [firstText, setFirstText] = useState('');
//   const [secondText, setSecondText] = useState('');
//   const firstString = 'Ship To Any Part Of The World';
//   const secondString = 'With Peace Of Mind';
//   const typingSpeed = 100;

//   useEffect(() => {
//     let isMounted = true;
//     let firstTimeout: NodeJS.Timeout, secondTimeout: NodeJS.Timeout;

//     const typeFirstText = (i = 0) => {
//       if (isMounted && i < firstString.length) {
//         setFirstText(prev => prev + firstString.charAt(i));
//         firstTimeout = setTimeout(() => typeFirstText(i + 1), typingSpeed);
//       } else if (isMounted) {
//         typeSecondText();
//       }
//     };

//     const typeSecondText = (i = 0) => {
//       if (isMounted && i < secondString.length) {
//         setSecondText(prev => prev + secondString.charAt(i));
//         secondTimeout = setTimeout(() => typeSecondText(i + 1), typingSpeed);
//       } else if (isMounted) {
//         setTimeout(() => {
//           setFirstText('');
//           setSecondText('');
//           typeFirstText();
//         }, 2000);
//       }
//     };

//     typeFirstText();

//     return () => {
//       isMounted = false;
//       clearTimeout(firstTimeout);
//       clearTimeout(secondTimeout);
//     };
//   }, []);

//   const openModal = (title: string, description: string) => { setSelectedCard({ title, description }); setIsModalOpen(true); };
//   const openModal2 = (title: string, description: string) => { setSelectedCard2({ title, description }); setIsModalOpen2(true); };
//   const openModal3 = (title: string, description: string) => { setSelectedCard3({ title, description }); setIsModalOpen3(true); };
//   const openInnerModal = () => setIsInnerModalOpen(true);
//   const openInnerModal2 = () => setIsInnerModalOpen2(true);
//   const closeModal = () => { setIsModalOpen(false); setIsInnerModalOpen(false); setIsInnerModalOpen2(false); };
//   const closeModal2 = () => { setIsModalOpen2(false); setIsInnerModalOpen(false); setIsInnerModalOpen2(false); };
//   const closeModal3 = () => setIsModalOpen3(false);

//   return (
//     <div className='relative min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-appWhite via-gray-50 to-appBanner/5 mt-0 pt-48 md:pt-60 pb-20'>
      
//       <div className="text-center mb-12 h-24 px-4 mt-4">
//         <h1 className="text-3xl md:text-5xl font-bold text-appBlack mb-2 tracking-tight">
//           {firstText}<span className="animate-pulse text-appBanner">|</span>
//         </h1>
//         <p className="text-xl md:text-2xl text-gray-500 font-medium h-8">
//           {secondText}
//         </p>
//       </div>

//       <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-11/12 max-w-6xl mx-auto'>
//         <LandingBannerCard 
//           title="Pick up Package" 
//           description="Request Pick off and Drop off Services" 
//           imageSrc="/images/package_pickup.png" // Correct Path
//           onClick={openModal} 
//         />

//         <LandingBannerCard 
//           title="Delivery Package" 
//           description="Request delivery to your doorstep" 
//           imageSrc="/images/package_delivery.png" // Correct Path
//           onClick={openModal2} 
//         />

//         <LandingBannerCard 
//           title="Book a Drop Off" 
//           description="Drop off items at our nearest hub" 
//           imageSrc="/images/drop_off.png" // Correct Path
//           onClick={openModal3} 
//         />
//       </div>

//       {/* --- MODAL 1: Pick Up --- */}
//       {isModalOpen && selectedCard && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
//           <div className="relative bg-gray-50 w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
//             <div className="w-full bg-white border-b border-gray-100 p-4 md:p-5 flex justify-between items-center shrink-0">
//                 <h3 className="text-lg md:text-xl font-bold text-appBanner">Pick Up Package</h3>
//                 <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
//                   <IoMdCloseCircle size={28} />
//                 </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 md:p-10 flex items-center justify-center">
//                 <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <LandingBannerCard2 title="From Me to Another" description="Request Service" onClick={openInnerModal} />
//                     <LandingBannerCard2 title="From Another to Me" description="Request Service" onClick={openInnerModal2} />
//                     <LandingBannerCard2 title="Specific Address" description="To Specific Address" />
//                     <LandingBannerCard2 title="Pick up only" description="Request Service" />
//                 </div>
//             </div>

//             {/* Inner Modals */}
//             {isInnerModalOpen && (
//               <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col animate-in slide-in-from-bottom-10 duration-300">
//                  <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shrink-0">
//                       <span className="font-bold text-gray-600 text-sm">Pick Up Form</span>
//                       <button onClick={() => setIsInnerModalOpen(false)} className="flex items-center gap-1 text-red-500 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-md transition-colors">
//                         <IoMdCloseCircle size={20} /> Close
//                       </button>
//                  </div>
//                  <div className="flex-1 overflow-hidden">
//                     <BannerStepForm />
//                  </div>
//               </div>
//             )}

//              {isInnerModalOpen2 && (
//               <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col animate-in slide-in-from-bottom-10 duration-300">
//                  <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shrink-0">
//                       <span className="font-bold text-gray-600 text-sm">Pick Up Form</span>
//                       <button onClick={() => setIsInnerModalOpen2(false)} className="flex items-center gap-1 text-red-500 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-md transition-colors">
//                         <IoMdCloseCircle size={20} /> Close
//                       </button>
//                  </div>
//                  <div className="flex-1 overflow-hidden">
//                     <BannerStepForm2 />
//                  </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 2: Delivery --- */}
//       {isModalOpen2 && selectedCard2 && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
//           <div className="relative bg-gray-50 w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
//             <div className="w-full bg-white border-b border-gray-100 p-4 md:p-5 flex justify-between items-center shrink-0">
//                 <h3 className="text-lg md:text-xl font-bold text-appBanner">Delivery Package</h3>
//                 <button onClick={closeModal2} className="text-gray-400 hover:text-red-500 transition-colors">
//                   <IoMdCloseCircle size={28} />
//                 </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 md:p-10 flex items-center justify-center">
//                 <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <LandingBannerCard2 title="From Me to Another" description="Request Service" onClick={openInnerModal} />
//                     <LandingBannerCard2 title="From Another to Me" description="Request Service" onClick={openInnerModal} />
//                     <LandingBannerCard2 title="Specific Address" description="To Specific Address" />
//                     <LandingBannerCard2 title="Pick up only" description="Request Service" />
//                 </div>
//             </div>

//             {(isInnerModalOpen || isInnerModalOpen2) && (
//                <div className="absolute inset-0 z-50 bg-gray-50 flex flex-col animate-in slide-in-from-bottom-10 duration-300">
//                   <div className="flex justify-between items-center p-3 bg-white border-b border-gray-200 shrink-0">
//                       <span className="font-bold text-gray-600 text-sm">Delivery Form</span>
//                       <button onClick={() => { setIsInnerModalOpen(false); setIsInnerModalOpen2(false); }} className="flex items-center gap-1 text-red-500 font-bold text-sm hover:bg-red-50 px-3 py-1 rounded-md transition-colors">
//                         <IoMdCloseCircle size={20} /> Close
//                       </button>
//                   </div>
//                   <div className="flex-1 overflow-hidden">
//                     {isInnerModalOpen ? <BannerStepForm /> : <BannerStepForm2 />}
//                   </div>
//                </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 3: Book Drop Off --- */}
//       {isModalOpen3 && selectedCard3 && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
//            <div className="relative bg-gray-50 w-full h-full md:h-[85vh] md:w-11/12 md:max-w-5xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
//               <div className="absolute top-3 right-3 z-50">
//                   <button onClick={closeModal3} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-md">
//                     <IoMdCloseCircle size={28} />
//                   </button>
//               </div>
//               <div className="flex-1 overflow-hidden">
//                  <BannerStepForm3 />
//               </div>
//            </div>
//         </div>
//       )}

//     </div>
//   )
// }

// export default LandingBanner;