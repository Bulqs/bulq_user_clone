'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    User, Lock, Bell, Trash2, Shield, Mail, Camera, Eye, EyeOff,
    CheckCircle, Download, Copy, Settings, Key, Upload, MapPin,
    Volume2, VolumeX, ChevronDown, FileText, Save, X, Loader2,
    CreditCard, Calendar, Briefcase, Building
} from 'lucide-react';
import { UserResponseDTO } from '@/types/admin';
import { getMyProfile, updateProfile, getSupportedCountries } from '@/lib/user/actions';
import { CountryDTO, UpdateProfileRequest } from '@/types/user';
import { KYCPersonalInfoRequest } from '@/types/kyc';
import { submitKYC } from '@/lib/user/kyc.actions';
import Image from 'next/image';
// import { submitKYC, KYCPersonalInfoRequest } from '@/lib/user/booking.actions';

type SettingsPage = 'profile' | 'security' | 'notifications' | 'delete' | 'kyc';

const SettingsPage = () => {
    // --- GLOBAL STATE ---
    const [activePage, setActivePage] = useState<SettingsPage>('profile');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserResponseDTO | null>(null);
    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    // --- PROFILE TAB STATE ---
    const [isSaving, setIsSaving] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        firstName: '', lastName: '', email: '', phoneNumber: '',
        country: '', city: '', state: '', defaultAddress: '', username: ''
    });

    // --- SECURITY TAB STATE ---
    const [showPassword, setShowPassword] = useState(false);

    // --- NOTIFICATION TAB STATE ---
    const [desktopNotifications, setDesktopNotifications] = useState(true);
    const [unreadNotifications, setUnreadNotifications] = useState(true);
    const [pushNotificationTimeout, setPushNotificationTimeout] = useState('30');
    const [communicationEmail, setCommunicationEmail] = useState(true);
    const [announcementUpdates, setAnnouncementUpdates] = useState(false);
    const [disableAllSounds, setDisableAllSounds] = useState(false);

    // --- KYC TAB STATE ---
    const [kycLoading, setKycLoading] = useState(false);
    const [showKycSuccess, setShowKycSuccess] = useState(false);
    
    // File Refs
    const idFrontRef = useRef<HTMLInputElement>(null);
    const idBackRef = useRef<HTMLInputElement>(null);
    const selfieRef = useRef<HTMLInputElement>(null);
    const proofRef = useRef<HTMLInputElement>(null);

    // KYC Form Data (Matches KYCPersonalInfoRequest)
    const [kycFormData, setKycFormData] = useState({
        firstName: '', lastName: '', phoneNumber: '', email: '',
        dateOfBirth: '', nationality: '', occupation: '',
        address: '', city: '', state: '', postalCode: '', country: '',
        idType: '', idNumber: '', idExpiryDate: '',
        bankName: '', accountNumber: '', bvn: ''
    });

    // KYC Files & Previews
    const [kycFiles, setKycFiles] = useState<{
        idFront: File | null; idBack: File | null; selfie: File | null; proof: File | null;
    }>({ idFront: null, idBack: null, selfie: null, proof: null });

    const [kycPreviews, setKycPreviews] = useState<{
        idFront: string | null; idBack: string | null; selfie: string | null; proof: string | null;
    }>({ idFront: null, idBack: null, selfie: null, proof: null });


    // --- 1. INITIAL DATA FETCH ---
    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true);
                const [userData, countryData] = await Promise.all([
                    getMyProfile(),
                    getSupportedCountries()
                ]);

                setProfile(userData);
                setCountries(countryData || []);
                setProfileImage(userData.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');

                // Populate Profile Form
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    country: userData.country || '',
                    city: userData.city || '',
                    state: userData.state || '',
                    defaultAddress: userData.defaultAddress || '',
                    username: userData.username || '',
                });

                // Pre-fill KYC Form (Auto-fill known fields)
                setKycFormData(prev => ({
                    ...prev,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    country: userData.country || '',
                    nationality: userData.country || '', // Default to country
                    address: userData.defaultAddress || '',
                    city: userData.city || '',
                    state: userData.state || ''
                }));

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);


    // --- 2. HANDLERS ---

    // Profile Handlers
    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveProfile = async () => {
        if (!profile?.id) return;
        setIsSaving(true);
        try {
            await updateProfile(profile.id, formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // KYC Handlers
    const handleKycChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setKycFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleKycFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof kycFiles) => {
        const file = e.target.files?.[0];
        if (file) {
            setKycFiles(prev => ({ ...prev, [field]: file }));
            const reader = new FileReader();
            reader.onload = (ev) => setKycPreviews(prev => ({ ...prev, [field]: ev.target?.result as string }));
            reader.readAsDataURL(file);
        }
    };

    // Cloudinary Logic
    const uploadImageToCloud = async (file: File): Promise<string> => {
        const cloudName = "dhydpleqs"; 
        const uploadPreset = "abokina"; 

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
            if (!response.ok) throw new Error("Image upload failed");
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    };

    const handleKycSubmit = async () => {
        // 1. Validation
        if (!kycFiles.idFront || !kycFiles.idBack || !kycFiles.selfie || !kycFiles.proof) {
            alert("Please upload all required documents (ID Front, Back, Selfie, Proof of Address).");
            return;
        }
        if (!kycFormData.bvn || !kycFormData.idNumber || !kycFormData.dateOfBirth) {
            alert("Please fill in all required text fields.");
            return;
        }

        setKycLoading(true);
        try {
            // 2. Upload Images
            const [frontUrl, backUrl, selfieUrl, proofUrl] = await Promise.all([
                uploadImageToCloud(kycFiles.idFront),
                uploadImageToCloud(kycFiles.idBack),
                uploadImageToCloud(kycFiles.selfie),
                uploadImageToCloud(kycFiles.proof)
            ]);

            // 3. Format Dates for Backend (java.util.Date usually wants ISO)
            const dobISO = new Date(kycFormData.dateOfBirth).toISOString(); // YYYY-MM-DD -> ISO
            const expISO = new Date(kycFormData.idExpiryDate).toISOString(); 

            // 4. Construct Payload
            const payload: KYCPersonalInfoRequest = {
                firstName: kycFormData.firstName,
                lastName: kycFormData.lastName,
                phoneNumber: kycFormData.phoneNumber,
                email: kycFormData.email,
                dateOfBirth: dobISO, // Sending as ISO
                nationality: kycFormData.nationality,
                occupation: kycFormData.occupation,
                
                address: kycFormData.address,
                city: kycFormData.city,
                state: kycFormData.state,
                postalCode: kycFormData.postalCode,
                country: kycFormData.country,
                
                idType: kycFormData.idType, // Enum string (e.g. "NIN")
                idNumber: kycFormData.idNumber,
                idExpiryDate: expISO, // Sending as ISO
                
                bankName: kycFormData.bankName,
                accountNumber: kycFormData.accountNumber,
                bvn: kycFormData.bvn,
                
                profilePhoto: selfieUrl,
                idFrontPhoto: frontUrl,
                idBackPhoto: backUrl,
                proofOfAddress: proofUrl
            };

            console.log("Submitting KYC:", payload);

            // 5. Submit
            await submitKYC(payload);
            setShowKycSuccess(true);

        } catch (error: any) {
            console.error(error);
            alert(error.message || "KYC Submission Failed");
        } finally {
            setKycLoading(false);
        }
    };

    const menuItems = [
        { id: 'profile' as SettingsPage, label: 'Profile Settings', icon: User, color: 'text-appBanner', bg: 'from-appBanner/20 to-appNav/20' },
        { id: 'security' as SettingsPage, label: 'Security', icon: Lock, color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/20' },
        { id: 'notifications' as SettingsPage, label: 'Notifications', icon: Bell, color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/20' },
        { id: 'kyc' as SettingsPage, label: 'Identity Verification', icon: Shield, color: 'text-purple-500', bg: 'from-purple-500/20 to-violet-500/20' },
        { id: 'delete' as SettingsPage, label: 'Delete Account', icon: Trash2, color: 'text-red-400', bg: 'from-red-500/20 to-pink-500/20' },
    ];

    if (loading) return <div className="flex h-screen items-center justify-center text-appBanner"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (error) return <div className="p-8 text-red-500">Error loading settings: {error}</div>;

    // --- RENDER CONTENT ---
    const renderContent = () => {
        switch (activePage) {
            case 'profile':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                            <p className="text-gray-600">Manage your personal information</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-appBanner" /> Personal Information</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-sm font-medium text-gray-700">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                        <div><label className="text-sm font-medium text-gray-700">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                    </div>
                                    <div><label className="text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                    <div><label className="text-sm font-medium text-gray-700">Username</label><input type="text" name="username" value={formData.username} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                    <div><label className="text-sm font-medium text-gray-700">Phone</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                </div>
                            </div>
                            
                            {/* Photo & Location */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Image src={profileImage} alt="Profile" className="w-20 h-20 rounded-xl object-cover border-2 border-appBanner/30" />
                                            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-appBanner rounded-full p-2 text-white"><Camera className="w-3 h-3" /></button>
                                            <input type="file" ref={fileInputRef} onChange={handleProfileImageUpload} className="hidden" />
                                        </div>
                                        <div className="flex-1">
                                            <button onClick={() => fileInputRef.current?.click()} className="bg-appBanner text-white py-2 px-3 rounded-lg text-sm">Upload New</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4"><MapPin className="w-5 h-5 inline mr-2 text-green-500" /> Location</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-sm font-medium text-gray-700">Country</label><input type="text" name="country" value={formData.country} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                        <div><label className="text-sm font-medium text-gray-700">City</label><input type="text" name="city" value={formData.city} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                    </div>
                                    <div className="mt-4"><label className="text-sm font-medium text-gray-700">Default Address Type</label>
                                        <div className="relative mt-2">
                                            <select name="defaultAddress" value={formData.defaultAddress} onChange={handleProfileInputChange} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-appBanner appearance-none">
                                                <option value="">Select Type</option><option value="HOME">HOME</option><option value="OFFICE">OFFICE</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button onClick={handleSaveProfile} disabled={isSaving} className="bg-appBanner text-white py-3 px-6 rounded-xl font-semibold flex items-center gap-2 hover:bg-appNav transition-colors disabled:opacity-50">
                                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div><h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2><p className="text-gray-600">Manage password and security</p></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-blue-500" /> Change Password</h3>
                                <div className="space-y-4">
                                    <div><label className="text-sm font-medium">Current Password</label><div className="relative mt-2"><input type={showPassword ? "text" : "password"} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none" /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button></div></div>
                                    <div><label className="text-sm font-medium">New Password</label><input type="password" className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none" /></div>
                                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold mt-4">Update Password</button>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-500" /> 2FA</h3>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border"><div className="text-sm font-medium">Two-Factor Authentication</div><input type="checkbox" className="toggle" /></div>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div><h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2><p className="text-gray-600">Configure alerts</p></div>
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div><h4 className="font-medium">Desktop Notifications</h4><p className="text-xs text-gray-500">Get updates on your screen</p></div>
                                <input type="checkbox" checked={desktopNotifications} onChange={(e) => setDesktopNotifications(e.target.checked)} />
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div><h4 className="font-medium">Email Updates</h4><p className="text-xs text-gray-500">Receive order updates via email</p></div>
                                <input type="checkbox" checked={communicationEmail} onChange={(e) => setCommunicationEmail(e.target.checked)} />
                            </div>
                        </div>
                    </div>
                );

            case 'kyc':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
                            <p className="text-gray-600">Complete all fields to verify your identity.</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 space-y-8">
                            
                            {/* 1. PERSONAL DETAILS */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-purple-600"/> Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="text-sm font-bold block mb-2">First Name</label><input type="text" name="firstName" value={kycFormData.firstName} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Last Name</label><input type="text" name="lastName" value={kycFormData.lastName} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Email</label><input type="email" name="email" value={kycFormData.email} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Phone</label><input type="tel" name="phoneNumber" value={kycFormData.phoneNumber} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Date of Birth</label><input type="date" name="dateOfBirth" value={kycFormData.dateOfBirth} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Occupation</label><input type="text" name="occupation" value={kycFormData.occupation} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                </div>
                            </div>

                            {/* 2. ADDRESS & LOCATION */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-600"/> Address & Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2"><label className="text-sm font-bold block mb-2">Residential Address</label><input type="text" name="address" value={kycFormData.address} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
                                    
                                    {/* Country Dropdown */}
                                    <div className="relative">
                                        <label className="text-sm font-bold block mb-2">Country</label>
                                        <select name="country" value={kycFormData.country} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                                            <option value="">Select Country</option>
                                            {countries.map(c => <option key={c.countryCode} value={c.countryName}>{c.countryName}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 bottom-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>

                                    {/* Nationality Dropdown */}
                                    <div className="relative">
                                        <label className="text-sm font-bold block mb-2">Nationality</label>
                                        <select name="nationality" value={kycFormData.nationality} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                                            <option value="">Select Nationality</option>
                                            {countries.map(c => <option key={c.countryCode} value={c.countryName}>{c.countryName}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 bottom-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>

                                    <div><label className="text-sm font-bold block mb-2">State/Region</label><input type="text" name="state" value={kycFormData.state} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">City</label><input type="text" name="city" value={kycFormData.city} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Postal Code</label><input type="text" name="postalCode" value={kycFormData.postalCode} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
                                </div>
                            </div>

                            {/* 3. IDENTIFICATION */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600"/> Identification</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="relative">
                                        <label className="text-sm font-bold block mb-2">ID Type</label>
                                        <select name="idType" value={kycFormData.idType} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                            <option value="">Select ID Type</option>
                                            {/* ENUM VALUES MUST MATCH BACKEND EXACTLY */}
                                            <option value="NIN">NIN (National Identity Number)</option>
                                            <option value="PASSPORT">International Passport</option>
                                            <option value="DRIVERS_LICENSE">Driver's License</option>
                                            <option value="VOTERS_CARD">Voter's Card</option>
                                            <option value="BUSINESS_LICENSE">Business License</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 bottom-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                    <div><label className="text-sm font-bold block mb-2">ID Number</label><input type="text" name="idNumber" value={kycFormData.idNumber} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Expiry Date</label><input type="date" name="idExpiryDate" value={kycFormData.idExpiryDate} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                                </div>
                            </div>

                            {/* 4. FINANCIALS */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-600"/> Financial Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div><label className="text-sm font-bold block mb-2">BVN</label><input type="text" name="bvn" value={kycFormData.bvn} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Bank Name</label><input type="text" name="bankName" value={kycFormData.bankName} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Account Number</label><input type="text" name="accountNumber" value={kycFormData.accountNumber} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" /></div>
                                </div>
                            </div>

                            {/* 5. DOCUMENTS */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600"/> Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { key: 'idFront', label: "ID Front", ref: idFrontRef },
                                        { key: 'idBack', label: "ID Back", ref: idBackRef },
                                        { key: 'selfie', label: "Selfie", ref: selfieRef },
                                        { key: 'proof', label: "Proof of Address", ref: proofRef },
                                    ].map((doc) => (
                                        <div key={doc.key} onClick={() => doc.ref.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative group">
                                            {kycPreviews[doc.key as keyof typeof kycPreviews] ? (
                                                <Image src={kycPreviews[doc.key as keyof typeof kycPreviews]!} alt={doc.label} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-indigo-500" />
                                                    <span className="text-xs font-bold text-gray-600">{doc.label}</span>
                                                </>
                                            )}
                                            <input type="file" ref={doc.ref} onChange={(e) => handleKycFileUpload(e, doc.key as any)} className="hidden" accept="image/*" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button onClick={handleKycSubmit} disabled={kycLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                    {kycLoading ? <><Loader2 className="w-5 h-5 animate-spin"/> Submitting...</> : "Submit Verification"}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'delete':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div><h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2><p className="text-gray-600">Danger Zone</p></div>
                        <div className="max-w-2xl bg-red-50 border border-red-200 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-red-700 mb-2">Delete Account</h3>
                            <p className="text-red-600 mb-4 text-sm">Once deleted, your data is gone forever.</p>
                            <button className="bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700">Delete My Account</button>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-appBanner/5 p-4 lg:p-6 relative">
            <div className="relative z-10 w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="w-full flex flex-col md:flex-row justify-between bg-gradient-to-r from-appTitleBgColor to-appNav p-6 md:p-8 mb-8 rounded-2xl shadow-xl min-h-[8rem]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center shadow-lg"><Settings className="w-6 h-6 text-white" /></div>
                        <div><h1 className='font-bold text-xl md:text-2xl text-white'>Account Settings</h1><p className='text-white/90'>Manage your account</p></div>
                    </div>
                    <div className="text-white text-right"><p className="text-sm font-semibold">STATUS</p><p className="text-2xl font-bold">{profile?.verified || 'UNVERIFIED'}</p></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <nav className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button key={item.id} onClick={() => setActivePage(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activePage === item.id ? `bg-gradient-to-r ${item.bg} border-l-4 border-${item.color.split('-')[1]}-500 shadow-sm` : 'hover:bg-gray-50'}`}>
                                            <Icon className={`w-4 h-4 ${item.color}`} />
                                            <span className={`text-sm font-medium ${activePage === item.id ? 'text-gray-900' : 'text-gray-600'}`}>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">{renderContent()}</div>
                </div>
            </div>

            {/* Success Modal */}
            {showKycSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl relative flex flex-col items-center text-center">
                        <button onClick={() => setShowKycSuccess(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-pulse"><CheckCircle className="w-10 h-10 text-green-600" /></div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Submission Successful</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">You have completed your identity verification. We will review it as soon as possible and notify you of the results. The review is expected to be completed in 1 hour.</p>
                        <button onClick={() => setShowKycSuccess(false)} className="mt-8 bg-gray-900 text-white py-3 px-10 rounded-xl font-bold hover:bg-gray-800 transition-all w-full">Got it</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;

// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import {
//     User,
//     Lock,
//     Bell,
//     Trash2,
//     Shield,
//     Mail,
//     Camera,
//     Eye,
//     EyeOff,
//     CheckCircle,
//     Download,
//     Copy,
//     Settings,
//     Key,
//     Upload,
//     MapPin,
//     Volume2,
//     VolumeX,
//     ChevronDown,
//     FileText,
//     Save
// } from 'lucide-react';
// import { UserResponseDTO } from '@/types/admin';
// import { getMyProfile, updateProfile } from '@/lib/user/actions';
// import { UpdateProfileRequest } from '@/types/user';

// type SettingsPage = 'profile' | 'security' | 'notifications' | 'delete'

// const SettingsPage = () => {
//     const [activePage, setActivePage] = useState<SettingsPage>('profile')
//     const [copied, setCopied] = useState(false)
//     const [showPassword, setShowPassword] = useState(false)
//     const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face')
//     const [idDocument, setIdDocument] = useState<string | null>(null)

//     // Notification states
//     const [desktopNotifications, setDesktopNotifications] = useState(true)
//     const [unreadNotifications, setUnreadNotifications] = useState(true)
//     const [pushNotificationTimeout, setPushNotificationTimeout] = useState('30')
//     const [communicationEmail, setCommunicationEmail] = useState(true)
//     const [announcementUpdates, setAnnouncementUpdates] = useState(false)
//     const [disableAllSounds, setDisableAllSounds] = useState(false)

//     // 1. Define state for data, loading, and errors
//     const [profile, setProfile] = useState<UserResponseDTO | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isSaving, setIsSaving] = useState(false);


//     const fileInputRef = useRef<HTMLInputElement>(null)
//     const idDocumentRef = useRef<HTMLInputElement>(null)

//     const userData = {
//         firstName: 'Alex',
//         lastName: 'Johnson',
//         email: 'alex.johnson@example.com',
//         mobile: '+1 (555) 123-4567',
//         country: 'United States',
//         city: 'New York',
//         address1: '123 Main Street',
//         address2: 'Apt 4B',
//         avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
//         joined: 'January 2023',
//         userId: 'USR-789456123'
//     }

//     // 2. Handle Input Changes
//     // const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     //     const { name, value } = e.target;
//     //     console.log(`the field ${name} value parsed is ${value}`)
//     //     setFormData(prev => ({
//     //         ...prev,
//     //         [name]: value
//     //     }));
//     // };
//     // UPDATE THIS FUNCTION
// const handleProfileInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// ) => {
//     const { name, value } = e.target;
//     console.log(formData)
//     setFormData(prev => ({
//         ...prev,
//         [name]: value
//     }));
// };

//     // 3. Handle Form Submission
//     const handleSaveProfile = async () => {
//         if (!profile?.id) return;

//         setIsSaving(true);
//         try {
//             // Call the server action
//             await updateProfile(profile.id, formData);

//             // Optional: Add a toast notification here
//             alert("Profile updated successfully!");

//             // Optional: Refresh the page data if needed
//             // router.refresh(); 
//         } catch (error) {
//             console.error("Update failed", error);
//             alert("Failed to update profile. Please try again.");
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0]
//         if (file) {
//             const reader = new FileReader()
//             reader.onload = (e) => {
//                 setProfileImage(e.target?.result as string)
//             }
//             reader.readAsDataURL(file)
//         }
//     }

//     const handleIdDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0]
//         if (file) {
//             const reader = new FileReader()
//             reader.onload = (e) => {
//                 setIdDocument(e.target?.result as string)
//             }
//             reader.readAsDataURL(file)
//         }
//     }

//     const triggerFileInput = () => {
//         fileInputRef.current?.click()
//     }

//     const triggerIdDocumentInput = () => {
//         idDocumentRef.current?.click()
//     }

//     const copyToClipboard = (text: string) => {
//         navigator.clipboard.writeText(text)
//             .then(() => {
//                 setCopied(true);
//                 setTimeout(() => setCopied(false), 2000);
//             })
//             .catch(err => {
//                 console.error('Failed to copy text: ', err);
//             });
//     };

//     const menuItems = [
//         { id: 'profile' as SettingsPage, label: 'Profile Settings', icon: User, color: 'text-appBanner', bg: 'from-appBanner/20 to-appNav/20' },
//         { id: 'security' as SettingsPage, label: 'Security', icon: Lock, color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/20' },
//         { id: 'notifications' as SettingsPage, label: 'Notifications', icon: Bell, color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/20' },
//         { id: 'delete' as SettingsPage, label: 'Delete Account', icon: Trash2, color: 'text-red-400', bg: 'from-red-500/20 to-pink-500/20' },
//     ]

//     useEffect(() => {
//         // 2. Define the async function inside the effect
//         const fetchProfile = async () => {
//             try {
//                 setLoading(true);
//                 const data = await getMyProfile();
//                 setProfile(data);
//                 console.log(data);
//             } catch (err: any) {
//                 console.error("Failed to load profile:", err);
//                 setError(err.message || "Failed to load profile");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         // 3. Call it
//         fetchProfile();
//     }, []); // Empty dependency array = runs once on mount

//     useEffect(() => {
//         if (profile) {
//             setFormData({
//                 firstName: profile.firstName || '',
//                 lastName: profile.lastName || '',
//                 email: profile.email || '',
//                 phoneNumber: profile.phoneNumber || '',
//                 country: profile.country || '',
//                 city: profile.city || '',
//                 state: profile.state || '',
//                 defaultAddress: profile.defaultAddress || '', // Ensure your API returns this or map it correctly
//                 username: profile.username || '',
//                 password: ''
//             });
//         }
//     }, [profile]);

//     // 1. Initialize state with existing profile data (fallbacks to empty strings to avoid uncontrolled errors)
//     const [formData, setFormData] = useState<UpdateProfileRequest>({
//         firstName: profile?.firstName || '',
//         lastName: profile?.lastName || '',
//         email: profile?.email || '',
//         phoneNumber: profile?.phoneNumber || '',
//         country: profile?.country || '',
//         city: profile?.city || '',
//         state: profile?.state || '', // Ensure this exists in your profile object or add a field
//         defaultAddress: profile?.defaultAddress || '',
//         username: profile?.username || '', // API requires username, ensure it's mapped
//         // password: '' // Optional, leave empty unless changing
//     });



//     // 4. Render based on state
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     const renderContent = () => {
//         switch (activePage) {
//             case 'profile':
//                 return (
//                     <div className="space-y-8">
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                                 Profile Settings
//                             </h2>
//                             <p className="text-gray-600">
//                                 Manage your personal information and identification documents
//                             </p>
//                         </div>

//                         {/* MAIN GRID LAYOUT */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//                             {/* 1. PERSONAL INFORMATION (Top Left) */}
//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     <User className="w-5 h-5 text-appBanner" />
//                                     Personal Information
//                                 </h3>
//                                 <div className="space-y-4">
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="text-sm font-medium text-gray-700">First Name</label>
//                                             <input
//                                                 type="text"
//                                                 name="firstName"
//                                                 value={formData.firstName}
//                                                 onChange={handleProfileInputChange}
//                                                 className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="text-sm font-medium text-gray-700">Last Name</label>
//                                             <input
//                                                 type="text"
//                                                 name="lastName"
//                                                 value={formData.lastName}
//                                                 onChange={handleProfileInputChange}
//                                                 className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">Email Address</label>
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             value={formData.email}
//                                             onChange={handleProfileInputChange}
//                                             className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">Username</label>
//                                         <input
//                                             type="text"
//                                             name="username"
//                                             value={formData.username}
//                                             onChange={handleProfileInputChange}
//                                             className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">Mobile Number</label>
//                                         <input
//                                             type="tel"
//                                             name="phoneNumber"
//                                             value={formData.phoneNumber}
//                                             onChange={handleProfileInputChange}
//                                             className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                         />
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="text-sm font-medium text-gray-700">Country</label>
//                                             <input
//                                                 type="text"
//                                                 name="country"
//                                                 value={formData.country}
//                                                 onChange={handleProfileInputChange}
//                                                 className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="text-sm font-medium text-gray-700">City</label>
//                                             <input
//                                                 type="text"
//                                                 name="city"
//                                                 value={formData.city}
//                                                 onChange={handleProfileInputChange}
//                                                 className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                             />
//                                         </div>
                                        
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">State / Province</label>
//                                         <input
//                                             type="text"
//                                             name="state"
//                                             value={formData?.state}
//                                             onChange={handleProfileInputChange}
//                                             className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* 2. PROFILE PHOTO (Top Right - Restored Original Layout) */}
//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
//                                 <div className="flex items-center gap-4">
//                                     <div className="relative">
//                                         <Image
//                                             src={profile?.profileImage || profile?.profileImage || '/default-avatar.png'}
//                                             alt="Profile"
//                                             className="w-20 h-20 rounded-xl object-cover border-2 border-appBanner/30"
//                                         />
//                                         <button
//                                             onClick={triggerFileInput}
//                                             className="absolute -bottom-2 -right-2 bg-gradient-to-r from-appBanner to-appNav rounded-full p-2 shadow-lg hover:from-appBanner/90 hover:to-appNav/90 transition-all duration-300"
//                                         >
//                                             <Camera className="w-3 h-3 text-white" />
//                                         </button>
//                                         <input
//                                             type="file"
//                                             ref={fileInputRef}
//                                             onChange={handleProfileImageUpload}
//                                             accept="image/*"
//                                             className="hidden"
//                                         />
//                                     </div>
//                                     <div className="flex-1">
//                                         <p className="text-gray-600 text-sm mb-3">
//                                             JPG, GIF or PNG. Max 2MB.
//                                         </p>
//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={triggerFileInput}
//                                                 className="bg-gradient-to-r from-appBanner to-appNav text-white py-2 px-3 rounded-lg text-sm font-semibold hover:from-appBanner/90 hover:to-appNav/90 transition-all duration-300"
//                                             >
//                                                 Upload New
//                                             </button>
//                                             <button
//                                                 onClick={() => setProfileImage(profile?.profileImage || '')}
//                                                 className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all duration-300"
//                                             >
//                                                 Remove
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* 3. IDENTITY VERIFICATION (Bottom - Spans 2 Columns) */}
//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     <Upload className="w-5 h-5 text-appNav" />
//                                     Identity Verification
//                                 </h3>
//                                 <p className="text-gray-600 text-sm mb-4">
//                                     Upload a valid government-issued ID for verification
//                                 </p>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-2 block">
//                                             Document Type
//                                         </label>
//                                         <div className="relative">
//                                             <select className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200 appearance-none cursor-pointer">
//                                                 <option value="">Select Document Type</option>
//                                                 <option value="drivers_license">Driver's License</option>
//                                                 <option value="passport">International Passport</option>
//                                                 <option value="national_id">National ID Card</option>
//                                             </select>
//                                             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-2 block">
//                                             Upload Document
//                                         </label>
//                                         <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-appBanner transition-all duration-300 bg-gray-50/50">
//                                             {idDocument ? (
//                                                 <div className="flex flex-col items-center">
//                                                     <Image
//                                                         src={idDocument}
//                                                         alt="ID Document"
//                                                         className="w-32 h-20 object-cover rounded-lg mb-2 border border-gray-200"
//                                                     />
//                                                     <p className="text-green-600 text-sm mb-2 font-medium">Document Uploaded</p>
//                                                     <button
//                                                         onClick={triggerIdDocumentInput}
//                                                         className="text-appBanner text-sm hover:text-appNav transition-colors font-medium"
//                                                     >
//                                                         Change Document
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex flex-col items-center">
//                                                     <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                                                     <p className="text-gray-500 text-sm mb-2">
//                                                         Click to upload or drag and drop
//                                                     </p>
//                                                     <button
//                                                         onClick={triggerIdDocumentInput}
//                                                         className="bg-gradient-to-r from-appBanner to-appNav text-white py-2 px-4 rounded-lg text-sm font-semibold hover:from-appBanner/90 hover:to-appNav/90 transition-all duration-300"
//                                                     >
//                                                         Choose File
//                                                     </button>
//                                                 </div>
//                                             )}
//                                             <input
//                                                 type="file"
//                                                 ref={idDocumentRef}
//                                                 onChange={handleIdDocumentUpload}
//                                                 accept="image/*,.pdf"
//                                                 className="hidden"
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* 4. ADDRESS INFORMATION (Bottom - Spans 2 Columns) */}
//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:col-span-2 w-full">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     <MapPin className="w-5 h-5 text-green-500" />
//                                     Default Address
//                                 </h3>
//                                 {/* <div className="grid grid-cols-1 gap-4 w-full">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">Default Address</label>
//                                         <input
//                                             type="text"
//                                             name="defaultAddress"
//                                             value={formData.defaultAddress}
//                                             onChange={handleProfileInputChange}
//                                             placeholder="Enter your full street address"
//                                             className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                         />
//                                     </div>
//                                 </div> */}
//                                 <div>
//                                             <label className="text-sm font-medium text-gray-700">Default Address Type</label>
//                                             <div className="relative mt-2">
//                                                 <select
//                                                     name="defaultAddress"
//                                                     value={formData.defaultAddress}
//                                                     onChange={handleProfileInputChange}
//                                                     className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200 appearance-none cursor-pointer"
//                                                 >
//                                                     <option value="">Select Type</option>
//                                                     <option value="HOME">HOME</option>
//                                                     <option value="OFFICE">OFFICE</option>
//                                                     <option value="OTHER">OTHER</option>
//                                                 </select>
//                                                 <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
//                                             </div>
//                                         </div>
//                             </div>
//                         </div>

//                         {/* ACTION BUTTONS */}
//                         <div className="flex gap-3 pt-4">
//                             <button
//                                 onClick={handleSaveProfile}
//                                 disabled={isSaving}
//                                 className="flex items-center gap-2 bg-gradient-to-r from-appBanner to-appNav text-white py-3 px-6 rounded-xl font-semibold hover:from-appBanner/90 hover:to-appNav/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {isSaving ? (
//                                     <>
//                                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                         Saving...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Save className="w-4 h-4" />
//                                         Save Changes
//                                     </>
//                                 )}
//                             </button>
//                             <button
//                                 onClick={() => setFormData({
//                                     firstName: profile?.firstName || '',
//                                     lastName: profile?.lastName || '',
//                                     email: profile?.email || '',
//                                     phoneNumber: profile?.phoneNumber || '',
//                                     country: profile?.country || '',
//                                     city: profile?.city || '',
//                                     state: profile?.state || '',
//                                     defaultAddress: profile?.defaultAddress || '',
//                                     username: profile?.username || ''
//                                 })}
//                                 className="bg-gray-100 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
//                             >
//                                 Reset
//                             </button>
//                         </div>
//                     </div>
//                 )

//             case 'security':
//                 return (
//                     <div className="space-y-8">
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                                 Security Settings
//                             </h2>
//                             <p className="text-gray-600">
//                                 Manage your password and security preferences
//                             </p>
//                         </div>

//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     <Key className="w-5 h-5 text-blue-500" />
//                                     Change Password
//                                 </h3>
//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">Current Password</label>
//                                         <div className="relative mt-2">
//                                             <input
//                                                 type={showPassword ? "text" : "password"}
//                                                 className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200 pr-12"
//                                             />
//                                             <button
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                                             >
//                                                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">New Password</label>
//                                         <input
//                                             type="password"
//                                             className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
//                                         <input
//                                             type="password"
//                                             className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
//                                         />
//                                     </div>
//                                 </div>
//                                 <button className="w-full bg-gradient-to-r from-appBanner to-appNav text-white py-3 rounded-xl font-semibold hover:from-appBanner/90 hover:to-appNav/90 transition-all duration-300 mt-4">
//                                     Update Password
//                                 </button>
//                             </div>

//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     <Shield className="w-5 h-5 text-green-500" />
//                                     Security Features
//                                 </h3>
//                                 <div className="space-y-4">
//                                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
//                                             <p className="text-gray-600 text-sm">Add an extra layer of security</p>
//                                         </div>
//                                         <label className="relative inline-flex items-center cursor-pointer">
//                                             <input type="checkbox" className="sr-only peer" />
//                                             <div className="w-12 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-appBanner/20 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-appBanner"></div>
//                                         </label>
//                                     </div>
//                                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900">Login Alerts</h4>
//                                             <p className="text-gray-600 text-sm">Get notified of new logins</p>
//                                         </div>
//                                         <label className="relative inline-flex items-center cursor-pointer">
//                                             <input type="checkbox" className="sr-only peer" defaultChecked />
//                                             <div className="w-12 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-appBanner/20 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-appBanner"></div>
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )

//             case 'notifications':
//                 return (
//                     <div className="space-y-8">
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                                 Notification Settings
//                             </h2>
//                             <p className="text-gray-600">
//                                 Configure how you receive notifications and alerts
//                             </p>
//                         </div>

//                         <div className="space-y-6">
//                             {/* Push Notifications */}
//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     <Bell className="w-5 h-5 text-appBanner" />
//                                     Push Notifications
//                                 </h3>
//                                 <div className="space-y-4">
//                                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900">Enable Desktop Notifications</h4>
//                                             <p className="text-gray-600 text-sm">Receive updates on your desktop, stay informed anywhere</p>
//                                         </div>
//                                         <label className="relative inline-flex items-center cursor-pointer">
//                                             <input
//                                                 type="checkbox"
//                                                 className="sr-only peer"
//                                                 checked={desktopNotifications}
//                                                 onChange={(e) => setDesktopNotifications(e.target.checked)}
//                                             />
//                                             <div className="w-12 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-appBanner/20 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-appBanner"></div>
//                                         </label>
//                                     </div>
//                                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900">Enable Unread Notification</h4>
//                                             <p className="text-gray-600 text-sm">Stay informed with a visual indicator of unread notification</p>
//                                         </div>
//                                         <label className="relative inline-flex items-center cursor-pointer">
//                                             <input
//                                                 type="checkbox"
//                                                 className="sr-only peer"
//                                                 checked={unreadNotifications}
//                                                 onChange={(e) => setUnreadNotifications(e.target.checked)}
//                                             />
//                                             <div className="w-12 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-appBanner/20 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-appBanner"></div>
//                                         </label>
//                                     </div>
//                                     <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                         <div className="flex items-center justify-between mb-3">
//                                             <div>
//                                                 <h4 className="font-medium text-gray-900">Push Notification Time-out</h4>
//                                                 <p className="text-gray-600 text-sm">Auto-dismiss notifications after</p>
//                                             </div>
//                                         </div>
//                                         <div className="relative">
//                                             <select
//                                                 value={pushNotificationTimeout}
//                                                 onChange={(e) => setPushNotificationTimeout(e.target.value)}
//                                                 className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200 appearance-none cursor-pointer"
//                                             >
//                                                 <option value="15">15 minutes</option>
//                                                 <option value="20">20 minutes</option>
//                                                 <option value="30">30 minutes</option>
//                                                 <option value="45">45 minutes</option>
//                                                 <option value="60">1 hour</option>
//                                                 <option value="90">1.5 hours</option>
//                                                 <option value="120">2 hours</option>
//                                             </select>
//                                             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Email Notifications */}
//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     <Mail className="w-5 h-5 text-blue-500" />
//                                     Email Notifications
//                                 </h3>
//                                 <div className="space-y-4">
//                                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900">Enable Communication Email</h4>
//                                             <p className="text-gray-600 text-sm">Receive message, updates, orders and more via linked email</p>
//                                         </div>
//                                         <label className="relative inline-flex items-center cursor-pointer">
//                                             <input
//                                                 type="checkbox"
//                                                 className="sr-only peer"
//                                                 checked={communicationEmail}
//                                                 onChange={(e) => setCommunicationEmail(e.target.checked)}
//                                             />
//                                             <div className="w-12 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-appBanner/20 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-appBanner"></div>
//                                         </label>
//                                     </div>
//                                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900">Enable Announcement & Updates</h4>
//                                             <p className="text-gray-600 text-sm">Receive email about products update, order updates etc.</p>
//                                         </div>
//                                         <label className="relative inline-flex items-center cursor-pointer">
//                                             <input
//                                                 type="checkbox"
//                                                 className="sr-only peer"
//                                                 checked={announcementUpdates}
//                                                 onChange={(e) => setAnnouncementUpdates(e.target.checked)}
//                                             />
//                                             <div className="w-12 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-appBanner/20 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-appBanner"></div>
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Sound Settings */}
//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     {disableAllSounds ? (
//                                         <VolumeX className="w-5 h-5 text-red-500" />
//                                     ) : (
//                                         <Volume2 className="w-5 h-5 text-green-500" />
//                                     )}
//                                     Sound Settings
//                                 </h3>
//                                 <div className="space-y-4">
//                                     <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                         <div>
//                                             <h4 className="font-medium text-gray-900">Disable All Notification Sounds</h4>
//                                             <p className="text-gray-600 text-sm">Mute all notification of messages, update, orders and more</p>
//                                         </div>
//                                         <label className="relative inline-flex items-center cursor-pointer">
//                                             <input
//                                                 type="checkbox"
//                                                 className="sr-only peer"
//                                                 checked={disableAllSounds}
//                                                 onChange={(e) => setDisableAllSounds(e.target.checked)}
//                                             />
//                                             <div className="w-12 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-appBanner/20 rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-appBanner"></div>
//                                         </label>
//                                     </div>

//                                     {!disableAllSounds && (
//                                         <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                             <div className="space-y-3">
//                                                 <div className="flex items-center justify-between">
//                                                     <span className="text-gray-700 text-sm font-medium">Notification Volume</span>
//                                                     <span className="text-appBanner text-sm font-medium">75%</span>
//                                                 </div>
//                                                 <div className="w-full bg-gray-300 rounded-full h-2">
//                                                     <div className="bg-appBanner h-2 rounded-full" style={{ width: '75%' }}></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex gap-3 pt-4">
//                             <button className="flex items-center gap-2 bg-gradient-to-r from-appBanner to-appNav text-white py-3 px-6 rounded-xl font-semibold hover:from-appBanner/90 hover:to-appNav/90 transition-all duration-300 shadow-lg hover:shadow-xl">
//                                 <Save className="w-4 h-4" />
//                                 Save Notification Settings
//                             </button>
//                             <button className="bg-gray-100 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
//                                 Reset to Default
//                             </button>
//                         </div>
//                     </div>
//                 )

//             case 'delete':
//                 return (
//                     <div className="space-y-8">
//                         <div>
//                             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                                 Account Settings
//                             </h2>
//                             <p className="text-gray-600">
//                                 Manage your account preferences and data
//                             </p>
//                         </div>

//                         <div className="max-w-2xl">
//                             <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-200 p-6">
//                                 <div className="flex items-start gap-4">
//                                     <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center border border-red-200">
//                                         <Trash2 className="w-6 h-6 text-red-500" />
//                                     </div>
//                                     <div className="flex-1">
//                                         <h3 className="text-xl font-semibold text-red-700 mb-2">
//                                             Delete Account
//                                         </h3>
//                                         <p className="text-red-600 mb-4 text-sm">
//                                             Once you delete your account, all of your data will be permanently removed.
//                                             This action cannot be undone.
//                                         </p>
//                                         <div className="space-y-3 mb-4">
//                                             <label className="flex items-center gap-3">
//                                                 <input
//                                                     type="checkbox"
//                                                     className="rounded border-red-300 text-red-600 focus:ring-red-500 bg-white"
//                                                 />
//                                                 <span className="text-sm font-medium text-red-700">
//                                                     I understand this action cannot be undone
//                                                 </span>
//                                             </label>
//                                             <label className="flex items-center gap-3">
//                                                 <input
//                                                     type="checkbox"
//                                                     className="rounded border-red-300 text-red-600 focus:ring-red-500 bg-white"
//                                                 />
//                                                 <span className="text-sm font-medium text-red-700">
//                                                     I have exported any data I wish to keep
//                                                 </span>
//                                             </label>
//                                         </div>
//                                         <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm">
//                                             Delete My Account
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                                     <Download className="w-5 h-5 text-appNav" />
//                                     Export Your Data
//                                 </h3>
//                                 <p className="text-gray-600 mb-4 text-sm">
//                                     Download a copy of your personal data before deleting your account.
//                                 </p>
//                                 <button className="flex items-center gap-2 bg-gradient-to-r from-appBanner to-appNav text-white py-3 px-6 rounded-xl font-semibold hover:from-appBanner/90 hover:to-appNav/90 transition-all duration-300 text-sm">
//                                     <Download className="w-4 h-4" />
//                                     Export All Data
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )

//             default:
//                 return null
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-appBanner/5 p-4 lg:p-6 relative overflow-hidden">
//             {/* Enhanced Background Elements */}
//             <div className="absolute top-0 left-0 w-96 h-96 bg-appBanner/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//             <div className="absolute top-1/2 right-0 w-80 h-80 bg-appNav/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
//             <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-appTitleBgColor/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

//             <div className="relative z-10 w-full max-w-7xl mx-auto">
//                 {/* Header Section */}
//                 <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-appTitleBgColor to-appNav p-6 md:p-8 mb-8 rounded-2xl shadow-xl min-h-[8rem]">
//                     <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
//                         <div className='flex-shrink-0'>
//                             <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center shadow-lg">
//                                 <Settings className="w-6 h-6 md:w-7 md:h-7 text-white" />
//                             </div>
//                         </div>
//                         <div className="flex flex-col">
//                             <h1 className='font-bold text-xl md:text-2xl text-white'>
//                                 Account Settings
//                             </h1>
//                             <p className='font-medium text-sm md:text-base text-white/90 mt-1'>
//                                 Manage your account preferences and security settings
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between xs:justify-end gap-3 w-full md:w-auto">
//                         <div className='flex flex-col p-2 text-white text-center'>
//                             <p className='text-sm font-semibold text-white'>
//                                 ACCOUNT STATUS
//                             </p>
//                             <p className='font-bold text-2xl md:text-3xl text-white'>
//                                 {profile?.verified}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-6">
//                     {/* Sidebar */}
//                     <div className="lg:w-64">
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                             <nav className="space-y-2">
//                                 {menuItems.map((item) => {
//                                     const IconComponent = item.icon
//                                     return (
//                                         <button
//                                             key={item.id}
//                                             onClick={() => setActivePage(item.id)}
//                                             className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-300 group ${activePage === item.id
//                                                 ? `bg-gradient-to-r ${item.bg} border border-${item.color.split('-')[1]}-400/30 shadow-lg`
//                                                 : 'bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100'
//                                                 }`}
//                                         >
//                                             <IconComponent
//                                                 className={`w-4 h-4 ${item.color} ${activePage === item.id ? 'scale-110' : ''} transition-transform duration-200`}
//                                             />
//                                             <span className={`text-sm font-medium ${activePage === item.id ? 'text-gray-900' : 'text-gray-700'
//                                                 }`}>
//                                                 {item.label}
//                                             </span>
//                                         </button>
//                                     )
//                                 })}
//                             </nav>

//                             {/* User Info Card */}
//                             <div className="mt-6 p-4 bg-gradient-to-r from-appBanner/5 to-appNav/5 rounded-xl border border-appBanner/20">
//                                 <div className="flex items-center gap-3">
//                                     <Image
//                                         src={profile?.profileImage!}
//                                         alt="Profile"
//                                         className="w-10 h-10 rounded-lg object-cover border border-appBanner/30"
//                                     />
//                                     <div className="flex-1 min-w-0">
//                                         <h3 className="font-semibold text-gray-900 text-sm truncate">{profile?.firstName} {profile?.lastName}</h3>
//                                         <p className="text-gray-600 text-xs truncate">{profile?.email}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Main Content */}
//                     <div className="flex-1">
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//                             {renderContent()}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Custom CSS for animation delays */}
//             <style jsx>{`
//                 .animation-delay-2000 {
//                     animation-delay: 2s;
//                 }
//                 .animation-delay-4000 {
//                     animation-delay: 4s;
//                 }
//             `}</style>
//         </div>
//     )
// }

// export default SettingsPage