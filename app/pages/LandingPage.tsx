// import React from 'react'
// // import { NewLetterSection } from '../../components/NewLetterSection'
// import logistics from '@/public/images/warehouse-logistics.png';
// import nationwide from '@/public/images/nation-wide.png';
// import ecommerce from '@/public/images/ecommerce.jpg';
// // import CardComponent from '../../components/landingpagecards/CardComponent';
// // import CardComponent2 from '../../components/landingpagecards/CardComponent2';
// // import CardComponent3 from '../../components/landingpagecards/CardComponent3';
// import CardComponentHeading from '../components/landingpagecards/CardComponentHeading';
// import OfferCard from '../components/landingpageoffercards/OfferCard';
// import OfferCardHeading from '../components/landingpageoffercards/OfferCardHeading';
// import LandingBanner from '../components/landingbanner/LandingBanner';
// import Image, { StaticImageData } from 'next/image';
// import bannerBacground from '../../public/images/banner2.png';
// import BannerStepForm from '../components/bannerform/BannerStepForm';
// import Header from '../components/Header';
// import background from '@/public/images/ship.png';
// // import Footer from '../../components/Footer';
// // import { NewLetterSection } from '@/app/components/NewLetterSection';
// import CardComponent from '@/app/components/landingpagecards/CardComponent';
// import CardComponent3 from '@/app/components/landingpagecards/CardComponent3';
// import CardComponent2 from '@/app/components/landingpagecards/CardComponent2';
// import Footer from '@/app/components/Footer';
// import { NewLetterSection } from '@/app/components/NewLetterSection';


// const LandingPage = () => {
//     return (
//         <>
//             <Header />
//             <div className='w-full p bg-appWhite lg:pb-24'>

//                 {/* <div className="w-full flex m-0 p-0">
//                 <Header />
//             </div> */}

//                 <div className="w-full items-center justify-center relative md:h-[90vh] md:max-h-[90vh] py-12 md:py-0 " style={{
//                     backgroundImage: `url(${background.src})`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                 }}>
//                     <LandingBanner />
//                 </div>

//                 <div className="flex w-full flex-wrap items-center justify-center py-8 lg:py-20 lg:mb-12 bg-appTitleBgColor z-0">

//                     <OfferCardHeading
//                         title="What We Offer"
//                     />

//                     <div className='md:grid md:grid-cols-3 lg:px-24 gap-y-4 lg:py-4  lg:gap-x-10 md:mt-8 flex flex-col  items-center justify-center'>

//                         <OfferCard
//                             title="Nationwide Delivery"
//                             description="Bulq shipping offers effective and prompt dor-to-door delivery"
//                             imageSrc={ecommerce}
//                         />

//                         <OfferCard
//                             title="Payment Delivery"
//                             description="bulq shipping offers payment on delivery to any part of the nation"
//                             imageSrc={ecommerce}
//                         />

//                         <OfferCard
//                             title="E-commerce"
//                             description="Bulq shipping offers E-commerce services on all kind of goods"
//                             imageSrc={ecommerce}
//                         />

//                     </div>

//                 </div>


//                 <div className='flex flex-col px-8 lg:px-24 gap-y-2 lg:gap-y-8 py-8 md:py-0 z-0'>
//                     <CardComponentHeading
//                         title="Shipping Solution For Our Customers"
//                         description="Quickly integrate powerful solutions that gives you more flexibility and control over your percel shipping and logistics progress"
//                     />

//                     <CardComponent3
//                         title="E-Commerce"
//                         description="We Provide E-commerce services where you buy and also ship to any location across the country"
//                         imageSrc={ecommerce}
//                     />

//                     <CardComponent2
//                         title="Nationwide Delivery"
//                         description="We provide logistics services where we deliver to all customers in any location across the country"
//                         imageSrc={nationwide}
//                     />

//                     <CardComponent
//                         title="Warehousing Support"
//                         description="We take care of your storage and distribution logistics needs, utilizing our strategic network of warehouses across the country."
//                         imageSrc={logistics}
//                     />
//                 </div>
//             </div>
//             <NewLetterSection />
//             <Footer />
//         </>
//     )
// }

// export default LandingPage




import React from 'react'
import Header2 from '../components/newlandingpage/Header2'
import Banner from '../components/newlandingpage/Banner'
import TrackingSearch from '../components/newlandingpage/TrackingSearch'
import BannerWithTracking from '../components/newlandingpage/BannerWithTracking'
import HowItWorks from '../components/newlandingpage/HowItWorks'
import PlanSubscription from '../components/newlandingpage/PlanSubscription'
import TrustedByShopper from '../components/newlandingpage/TrustedByShopper'
import SignUpWithBulq from '../components/newlandingpage/SignUpWithBulq'
import Footer from '../components/newlandingpage/Footer'
import Header from '../components/Header'
import LandingBanner from '../components/landingbanner/LandingBanner'

const LandingPage = () => {
  return (
    <div className="w-full flex flex-col">
      {/* <Header /> */}
      <Header2 />

      {/* <Banner />
          <TrackingSearch /> */}
      <BannerWithTracking />
      <LandingBanner />
      <HowItWorks />
      <PlanSubscription />
      <TrustedByShopper />
      <SignUpWithBulq />
      <Footer />
    </div>
  )
}

export default LandingPage