"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import logo from '../../../public/images/logo4.svg';
import logo2 from '../../../public/images/logo5.svg';
import shipping from '../../../public/images/shipping.jpg';
import Button from '../../components/inputs/Button';
import Link from 'next/link';
import InputField from '../../components/inputs/InputField';
import { IoHome } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { AuthResponse, Register } from '@/lib/user/actions';
import { useRouter } from 'next/navigation';
import { RegisterUser } from '@/types/user';

const page: React.FC = () => {
    const [isPaused, setIsPaused] = useState(false);

    // 1. ADDED: Dedicated state for the phone dial code (defaults to +234)
    const [dialCode, setDialCode] = useState("+234");

    const [formData, setFormData] = useState<RegisterUser>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        country: '',
        address: '',
        city: '',
        state: '',
        termsAndConditions: ''
    });

    const [error, setErrorMessage] = useState<String>("");
    const [submissionPending, setSubmissionPending] = useState<boolean>(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSubmissionPending(true);
        setErrorMessage("");

        if (!formData) {
            setErrorMessage("Incomplete credentials");
            return;
        }

        (async function () {
            try {
                // 2. ADDED: Merge dial code with phone number before sending to API
                const apiPayload = {
                    ...formData,
                    phoneNumber: `${dialCode}${formData.phoneNumber}`
                };

                const response: AuthResponse = await Register(apiPayload);

                if (!response) {
                    throw new Error("Failed to register");
                }
                router.push("/login");

            } catch (error) {
                setErrorMessage("Error validating credentials!");
                setSubmissionPending(false);
            }
        })();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 3. MODIFIED: Only update the dialCode state, leave formData.country alone!
    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDialCode(e.target.value);
    };

    return (
        <div className='w-full min-h-screen md:min-h-screen bg-appBlue/20 overflow-hidden'
            style={{
                backgroundImage: `url(${shipping.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="flex min-h-screen md:min-h-screen flex-1 py-0 px-3 md:py-4 md:px-10 bg-black/70 overflow-hidden">
                <div className="flex flex-1 flex-col justify-center  py-0 md:py-4 px-1 sm:px-3 md:px-6 lg:flex-none w-[330px] md:w-[550px] lg:px-16 xl:px-16 lg:w-[900px]">
                    <div className=" w-full max-w-sm lg:w-full lg:max-w-full bg-appTitleBgColor rounded-xl p-4 lg:p-6">

                        <div className='w-full'>
                            <div className="flex items-center justify-center">
                                <Image
                                    src={logo2}
                                    alt="Description of the image"
                                    width={300}
                                    height={400}
                                    className="w-36 md:w-72"
                                />
                            </div>

                            <h2 className="flex mt-2 text-base md:text-2xl font-bold mx-auto w-10/12 md:w-96 leading-9 tracking-tight items-center justify-center text-white bg-appNav/55 px-2 md:py-1 rounded-md md:rounded-xl">
                                Create Your Shipping Account
                            </h2>
                            
                        </div>

                        <div className="mt-6 w-full">
                            <div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex flex-col bg-appNav/55 px-2  py-4 gap-y-2 lg:gap-y-2 rounded-2xl">
                                        
                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className='w-full'>
                                                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">
                                                    First Name
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="text"
                                                        id="firstName"
                                                        name="firstName"
                                                        value={formData.firstName}  
                                                        placeholder="Enter your first name"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        className="bg-white"
                                                    />
                                                </div>
                                            </div>

                                            <div className=' w-full'>
                                                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-white">
                                                    Last Name
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="text"
                                                        id="lastName"
                                                        name="lastName"
                                                        value={formData.lastName}  
                                                        placeholder="Enter your last name"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className='w-full'>
                                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                                                    Username
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        value={formData.username}  
                                                        placeholder="choose a username"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                        className="bg-white"
                                                    />
                                                </div>
                                            </div>

                                            <div className='w-full'>
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                                    Email
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}  
                                                        placeholder="Enter your email address"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-white">
                                                    Mobile Number
                                                </label>
                                                <div className="mt-2 bg-white">
                                                    <InputField
                                                        isPhone={true}
                                                        id="phoneNumber"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}  
                                                        placeholder="Input your mobile number"
                                                        required={true}
                                                        // 4. MODIFIED: Bind to dialCode state
                                                        countryCode={dialCode} 
                                                        onChange={handleInputChange}
                                                        onCountryCodeChange={handleCountryCodeChange} 
                                                        className="bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                                    Password
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        value={formData.password}  
                                                        placeholder="Enter your password"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className=' w-full'>
                                                <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                                                    Country
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="country"
                                                        id="country"
                                                        name="country"
                                                        value={formData.country}  
                                                        placeholder="Enter your country"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="address" className="block text-sm font-medium leading-6 text-white">
                                                    Address
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="address"
                                                        id="address"
                                                        name="address"
                                                        value={formData.address}  
                                                        placeholder="Enter your address"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="state" className="block text-sm font-medium leading-6 text-white">
                                                    State
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="state"
                                                        id="state"
                                                        name="state"
                                                        value={formData.state}  
                                                        placeholder="Enter your state"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className='w-full'>
                                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                                    Confirm Password
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="password"
                                                        id="password" // Might want to fix this id later since it's duplicate
                                                        name="password" // Same here
                                                        value={formData.password}  
                                                        placeholder="Confirm your password"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">
                                                    City
                                                </label>
                                                <div className="mt-2">
                                                    <InputField
                                                        type="city"
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}  
                                                        placeholder="Enter your City"
                                                        required={true}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <Button type="submit" className='bg-appNav/70 w-full gap-3 flex justify-center items-center'>
                                            <FaUserPlus className="text-2xl" /> <span className=""> Create Account </span>
                                        </Button>
                                    </div>
                                </form>
                            </div>

                            <div className="mt-4">
                                <div className="relative">
                                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm font-medium leading-6">
                                        <span className="bg-white px-6 text-gray-900">New user? Create an account</span>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-4">
                                    <Button className='bg-appNav/70 w-full flex justify-center items-center'>
                                        <Link href="/pages/signin" className=" flex justify-center items-center gap-1 md:gap-3 ">
                                            <RiLoginCircleFill className="text-2xl" /> <span className=""> Login Account </span>
                                        </Link>
                                    </Button>

                                    <Button className='bg-black flex justify-center items-center'>
                                        <Link href="/pages/home" className="flex justify-start items-center gap-1 md:gap-3">
                                            <IoHome className="text-lg md:text-2xl" /> <span className=""> Back to Homepage  </span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="relative hidden w-0 flex-1 lg:block py-16 px-3 md:flex items-center-justify-center">
                    <div className={`overflow-hidden expand animate-roundedTransition ${isPaused ? 'animation-paused' : ''
                        }`}
                        onMouseEnter={() => setIsPaused(true)}  
                        onMouseLeave={() => setIsPaused(false)} 
                    >
                        <div className="relative  w-full h-full bg-appTitleBgColor rounded-tr-[450px] rounded-bl-[450px] shadow-2xl shadow-appTitleBgColor">
                            <div className=" bg-white absolute w-full h-full rounded-tl-[450px] rounded-br-[450px] flex items-center kustify-center overflow-hidden shadow-2xl shadow-appTitleBgColor ">
                                <Image
                                    src={logo}
                                    alt="Description of the image"
                                    width={100}
                                    height={100}
                                    className="bg-appWhite h-full w-full -rotate-45"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;

// "use client"
// import React, { useState } from 'react'
// import Image from 'next/image';
// import logo from '../../../public/images/logo4.svg';
// import logo2 from '../../../public/images/logo5.svg';
// import shipping from '../../../public/images/shipping.jpg';
// import Button from '../../components/inputs/Button';
// import Link from 'next/link';
// import InputField from '../../components/inputs/InputField';
// import { IoHome } from "react-icons/io5";
// import { FaUserPlus } from "react-icons/fa";
// import { RiLoginCircleFill } from "react-icons/ri";
// import { AuthResponse, Register } from '@/lib/user/actions';
// import { useRouter } from 'next/navigation';
// import { RegisterUser } from '@/types/user';


// const page: React.FC = () => {
//     const [isPaused, setIsPaused] = useState(false);

//     const [formData, setFormData] = useState<RegisterUser>({
//         firstName: '',
//         lastName: '',
//         username: '',
//         email: '',
//         phoneNumber: '',
//         password: '',
//         country: '',
//         address: '',
//         city: '',
//         state: '',
//         termsAndConditions: ''

//     });

//     const [error, setErrorMessage] = useState<String>("");
//   const [submissionPending, setSubmissionPending] = useState<boolean>(false);
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     console.log(formData);
//   };

//   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     // Set button pending state
//     setSubmissionPending(true);

//     // Clear error messages
//     setErrorMessage("");

//     if (!formData) {
//       setErrorMessage("Incomplete credentials");
//       return;
//     }

//     (async function () {
//       try {
//         const response: AuthResponse = await Register(formData);
//         // router.push("/login");

//         console.log(response);

//         if (!response) {
//             throw new Error("Failed to register");
//           }
//           router.push("/login");

//       } catch (error) {
//         setErrorMessage("Error validating credentials!");
//         // Clear pending state
//         setSubmissionPending(false);
//       }
//     })();
//   }

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     // Handle country code change separately
//     const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         setFormData({
//             ...formData,
//             country: e.target.value,
//         });
//     };

//     return (
//         <div className='w-full min-h-screen md:min-h-screen bg-appBlue/20 overflow-hidden'
//             style={{
//                 backgroundImage: `url(${shipping.src})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//             }}
//         >
//             <div className="flex min-h-screen md:min-h-screen flex-1 py-0 px-3 md:py-4 md:px-10 bg-black/70 overflow-hidden">
//                 <div className="flex flex-1 flex-col justify-center  py-0 md:py-4 px-1 sm:px-3 md:px-6 lg:flex-none w-[330px] md:w-[550px] lg:px-16 xl:px-16 lg:w-[900px]">
//                     <div className=" w-full max-w-sm lg:w-full lg:max-w-full bg-appTitleBgColor rounded-xl p-4 lg:p-6">

//                         <div className='w-full'>
//                             <div className="flex items-center justify-center">
//                                 <Image
//                                     src={logo2}
//                                     alt="Description of the image"
//                                     width={300}
//                                     height={400}
//                                     className="w-36 md:w-72"
//                                 />
//                             </div>

//                             <h2 className="flex mt-2 text-base md:text-2xl font-bold mx-auto w-10/12 md:w-96 leading-9 tracking-tight items-center justify-center text-white bg-appNav/55 px-2 md:py-1 rounded-md md:rounded-xl">
//                                 Create Your Shipping Account
//                             </h2>
                            
//                         </div>

//                         <div className="mt-6 w-full">
//                             <div>
//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     <div className="flex flex-col bg-appNav/55 px-2  py-4 gap-y-2 lg:gap-y-2 rounded-2xl">
//                                         {/* first and last name goes here */}
//                                         <div className="flex items-center justify-center w-full gap-4">
//                                             <div className='w-full'>
//                                                 <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">
//                                                     First Name
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="text"
//                                                         id="firstName"
//                                                         name="firstName"
//                                                         value={formData.firstName}  // Your state value
//                                                         placeholder="Enter your first name"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                                                         className="bg-white"
//                                                     />
//                                                 </div>
//                                             </div>


//                                             <div className=' w-full'>
//                                                 <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-white">
//                                                     Last Name
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="text"
//                                                         id="lastName"
//                                                         name="lastName"
//                                                         value={formData.lastName}  // Your state value
//                                                         placeholder="Enter your last name"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/* first and last name ends here */}

//                                         {/* Email and username section goes here */}
//                                         <div className="flex items-center justify-center w-full gap-4">
//                                             <div className='w-full'>
//                                                 <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
//                                                     Username
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="text"
//                                                         id="username"
//                                                         name="username"
//                                                         value={formData.username}  // Your state value
//                                                         placeholder="choose a username"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                                                         className="bg-white"
//                                                     />
//                                                 </div>
//                                             </div>


//                                             <div className='w-full'>
//                                                 <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
//                                                     Email
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="email"
//                                                         id="email"
//                                                         name="email"
//                                                         value={formData.email}  // Your state value
//                                                         placeholder="Enter your email address"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/* Email and username section ends here */}

//                                         {/* Number Goes Here */}
//                                         <div className="flex items-center justify-center w-full gap-4">
//                                             <div className=' w-full'>
//                                                 <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-white">
//                                                     Mobile Number
//                                                 </label>
//                                                 <div className="mt-2 bg-white">
//                                                     <InputField
//                                                         isPhone={true}
//                                                         id="phoneNumber"
//                                                         name="phoneNumber"
//                                                         value={formData.phoneNumber}  // Your state value
//                                                         placeholder="Input your mobile number"
//                                                         required={true}
//                                                         countryCode={formData.country} // Pass selected country code
//                                                         onChange={handleInputChange}
//                                                         onCountryCodeChange={handleCountryCodeChange} // Pass handler for country code change
//                                                         className="bg-white"
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/* Number Ends Here */}



//                                         {/* Passsword, Confirm Password Goes Here */}
//                                         <div className="flex items-center justify-center w-full gap-4">

//                                             <div className=' w-full'>
//                                                 <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
//                                                     Password
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="password"
//                                                         id="password"
//                                                         name="password"
//                                                         value={formData.password}  // Your state value
//                                                         placeholder="Enter your password"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                                                     />
//                                                 </div>
//                                             </div>

//                                             <div className=' w-full'>
//                                                 <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
//                                                     Country
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="country"
//                                                         id="country"
//                                                         name="country"
//                                                         value={formData.country}  // Your state value
//                                                         placeholder="Enter your password"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//                                                     />
//                                                 </div>
//                                             </div>

//                                         </div>
//                                         {/* Address, City Goes Here */}
//                                         <div className="flex items-center justify-center w-full gap-4">

                                            

//                                             <div className=' w-full'>
//                                                 <label htmlFor="address" className="block text-sm font-medium leading-6 text-white">
//                                                     Address
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="address"
//                                                         id="address"
//                                                         name="address"
//                                                         value={formData.address}  // Your state value
//                                                         placeholder="Enter your address"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                                                     />
//                                                 </div>
//                                             </div>

//                                         </div>

//                                         {/* Address, City Goes Here */}
//                                         <div className="flex items-center justify-center w-full gap-4">

                                            

                                            
//                                             <div className=' w-full'>
//                                                 <label htmlFor="state" className="block text-sm font-medium leading-6 text-white">
//                                                     State
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="state"
//                                                         id="state"
//                                                         name="state"
//                                                         value={formData.state}  // Your state value
//                                                         placeholder="Enter your state"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                                                     />
//                                                 </div>
//                                             </div>

//                                             <div className='w-full'>
//                                                 <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
//                                                     Confirm Password
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="password"
//                                                         id="password"
//                                                         name="password"
//                                                         value={formData.password}  // Your state value
//                                                         placeholder="Confirm your password"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         {/*  Passsword, Confirm Password Ends Here */}
//                                         <div className="flex items-center justify-center w-full gap-4">

                                            

                                            
//                                             <div className=' w-full'>
//                                                 <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">
//                                                     City
//                                                 </label>
//                                                 <div className="mt-2">
//                                                     <InputField
//                                                         type="city"
//                                                         id="city"
//                                                         name="city"
//                                                         value={formData.city}  // Your state value
//                                                         placeholder="Enter your City"
//                                                         required={true}
//                                                         onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                     </div>

//                                     <div>
//                                         <Button type="submit" className='bg-appNav/70 w-full gap-3 flex justify-center items-center'>
//                                             <FaUserPlus className="text-2xl" /> <span className=""> Create Account </span>
//                                         </Button>
//                                     </div>
//                                 </form>
//                             </div>

//                             <div className="mt-4">
//                                 <div className="relative">
//                                     <div aria-hidden="true" className="absolute inset-0 flex items-center">
//                                         <div className="w-full border-t border-gray-200" />
//                                     </div>
//                                     <div className="relative flex justify-center text-sm font-medium leading-6">
//                                         <span className="bg-white px-6 text-gray-900">New user? Create an account</span>
//                                     </div>
//                                 </div>

//                                 <div className="mt-3 grid grid-cols-2 gap-4">
//                                     <Button className='bg-appNav/70 w-full flex justify-center items-center'>
//                                         <Link href="pages//signin" className=" flex justify-center items-center gap-1 md:gap-3 ">
//                                             <RiLoginCircleFill className="text-2xl" /> <span className=""> Login Account </span>
//                                         </Link>
//                                     </Button>

//                                     <Button className='bg-black flex justify-center items-center'>
//                                         <Link href="/pages/home" className="flex justify-start items-center gap-1 md:gap-3">
//                                             <IoHome className="text-lg md:text-2xl" /> <span className=""> Back to Homepage  </span>
//                                         </Link>
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
                
//                 <div className="relative hidden w-0 flex-1 lg:block py-16 px-3 md:flex items-center-justify-center">
//                     <div className={`overflow-hidden expand animate-roundedTransition ${isPaused ? 'animation-paused' : ''
//                         }`}
//                         onMouseEnter={() => setIsPaused(true)}  // Pause animation on hover
//                         onMouseLeave={() => setIsPaused(false)} // Resume animation on mouse leave
//                     >
//                         <div className="relative  w-full h-full bg-appTitleBgColor rounded-tr-[450px] rounded-bl-[450px] shadow-2xl shadow-appTitleBgColor">
//                             <div className=" bg-white absolute w-full h-full rounded-tl-[450px] rounded-br-[450px] flex items-center kustify-center overflow-hidden shadow-2xl shadow-appTitleBgColor ">
//                                 <Image
//                                     src={logo}
//                                     alt="Description of the image"
//                                     width={100}
//                                     height={100}
//                                     className="bg-appWhite h-full w-full -rotate-45"
//                                 />
//                             </div>
//                         </div>
//                     </div>
                   
//                 </div>
//             </div>
//         </div>
//     );

// }

// export default page;
