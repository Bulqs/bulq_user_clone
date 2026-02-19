import React from 'react'
import Header from '@/app/components/drivercomponents/Header'
import DriverBanner from '@/app/components/drivercomponents/DriverBanner'
import RoutePlanner from '@/app/components/drivercomponents/RoutePlanner'
import HowITWorks from '@/app/components/drivercomponents/HowITWorks'
// import WhyChooseUs from '@/app/components/drivercomponents/WhyChooseUs'
import Testimonies from '@/app/components/drivercomponents/Testimonies'
import NewsLetterSubscription from '@/app/components/drivercomponents/NewsLetterSubscription'
// import Footer from '@/app/components/Footer'
import OnboardingEasy from '@/app/components/newlandingpage/OnboardingEasy'

import DriverWhyChooseUs from '@/app/components/newlandingpage/DriverWhyChooseUs'
import Footer from '@/app/components/drivercomponents/Footer'

const page: React.FC = () => {
  return (
    <div className='flex p-0 m-0 flex-col'>
      <Header />
      <DriverBanner />
      <HowITWorks />
      <OnboardingEasy />
      <RoutePlanner />
      <DriverWhyChooseUs />
      {/* <WhyChooseUs /> */}
      <Testimonies />
      <NewsLetterSubscription />
      <Footer />
    </div>
  )
}     
export default page
