import { useState } from 'react';

interface BusinessProfileFormData {
    businessName: string;
    businessType: string;
    registrationNumber: string;
    taxIdentificationNumber: string;
    businessAddress: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    businessDescription: string;
    certificateOfIncorporation: File | null;
    taxClearanceCertificate: File | null;
    businessBankStatement: File | null;
    businessLogo: File | null;
    agreedToTerms: boolean;
}

interface BusinessProfileProps {
    onSubmit: (data: BusinessProfileFormData) => void;
    onSuccess: () => void;
}

const BusinessProfile = ({ onSubmit, onSuccess }: BusinessProfileProps) => {
    const [formData, setFormData] = useState<BusinessProfileFormData>({
        businessName: '',
        businessType: '',
        registrationNumber: '',
        taxIdentificationNumber: '',
        businessAddress: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        businessDescription: '',
        certificateOfIncorporation: null,
        taxClearanceCertificate: null,
        businessBankStatement: null,
        businessLogo: null,
        agreedToTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.files![0]
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onSuccess();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-appTitleBgColor rounded-lg shadow-md shadow-appNav">
            <div className="w-full flex items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-6">Welcome Let's Create Your Business Profile </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="border-b pb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Business Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Business Name */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Business Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Business Type */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Business Type</label>
                            <div className="relative">
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                    required
                                >
                                    <option value="">Select Business Type</option>
                                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Limited Liability Company">Limited Liability Company</option>
                                    <option value="Corporation">Corporation</option>
                                    <option value="Cooperative">Cooperative</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Registration Number */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Registration Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tax Identification Number */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Tax Identification Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="taxIdentificationNumber"
                                    value={formData.taxIdentificationNumber}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Business Address */}
                        <div className="md:col-span-2 relative">
                            <label className="block text-sm font-bold text-white mb-1">Business Address</label>
                            <div className="relative">
                                <textarea
                                    name="businessAddress"
                                    value={formData.businessAddress}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    rows={3}
                                />
                                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Business Description */}
                        <div className="md:col-span-2 relative">
                            <label className="block text-sm font-bold text-white mb-1">Business Description</label>
                            <div className="relative">
                                <textarea
                                    name="businessDescription"
                                    value={formData.businessDescription}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                />
                                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4h6v2H9V4zm0 4h6v2H9V8zm0 4h6v2H9v-2zm-2 0H5v-2h2v2zm0-4H5V8h2v2zm0-4H5V4h2v2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b pb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Contact Person */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Contact Person</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Contact Phone */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Contact Phone</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Contact Email */}
                        <div className="relative md:col-span-2">
                            <label className="block text-sm font-bold text-white mb-1">Contact Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b pb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Business Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Certificate of Incorporation */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-1">Certificate of Incorporation</label>
                            <input
                                type="file"
                                name="certificateOfIncorporation"
                                onChange={handleFileChange}
                                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                        </div>

                        {/* Tax Clearance Certificate */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-1">Tax Clearance Certificate</label>
                            <input
                                type="file"
                                name="taxClearanceCertificate"
                                onChange={handleFileChange}
                                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                        </div>

                        {/* Business Bank Statement */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-1">Business Bank Statement</label>
                            <input
                                type="file"
                                name="businessBankStatement"
                                onChange={handleFileChange}
                                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                        </div>

                        {/* Business Logo */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-1">Business Logo</label>
                            <input
                                type="file"
                                name="businessLogo"
                                onChange={handleFileChange}
                                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".jpg,.jpeg,.png"
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-4">Terms and Conditions</h2>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                name="agreedToTerms"
                                type="checkbox"
                                checked={formData.agreedToTerms}
                                onChange={handleCheckboxChange}
                                className="focus:ring-blue-500 h-4 w-4 text-text-white border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-white">
                                I agree to the terms and conditions
                            </label>
                            <p className="text-white">
                                By checking this box, you confirm that all information provided is accurate.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-appNav/80 text-white font-medium rounded-md hover:bg-appNav/40 focus:outline-none focus:ring-2 focus:ring-bg-appNav/20 focus:ring-offset-2"
                    >
                        Continue Registration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessProfile;