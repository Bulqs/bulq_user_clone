"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import logo from '@/public/images/logo4.svg'; // Adjust paths based on where you save this file!
import logo2 from '@/public/images/logo5.svg';
import shipping from '@/public/images/shipping.jpg';
// import Button from './inputs/Button';
import Link from 'next/link';
// import InputField from './inputs/InputField';
import { IoHome } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { AuthResponse, getSupportedCities, getSupportedCountries, Register } from '@/lib/user/actions';
import { useRouter } from 'next/navigation';
import { RegisterUser } from '@/types/user';
import InputField from '@/app/components/inputs/InputField';
import Button from '@/app/components/inputs/Button';
// import InputField from '@/app/components/inputs/InputField';
// import Button from '@/app/components/inputs/Button';

// 1. Update the interface
interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void; // <--- ADD THIS LINE
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
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

    useEffect(() => {
        if (!isOpen) return; // Only fetch when modal is open
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
    }, [isOpen]);

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

                // Registration successful! Close modal and maybe route or show success msg.
                onClose();
                router.push("/login"); // Or open login modal instead

            } catch (error) {
                setErrorMessage("Error validating credentials!");
                setSubmissionPending(false);
            }
        })();
    }

    // If modal is not open, render absolutely nothing.
    if (!isOpen) return null;

    return (
        // OVERLAY: The dark background behind the modal
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">

            {/* MODAL CONTAINER */}
            <div className="relative flex w-full max-w-6xl max-h-[95vh] bg-appTitleBgColor rounded-2xl shadow-2xl overflow-hidden">

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-all"
                >
                    ✕
                </button>

                {/* LEFT SIDE: Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className='w-full'>
                        <div className="flex items-center justify-center">
                            <Image src={logo2} alt="logo" width={300} height={400} className="w-32 md:w-56" />
                        </div>
                        <h2 className="flex mt-2 text-base md:text-xl font-bold mx-auto w-full md:w-96 leading-9 tracking-tight items-center justify-center text-white bg-appNav/55 px-2 md:py-1 rounded-md md:rounded-xl">
                            Create Your Shipping Account
                        </h2>
                    </div>

                    <div className="mt-6 w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col bg-appNav/55 px-4 py-6 gap-y-4 rounded-2xl">

                                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4">
                                    <div className='w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">First Name</label>
                                        <InputField type="text" name="firstName" value={formData.firstName} placeholder="First name" required onChange={handleChange} />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">Last Name</label>
                                        <InputField type="text" name="lastName" value={formData.lastName} placeholder="Last name" required onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4">
                                    <div className='w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">Username</label>
                                        <InputField type="text" name="username" value={formData.username} placeholder="Username" required onChange={handleChange} />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">Email</label>
                                        <InputField type="email" name="email" value={formData.email} placeholder="Email address" required onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center w-full gap-4">
                                    <div className=' w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">Mobile Number</label>
                                        <InputField isPhone={true} name="phoneNumber" value={formData.phoneNumber} placeholder="Mobile number" required countryCode={phoneCode} onChange={handleChange} onCountryCodeChange={handleCountryCodeChange} />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4">
                                    <div className=' w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">Password</label>
                                        <InputField type="password" name="password" value={formData.password} placeholder="Password" required onChange={handleChange} />
                                    </div>
                                    <div className=' w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">Country</label>
                                        <InputField name="country" value={formData.country} placeholder={loadingLocations ? "Loading..." : "Select country"} required dropdownOptions={countries} onChange={handleChange} disabled={loadingLocations} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center w-full gap-4">
                                    <div className=' w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">Address</label>
                                        <InputField type="address" name="address" value={formData.address} placeholder="Address" required onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4">
                                    <div className=' w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">State</label>
                                        <InputField type="state" name="state" value={formData.state} placeholder="State" required onChange={handleChange} />
                                    </div>
                                    <div className='w-full'>
                                        <label className="block text-sm font-medium leading-6 text-white">City</label>
                                        <InputField name="city" value={formData.city} placeholder={!formData.country ? "Select country first" : "Select City"} required dropdownOptions={cities} onChange={handleChange} disabled={!formData.country || cities.length === 0} />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className='bg-appNav/70 w-full gap-3 flex justify-center items-center py-4'>
                                {submissionPending ? (
                                    <span className="animate-pulse">Creating Account...</span>
                                ) : (
                                    <><FaUserPlus className="text-2xl" /> <span> Create Account </span></>
                                )}
                            </Button>
                        </form>

                        <div className="mt-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600" /></div>
                                <div className="relative flex justify-center text-sm font-medium">
                                    <span className="bg-appTitleBgColor px-4 text-white">Already have an account?</span>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {/* Change this button near the bottom of RegisterModal.tsx */}
                                <Button
                                    type="button" // Add this to prevent form submission
                                    className='bg-appNav/70 w-full flex justify-center items-center'
                                    onClick={onSwitchToLogin} // <--- Call the prop here!
                                >
                                    <div className="flex items-center gap-2">
                                        <RiLoginCircleFill className="text-xl" /> <span> Login </span>
                                    </div>
                                </Button>
                                {/* Instead of routing to home, this just closes the modal */}
                                <Button className='bg-black flex justify-center items-center' onClick={onClose}>
                                    <div className="flex items-center gap-2">
                                        <IoHome className="text-xl" /> <span> Close </span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: The Graphic Animation (Hidden on mobile, visible on desktop) */}
                <div
                    className="relative hidden lg:flex w-5/12 items-center justify-center bg-black/40"
                    style={{ backgroundImage: `url(${shipping.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    <div className={`z-10 overflow-hidden expand animate-roundedTransition ${isPaused ? 'animation-paused' : ''}`}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="relative w-64 h-64 bg-appTitleBgColor rounded-tr-[150px] rounded-bl-[150px] shadow-2xl">
                            <div className="bg-white absolute inset-2 rounded-tl-[150px] rounded-br-[150px] flex items-center justify-center overflow-hidden">
                                <Image src={logo} alt="logo" width={80} height={80} className="-rotate-45" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RegisterModal;