"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import InnerPageBanner from '../../components/InnerPageBanner';
import InputField from '../../components/inputs/InputField';
import Button from '../../components/inputs/Button';
import Link from 'next/link';
import LocationCard from '../../components/locationcard/LocationCard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const LocationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
  });

  const workingHours = [
    { day: "Monday", hours: "8am - 5pm" },
    { day: "Tuesday", hours: "8am - 5pm" },
    { day: "Wednesday", hours: "8am - 5pm" },
    { day: "Thursday", hours: "8am - 5pm" },
    { day: "Friday", hours: "8am - 5pm" },
    { day: "Saturday", hours: "8am - 5pm" },
  ];

  const phoneNumbers = ["+234 807 8789 675", "+234 807 8789 675", "+234 807 8789 675"];

  return (
    <>
      <Header />
      <div className='w-full min-h-screen'>
        <InnerPageBanner
          heading="All Offices Address"
          text="Contact us in a second"
          // {/* FIX: Use the absolute string path directly from the public folder */}
          backgroundImage="/images/location.jpg"
        />

        <div className="flex flex-col mx-auto w-full py-12">
          {/* Search input section goes here */}
          <div className='w-full flex flex-col md:flex-row items-center justify-center md:px-8 md:py-8 px-6 py-4'>
            <div className=' flex flex-col md:flex-row p-2 w-full md:w-9/12 items-center justify-center gap-4'>
              <InputField
                id="country"
                name="country"
                value={formData.country}
                placeholder="Select Your Country"
                dropdownOptions={['USA', 'Canada', 'UK', 'Nigeria']}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />

              <InputField
                id="state"
                name="state"
                value={formData.state}
                placeholder="Select Your State"
                dropdownOptions={['Lagos State', 'Akwa-Ibom State', 'Abuja', 'Oyo State', 'Nasarawa State']}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />

              <InputField
                id="city"
                name="city"
                value={formData.city}
                placeholder="Select Your City"
                dropdownOptions={['Ikorodu', 'Abule Egba', 'Lekki']}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className=' flex w-full md:w-3/12 h-5 p-2 md:mt-0 mt-4 items-center justify-between md:justify-end md:gap-2'>
              <Button className='flex'>
                SEARCH
              </Button>
              <Link href="/" className="text-white flex bg-green-900 p-2 rounded-md">
                Show All Delivery Hub
              </Link>
            </div>
          </div>
          {/* Search input section ends here */}

          {/* Location Card Section Goes Here */}
          <div className="flex md:flex-wrap flex-col md:flex-row gap-6 px-8 py-8 w-full">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="md:w-[32.2%] w-full">
                <LocationCard
                  title="Bulq Lagos"
                  location="Ikeja"
                  address="123 Ikeja Road, Lagos Island"
                  workingHours={workingHours}
                  phoneNumbers={phoneNumbers}
                />
              </div>
            ))}
          </div>
          {/* Location Card Section Ends Here */}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LocationPage;

// "use client"
// import React, { useState } from 'react';
// import Image from 'next/image';
// import InnerPageBanner from '../../components/InnerPageBanner';
// // import location from '../../public/images/location.jpg';
// import InputField from '../../components/inputs/InputField';
// import Button from '../../components/inputs/Button';
// import Link from 'next/link';
// import LocationCard from '../../components/locationcard/LocationCard';
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';


// const page: React.FC = () => {

//   const [formData, setFormData] = useState({
//     country: '',
//     state: '',
//     city: '',
//   });


//   const workingHours = [
//     { day: "Monday", hours: "8am - 5pm" },
//     { day: "Tuesday", hours: "8am - 5pm" },
//     { day: "Wednesday", hours: "8am - 5pm" },
//     { day: "Thursday", hours: "8am - 5pm" },
//     { day: "Friday", hours: "8am - 5pm" },
//     { day: "Saturday", hours: "8am - 5pm" },
//   ];

//   const phoneNumbers = ["+234 807 8789 675", "+234 807 8789 675", "+234 807 8789 675"];

//   return (
//     <>
//       <Header />
//       <div className='w-full min-h-screen'>
//         <InnerPageBanner
//           heading="All Offices Address"
//           text="Contact us in a second"
//           backgroundImage={location}
//         />

//         <div className="flex flex-col mx-auto w-full py-12">
//           {/* Search input section goes here */}
//           <div className='w-full flex flex-col md:flex-row items-center justify-center md:px-8 md:py-8 px-6 py-4'>

//             <div className=' flex flex-col md:flex-row p-2 w-full md:w-9/12 items-center justify-center gap-4'>
//               <InputField
//                 id="country"
//                 name="country"
//                 value={formData.country}
//                 placeholder="Select Your Country"
//                 dropdownOptions={['USA', 'Canada', 'UK', 'Nigeria']}
//                 onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//               />

//               <InputField
//                 id="state"
//                 name="state"
//                 value={formData.state}
//                 placeholder="Select Your State"
//                 dropdownOptions={['Lagos State', 'Akwa-Ibom State', 'Abuja', 'Oyo State', 'Nasarawa State']}
//                 onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//               />

//               <InputField
//                 id="city"
//                 name="city"
//                 value={formData.city}
//                 placeholder="Select Your City"
//                 dropdownOptions={['Ikorody', 'Abule Egba', 'Lekki']}
//                 onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//               />

//             </div>

//             <div className=' flex w-full md:w-3/12 h-5 p-2 md:mt-0 mt-4 items-center justify-between md:justify-end md:gap-2'>

//               <Button className='flex'>
//                 SEARCH
//               </Button>

//               <Link href="/" className="text-white flex bg-green-900 p-2 rounded-md">
//                 Show All Delivery Hub
//               </Link>

//             </div>

//           </div>
//           {/* Search input section ends here */}

//           {/* Location Card Section Goes Here */}
//           <div className="flex md:flex-wrap flex-col md:flex-row gap-6 px-8 py-8 w-full">
//             <div className="md:w-[32.2%] w-full">
//               <LocationCard
//                 title="Bulq Lagos"
//                 location="Ikeja"
//                 address="123 Ikeja Road, Lagos Island"
//                 workingHours={workingHours}
//                 phoneNumbers={phoneNumbers}
//               />
//             </div>

//             <div className="md:w-[32.2%] w-full">
//               <LocationCard
//                 title="Bulq Lagos"
//                 location="Ikeja"
//                 address="123 Ikeja Road, Lagos Island"
//                 workingHours={workingHours}
//                 phoneNumbers={phoneNumbers}
//               />
//             </div>

//             <div className="md:w-[32.2%] w-full">
//               <LocationCard
//                 title="Bulq Lagos"
//                 location="Ikeja"
//                 address="123 Ikeja Road, Lagos Island"
//                 workingHours={workingHours}
//                 phoneNumbers={phoneNumbers}
//               />
//             </div>

//             <div className="md:w-[32.2%] w-full">
//               <LocationCard
//                 title="Bulq Lagos"
//                 location="Ikeja"
//                 address="123 Ikeja Road, Lagos Island"
//                 workingHours={workingHours}
//                 phoneNumbers={phoneNumbers}
//               />
//             </div>

//             <div className="md:w-[32.2%] w-full">
//               <LocationCard
//                 title="Bulq Lagos"
//                 location="Ikeja"
//                 address="123 Ikeja Road, Lagos Island"
//                 workingHours={workingHours}
//                 phoneNumbers={phoneNumbers}
//               />
//             </div>

//             <div className="md:w-[32.2%] w-full">
//               <LocationCard
//                 title="Bulq Lagos"
//                 location="Ikeja"
//                 address="123 Ikeja Road, Lagos Island"
//                 workingHours={workingHours}
//                 phoneNumbers={phoneNumbers}
//               />
//             </div>

//           </div>
//           {/* Location Card Section Ends Here */}
//         </div>

//       </div>
//       <Footer />
//     </>
//   );
// }

// export default page;
