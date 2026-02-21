"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Button from '@/app/components/inputs/Button';
import Link from 'next/link';
import InputField from '../../components/inputs/InputField';
import { IoHome } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { AuthResponse, getSupportedCities, getSupportedCountries, Register } from '@/lib/user/actions';
import { useRouter } from 'next/navigation';
import { RegisterUser } from '@/types/user';

const page: React.FC = () => {
    const [isPaused, setIsPaused] = useState(false);

    const [phoneCode, setPhoneCode] = useState("+234");

    const [formData, setFormData] = useState<RegisterUser>({
        firstName: '', lastName: '', username: '', email: '', phoneNumber: '',
        password: '', country: '', address: '', city: '', state: '', termsAndConditions: ''
    });

    const [error, setErrorMessage] = useState<String>("");
    const [submissionPending, setSubmissionPending] = useState<boolean>(false);
    const router = useRouter();

    const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
    const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
    const [loadingLocations, setLoadingLocations] = useState(true);

    // Logs the entire object state whenever it finishes updating
    useEffect(() => {
        console.log("Current Form Data Object:", formData);
    }, [formData]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getSupportedCountries();
                if (data && Array.isArray(data)) {
                    const formattedCountries = data.map((c) => ({
                        label: c.countryName,
                        value: c.countryName
                    }));
                    setCountries(formattedCountries);
                }
            } catch (err) {
                console.error("Failed to fetch countries", err);
            } finally {
                setLoadingLocations(false);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (!formData.country) {
                setCities([]);
                return;
            }
            try {
                const data = await getSupportedCities(formData.country);
                if (data && Array.isArray(data)) {
                    const formattedCities = data.map((cityName) => ({
                        label: cityName,
                        value: cityName
                    }));
                    setCities(formattedCities);
                }
            } catch (err) {
                console.error("Failed to fetch cities", err);
            }
        };
        fetchCities();
    }, [formData.country]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPhoneCode(e.target.value);
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
                const apiPayload = {
                    ...formData,
                    phoneNumber: `${phoneCode}${formData.phoneNumber}`
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

    return (
        // 1. FIXED THE BACKGROUND IMAGE PATH HERE
        <div className='w-full min-h-screen md:min-h-screen bg-appBlue/20 overflow-hidden'
            style={{ backgroundImage: "url('/images/shipping.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>

            <div className="flex min-h-screen md:min-h-screen flex-1 py-0 px-3 md:py-4 md:px-10 bg-black/70 overflow-hidden">
                <div className="flex flex-1 flex-col justify-center  py-0 md:py-4 px-1 sm:px-3 md:px-6 lg:flex-none w-[330px] md:w-[550px] lg:px-16 xl:px-16 lg:w-[900px]">
                    <div className=" w-full max-w-sm lg:w-full lg:max-w-full bg-appTitleBgColor rounded-xl p-4 lg:p-6">

                        <div className='w-full'>
                            <div className="flex items-center justify-center">
                                {/* 2. FIXED LOGO2 PATH HERE */}
                                <Image src="/images/logo5.svg" alt="Description of the image" width={300} height={400} className="w-36 md:w-72" />
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
                                                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-white">First Name</label>
                                                <div className="mt-2">
                                                    <InputField type="text" id="firstName" name="firstName" value={formData.firstName} placeholder="Enter your first name" required={true} onChange={handleChange} className="bg-white" />
                                                </div>
                                            </div>
                                            <div className=' w-full'>
                                                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-white">Last Name</label>
                                                <div className="mt-2">
                                                    <InputField type="text" id="lastName" name="lastName" value={formData.lastName} placeholder="Enter your last name" required={true} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className='w-full'>
                                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">Username</label>
                                                <div className="mt-2">
                                                    <InputField type="text" id="username" name="username" value={formData.username} placeholder="choose a username" required={true} onChange={handleChange} className="bg-white" />
                                                </div>
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Email</label>
                                                <div className="mt-2">
                                                    <InputField type="email" id="email" name="email" value={formData.email} placeholder="Enter your email address" required={true} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-white">Mobile Number</label>
                                                <div className="mt-2 bg-white">
                                                    <InputField
                                                        isPhone={true}
                                                        id="phoneNumber"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        placeholder="Input your mobile number"
                                                        required={true}
                                                        countryCode={phoneCode}
                                                        onChange={handleChange}
                                                        onCountryCodeChange={handleCountryCodeChange}
                                                        className="bg-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password</label>
                                                <div className="mt-2">
                                                    <InputField type="password" id="password" name="password" value={formData.password} placeholder="Enter your password" required={true} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className=' w-full'>
                                                <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">Country</label>
                                                <div className="mt-2">
                                                    <InputField
                                                        id="country"
                                                        name="country"
                                                        value={formData.country}
                                                        placeholder={loadingLocations ? "Loading countries..." : "Select your country"}
                                                        required={true}
                                                        dropdownOptions={countries}
                                                        onChange={handleChange}
                                                        disabled={loadingLocations}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="address" className="block text-sm font-medium leading-6 text-white">Address</label>
                                                <div className="mt-2">
                                                    <InputField type="address" id="address" name="address" value={formData.address} placeholder="Enter your address" required={true} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="state" className="block text-sm font-medium leading-6 text-white">State</label>
                                                <div className="mt-2">
                                                    <InputField type="state" id="state" name="state" value={formData.state} placeholder="Enter your state" required={true} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className='w-full'>
                                                <label htmlFor="passwordConfirm" className="block text-sm font-medium leading-6 text-white">Confirm Password</label>
                                                <div className="mt-2">
                                                    <InputField type="password" id="passwordConfirm" name="password" value={formData.password} placeholder="Confirm your password" required={true} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center w-full gap-4">
                                            <div className=' w-full'>
                                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">City</label>
                                                <div className="mt-2">
                                                    <InputField
                                                        id="city"
                                                        name="city"
                                                        value={formData.city}
                                                        placeholder={!formData.country ? "Select country first" : "Select your City"}
                                                        required={true}
                                                        dropdownOptions={cities}
                                                        onChange={handleChange}
                                                        disabled={!formData.country || cities.length === 0}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div>
                                        <Button type="submit" className='bg-appNav/70 w-full gap-3 flex justify-center items-center'>
                                            {submissionPending ? (
                                                <span className="animate-pulse">Creating Account...</span>
                                            ) : (
                                                <><FaUserPlus className="text-2xl" /> <span> Create Account </span></>
                                            )}
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
                    <div className={`overflow-hidden expand animate-roundedTransition ${isPaused ? 'animation-paused' : ''}`}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="relative  w-full h-full bg-appTitleBgColor rounded-tr-[450px] rounded-bl-[450px] shadow-2xl shadow-appTitleBgColor">
                            <div className=" bg-white absolute w-full h-full rounded-tl-[450px] rounded-br-[450px] flex items-center kustify-center overflow-hidden shadow-2xl shadow-appTitleBgColor ">
                                {/* 3. FIXED LOGO PATH HERE */}
                                <Image src="/images/logo4.svg" alt="logo" width={100} height={100} className="bg-appWhite h-full w-full -rotate-45" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;