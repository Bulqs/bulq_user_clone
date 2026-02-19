// "use client";
// import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
// import { useState } from 'react';
// import { User, Bell, Shield, Settings, Camera, Save, Key, Eye, EyeOff, Trash2 } from 'lucide-react';

// const SettingsPage = () => {
//     const [activeTab, setActiveTab] = useState('profile');
//     const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     // Security questions state
//     const [securityQuestions, setSecurityQuestions] = useState([
//         { id: 1, question: '', answer: '' },
//         { id: 2, question: '', answer: '' }
//     ]);

//     // Emergency contacts state
//     const [emergencyContacts, setEmergencyContacts] = useState([
//         { id: 1, name: '', phone: '', relationship: '' }
//     ]);

//     // Connected devices state
//     const [connectedDevices, setConnectedDevices] = useState([
//         { id: 1, name: 'iPhone 13 Pro', lastActive: '2 hours ago', location: 'New York, NY' },
//         { id: 2, name: 'MacBook Pro', lastActive: '5 days ago', location: 'Home Office' }
//     ]);

//     const tabs = [
//         { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
//         { id: 'notification', label: 'Notification', icon: <Bell className="w-4 h-4" /> },
//         { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
//         { id: 'system', label: 'System', icon: <Settings className="w-4 h-4" /> }
//     ];

//     const handleSubmit = (e: React.FormEvent, tab: string) => {
//         e.preventDefault();
//         console.log(`Submitting ${tab} form`);
//         // Add your form submission logic here
//     };

//     const handleSecurityQuestionChange = (id: number, field: string, value: string) => {
//         setSecurityQuestions(prev =>
//             prev.map(q => q.id === id ? { ...q, [field]: value } : q)
//         );
//     };

//     const handleEmergencyContactChange = (id: number, field: string, value: string) => {
//         setEmergencyContacts(prev =>
//             prev.map(contact => contact.id === id ? { ...contact, [field]: value } : contact)
//         );
//     };

//     const addEmergencyContact = () => {
//         const newId = emergencyContacts.length > 0 ? Math.max(...emergencyContacts.map(c => c.id)) + 1 : 1;
//         setEmergencyContacts(prev => [...prev, { id: newId, name: '', phone: '', relationship: '' }]);
//     };

//     const removeEmergencyContact = (id: number) => {
//         if (emergencyContacts.length > 1) {
//             setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
//         }
//     };

//     const removeDevice = (id: number) => {
//         setConnectedDevices(prev => prev.filter(device => device.id !== id));
//     };

//     const questionOptions = [
//         "What was your first pet's name?",
//         "What city were you born in?",
//         "What is your mother's maiden name?",
//         "What was the name of your first school?",
//         "What is your favorite book?",
//         "What was your childhood nickname?",
//         "What is the name of your favorite childhood friend?",
//         "What street did you grow up on?",
//         "What was your first car?",
//         "What is your favorite movie?"
//     ];

//     return (
//         <DriverDashboardLayout>
//             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
//                 <div className="flex justify-between items-center mb-8">
//                     <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
//                     <div className="flex items-center gap-4">
//                         <span className="text-sm text-gray-500">Manage your account preferences</span>
//                     </div>
//                 </div>

//                 {/* Tabs Navigation */}
//                 <div className="border-b border-gray-200 mb-8">
//                     <div className="flex space-x-8">
//                         {tabs.map(tab => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id)}
//                                 className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
//                                     ? 'border-appTitleBgColor text-appTitleBgColor'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                     }`}
//                             >
//                                 {tab.icon}
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Tab Content */}
//                 <div className="max-w-4xl">
//                     {/* Profile Tab */}
//                     {activeTab === 'profile' && (
//                         <form onSubmit={(e) => handleSubmit(e, 'profile')}>
//                             <div className="space-y-8">
//                                 <div>
//                                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
//                                     <p className="text-gray-600 mb-6">Manage your personal profile and account details</p>

//                                     {/* Profile Photo Upload */}
//                                     <div className="flex items-center gap-6 mb-8">
//                                         <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
//                                             <User className="w-10 h-10 text-gray-400" />
//                                         </div>
//                                         <div>
//                                             <button type="button" className="flex items-center gap-2 px-4 py-2 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors">
//                                                 <Camera className="w-4 h-4" />
//                                                 Upload Photo
//                                             </button>
//                                             <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF, max 5MB</p>
//                                         </div>
//                                     </div>

//                                     {/* Personal Information Form */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="John"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="John"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                                             <input
//                                                 type="email"
//                                                 defaultValue="john.doe@bulqlogistics.com"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                                             <input
//                                                 type="tel"
//                                                 defaultValue="+1 (222) 777-1123"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="Driver"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
//                                                 disabled
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="Logistics"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
//                                                 disabled
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="United States"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="California"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">LGA</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="Los Angeles"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">City/Town</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="Los Angeles"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                         <div className="md:col-span-2">
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                                             <input
//                                                 type="text"
//                                                 defaultValue="123 Logistics Ave, Transport City, TC 12345"
//                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="mt-6 flex justify-end">
//                                         <button
//                                             type="submit"
//                                             className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
//                                         >
//                                             <Save className="w-4 h-4" />
//                                             Save Changes
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>
//                     )}

//                     {/* Notification Tab */}
//                     {activeTab === 'notification' && (
//                         <form onSubmit={(e) => handleSubmit(e, 'notification')}>
//                             <div className="space-y-8">
//                                 <div>
//                                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Notification Preferences</h3>
//                                     <p className="text-gray-600 mb-6">Configure how you want to receive notifications</p>

//                                     {/* Communication Channels */}
//                                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
//                                         <h4 className="text-lg font-medium text-gray-800 mb-4">Communication Channels</h4>
//                                         <div className="space-y-4">
//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">Email Notifications</h5>
//                                                     <p className="text-sm text-gray-600">Receive notifications via email</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" defaultChecked className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
//                                                 </label>
//                                             </div>

//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">SMS Notifications</h5>
//                                                     <p className="text-sm text-gray-600">Receive notifications via SMS</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" defaultChecked className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
//                                                 </label>
//                                             </div>

//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">Push Notifications</h5>
//                                                     <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Alert Types */}
//                                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                                         <h4 className="text-lg font-medium text-gray-800 mb-4">Alert Types</h4>
//                                         <div className="space-y-4">
//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">Delivery Alerts</h5>
//                                                     <p className="text-sm text-gray-600">Notifications about delivery status changes</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" defaultChecked className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
//                                                 </label>
//                                             </div>

//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">Maintenance Alerts</h5>
//                                                     <p className="text-sm text-gray-600">Notifications about vehicle maintenance schedules</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" defaultChecked className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
//                                                 </label>
//                                             </div>

//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">Low Inventory Alerts</h5>
//                                                     <p className="text-sm text-gray-600">Notifications when inventory levels are low</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="mt-6 flex justify-end">
//                                         <button
//                                             type="submit"
//                                             className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
//                                         >
//                                             <Save className="w-4 h-4" />
//                                             Save Notification Settings
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>
//                     )}

//                     {/* Security Tab - UPDATED */}
//                     {activeTab === 'security' && (
//                         <form onSubmit={(e) => handleSubmit(e, 'security')}>
//                             <div className="space-y-8">
//                                 <div>
//                                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Security Settings</h3>
//                                     <p className="text-gray-600 mb-6">Manage your account security and authentication</p>

//                                     {/* Password Change - UPDATED with 2 columns */}
//                                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                                         <div className="flex items-center justify-between mb-4">
//                                             <div>
//                                                 <h4 className="text-lg font-medium text-gray-800">Password</h4>
//                                                 <p className="text-sm text-gray-600">Last changed 5 months ago</p>
//                                             </div>
//                                             <Key className="w-6 h-6 text-gray-400" />
//                                         </div>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
//                                                 <div className="relative">
//                                                     <input
//                                                         type={showCurrentPassword ? "text" : "password"}
//                                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor pr-10"
//                                                         placeholder="Enter current password"
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                                                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                                     >
//                                                         {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
//                                                 <div className="relative">
//                                                     <input
//                                                         type={showNewPassword ? "text" : "password"}
//                                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor pr-10"
//                                                         placeholder="Enter new password"
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setShowNewPassword(!showNewPassword)}
//                                                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                                     >
//                                                         {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             <div className="md:col-span-2">
//                                                 <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
//                                                 <div className="relative">
//                                                     <input
//                                                         type={showConfirmPassword ? "text" : "password"}
//                                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor pr-10"
//                                                         placeholder="Confirm new password"
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                                     >
//                                                         {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="flex justify-end mt-6">
//                                             <button
//                                                 type="submit"
//                                                 className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
//                                             >
//                                                 <Save className="w-4 h-4" />
//                                                 Update Password
//                                             </button>
//                                         </div>
//                                     </div>

//                                     {/* Two-Factor Authentication - UPDATED with 2 columns and colored button */}
//                                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                                         <div className="flex items-center justify-between mb-4">
//                                             <div>
//                                                 <h4 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h4>
//                                                 <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
//                                             </div>
//                                             <button
//                                                 type="button"
//                                                 className="px-4 py-2 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
//                                             >
//                                                 Enable 2FA
//                                             </button>
//                                         </div>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number for 2FA</label>
//                                                 <input
//                                                     type="tel"
//                                                     placeholder="+1 (555) 123-4567"
//                                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                                 />
//                                                 <p className="text-sm text-gray-500 mt-1">We'll send verification codes to this number</p>
//                                             </div>
//                                             <div>
//                                                 <label className="block text-sm font-medium text-gray-700 mb-2">Backup Email</label>
//                                                 <input
//                                                     type="email"
//                                                     placeholder="backup@example.com"
//                                                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                                 />
//                                                 <p className="text-sm text-gray-500 mt-1">For account recovery purposes</p>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Security Questions Section - UPDATED with 2 columns */}
//                                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                                         <h4 className="text-lg font-medium text-gray-800">Security Questions</h4>
//                                         <p className="text-sm text-gray-600 mb-6">Set up security questions for account recovery</p>

//                                         <div className="space-y-6">
//                                             {securityQuestions.map((question, index) => (
//                                                 <div key={question.id} className="bg-white p-4 rounded-lg border border-gray-200">
//                                                     <h5 className="font-medium text-gray-800 mb-3">Question {index + 1}</h5>
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                         <div>
//                                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                                 Security Question
//                                                             </label>
//                                                             <select
//                                                                 value={question.question}
//                                                                 onChange={(e) => handleSecurityQuestionChange(question.id, 'question', e.target.value)}
//                                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                                             >
//                                                                 <option value="">Select a security question</option>
//                                                                 {questionOptions.map((opt, idx) => (
//                                                                     <option key={idx} value={opt}>{opt}</option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>
//                                                         <div>
//                                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                                 Answer
//                                                             </label>
//                                                             <input
//                                                                 type="text"
//                                                                 value={question.answer}
//                                                                 onChange={(e) => handleSecurityQuestionChange(question.id, 'answer', e.target.value)}
//                                                                 placeholder="Enter your answer"
//                                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         <div className="flex justify-end mt-6">
//                                             <button
//                                                 type="submit"
//                                                 className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
//                                             >
//                                                 <Save className="w-4 h-4" />
//                                                 Save Security Questions
//                                             </button>
//                                         </div>
//                                     </div>

//                                     {/* Emergency Contacts Section - UPDATED with 2 columns and colored button */}
//                                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                                         <div className="flex items-center justify-between mb-4">
//                                             <div>
//                                                 <h4 className="text-lg font-medium text-gray-800">Emergency Contacts</h4>
//                                                 <p className="text-sm text-gray-600">Add emergency contacts for account recovery</p>
//                                             </div>
//                                         </div>

//                                         <div className="space-y-4">
//                                             {emergencyContacts.map((contact, index) => (
//                                                 <div key={contact.id} className="bg-white p-4 rounded-lg border border-gray-200">
//                                                     <div className="flex items-center justify-between mb-3">
//                                                         <h5 className="font-medium text-gray-800">Contact {index + 1}</h5>
//                                                         {emergencyContacts.length > 1 && (
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => removeEmergencyContact(contact.id)}
//                                                                 className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
//                                                             >
//                                                                 Remove
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                         <div>
//                                                             <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
//                                                             <input
//                                                                 type="text"
//                                                                 value={contact.name}
//                                                                 onChange={(e) => handleEmergencyContactChange(contact.id, 'name', e.target.value)}
//                                                                 placeholder="Full name"
//                                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                                             />
//                                                         </div>
//                                                         <div>
//                                                             <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                                                             <input
//                                                                 type="tel"
//                                                                 value={contact.phone}
//                                                                 onChange={(e) => handleEmergencyContactChange(contact.id, 'phone', e.target.value)}
//                                                                 placeholder="+1 (555) 123-4567"
//                                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                                             />
//                                                         </div>
//                                                         <div className="md:col-span-2">
//                                                             <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
//                                                             <input
//                                                                 type="text"
//                                                                 value={contact.relationship}
//                                                                 onChange={(e) => handleEmergencyContactChange(contact.id, 'relationship', e.target.value)}
//                                                                 placeholder="e.g., Spouse, Parent, Sibling"
//                                                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         <div className="flex justify-between items-center mt-4">
//                                             <button
//                                                 type="button"
//                                                 onClick={addEmergencyContact}
//                                                 className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
//                                             >
//                                                 + Add Another Contact
//                                             </button>
//                                             <button
//                                                 type="submit"
//                                                 className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
//                                             >
//                                                 <Save className="w-4 h-4" />
//                                                 Save Emergency Contacts
//                                             </button>
//                                         </div>
//                                     </div>

//                                     {/* Connected Devices Section - UPDATED with colored button */}
//                                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                                         <h4 className="text-lg font-medium text-gray-800">Connected Devices</h4>
//                                         <p className="text-sm text-gray-600 mb-6">Manage devices that have access to your account</p>

//                                         <div className="space-y-4">
//                                             {connectedDevices.map((device) => (
//                                                 <div key={device.id} className="bg-white p-4 rounded-lg border border-gray-200">
//                                                     <div className="flex items-center justify-between">
//                                                         <div className="flex-1">
//                                                             <h5 className="font-medium text-gray-800">{device.name}</h5>
//                                                             <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
//                                                                 <span>Last active: {device.lastActive}</span>
//                                                                 <span>Location: {device.location}</span>
//                                                             </div>
//                                                         </div>
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => removeDevice(device.id)}
//                                                             className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
//                                                         >
//                                                             <Trash2 className="w-4 h-4" />
//                                                             Remove
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>
//                     )}

//                     {/* System Tab */}
//                     {activeTab === 'system' && (
//                         <form onSubmit={(e) => handleSubmit(e, 'system')}>
//                             <div className="space-y-8">
//                                 <div>
//                                     <h3 className="text-xl font-semibold text-gray-800 mb-2">System Settings</h3>
//                                     <p className="text-gray-600 mb-6">Configure system preferences and application settings</p>

//                                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                                         <h4 className="text-lg font-medium text-gray-800 mb-4">Application Preferences</h4>

//                                         <div className="space-y-4">
//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">Auto-logout</h5>
//                                                     <p className="text-sm text-gray-600">Automatically log out after 30 minutes of inactivity</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" defaultChecked className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
//                                                 </label>
//                                             </div>

//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">Dark Mode</h5>
//                                                     <p className="text-sm text-gray-600">Switch to dark theme</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
//                                                 </label>
//                                             </div>

//                                             <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                                                 <div>
//                                                     <h5 className="font-medium text-gray-800">Language</h5>
//                                                     <p className="text-sm text-gray-600">Application language preference</p>
//                                                 </div>
//                                                 <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor">
//                                                     <option>English</option>
//                                                     <option>Spanish</option>
//                                                     <option>French</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="mt-6 flex justify-end">
//                                             <button
//                                                 type="submit"
//                                                 className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
//                                             >
//                                                 <Save className="w-4 h-4" />
//                                                 Save System Settings
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         </DriverDashboardLayout>
//     );
// };

// export default SettingsPage;






"use client";
import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
import { useState } from 'react';
import { User, Bell, Shield, Settings, Camera, Save, Key, Eye, EyeOff, Trash2 } from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // System settings state
    const [systemSettings, setSystemSettings] = useState({
        theme: 'light',
        language: 'english',
        timezone: 'utc-5',
        dateFormat: 'mm-dd-yyyy',
        distanceUnit: 'miles',
        weightUnit: 'pounds',
        currency: 'usd'
    });

    // Security questions state
    const [securityQuestions, setSecurityQuestions] = useState([
        { id: 1, question: '', answer: '' },
        { id: 2, question: '', answer: '' }
    ]);

    // Emergency contacts state
    const [emergencyContacts, setEmergencyContacts] = useState([
        { id: 1, name: '', phone: '', relationship: '' }
    ]);

    // Connected devices state
    const [connectedDevices, setConnectedDevices] = useState([
        { id: 1, name: 'iPhone 13 Pro', lastActive: '2 hours ago', location: 'New York, NY' },
        { id: 2, name: 'MacBook Pro', lastActive: '5 days ago', location: 'Home Office' }
    ]);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        { id: 'notification', label: 'Notification', icon: <Bell className="w-4 h-4" /> },
        { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
        { id: 'system', label: 'System', icon: <Settings className="w-4 h-4" /> }
    ];

    const handleSubmit = (e: React.FormEvent, tab: string) => {
        e.preventDefault();
        console.log(`Submitting ${tab} form`);
        // Add your form submission logic here
    };

    const handleSystemSettingChange = (field: string, value: string) => {
        setSystemSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSecurityQuestionChange = (id: number, field: string, value: string) => {
        setSecurityQuestions(prev =>
            prev.map(q => q.id === id ? { ...q, [field]: value } : q)
        );
    };

    const handleEmergencyContactChange = (id: number, field: string, value: string) => {
        setEmergencyContacts(prev =>
            prev.map(contact => contact.id === id ? { ...contact, [field]: value } : contact)
        );
    };

    const addEmergencyContact = () => {
        const newId = emergencyContacts.length > 0 ? Math.max(...emergencyContacts.map(c => c.id)) + 1 : 1;
        setEmergencyContacts(prev => [...prev, { id: newId, name: '', phone: '', relationship: '' }]);
    };

    const removeEmergencyContact = (id: number) => {
        if (emergencyContacts.length > 1) {
            setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
        }
    };

    const removeDevice = (id: number) => {
        setConnectedDevices(prev => prev.filter(device => device.id !== id));
    };

    const questionOptions = [
        "What was your first pet's name?",
        "What city were you born in?",
        "What is your mother's maiden name?",
        "What was the name of your first school?",
        "What is your favorite book?",
        "What was your childhood nickname?",
        "What is the name of your favorite childhood friend?",
        "What street did you grow up on?",
        "What was your first car?",
        "What is your favorite movie?"
    ];

    // Dropdown options
    const themeOptions = [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'auto', label: 'Auto (System)' }
    ];

    const languageOptions = [
        { value: 'english', label: 'English' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'french', label: 'French' },
        { value: 'german', label: 'German' },
        { value: 'chinese', label: 'Chinese' },
        { value: 'japanese', label: 'Japanese' }
    ];

    const timezoneOptions = [
        { value: 'utc-12', label: 'UTC-12:00' },
        { value: 'utc-8', label: 'UTC-08:00 (PST)' },
        { value: 'utc-5', label: 'UTC-05:00 (EST)' },
        { value: 'utc-0', label: 'UTC±00:00 (GMT)' },
        { value: 'utc+1', label: 'UTC+01:00 (CET)' },
        { value: 'utc+3', label: 'UTC+03:00' },
        { value: 'utc+5.5', label: 'UTC+05:30 (IST)' },
        { value: 'utc+8', label: 'UTC+08:00 (CST)' },
        { value: 'utc+9', label: 'UTC+09:00 (JST)' }
    ];

    const dateFormatOptions = [
        { value: 'mm-dd-yyyy', label: 'MM-DD-YYYY' },
        { value: 'dd-mm-yyyy', label: 'DD-MM-YYYY' },
        { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
        { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
        { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
        { value: 'yyyy/mm/dd', label: 'YYYY/MM/DD' }
    ];

    const distanceUnitOptions = [
        { value: 'miles', label: 'Miles' },
        { value: 'kilometers', label: 'Kilometers' }
    ];

    const weightUnitOptions = [
        { value: 'pounds', label: 'Pounds (lbs)' },
        { value: 'kilograms', label: 'Kilograms (kg)' }
    ];

    const currencyOptions = [
        { value: 'usd', label: 'USD ($)' },
        { value: 'eur', label: 'EUR (€)' },
        { value: 'gbp', label: 'GBP (£)' },
        { value: 'jpy', label: 'JPY (¥)' },
        { value: 'cad', label: 'CAD (C$)' },
        { value: 'aud', label: 'AUD (A$)' }
    ];

    return (
        <DriverDashboardLayout>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Manage your account preferences</span>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 mb-8">
                    <div className="flex space-x-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-appTitleBgColor text-appTitleBgColor'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-w-4xl">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={(e) => handleSubmit(e, 'profile')}>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
                                    <p className="text-gray-600 mb-6">Manage your personal profile and account details</p>

                                    {/* Profile Photo Upload */}
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <div>
                                            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors">
                                                <Camera className="w-4 h-4" />
                                                Upload Photo
                                            </button>
                                            <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF, max 5MB</p>
                                        </div>
                                    </div>

                                    {/* Personal Information Form */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                defaultValue="John"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                defaultValue="John"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                defaultValue="john.doe@bulqlogistics.com"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                defaultValue="+1 (222) 777-1123"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                            <input
                                                type="text"
                                                defaultValue="Driver"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                            <input
                                                type="text"
                                                defaultValue="Logistics"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                            <input
                                                type="text"
                                                defaultValue="United States"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                defaultValue="California"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">LGA</label>
                                            <input
                                                type="text"
                                                defaultValue="Los Angeles"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City/Town</label>
                                            <input
                                                type="text"
                                                defaultValue="Los Angeles"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <input
                                                type="text"
                                                defaultValue="123 Logistics Ave, Transport City, TC 12345"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Notification Tab */}
                    {activeTab === 'notification' && (
                        <form onSubmit={(e) => handleSubmit(e, 'notification')}>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Notification Preferences</h3>
                                    <p className="text-gray-600 mb-6">Configure how you want to receive notifications</p>

                                    {/* Communication Channels */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                                        <h4 className="text-lg font-medium text-gray-800 mb-4">Communication Channels</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">Email Notifications</h5>
                                                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">SMS Notifications</h5>
                                                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">Push Notifications</h5>
                                                    <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alert Types */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-medium text-gray-800 mb-4">Alert Types</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">Delivery Alerts</h5>
                                                    <p className="text-sm text-gray-600">Notifications about delivery status changes</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">Maintenance Alerts</h5>
                                                    <p className="text-sm text-gray-600">Notifications about vehicle maintenance schedules</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">Low Inventory Alerts</h5>
                                                    <p className="text-sm text-gray-600">Notifications when inventory levels are low</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Notification Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <form onSubmit={(e) => handleSubmit(e, 'security')}>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Security Settings</h3>
                                    <p className="text-gray-600 mb-6">Manage your account security and authentication</p>

                                    {/* Password Change */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-800">Password</h4>
                                                <p className="text-sm text-gray-600">Last changed 5 months ago</p>
                                            </div>
                                            <Key className="w-6 h-6 text-gray-400" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor pr-10"
                                                        placeholder="Enter current password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor pr-10"
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor pr-10"
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-6">
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Update Password
                                            </button>
                                        </div>
                                    </div>

                                    {/* Two-Factor Authentication */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h4>
                                                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                                            >
                                                Enable 2FA
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number for 2FA</label>
                                                <input
                                                    type="tel"
                                                    placeholder="+1 (555) 123-4567"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                />
                                                <p className="text-sm text-gray-500 mt-1">We'll send verification codes to this number</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Backup Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="backup@example.com"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                />
                                                <p className="text-sm text-gray-500 mt-1">For account recovery purposes</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Questions Section */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-medium text-gray-800">Security Questions</h4>
                                        <p className="text-sm text-gray-600 mb-6">Set up security questions for account recovery</p>

                                        <div className="space-y-6">
                                            {securityQuestions.map((question, index) => (
                                                <div key={question.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h5 className="font-medium text-gray-800 mb-3">Question {index + 1}</h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Security Question
                                                            </label>
                                                            <select
                                                                value={question.question}
                                                                onChange={(e) => handleSecurityQuestionChange(question.id, 'question', e.target.value)}
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                            >
                                                                <option value="">Select a security question</option>
                                                                {questionOptions.map((opt, idx) => (
                                                                    <option key={idx} value={opt}>{opt}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Answer
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={question.answer}
                                                                onChange={(e) => handleSecurityQuestionChange(question.id, 'answer', e.target.value)}
                                                                placeholder="Enter your answer"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-end mt-6">
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Security Questions
                                            </button>
                                        </div>
                                    </div>

                                    {/* Emergency Contacts Section */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-800">Emergency Contacts</h4>
                                                <p className="text-sm text-gray-600">Add emergency contacts for account recovery</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {emergencyContacts.map((contact, index) => (
                                                <div key={contact.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="font-medium text-gray-800">Contact {index + 1}</h5>
                                                        {emergencyContacts.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeEmergencyContact(contact.id)}
                                                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                                                            <input
                                                                type="text"
                                                                value={contact.name}
                                                                onChange={(e) => handleEmergencyContactChange(contact.id, 'name', e.target.value)}
                                                                placeholder="Full name"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                            <input
                                                                type="tel"
                                                                value={contact.phone}
                                                                onChange={(e) => handleEmergencyContactChange(contact.id, 'phone', e.target.value)}
                                                                placeholder="+1 (555) 123-4567"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                                                            <input
                                                                type="text"
                                                                value={contact.relationship}
                                                                onChange={(e) => handleEmergencyContactChange(contact.id, 'relationship', e.target.value)}
                                                                placeholder="e.g., Spouse, Parent, Sibling"
                                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                type="button"
                                                onClick={addEmergencyContact}
                                                className="flex items-center gap-2 px-4 py-2 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                                            >
                                                + Add Another Contact
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Emergency Contacts
                                            </button>
                                        </div>
                                    </div>

                                    {/* Connected Devices Section */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-medium text-gray-800">Connected Devices</h4>
                                        <p className="text-sm text-gray-600 mb-6">Manage devices that have access to your account</p>

                                        <div className="space-y-4">
                                            {connectedDevices.map((device) => (
                                                <div key={device.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-gray-800">{device.name}</h5>
                                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                                <span>Last active: {device.lastActive}</span>
                                                                <span>Location: {device.location}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDevice(device.id)}
                                                            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* System Tab - UPDATED */}
                    {activeTab === 'system' && (
                        <form onSubmit={(e) => handleSubmit(e, 'system')}>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">System Settings</h3>
                                    <p className="text-gray-600 mb-6">Configure system preferences and application settings</p>

                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-medium text-gray-800 mb-4">Application Preferences</h4>

                                        <div className="space-y-4">
                                            {/* System Preferences Dropdowns */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                                    <select
                                                        value={systemSettings.theme}
                                                        onChange={(e) => handleSystemSettingChange('theme', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                    >
                                                        {themeOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                                    <select
                                                        value={systemSettings.language}
                                                        onChange={(e) => handleSystemSettingChange('language', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                    >
                                                        {languageOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                                    <select
                                                        value={systemSettings.timezone}
                                                        onChange={(e) => handleSystemSettingChange('timezone', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                    >
                                                        {timezoneOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                                                    <select
                                                        value={systemSettings.dateFormat}
                                                        onChange={(e) => handleSystemSettingChange('dateFormat', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                    >
                                                        {dateFormatOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Distance Unit</label>
                                                    <select
                                                        value={systemSettings.distanceUnit}
                                                        onChange={(e) => handleSystemSettingChange('distanceUnit', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                    >
                                                        {distanceUnitOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight Unit</label>
                                                    <select
                                                        value={systemSettings.weightUnit}
                                                        onChange={(e) => handleSystemSettingChange('weightUnit', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                    >
                                                        {weightUnitOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                                    <select
                                                        value={systemSettings.currency}
                                                        onChange={(e) => handleSystemSettingChange('currency', e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                    >
                                                        {currencyOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Existing Toggle Settings */}
                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">Auto-logout</h5>
                                                    <p className="text-sm text-gray-600">Automatically log out after 30 minutes of inactivity</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">Dark Mode</h5>
                                                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={systemSettings.theme === 'dark'}
                                                        onChange={(e) => handleSystemSettingChange('theme', e.target.checked ? 'dark' : 'light')}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-appTitleBgColor/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-appTitleBgColor"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <h5 className="font-medium text-gray-800">Language</h5>
                                                    <p className="text-sm text-gray-600">Application language preference</p>
                                                </div>
                                                <select
                                                    value={systemSettings.language}
                                                    onChange={(e) => handleSystemSettingChange('language', e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appTitleBgColor focus:border-appTitleBgColor"
                                                >
                                                    {languageOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="submit"
                                                className="flex items-center gap-2 px-6 py-3 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save System Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DriverDashboardLayout>
    );
};

export default SettingsPage;