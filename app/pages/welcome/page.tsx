"use client"
import Header2 from '@/app/components/newlandingpage/Header2';
import React, { useState } from 'react'
import RegisterModal from '../signup/RegisterModal';
import LoginModal from '../signin/LoginModal';
import HowItWorks from '@/app/components/newlandingpage/HowItWorks';
import PlanSubscription from '@/app/components/newlandingpage/PlanSubscription';
import TrustedByShopper from '@/app/components/newlandingpage/TrustedByShopper';
import SignUpWithBulq from '@/app/components/newlandingpage/SignUpWithBulq';
import Footer from '@/app/components/newlandingpage/Footer'
import LandingBanner from '@/app/components/landingbanner/LandingBanner';
import BannerWithTracking from '@/app/components/newlandingpage/BannerWithTracking';
import WelcomeBannerWithoutTracking from '@/app/components/newlandingpage/WelcomeBannerWithoutTracking';

// ... (your landing page imports)
// import RegisterModal from '../components/RegisterModal' 
// import LoginModal from '../components/LoginModal' 

const LandingPage = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Helper functions for a smooth swap
  const openLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); }
  const openRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); }

  return (
    <div className="w-full flex flex-col relative">
      <Header2
        onLoginClick={() => setIsLoginOpen(true)} 
        onRegisterClick={() => setIsRegisterOpen(true)} 
      />
      {/* ... rest of your landing page components */}
      {/* <LandingBanner /> */}
      <WelcomeBannerWithoutTracking />
      <HowItWorks />
      <PlanSubscription />
      <TrustedByShopper />
      <SignUpWithBulq />
      <Footer />

      {/* The Modals */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSwitchToLogin={openLogin} // Ensure you add this prop to your RegisterModal too!
      />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSwitchToRegister={openRegister} 
      />
    </div>
  )
}

export default LandingPage