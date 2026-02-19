"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoCheckmarkCircleOutline, IoClose } from "react-icons/io5";

// Logic & Type Imports
import { AuthResponse, Register, getSupportedCountries, getSupportedCities } from '@/lib/user/actions';
import { RegisterUser, CountryDTO } from '@/types/user';
import InputField from '../../components/inputs/InputField';

interface UserSignUpProps {
    onSwitchToLogin?: () => void;
}

const UserSignUp: React.FC<UserSignUpProps> = ({ onSwitchToLogin }) => {

    const router = useRouter();

    // --- STATE ---
    const [formData, setFormData] = useState<RegisterUser>({
        firstName: '', lastName: '', username: '', email: '',
        phoneNumber: '', password: '',
        country: '', address: '', city: '', state: '',
        termsAndConditions: ''
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [submissionPending, setSubmissionPending] = useState<boolean>(false);
    
    // Data States
    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    
    // Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // --- EFFECTS ---

    // 1. Fetch Countries on Mount
    useEffect(() => {
        const fetchCountries = async () => {
            const data = await getSupportedCountries();
            setCountries(data || []);
        };
        fetchCountries();
    }, []);

    // 2. Fetch Cities when Country Changes
    useEffect(() => {
        if (formData.country) {
            // Find the country object to get the Name (needed for city API)
            const selectedCountry = countries.find(c => c.countryCode === formData.country);
            if (selectedCountry) {
                getSupportedCities(selectedCountry.countryName).then(data => setCities(data || []));
            } else {
                setCities([]);
            }
        }
    }, [formData.country, countries]);

    // --- HANDLERS ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Only updates the phone component's country code visual, not the main country field
        // If you want them synced, you can set formData.country here too
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            termsAndConditions: e.target.checked ? "accepted" : ""
        }));
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setSubmissionPending(true);
        setErrorMessage("");

        // Validation
        if (!formData.termsAndConditions) {
            setErrorMessage("Please accept the terms and conditions.");
            setSubmissionPending(false);
            return;
        }

        if (formData.password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setSubmissionPending(false);
            return;
        }

        try {
            const response: AuthResponse = await Register(formData);
            if (!response) throw new Error("Registration failed");
            
            // Show Success Modal instead of immediate redirect
            setShowSuccessModal(true);
            
        } catch (error: any) {
            setErrorMessage("Registration error. Please check your details or try again.");
        } finally {
            setSubmissionPending(false);
        }
    }

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        if (onSwitchToLogin) onSwitchToLogin();
        else router.push("/login");
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
            
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-white flex flex-col justify-center overflow-y-auto">
                <div className="max-w-md mx-auto w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
                    <p className="text-gray-600 mb-8">Join the BulQ community today</p>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <InputField id="firstName" name="firstName" value={formData.firstName} placeholder="First Name" required onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <InputField id="lastName" name="lastName" value={formData.lastName} placeholder="Last Name" required onChange={handleInputChange} />
                            </div>
                        </div>

                        {/* User/Email Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <InputField id="username" name="username" value={formData.username} placeholder="Username" required onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <InputField id="email" type="email" name="email" value={formData.email} placeholder="Email" required onChange={handleInputChange} />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <InputField id="phoneNumber" isPhone name="phoneNumber" value={formData.phoneNumber} placeholder="Mobile number" required countryCode={formData.country} onChange={handleInputChange} onCountryCodeChange={handleCountryCodeChange} />
                        </div>

                        {/* Location Row (Country/State/City) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <InputField 
                                    id="country" 
                                    name="country" 
                                    value={formData.country} 
                                    placeholder="Select Country" 
                                    required 
                                    dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))}
                                    onChange={handleInputChange} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <InputField id="state" name="state" value={formData.state} placeholder="State" required onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <InputField 
                                    id="city" 
                                    name="city" 
                                    value={formData.city} 
                                    placeholder="Select City" 
                                    required 
                                    dropdownOptions={cities} // Passing simple string array or map if needed
                                    onChange={handleInputChange} 
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <InputField id="address" name="address" value={formData.address} placeholder="Street address" required onChange={handleInputChange} />
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <InputField id="password" type="password" name="password" value={formData.password} placeholder="Password" required onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <InputField 
                                    id="confirmPassword" 
                                    type="password" 
                                    name="confirmPassword" 
                                    value={confirmPassword} 
                                    placeholder="Confirm Password" 
                                    required 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-center gap-2 py-2">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={formData.termsAndConditions === "accepted"} 
                                className="h-4 w-4 text-appNav border-gray-300 rounded cursor-pointer focus:ring-appBanner" 
                                required 
                                onChange={handleCheckboxChange} 
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700">
                                I agree to the <Link href="#" className="text-appNav hover:underline font-semibold">Terms of Service</Link>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={submissionPending}
                            className="w-full bg-appNav text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed mt-2 shadow-md"
                        >
                            {submissionPending ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={() => onSwitchToLogin ? onSwitchToLogin() : router.push("/login")} className="text-appNav font-bold hover:underline">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side Branding */}
            <div className="w-full md:w-1/2 bg-gray-900 relative min-h-[400px] hidden md:block">
                <div className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center opacity-70"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="relative z-10 h-full flex flex-col justify-center p-20 text-white">
                    <h2 className="text-5xl font-bold mb-4 tracking-tight">Join BulQ</h2>
                    <h3 className="text-4xl font-semibold mb-6 text-blue-400">Logistics</h3>
                    <p className="text-lg mb-10 text-gray-200">The smarter way to manage your global shipping.</p>
                </div>
            </div>

            {/* --- SUCCESS MODAL --- */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl relative flex flex-col items-center text-center">
                        <button onClick={closeSuccessModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <IoClose size={24} />
                        </button>
                        
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100 animate-bounce">
                            <IoCheckmarkCircleOutline className="w-10 h-10 text-green-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            A verification email has been sent to <span className="font-semibold text-gray-800">{formData.email}</span>. <br/>
                            Please verify your email address to activate your account.
                        </p>

                        <button 
                            onClick={closeSuccessModal}
                            className="w-full bg-appNav text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-md"
                        >
                            Proceed to Login
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserSignUp;

// "use client";
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// // Logic & Type Imports
// import { AuthResponse, Register } from '@/lib/user/actions';
// import { RegisterUser } from '@/types/user';
// import InputField from '../../components/inputs/InputField';

// interface UserSignUpProps {
//     onSwitchToLogin?: () => void;
// }

// const UserSignUp: React.FC<UserSignUpProps> = ({ onSwitchToLogin }) => {


//     const router = useRouter();

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

//     const [errorMessage, setErrorMessage] = useState<string>("");
//     const [submissionPending, setSubmissionPending] = useState<boolean>(false);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         // If 'name' is undefined here, your InputField isn't passing the prop down!
//         console.log(`Field Name: ${name}, Value: ${value}`);
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         // This handles the country selection for the phone component specifically
//         setFormData(prev => ({ ...prev, country: e.target.value }));
//     };

//     const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         // Force the state to update based on the actual checkbox status
//         const isChecked = e.target.checked;

//         setFormData(prev => ({
//             ...prev,
//             termsAndConditions: isChecked ? "accepted" : ""
//         }));
//     };

//     useEffect(() => {
//         console.log("Current Form Data:", formData);
//     }, [formData]); // This runs EVERY time formData changes

//     async function handleSubmit(event: React.FormEvent) {
//         event.preventDefault();
//         setSubmissionPending(true);
//         setErrorMessage("");

//         if (!formData.termsAndConditions) {
//             setErrorMessage("Please accept the terms and conditions.");
//             setSubmissionPending(false);
//             return;
//         }

//         try {
//             const response: AuthResponse = await Register(formData);
//             if (!response) throw new Error("Registration failed");
//             if (onSwitchToLogin) onSwitchToLogin();
//             else router.push("/login");
//         } catch (error) {
//             setErrorMessage("Registration error. Please check your details.");
//         } finally {
//             setSubmissionPending(false);
//         }
//     }

//     return (
//         <div className="min-h-screen bg-white flex flex-col md:flex-row">
//             <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-white flex flex-col justify-center overflow-y-auto">
//                 <div className="max-w-md mx-auto w-full">
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
//                     <p className="text-gray-600 mb-8">Join the BulQ community today</p>

//                     {errorMessage && (
//                         <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
//                             {errorMessage}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         {/* Name Row */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                                 <InputField
//                                     id="firstName"
//                                     name="firstName"
//                                     value={formData.firstName}
//                                     placeholder="First Name"
//                                     required={true}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                                 <InputField
//                                     id="lastName"
//                                     name="lastName"
//                                     value={formData.lastName}
//                                     placeholder="Last Name"
//                                     required={true}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                         </div>

//                         {/* User/Email Row */}
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                                 <InputField
//                                     id="username"
//                                     name="username"
//                                     value={formData.username}
//                                     placeholder="Username"
//                                     required={true}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                                 <InputField
//                                     id="email"
//                                     type="email"
//                                     name="email"
//                                     value={formData.email}
//                                     placeholder="Email"
//                                     required={true}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                         </div>

//                         {/* Phone Field */}
//                         <div>
//                             <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                             <InputField
//                                 id="phoneNumber"
//                                 isPhone={true}
//                                 name="phoneNumber"
//                                 value={formData.phoneNumber}
//                                 placeholder="Mobile number"
//                                 required={true}
//                                 countryCode={formData.country}
//                                 onChange={handleInputChange}
//                                 onCountryCodeChange={handleCountryCodeChange}
//                             />
//                         </div>

//                         {/* Country, State, City Row (3 columns) */}
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                             <div>
//                                 <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                                 <InputField
//                                     id="country"
//                                     name="country"
//                                     value={formData.country}
//                                     placeholder="Country"
//                                     required={true}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
//                                 <InputField
//                                     id="state"
//                                     name="state"
//                                     value={formData.state}
//                                     placeholder="State"
//                                     required={true}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                                 <InputField
//                                     id="city"
//                                     name="city"
//                                     value={formData.city}
//                                     placeholder="City"
//                                     required={true}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                         </div>

//                         {/* Address */}
//                         <div>
//                             <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Local Address</label>
//                             <InputField
//                                 id="address"
//                                 name="address"
//                                 value={formData.address}
//                                 placeholder="Street address"
//                                 required={true}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         {/* Password */}
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                             <InputField
//                                 id="password"
//                                 type="password"
//                                 name="password"
//                                 value={formData.password}
//                                 placeholder="Create password"
//                                 required={true}
//                                 onChange={handleInputChange}
//                             />
//                         </div>

//                         {/* Terms */}
//                         <div className="flex items-center gap-2 py-2">
//                             <input
//                                 type="checkbox"
//                                 id="terms"
//                                 name="termsAndConditions"
//                                 // THIS IS THE CRITICAL LINE:
//                                 checked={formData.termsAndConditions === "accepted"}
//                                 className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer"
//                                 required
//                                 onChange={handleCheckboxChange}
//                             />
//                             <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
//                                 I agree to the <Link href="#" className="text-blue-600 hover:underline font-semibold">Terms of Service</Link>
//                             </label>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={submissionPending}
//                             className="w-full bg-appTitleBgColor text-white py-3 rounded-lg font-bold hover:bg-appNav transition-all disabled:bg-gray-400 mt-2"
//                         >
//                             {submissionPending ? "Creating Account..." : "Create Account"}
//                         </button>
//                     </form>

//                     <div className="mt-6 text-center text-sm text-gray-600">
//                         Already have an account?{' '}
//                         <button
//                             onClick={() => onSwitchToLogin && onSwitchToLogin()}
//                             className="text-blue-600 font-bold hover:underline"
//                         >
//                             Sign In
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Side UI Branding */}
//             <div className="w-full md:w-1/2 bg-gray-900 relative min-h-[400px]">
//                 <div className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center opacity-70"></div>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
//                 <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 lg:p-20 text-white">
//                     <h2 className="text-5xl font-bold mb-4 tracking-tight">Join BulQ</h2>
//                     <h3 className="text-4xl font-semibold mb-6 text-blue-400">Logistics</h3>
//                     <p className="text-lg mb-10 text-gray-200">The smarter way to manage your global shipping.</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserSignUp;


// "use client";
// import React, { useEffect, useCallback } from 'react';
// import Link from 'next/link';

// interface UserSignUpProps {
//     isModal?: boolean;
//     onClose?: () => void;
//     onSwitchToLogin?: () => void;
// }

// const UserSignUp: React.FC<UserSignUpProps> = ({
//     isModal = false,
//     onClose = () => { },
//     onSwitchToLogin
// }) => {
//     useEffect(() => {
//         if (isModal) {
//             document.body.classList.add('modal-open');
//             document.body.style.touchAction = 'none';
//             return () => {
//                 document.body.classList.remove('modal-open');
//                 document.body.style.touchAction = '';
//             };
//         }
//     }, [isModal]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         // Handle form submission logic
//     };

//     const handleClose = useCallback((e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         onClose();
//         const dummy = document.body.offsetHeight;
//     }, [onClose]);

//     if (!isModal) return null;

//     return (
//         <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[500]"
//             onClick={handleClose}
//             data-testid="modal-overlay"
//         >
//             <div
//                 className="relative bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
//                 onClick={(e) => e.stopPropagation()}
//                 role="dialog"
//                 aria-modal="true"
//                 tabIndex={-1}
//             >
//                 <button
//                     onClick={handleClose}
//                     className="absolute top-4 right-4 text-white p-1 rounded-md bg-red-900 hover:text-gray-700 z-[1000]"
//                     aria-label="Close modal"
//                 >
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                 </button>
//                 <div className="min-h-[80vh] flex flex-col md:flex-row">
//                     <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-white flex flex-col justify-center">
//                         <div className="max-w-md mx-auto w-full">
//                             <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
//                             <p className="text-gray-600 mb-8">Join our community today</p>

//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <div>
//                                     <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Full Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="fullName"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Enter your full name"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Email Address
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Enter your email"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Country of Residence
//                                     </label>
//                                     <select
//                                         id="country"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         required
//                                     >
//                                         <option value="">Select your country</option>
//                                         <option value="US">United States</option>
//                                         <option value="UK">United Kingdom</option>
//                                         <option value="CA">Canada</option>
//                                         <option value="NG">Nigeria</option>
//                                         {/* Add more countries as needed */}
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Phone Number
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         id="phone"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Enter your phone number"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Local Address
//                                     </label>
//                                     <textarea
//                                         id="address"
//                                         rows={3}
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Enter your local address"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Create Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         id="password"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Create your password"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Confirm Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         id="confirmPassword"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Confirm your password"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="text-sm text-gray-600">
//                                     <p className="font-medium mb-2">Password must contain at least 8 characters, including:</p>
//                                     <ul className="list-disc pl-5 space-y-1">
//                                         <li>8+ characters</li>
//                                         <li>1 uppercase letter</li>
//                                         <li>1 number</li>
//                                         <li>1 special character</li>
//                                     </ul>
//                                 </div>

//                                 <div className="flex items-center">
//                                     <input
//                                         type="checkbox"
//                                         id="terms"
//                                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                         required
//                                     />
//                                     <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
//                                         I agree to the <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
//                                     </label>
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     className="w-full bg-appTitleBgColor text-white py-3 px-4 rounded-lg font-medium hover:bg-appNav transition-colors mt-4"
//                                 >
//                                     Create Account
//                                 </button>
//                             </form>

//                             <div className="text-center text-sm text-gray-600">
//                                 Already have an account?{' '}
//                                 <button
//                                     onClick={(e) => {
//                                         e.preventDefault();
//                                         if (onSwitchToLogin) onSwitchToLogin();
//                                     }}
//                                     className="text-blue-600 hover:underline"
//                                 >
//                                     Sign In
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="w-full md:w-1/2 bg-gray-100 relative">
//                         <div className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center opacity-90"></div>
//                         <div className="relative z-10 h-full flex flex-col justify-start p-8 md:p-12 lg:p-20 bg-black bg-opacity-40 text-white">
//                             <div className="max-w-md mx-auto">
//                                 <h2 className="text-5xl font-bold mb-4">Welcome to BulQ</h2>
//                                 <h3 className="text-4xl font-bold mb-6">Logistics</h3>
//                                 <p className="text-lg mb-8">
//                                     Join our community and experience the best platform for your needs.
//                                     We'll send you a verification email to activate your account.
//                                 </p>
//                                 <div className="flex items-center mt-12">
//                                     <div className="flex -space-x-2">
//                                         {[1, 2, 3, 4, 5].map((item) => (
//                                             <div
//                                                 key={item}
//                                                 className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"
//                                             />
//                                         ))}
//                                     </div>
//                                     <div className="ml-4">
//                                         <div className="flex items-center">
//                                             {[...Array(5)].map((_, i) => (
//                                                 <svg
//                                                     key={i}
//                                                     className="w-5 h-5 text-yellow-400"
//                                                     fill="currentColor"
//                                                     viewBox="0 0 20 20"
//                                                 >
//                                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                                 </svg>
//                                             ))}
//                                         </div>
//                                         <p className="text-sm mt-1">From 300+ reviews</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserSignUp;