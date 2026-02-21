"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { IoHome } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Logic & Component Imports
import { AuthResponse, getSupportedCities, getSupportedCountries, Register } from '@/lib/user/actions';
import { RegisterUser } from '@/types/user';
import InputField from '@/app/components/inputs/InputField';
import Button from '@/app/components/inputs/Button';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [phoneCode, setPhoneCode] = useState("+234");
    
    // We add confirmPassword to its own state so it doesn't get sent to the backend
    const [confirmPassword, setConfirmPassword] = useState(""); 
    
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

    // =========================================================================
    // RESTORED: Logs the entire object state whenever it finishes updating
    // =========================================================================
    useEffect(() => {
        console.log("Current Form Data Object:", formData);
    }, [formData]);

    // RESTORED: API Fetch for Countries
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
                    console.log("Fetched Countries:", formattedCountries); // Restored log
                }
            } catch (err) {
                console.error("Failed to fetch countries", err);
            } finally {
                setLoadingLocations(false);
            }
        };
        fetchCountries();
    }, [isOpen]);

    // RESTORED: API Fetch for Cities
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

    // =========================================================================
    // RESTORED: Console logs immediately as each specific field changes
    // =========================================================================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Log exactly which field changed and its new value
        console.log(`Field Changed => [${name}]:`, value);

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === 'country') console.log("Current Country:", value);
    };

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCode = e.target.value;
        console.log("Dial Code Changed =>", newCode);
        setPhoneCode(newCode);
    };
    // =========================================================================

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSubmissionPending(true);
        setErrorMessage("");

        if (!formData) {
            setErrorMessage("Incomplete credentials");
            setSubmissionPending(false);
            return;
        }

        // NEW: Password Match Validation
        if (formData.password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            setSubmissionPending(false);
            return;
        }

        (async function () {
            try {
                const apiPayload = {
                    ...formData,
                    phoneNumber: `${phoneCode}${formData.phoneNumber}`
                };

                // RESTORED: Logs the final merged payload sent to your backend
                console.log("FINAL API PAYLOAD:", apiPayload);

                const response: AuthResponse = await Register(apiPayload);

                if (!response) {
                    throw new Error("Failed to register");
                }
                
                onClose();
                router.push("/login");

            } catch (error) {
                setErrorMessage("Error validating credentials!");
                setSubmissionPending(false);
            }
        })();
    }

    if (!isOpen) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 lg:p-8"
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative flex w-full max-w-6xl h-[95vh] lg:h-[85vh] bg-appTitleBgColor rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-gray-800"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-md"
                >
                    ✕
                </button>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 custom-scrollbar relative z-10">
                    
                    <div className='w-full mb-8 text-center'>
                        <Image src="/images/logo5.svg" alt="BulQ Logo" width={200} height={50} className="mx-auto mb-4" />
                        <h2 className="inline-block text-xl md:text-2xl font-bold text-white bg-white/5 backdrop-blur-sm px-6 py-2 rounded-xl border border-white/10 shadow-inner">
                            Create Your Shipping Account
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                        
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col bg-white/5 backdrop-blur-sm p-6 gap-y-5 rounded-2xl border border-white/10">
                            
                            {/* Row 1: Name */}
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className='w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">First Name</label>
                                    <InputField type="text" name="firstName" value={formData.firstName} placeholder="First name" required onChange={handleChange} />
                                </div>
                                <div className='w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Last Name</label>
                                    <InputField type="text" name="lastName" value={formData.lastName} placeholder="Last name" required onChange={handleChange} />
                                </div>
                            </div>

                            {/* Row 2: Auth Info */}
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className='w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Username</label>
                                    <InputField type="text" name="username" value={formData.username} placeholder="Choose a username" required onChange={handleChange} />
                                </div>
                                <div className='w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Email</label>
                                    <InputField type="email" name="email" value={formData.email} placeholder="Email address" required onChange={handleChange} />
                                </div>
                            </div>

                            {/* Row 3: Phone */}
                            <div className="w-full">
                                <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Mobile Number</label>
                                <InputField isPhone={true} name="phoneNumber" value={formData.phoneNumber} placeholder="Mobile number" required countryCode={phoneCode} onChange={handleChange} onCountryCodeChange={handleCountryCodeChange} />
                            </div>

                            {/* Row 4: Passwords */}
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className=' w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Password</label>
                                    <InputField type="password" name="password" value={formData.password} placeholder="Password" required onChange={handleChange} />
                                </div>
                                <div className=' w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Confirm Password</label>
                                    <InputField type="password" name="confirmPassword" value={confirmPassword} placeholder="Confirm password" required onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>

                            {/* Row 5: Country & Address */}
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className=' w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Country</label>
                                    <InputField name="country" value={formData.country} placeholder={loadingLocations ? "Loading..." : "Select country"} required dropdownOptions={countries} onChange={handleChange} disabled={loadingLocations} />
                                </div>
                                <div className="w-full">
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Address</label>
                                    <InputField type="text" name="address" value={formData.address} placeholder="Enter your full address" required onChange={handleChange} />
                                </div>
                            </div>

                            {/* Row 6: State & City */}
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className=' w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">State</label>
                                    <InputField type="text" name="state" value={formData.state} placeholder="State" required onChange={handleChange} />
                                </div>
                                <div className='w-full'>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">City</label>
                                    <InputField name="city" value={formData.city} placeholder={!formData.country ? "Select country first" : "Select City"} required dropdownOptions={cities} onChange={handleChange} disabled={!formData.country || cities.length === 0} />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className='group relative w-full overflow-hidden bg-appNav py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 active:scale-[0.98]'>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <div className="relative flex justify-center items-center gap-3 text-white font-bold text-lg">
                                {submissionPending ? (
                                    <span className="animate-pulse">Creating Account...</span>
                                ) : (
                                    <><FaUserPlus className="text-xl" /> <span> Create Account </span></>
                                )}
                            </div>
                        </Button>
                    </form>

                    <div className="mt-8 max-w-2xl mx-auto">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700" /></div>
                            <div className="relative flex justify-center text-sm font-medium">
                                <span className="bg-appTitleBgColor px-4 text-gray-400">Already have an account?</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button type="button" onClick={onSwitchToLogin} className='bg-white/10 hover:bg-white/20 text-white w-full flex justify-center items-center py-3 rounded-xl backdrop-blur-sm transition-colors'>
                                <div className="flex items-center gap-2 font-medium">
                                    <RiLoginCircleFill className="text-xl text-blue-400" /> <span> Login </span>
                                </div>
                            </Button>

                            <Button type="button" onClick={onClose} className='bg-black/40 hover:bg-black/60 text-white w-full flex justify-center items-center py-3 rounded-xl transition-colors border border-gray-800'>
                                <div className="flex items-center gap-2 font-medium">
                                    <IoHome className="text-xl text-gray-400" /> <span> Cancel </span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex w-5/12 relative items-center justify-center overflow-hidden bg-black">
                    <div 
                        className="absolute inset-0 opacity-40 bg-cover bg-center"
                        style={{ backgroundImage: "url('/images/shipping.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-appTitleBgColor/90 via-appNav/40 to-black/80"></div>

                    <motion.div 
                        animate={{ y: [-15, 15, -15], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 w-72 h-72 bg-appTitleBgColor rounded-tr-[150px] rounded-bl-[150px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
                    >
                        <div className="bg-white absolute inset-2 rounded-tl-[150px] rounded-br-[150px] flex items-center justify-center overflow-hidden">
                            <Image src="/images/logo4.svg" alt="logo" width={100} height={100} className="-rotate-45 opacity-90" />
                        </div>
                    </motion.div>

                    <div className="absolute bottom-10 left-10 right-10 z-10 text-center">
                        <p className="text-blue-200/60 font-medium tracking-widest text-sm uppercase">Global Logistics Network</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default RegisterModal;