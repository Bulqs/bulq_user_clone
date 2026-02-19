
// "use client";
// import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
// import Tabs from "@/app/components/drivercomponents/Tabs";
// import { ArrowUp, ArrowDown, Clock, Star, AlertCircle, CheckCircle, MoreVertical, MapPin, User, Calendar, Eye, Trash2, Package, Truck, DollarSign, TrendingUp, X, BarChart3, Map, Package2, BarChart2, LineChart, Navigation, FileText, History, Copy, Car, Phone, Mail, CreditCard, Briefcase } from 'lucide-react';
// import { useState, useEffect } from 'react';

// interface Delivery {
//     id: string;
//     orderId: string;
//     customer: string;
//     deliveryAddress: string;
//     schedule: string;
//     status: 'active' | 'scheduled' | 'completed' | 'cancelled';
//     priority: 'high' | 'medium' | 'low';
//     deliveryDate: string; // YYYY-MM-DD format
//     customerEmail?: string;
//     customerPhone?: string;
//     customerImage?: string;
//     driverName?: string;
//     driverEmail?: string;
//     driverPhone?: string;
//     vehicleType?: string;
//     vehicleModel?: string;
//     plateNumber?: string;
//     paymentStatus?: 'paid' | 'not-paid' | 'pending';
// }

// interface DeliveryItem {
//     id: number;
//     name: string;
//     quantity: number;
//     weight: string;
//     fragile: boolean;
//     price?: number;
//     status: 'paid' | 'not-paid' | 'pending';
// }

// // Reschedule Delivery Modal Component
// const RescheduleDeliveryModal = ({ 
//     isOpen, 
//     onClose, 
//     delivery, 
//     onReschedule 
// }: { 
//     isOpen: boolean; 
//     onClose: () => void; 
//     delivery: Delivery | null;
//     onReschedule: (deliveryId: string, newDate: string, reason: string) => void;
// }) => {
//     const [newDate, setNewDate] = useState('');
//     const [reason, setReason] = useState('');

//     useEffect(() => {
//         if (delivery) {
//             // Set default new date to current delivery date
//             setNewDate(delivery.deliveryDate);
//             setReason('');
//         }
//     }, [delivery]);

//     if (!isOpen || !delivery) return null;

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (newDate && reason.trim()) {
//             onReschedule(delivery.id, newDate, reason.trim());
//             onClose();
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
//                 {/* Modal Header */}
//                 <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-blue-100 p-2 rounded-lg">
//                             <Briefcase className="w-6 h-6 text-blue-600" />
//                         </div>
//                         <div>
//                             <h2 className="text-xl font-bold text-gray-900">Reschedule Delivery</h2>
//                             <p className="text-sm text-gray-500">Update delivery schedule for {delivery.orderId}</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                         <X className="w-5 h-5 text-gray-500" />
//                     </button>
//                 </div>

//                 {/* Modal Content */}
//                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                     {/* Current Delivery Info */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-semibold text-gray-800 mb-2">Current Delivery Information</h4>
//                         <div className="space-y-2 text-sm">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Order ID:</span>
//                                 <span className="font-medium">{delivery.orderId}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Customer:</span>
//                                 <span className="font-medium">{delivery.customer}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Current Date:</span>
//                                 <span className="font-medium">{new Date(delivery.deliveryDate).toLocaleDateString()}</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* New Delivery Date Section */}
//                     <div>
//                         <h4 className="font-semibold text-gray-800 mb-3">New Delivery Date</h4>
//                         <div className="space-y-3">
//                             <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
//                                 <Calendar className="w-5 h-5 text-blue-600" />
//                                 <div className="flex-1">
//                                     <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Select New Delivery Date
//                                     </label>
//                                     <input
//                                         type="date"
//                                         id="deliveryDate"
//                                         value={newDate}
//                                         onChange={(e) => setNewDate(e.target.value)}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         required
//                                         min={new Date().toISOString().split('T')[0]}
//                                     />
//                                 </div>
//                             </div>
//                             {newDate && (
//                                 <p className="text-sm text-gray-600">
//                                     New delivery date: <span className="font-medium text-blue-600">{new Date(newDate).toLocaleDateString()}</span>
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Reason for Reschedule Section */}
//                     <div>
//                         <h4 className="font-semibold text-gray-800 mb-3">Reason for Reschedule</h4>
//                         <div className="space-y-3">
//                             <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
//                                 <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
//                                 <div className="flex-1">
//                                     <label htmlFor="rescheduleReason" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Explain why you need to reschedule
//                                     </label>
//                                     <textarea
//                                         id="rescheduleReason"
//                                         value={reason}
//                                         onChange={(e) => setReason(e.target.value)}
//                                         rows={4}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
//                                         placeholder="Please provide the reason for rescheduling this delivery..."
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                             <p className="text-xs text-gray-500">
//                                 Provide a clear reason for rescheduling to help with logistics planning.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Modal Footer */}
//                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//                             disabled={!newDate || !reason.trim()}
//                         >
//                             <Briefcase className="w-4 h-4" />
//                             Reschedule Delivery
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // Delivery Details Modal Component (unchanged except for the History tab)
// const DeliveryDetailsModal = ({ isOpen, onClose, delivery, onPriorityUpdate }: { isOpen: boolean; onClose: () => void; delivery: Delivery | null; onPriorityUpdate: (deliveryId: string, priority: 'high' | 'medium' | 'low') => void }) => {
//     const [activeTab, setActiveTab] = useState('overview');
//     const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(delivery);

//     // Update local state when delivery prop changes
//     useEffect(() => {
//         setCurrentDelivery(delivery);
//     }, [delivery]);

//     if (!isOpen || !currentDelivery) return null;

//     // Function to copy order ID to clipboard
//     const copyOrderId = () => {
//         navigator.clipboard.writeText(currentDelivery.orderId);
//         // You can add a toast notification here if needed
//         alert('Order ID copied to clipboard!');
//     };

//     // Function to handle priority button click
//     const handlePriorityClick = (priority: 'high' | 'medium' | 'low') => {
//         // Update local state immediately for responsive UI
//         setCurrentDelivery(prev => prev ? { ...prev, priority } : null);
//         // Call the parent update function
//         onPriorityUpdate(currentDelivery.id, priority);
//     };

//     // Sample delivery items data with payment status
//     const deliveryItems: DeliveryItem[] = [
//         { id: 1, name: 'Electronics Package', quantity: 1, weight: '2.5kg', fragile: true, price: 299.99, status: 'paid' },
//         { id: 2, name: 'Documents', quantity: 1, weight: '0.5kg', fragile: false, price: 15.50, status: 'not-paid' },
//         { id: 3, name: 'Clothing Package', quantity: 2, weight: '1.8kg', fragile: false, price: 89.99, status: 'pending' },
//         { id: 4, name: 'Books Collection', quantity: 5, weight: '3.2kg', fragile: false, price: 45.75, status: 'paid' }
//     ];

//     // Function to get payment status badge
//     const getPaymentStatusBadge = (status: 'paid' | 'not-paid' | 'pending') => {
//         const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
//         switch (status) {
//             case 'paid':
//                 return `${baseClasses} bg-green-100 text-green-800`;
//             case 'not-paid':
//                 return `${baseClasses} bg-red-100 text-red-800`;
//             case 'pending':
//                 return `${baseClasses} bg-yellow-100 text-yellow-800`;
//             default:
//                 return `${baseClasses} bg-gray-100 text-gray-800`;
//         }
//     };

//     // Function to get payment status icon
//     const getPaymentStatusIcon = (status: 'paid' | 'not-paid' | 'pending') => {
//         switch (status) {
//             case 'paid':
//                 return <CheckCircle className="w-3 h-3" />;
//             case 'not-paid':
//                 return <AlertCircle className="w-3 h-3" />;
//             case 'pending':
//                 return <Clock className="w-3 h-3" />;
//             default:
//                 return <CreditCard className="w-3 h-3" />;
//         }
//     };

//     const modalTabs = [
//         {
//             id: 'overview',
//             label: 'Overview',
//             icon: <FileText className="w-4 h-4" />,
//             content: (
//                 <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="bg-gray-50 p-4 rounded-lg">
//                             <h4 className="font-semibold text-gray-800 mb-3">Delivery Information</h4>
//                             <div className="space-y-3 text-sm">
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-gray-600">Order ID:</span>
//                                     <div className="flex items-center gap-2">
//                                         <span className="font-medium">{currentDelivery.orderId}</span>
//                                         <button 
//                                             onClick={copyOrderId}
//                                             className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
//                                             title="Copy Order ID"
//                                         >
//                                             <Copy className="w-3 h-3" />
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Status:</span>
//                                     <span className={`font-medium capitalize ${currentDelivery.status === 'completed' ? 'text-green-600' : currentDelivery.status === 'active' ? 'text-blue-600' : 'text-yellow-600'}`}>
//                                         {currentDelivery.status}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Priority:</span>
//                                     <span className={`font-medium capitalize ${currentDelivery.priority === 'high' ? 'text-red-600' : currentDelivery.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
//                                         {currentDelivery.priority}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Payment Status:</span>
//                                     <span className={getPaymentStatusBadge(currentDelivery.paymentStatus || 'pending')}>
//                                         {getPaymentStatusIcon(currentDelivery.paymentStatus || 'pending')}
//                                         <span className="capitalize">{(currentDelivery.paymentStatus || 'pending').replace('-', ' ')}</span>
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-gray-50 p-4 rounded-lg">
//                             <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                                         {currentDelivery.customerImage ? (
//                                             <Image 
//                                                 src={currentDelivery.customerImage} 
//                                                 alt={currentDelivery.customer}
//                                                 className="w-10 h-10 rounded-full object-cover"
//                                             />
//                                         ) : (
//                                             currentDelivery.customer.split(' ').map(n => n[0]).join('').toUpperCase()
//                                         )}
//                                     </div>
//                                     <div>
//                                         <div className="font-medium text-gray-800">{currentDelivery.customer}</div>
//                                         <div className="text-xs text-gray-500">{currentDelivery.customerEmail || 'customer@example.com'}</div>
//                                     </div>
//                                 </div>
//                                 <div className="space-y-2 text-sm">
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-600">Email:</span>
//                                         <span className="font-medium">{currentDelivery.customerEmail || 'customer@example.com'}</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-600">Phone:</span>
//                                         <span className="font-medium">{currentDelivery.customerPhone || '+1 (555) 123-4567'}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-semibold text-gray-800 mb-3">Schedule Information</h4>
//                         <div className="space-y-2 text-sm">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Delivery Date:</span>
//                                 <span className="font-medium">{new Date(currentDelivery.deliveryDate).toLocaleDateString()}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Address:</span>
//                                 <span className="font-medium text-right max-w-[200px]">{currentDelivery.deliveryAddress}</span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                             <button 
//                                 onClick={() => handlePriorityClick('high')}
//                                 className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
//                                     currentDelivery.priority === 'high' 
//                                         ? 'bg-red-600 text-white border-2 border-red-700 shadow-md' 
//                                         : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
//                                 }`}
//                             >
//                                 High Priority
//                             </button>
//                             <button 
//                                 onClick={() => handlePriorityClick('medium')}
//                                 className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
//                                     currentDelivery.priority === 'medium' 
//                                         ? 'bg-yellow-600 text-white border-2 border-yellow-700 shadow-md' 
//                                         : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200'
//                                 }`}
//                             >
//                                 In-Transit
//                             </button>
//                             <button 
//                                 onClick={() => handlePriorityClick('low')}
//                                 className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
//                                     currentDelivery.priority === 'low' 
//                                         ? 'bg-green-600 text-white border-2 border-green-700 shadow-md' 
//                                         : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
//                                 }`}
//                             >
//                                 Express
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )
//         },
//         {
//             id: 'route',
//             label: 'Route',
//             icon: <Navigation className="w-4 h-4" />,
//             content: (
//                 <div className="space-y-6">
//                     {/* Delivery Address Section */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-semibold text-gray-800 mb-3">Delivery Address</h4>
//                         <div className="space-y-4">
//                             <div className="flex items-start gap-3">
//                                 <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
//                                 <div className="flex-1">
//                                     <p className="font-medium text-gray-800">{currentDelivery.deliveryAddress}</p>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//                                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                                             <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
//                                                 <Navigation className="w-3 h-3 text-blue-600" />
//                                             </div>
//                                             <div>
//                                                 <span className="font-medium text-gray-700">Distance:</span>
//                                                 <p className="text-sm">8.5 km</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                                             <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
//                                                 <Clock className="w-3 h-3 text-green-600" />
//                                             </div>
//                                             <div>
//                                                 <span className="font-medium text-gray-700">Time Taken:</span>
//                                                 <p className="text-sm">25 mins</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Delivery Driver Section */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-semibold text-gray-800 mb-3">Delivery Driver</h4>
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                                     {currentDelivery.driverName ? (
//                                         currentDelivery.driverName.split(' ').map(n => n[0]).join('').toUpperCase()
//                                     ) : (
//                                         'JD'
//                                     )}
//                                 </div>
//                                 <div className="flex-1">
//                                     <div className="font-medium text-gray-800">{currentDelivery.driverName || 'John Driver'}</div>
//                                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-gray-600">
//                                         <div className="flex items-center gap-1">
//                                             <Mail className="w-3 h-3" />
//                                             <span>{currentDelivery.driverEmail || 'john.driver@example.com'}</span>
//                                         </div>
//                                         <div className="flex items-center gap-1">
//                                             <Phone className="w-3 h-3" />
//                                             <span>{currentDelivery.driverPhone || '+1 (555) 987-6543'}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                                         <Car className="w-5 h-5 text-purple-600" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600">Vehicle Type</p>
//                                         <p className="font-medium text-gray-800">
//                                             {currentDelivery.vehicleType || 'Toyota'} {currentDelivery.vehicleModel && `(${currentDelivery.vehicleModel})`}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
//                                         <Truck className="w-5 h-5 text-indigo-600" />
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600">Plate Number</p>
//                                         <p className="font-medium text-gray-800">{currentDelivery.plateNumber || 'ABC-1234'}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Delivery Route Map */}
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-semibold text-gray-800 mb-3">Delivery Route</h4>
//                         <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
//                             <div className="text-center">
//                                 <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//                                 <p className="text-gray-600">Route map visualization</p>
//                                 <p className="text-sm text-gray-500">From Warehouse to {currentDelivery.deliveryAddress}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="bg-white p-4 rounded-lg border border-gray-200">
//                             <h5 className="font-medium text-gray-800 mb-2">Route Details</h5>
//                             <div className="space-y-2 text-sm">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Estimated Distance:</span>
//                                     <span className="font-medium">8.5 km</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Estimated Time:</span>
//                                     <span className="font-medium">25 mins</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Traffic Condition:</span>
//                                     <span className="font-medium text-green-600">Light</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white p-4 rounded-lg border border-gray-200">
//                             <h5 className="font-medium text-gray-800 mb-2">Navigation</h5>
//                             <div className="space-y-2">
//                                 <button className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
//                                     Open in Google Maps
//                                 </button>
//                                 <button className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors">
//                                     Open in Apple Maps
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )
//         },
//         {
//             id: 'items',
//             label: 'Items',
//             icon: <Package2 className="w-4 h-4" />,
//             content: (
//                 <div className="space-y-6">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-semibold text-gray-800 mb-3">Delivery Items</h4>
//                         <div className="space-y-3">
//                             {deliveryItems.map((item) => (
//                                 <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
//                                     <div className="flex justify-between items-start">
//                                         <div className="flex-1">
//                                             <div className="flex items-start justify-between mb-2">
//                                                 <h5 className="font-medium text-gray-800">{item.name}</h5>
//                                                 <span className={getPaymentStatusBadge(item.status)}>
//                                                     {getPaymentStatusIcon(item.status)}
//                                                     <span className="capitalize">{item.status.replace('-', ' ')}</span>
//                                                 </span>
//                                             </div>
//                                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
//                                                 <div>
//                                                     <span className="font-medium text-gray-700">Quantity:</span>
//                                                     <p>{item.quantity}</p>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium text-gray-700">Weight:</span>
//                                                     <p>{item.weight}</p>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium text-gray-700">Price:</span>
//                                                     <p>${item.price?.toFixed(2) || '0.00'}</p>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium text-gray-700">Condition:</span>
//                                                     <p>
//                                                         {item.fragile ? (
//                                                             <span className="text-red-600 font-medium">Fragile</span>
//                                                         ) : (
//                                                             <span className="text-green-600">Standard</span>
//                                                         )}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <Package className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="bg-white p-4 rounded-lg border border-gray-200">
//                             <h5 className="font-medium text-gray-800 mb-2">Package Summary</h5>
//                             <div className="space-y-2 text-sm">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Total Items:</span>
//                                     <span className="font-medium">{deliveryItems.length}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Total Weight:</span>
//                                     <span className="font-medium">
//                                         {deliveryItems.reduce((total, item) => {
//                                             const weight = parseFloat(item.weight);
//                                             return total + (isNaN(weight) ? 0 : weight);
//                                         }, 0).toFixed(1)} kg
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Fragile Items:</span>
//                                     <span className="font-medium">{deliveryItems.filter(item => item.fragile).length}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Total Value:</span>
//                                     <span className="font-medium text-green-600">
//                                         ${deliveryItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2)}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white p-4 rounded-lg border border-gray-200">
//                             <h5 className="font-medium text-gray-800 mb-2">Payment Summary</h5>
//                             <div className="space-y-2 text-sm">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Paid Items:</span>
//                                     <span className="font-medium text-green-600">
//                                         {deliveryItems.filter(item => item.status === 'paid').length}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Not Paid Items:</span>
//                                     <span className="font-medium text-red-600">
//                                         {deliveryItems.filter(item => item.status === 'not-paid').length}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Pending Items:</span>
//                                     <span className="font-medium text-yellow-600">
//                                         {deliveryItems.filter(item => item.status === 'pending').length}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Payment Status:</span>
//                                     <span className={getPaymentStatusBadge(currentDelivery.paymentStatus || 'pending')}>
//                                         {getPaymentStatusIcon(currentDelivery.paymentStatus || 'pending')}
//                                         <span className="capitalize">{(currentDelivery.paymentStatus || 'pending').replace('-', ' ')}</span>
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )
//         },
//         {
//             id: 'history',
//             label: 'History',
//             icon: <History className="w-4 h-4" />,
//             content: (
//                 <div className="space-y-6">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h4 className="font-semibold text-gray-800 mb-3">Delivery Timeline</h4>
//                         <div className="space-y-4">
//                             {[
//                                 { 
//                                     time: 'Jan 19, 2024 at 2:30PM', 
//                                     status: 'Arrival at Warehouse', 
//                                     description: '' 
//                                 },
//                                 { 
//                                     time: 'Jan 19, 2024 at 2:30PM', 
//                                     status: 'Vehicle Inspection', 
//                                     description: '' 
//                                 },
//                                 { 
//                                     time: 'Jan 19, 2024 at 2:30PM', 
//                                     status: 'Goods Loading', 
//                                     description: '' 
//                                 },
//                                 { 
//                                     time: 'Jan 19, 2024 at 2:30PM', 
//                                     status: 'End Route', 
//                                     description: '' 
//                                 },
//                                 { 
//                                     time: 'Expected', 
//                                     status: 'Delivery Completed', 
//                                     description: '' 
//                                 }
//                             ].map((event, index) => (
//                                 <div key={index} className="flex gap-4">
//                                     <div className="flex flex-col items-center">
//                                         <div className={`w-3 h-3 rounded-full ${index === 4 ? 'bg-gray-400' : 'bg-green-500'}`}></div>
//                                         {index < 4 && <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>}
//                                     </div>
//                                     <div className="flex-1 pb-4">
//                                         <div className="flex justify-between items-start">
//                                             <div>
//                                                 <h5 className="font-medium text-gray-800">{event.status}</h5>
//                                                 {event.description && (
//                                                     <p className="text-sm text-gray-600">{event.description}</p>
//                                                 )}
//                                             </div>
//                                             <span className="text-sm text-gray-500">{event.time}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="bg-white p-4 rounded-lg border border-gray-200">
//                         <h4 className="font-semibold text-gray-800 mb-3">Customer History</h4>
//                         <div className="space-y-2 text-sm">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Previous Deliveries:</span>
//                                 <span className="font-medium">12</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">On-Time Rate:</span>
//                                 <span className="font-medium text-green-600">92%</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Last Delivery:</span>
//                                 <span className="font-medium">2024-12-05</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )
//         }
//     ];

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
//                 {/* Modal Header */}
//                 <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-indigo-100 p-2 rounded-lg">
//                             <Package className="w-6 h-6 text-indigo-600" />
//                         </div>
//                         <div>
//                             <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
//                             <p className="text-sm text-gray-500">Complete Information about the scheduled delivery</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                         <X className="w-5 h-5 text-gray-500" />
//                     </button>
//                 </div>

//                 {/* Modal Tabs */}
//                 <div className="border-b border-gray-200">
//                     <div className="flex space-x-1 px-6">
//                         {modalTabs.map(tab => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id)}
//                                 className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id
//                                         ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
//                                         : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                                     }`}
//                             >
//                                 {tab.icon}
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Modal Content */}
//                 <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
//                     {modalTabs.find(tab => tab.id === activeTab)?.content}
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Close
//                     </button>
//                     <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
//                         Start Delivery
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };



// const DeliveryPerformanceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//     const [activeTab, setActiveTab] = useState('overview');
//     const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

//     const monthlyData = [
//         { month: 'Jan', onTime: 85, delayed: 15 },
//         { month: 'Feb', onTime: 88, delayed: 12 },
//         { month: 'Mar', onTime: 82, delayed: 18 },
//         { month: 'Apr', onTime: 90, delayed: 10 },
//         { month: 'May', onTime: 87, delayed: 13 },
//         { month: 'Jun', onTime: 92, delayed: 8 },
//         { month: 'Jul', onTime: 89, delayed: 11 },
//         { month: 'Aug', onTime: 91, delayed: 9 },
//         { month: 'Sep', onTime: 86, delayed: 14 },
//         { month: 'Oct', onTime: 93, delayed: 7 },
//         { month: 'Nov', onTime: 88, delayed: 12 },
//         { month: 'Dec', onTime: 94, delayed: 6 }
//     ];

//     // Pie chart data
//     const deliveryStatusData = [
//         { status: 'On-Time', percentage: 89, color: '#3b82f6' },
//         { status: 'Delayed', percentage: 11, color: '#ef4444' }
//     ];

//     const delayReasonsData = [
//         { reason: 'Goods Damage', percentage: 25, color: '#ef4444' },
//         { reason: 'Weather Conditions', percentage: 20, color: '#f59e0b' },
//         { reason: 'Congestion', percentage: 18, color: '#8b5cf6' },
//         { reason: 'Incorrect Address', percentage: 15, color: '#06b6d4' },
//         { reason: 'Vehicle Breakdown', percentage: 12, color: '#84cc16' },
//         { reason: 'Others', percentage: 10, color: '#64748b' }
//     ];

//     // Pie chart component
//     const PieChart = ({ data, size = 160 }: { data: Array<{ status?: string; reason?: string; percentage: number; color: string }>, size?: number }) => {
//         const radius = size / 2 - 10;
//         const circumference = 2 * Math.PI * radius;

//         let currentPercentage = 0;

//         return (
//             <div className="relative" style={{ width: size, height: size }}>
//                 <svg width={size} height={size} className="transform -rotate-90">
//                     {data.map((item, index) => {
//                         const strokeDasharray = circumference;
//                         const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
//                         const previousPercentage = currentPercentage;
//                         currentPercentage += item.percentage;

//                         return (
//                             <circle
//                                 key={index}
//                                 cx={size / 2}
//                                 cy={size / 2}
//                                 r={radius}
//                                 fill="none"
//                                 stroke={item.color}
//                                 strokeWidth="20"
//                                 strokeDasharray={strokeDasharray}
//                                 strokeDashoffset={strokeDashoffset}
//                                 strokeLinecap="round"
//                                 style={{
//                                     transform: `rotate(${previousPercentage * 3.6}deg)`,
//                                     transformOrigin: 'center',
//                                     transition: 'all 0.5s ease'
//                                 }}
//                             />
//                         );
//                     })}
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="text-2xl font-bold text-gray-800">{data[0].percentage}%</div>
//                         <div className="text-xs text-gray-500">On-Time</div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const modalTabs = [
//         {
//             id: 'overview',
//             label: 'Overview',
//             icon: <BarChart3 className="w-4 h-4" />,
//             content: (
//                 <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//                             <div className="flex items-center justify-between">
//                                 <h4 className="text-sm font-medium text-blue-800">Total Deliveries</h4>
//                                 <Package2 className="w-5 h-5 text-blue-600" />
//                             </div>
//                             <p className="text-2xl font-bold text-blue-900 mt-2">1,247</p>
//                             <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
//                         </div>
//                         <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//                             <div className="flex items-center justify-between">
//                                 <h4 className="text-sm font-medium text-green-800">On-Time Rate</h4>
//                                 <CheckCircle className="w-5 h-5 text-green-600" />
//                             </div>
//                             <p className="text-2xl font-bold text-green-900 mt-2">94.2%</p>
//                             <p className="text-xs text-green-600 mt-1">+2.1% improvement</p>
//                         </div>
//                         <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
//                             <div className="flex items-center justify-between">
//                                 <h4 className="text-sm font-medium text-purple-800">Avg. Delivery Time</h4>
//                                 <Clock className="w-5 h-5 text-purple-600" />
//                             </div>
//                             <p className="text-2xl font-bold text-purple-900 mt-2">38min</p>
//                             <p className="text-xs text-purple-600 mt-1">-5min from last week</p>
//                         </div>
//                     </div>

//                     {/* Updated Delivery Performance Trends Section */}
//                     <div className="bg-white p-6 rounded-lg border border-gray-200">
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//                             <div>
//                                 <h4 className="text-lg font-semibold text-gray-800">Delivery Performance Trends</h4>
//                                 <p className="text-sm text-gray-500 mt-1">Monthly on-time vs. delayed delivery percentages</p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => setChartType('bar')}
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${chartType === 'bar'
//                                         ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
//                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
//                                         }`}
//                                 >
//                                     <BarChart2 className="w-4 h-4" />
//                                     Bar Chart
//                                 </button>
//                                 <button
//                                     onClick={() => setChartType('line')}
//                                     className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${chartType === 'line'
//                                         ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
//                                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
//                                         }`}
//                                 >
//                                     <LineChart className="w-4 h-4" />
//                                     Line Chart
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Chart Container */}
//                         <div className="relative">
//                             {/* Y-axis labels */}
//                             <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-8">
//                                 <span>100</span>
//                                 <span>75</span>
//                                 <span>50</span>
//                                 <span>25</span>
//                                 <span>0</span>
//                             </div>

//                             {/* Chart Area */}
//                             <div className="ml-8 border-l border-b border-gray-300 pl-4 pb-6">
//                                 {chartType === 'bar' ? (
//                                     // Bar Chart
//                                     <div className="flex items-end justify-between h-48 gap-2">
//                                         {monthlyData.map((data, index) => (
//                                             <div key={data.month} className="flex flex-col items-center flex-1 gap-1">
//                                                 <div className="flex items-end justify-center gap-1 w-full" style={{ height: '160px' }}>
//                                                     {/* On-Time Bar */}
//                                                     <div
//                                                         className="w-4 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 relative group"
//                                                         style={{ height: `${data.onTime * 1.6}px` }}
//                                                     >
//                                                         <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                                             On-Time: {data.onTime}%
//                                                         </div>
//                                                     </div>
//                                                     {/* Delayed Bar */}
//                                                     <div
//                                                         className="w-4 bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600 relative group"
//                                                         style={{ height: `${data.delayed * 1.6}px` }}
//                                                     >
//                                                         <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                                             Delayed: {data.delayed}%
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <span className="text-xs text-gray-600 mt-2">{data.month}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     // Line Chart
//                                     <div className="relative h-48">
//                                         {/* Grid Lines */}
//                                         <div className="absolute inset-0">
//                                             {[0, 25, 50, 75, 100].map((value) => (
//                                                 <div
//                                                     key={value}
//                                                     className="absolute left-0 right-4 border-t border-gray-200"
//                                                     style={{ bottom: `${value * 1.6}px` }}
//                                                 ></div>
//                                             ))}
//                                         </div>

//                                         {/* On-Time Line */}
//                                         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//                                             <path
//                                                 d={`M0,${100 - monthlyData[0].onTime} ${monthlyData.map((data, index) => `L${(index / (monthlyData.length - 1)) * 100},${100 - data.onTime}`).join(' ')}`}
//                                                 fill="none"
//                                                 stroke="#3b82f6"
//                                                 strokeWidth="2"
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                             />
//                                             {monthlyData.map((data, index) => (
//                                                 <circle
//                                                     key={`onTime-${index}`}
//                                                     cx={`${(index / (monthlyData.length - 1)) * 100}`}
//                                                     cy={`${100 - data.onTime}`}
//                                                     r="2"
//                                                     fill="#3b82f6"
//                                                     className="hover:r-3 transition-all"
//                                                 />
//                                             ))}
//                                         </svg>

//                                         {/* Delayed Line */}
//                                         <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100" preserveAspectRatio="none">
//                                             <path
//                                                 d={`M0,${100 - monthlyData[0].delayed} ${monthlyData.map((data, index) => `L${(index / (monthlyData.length - 1)) * 100},${100 - data.delayed}`).join(' ')}`}
//                                                 fill="none"
//                                                 stroke="#ef4444"
//                                                 strokeWidth="2"
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                             />
//                                             {monthlyData.map((data, index) => (
//                                                 <circle
//                                                     key={`delayed-${index}`}
//                                                     cx={`${(index / (monthlyData.length - 1)) * 100}`}
//                                                     cy={`${100 - data.delayed}`}
//                                                     r="2"
//                                                     fill="#ef4444"
//                                                     className="hover:r-3 transition-all"
//                                                 />
//                                             ))}
//                                         </svg>

//                                         {/* X-axis labels */}
//                                         <div className="flex justify-between mt-2">
//                                             {monthlyData.map((data) => (
//                                                 <span key={data.month} className="text-xs text-gray-600 flex-1 text-center">
//                                                     {data.month}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Legend */}
//                         <div className="flex justify-center gap-6 mt-6">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-3 h-3 bg-blue-500 rounded"></div>
//                                 <span className="text-sm text-gray-600">On-Time Deliveries</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-3 h-3 bg-red-500 rounded"></div>
//                                 <span className="text-sm text-gray-600">Delayed Deliveries</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Pie Charts Section */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {/* On-Time vs Delayed Deliveries Pie Chart */}
//                         <div className="bg-white p-6 rounded-lg border border-gray-200">
//                             <div className="mb-4">
//                                 <h4 className="text-lg font-semibold text-gray-800">On-Time vs Delayed Deliveries</h4>
//                                 <p className="text-sm text-gray-500 mt-1">Distribution of delivery statuses</p>
//                             </div>
//                             <div className="flex flex-col lg:flex-row items-center gap-6">
//                                 <PieChart data={deliveryStatusData} size={160} />
//                                 <div className="space-y-3 flex-1">
//                                     {deliveryStatusData.map((item, index) => (
//                                         <div key={index} className="flex items-center justify-between">
//                                             <div className="flex items-center gap-3">
//                                                 <div
//                                                     className="w-4 h-4 rounded"
//                                                     style={{ backgroundColor: item.color }}
//                                                 ></div>
//                                                 <span className="text-sm text-gray-700">{item.status}</span>
//                                             </div>
//                                             <span className="font-medium text-gray-800">{item.percentage}%</span>
//                                         </div>
//                                     ))}
//                                     <div className="pt-3 border-t border-gray-200">
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-gray-600">Total Deliveries</span>
//                                             <span className="font-medium text-gray-800">1,247</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Delay Reasons Pie Chart */}
//                         <div className="bg-white p-6 rounded-lg border border-gray-200">
//                             <div className="mb-4">
//                                 <h4 className="text-lg font-semibold text-gray-800">Delay Reasons</h4>
//                                 <p className="text-sm text-gray-500 mt-1">Common causes for delivery delays</p>
//                             </div>
//                             <div className="flex flex-col lg:flex-row items-center gap-6">
//                                 <PieChart data={delayReasonsData} size={160} />
//                                 <div className="space-y-3 flex-1">
//                                     {delayReasonsData.map((item, index) => (
//                                         <div key={index} className="flex items-center justify-between">
//                                             <div className="flex items-center gap-3">
//                                                 <div
//                                                     className="w-4 h-4 rounded"
//                                                     style={{ backgroundColor: item.color }}
//                                                 ></div>
//                                                 <span className="text-sm text-gray-700">{item.reason}</span>
//                                             </div>
//                                             <span className="font-medium text-gray-800">{item.percentage}%</span>
//                                         </div>
//                                     ))}
//                                     <div className="pt-3 border-t border-gray-200">
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-gray-600">Total Delayed</span>
//                                             <span className="font-medium text-gray-800">137</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )
//         },
//         {
//             id: 'region',
//             label: 'Region',
//             icon: <Map className="w-4 h-4" />,
//             content: (
//                 <div className="space-y-6">
//                     {/* Regional Performance Bar Chart */}
//                     <div className="bg-white p-6 rounded-lg border border-gray-200">
//                         <div className="mb-6">
//                             <h4 className="text-lg font-semibold text-gray-800">Regional Performance</h4>
//                             <p className="text-sm text-gray-500 mt-1">Delivery performance across different regions</p>
//                         </div>

//                         {/* Regional Bar Chart Data */}
//                         {(() => {
//                             const regionalMonthlyData = [
//                                 { month: 'Jan', north: 92, south: 88, east: 85, west: 90 },
//                                 { month: 'Feb', north: 94, south: 86, east: 87, west: 91 },
//                                 { month: 'Mar', north: 91, south: 89, east: 84, west: 92 },
//                                 { month: 'Apr', north: 93, south: 87, east: 86, west: 89 },
//                                 { month: 'May', north: 95, south: 85, east: 88, west: 90 },
//                                 { month: 'Jun', north: 92, south: 90, east: 83, west: 91 },
//                                 { month: 'Jul', north: 90, south: 88, east: 85, west: 93 },
//                                 { month: 'Aug', north: 93, south: 86, east: 87, west: 89 },
//                                 { month: 'Sep', north: 91, south: 89, east: 84, west: 92 },
//                                 { month: 'Oct', north: 94, south: 87, east: 86, west: 90 },
//                                 { month: 'Nov', north: 92, south: 85, east: 88, west: 91 },
//                                 { month: 'Dec', north: 95, south: 90, east: 83, west: 93 }
//                             ];

//                             const regionColors = {
//                                 north: '#059669', // Deep Green
//                                 south: '#2563eb', // Deep Blue
//                                 east: '#7c3aed',  // Deep Purple
//                                 west: '#db2777'   // Deep Pink
//                             };

//                             return (
//                                 <div className="relative">
//                                     {/* Y-axis labels */}
//                                     <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-8">
//                                         <span>100</span>
//                                         <span>75</span>
//                                         <span>50</span>
//                                         <span>25</span>
//                                         <span>0</span>
//                                     </div>

//                                     {/* Chart Area */}
//                                     <div className="ml-8 border-l border-b border-gray-300 pl-4 pb-6">
//                                         <div className="flex items-end justify-between h-48 gap-1">
//                                             {regionalMonthlyData.map((monthData, index) => (
//                                                 <div key={monthData.month} className="flex flex-col items-center flex-1 gap-1">
//                                                     <div className="flex items-end justify-center gap-1 w-full" style={{ height: '160px' }}>
//                                                         {/* North Bar */}
//                                                         <div
//                                                             className="w-3 rounded-t transition-all duration-300 hover:opacity-80 relative group"
//                                                             style={{
//                                                                 height: `${monthData.north * 1.6}px`,
//                                                                 backgroundColor: regionColors.north
//                                                             }}
//                                                         >
//                                                             <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                                                 North: {monthData.north}%
//                                                             </div>
//                                                         </div>
//                                                         {/* South Bar */}
//                                                         <div
//                                                             className="w-3 rounded-t transition-all duration-300 hover:opacity-80 relative group"
//                                                             style={{
//                                                                 height: `${monthData.south * 1.6}px`,
//                                                                 backgroundColor: regionColors.south
//                                                             }}
//                                                         >
//                                                             <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                                                 South: {monthData.south}%
//                                                             </div>
//                                                         </div>
//                                                         {/* East Bar */}
//                                                         <div
//                                                             className="w-3 rounded-t transition-all duration-300 hover:opacity-80 relative group"
//                                                             style={{
//                                                                 height: `${monthData.east * 1.6}px`,
//                                                                 backgroundColor: regionColors.east
//                                                             }}
//                                                         >
//                                                             <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                                                 East: {monthData.east}%
//                                                             </div>
//                                                         </div>
//                                                         {/* West Bar */}
//                                                         <div
//                                                             className="w-3 rounded-t transition-all duration-300 hover:opacity-80 relative group"
//                                                             style={{
//                                                                 height: `${monthData.west * 1.6}px`,
//                                                                 backgroundColor: regionColors.west
//                                                             }}
//                                                         >
//                                                             <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                                                 West: {monthData.west}%
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <span className="text-xs text-gray-600 mt-2">{monthData.month}</span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })()}

//                         {/* Regional Legend */}
//                         <div className="flex justify-center gap-6 mt-6 flex-wrap">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-3 h-3 rounded" style={{ backgroundColor: '#059669' }}></div>
//                                 <span className="text-sm text-gray-600">North</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-3 h-3 rounded" style={{ backgroundColor: '#2563eb' }}></div>
//                                 <span className="text-sm text-gray-600">South</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-3 h-3 rounded" style={{ backgroundColor: '#7c3aed' }}></div>
//                                 <span className="text-sm text-gray-600">East</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <div className="w-3 h-3 rounded" style={{ backgroundColor: '#db2777' }}></div>
//                                 <span className="text-sm text-gray-600">West</span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Regional Details Table */}
//                     <div className="bg-white p-6 rounded-lg border border-gray-200">
//                         <div className="mb-6">
//                             <h4 className="text-lg font-semibold text-gray-800">Regional Details</h4>
//                             <p className="text-sm text-gray-500 mt-1">Detailed performance metrics for each region</p>
//                         </div>

//                         {/* Table */}
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="bg-appTitleBgColor text-white border-b border-gray-200">
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Region</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">On-Time %</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Delay %</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Successful Deliveries</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Cancel Deliveries</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Top Reasons</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                     {[
//                                         {
//                                             region: 'North',
//                                             onTime: 92,
//                                             delay: 8,
//                                             successfulDeliveries: 324,
//                                             cancelDeliveries: 12,
//                                             topReasons: ['Weather Conditions', 'Traffic Congestion']
//                                         },
//                                         {
//                                             region: 'South',
//                                             onTime: 88,
//                                             delay: 12,
//                                             successfulDeliveries: 287,
//                                             cancelDeliveries: 18,
//                                             topReasons: ['Traffic Congestion', 'Vehicle Issues']
//                                         },
//                                         {
//                                             region: 'East',
//                                             onTime: 85,
//                                             delay: 15,
//                                             successfulDeliveries: 198,
//                                             cancelDeliveries: 23,
//                                             topReasons: ['Weather Conditions', 'Incorrect Address']
//                                         },
//                                         {
//                                             region: 'West',
//                                             onTime: 90,
//                                             delay: 10,
//                                             successfulDeliveries: 256,
//                                             cancelDeliveries: 9,
//                                             topReasons: ['Traffic Congestion', 'Weather Conditions']
//                                         }
//                                     ].map((region, index) => (
//                                         <tr key={region.region} className="hover:bg-gray-50 transition-colors">
//                                             <td className="py-3 px-4 text-sm font-medium text-gray-900">
//                                                 <div className="flex items-center gap-2">
//                                                     <div
//                                                         className="w-3 h-3 rounded"
//                                                         style={{
//                                                             backgroundColor:
//                                                                 region.region === 'North' ? '#059669' :
//                                                                     region.region === 'South' ? '#2563eb' :
//                                                                         region.region === 'East' ? '#7c3aed' : '#db2777'
//                                                         }}
//                                                     ></div>
//                                                     {region.region}
//                                                 </div>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-900">
//                                                 <span className="font-medium text-green-600">{region.onTime}%</span>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-900">
//                                                 <span className="font-medium text-red-600">{region.delay}%</span>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-900">
//                                                 <span className="font-medium">{region.successfulDeliveries}</span>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-900">
//                                                 <span className="font-medium text-orange-600">{region.cancelDeliveries}</span>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-600">
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {region.topReasons.map((reason, reasonIndex) => (
//                                                         <span
//                                                             key={reasonIndex}
//                                                             className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200"
//                                                         >
//                                                             <AlertCircle className="w-3 h-3" />
//                                                             {reason}
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             )
//         },
//         {
//             id: 'deliveries',
//             label: 'Deliveries',
//             icon: <Package2 className="w-4 h-4" />,
//             content: (
//                 <div className="space-y-6">
//                     {/* Recent Deliveries Table */}
//                     <div className="bg-white p-6 rounded-lg border border-gray-200">
//                         <div className="mb-6">
//                             <h4 className="text-lg font-semibold text-gray-800">Recent Deliveries</h4>
//                             <p className="text-sm text-gray-500 mt-1">Detailed list of recent deliveries and their performance</p>
//                         </div>

//                         {/* Recent Deliveries Table */}
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="bg-appTitleBgColor text-white border-b border-gray-200">
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">ORDER ID</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">CUSTOMER</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">DESTINATION</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">STATUS</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">SCHEDULED</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">ACTUAL</th>
//                                         <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">ON TIME</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                     {[
//                                         {
//                                             orderId: 'ORD-001',
//                                             customer: 'John Smith',
//                                             destination: '123 Main St, New York',
//                                             status: 'Delivered',
//                                             scheduled: '10:00 AM',
//                                             actual: '9:45 AM',
//                                             onTime: 'Yes'
//                                         },
//                                         {
//                                             orderId: 'ORD-002',
//                                             customer: 'Sarah Johnson',
//                                             destination: '456 Oak Ave, Brooklyn',
//                                             status: 'Delivered',
//                                             scheduled: '11:30 AM',
//                                             actual: '12:15 PM',
//                                             onTime: 'No'
//                                         },
//                                         {
//                                             orderId: 'ORD-003',
//                                             customer: 'Mike Davis',
//                                             destination: '789 Pine St, Queens',
//                                             status: 'In Transit',
//                                             scheduled: '2:00 PM',
//                                             actual: '-',
//                                             onTime: '-'
//                                         },
//                                         {
//                                             orderId: 'ORD-004',
//                                             customer: 'Emily Wilson',
//                                             destination: '321 Elm St, Manhattan',
//                                             status: 'Delivered',
//                                             scheduled: '3:45 PM',
//                                             actual: '3:30 PM',
//                                             onTime: 'Yes'
//                                         },
//                                         {
//                                             orderId: 'ORD-005',
//                                             customer: 'David Brown',
//                                             destination: '654 Maple Rd, Brooklyn',
//                                             status: 'Delivered',
//                                             scheduled: '1:15 PM',
//                                             actual: '2:30 PM',
//                                             onTime: 'No'
//                                         },
//                                         {
//                                             orderId: 'ORD-006',
//                                             customer: 'Lisa Taylor',
//                                             destination: '987 Cedar Ln, Queens',
//                                             status: 'Scheduled',
//                                             scheduled: '4:30 PM',
//                                             actual: '-',
//                                             onTime: '-'
//                                         },
//                                         {
//                                             orderId: 'ORD-007',
//                                             customer: 'Robert Clark',
//                                             destination: '159 Birch St, Manhattan',
//                                             status: 'Delivered',
//                                             scheduled: '9:00 AM',
//                                             actual: '8:45 AM',
//                                             onTime: 'Yes'
//                                         },
//                                         {
//                                             orderId: 'ORD-008',
//                                             customer: 'Jennifer Lee',
//                                             destination: '753 Spruce Ave, Brooklyn',
//                                             status: 'Delivered',
//                                             scheduled: '10:45 AM',
//                                             actual: '11:20 AM',
//                                             onTime: 'No'
//                                         }
//                                     ].map((delivery, index) => (
//                                         <tr key={delivery.orderId} className="hover:bg-gray-50 transition-colors">
//                                             <td className="py-3 px-4 text-sm font-medium text-gray-900">
//                                                 {delivery.orderId}
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-900">
//                                                 {delivery.customer}
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-600">
//                                                 <div className="flex items-center gap-2">
//                                                     <MapPin className="w-3 h-3 text-gray-400" />
//                                                     <span className="truncate max-w-[150px]">{delivery.destination}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm">
//                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${delivery.status === 'Delivered'
//                                                     ? 'bg-green-100 text-green-800'
//                                                     : delivery.status === 'In Transit'
//                                                         ? 'bg-blue-100 text-blue-800'
//                                                         : 'bg-yellow-100 text-yellow-800'
//                                                     }`}>
//                                                     {delivery.status === 'In Transit' && <Truck className="w-3 h-3 mr-1" />}
//                                                     {delivery.status === 'Delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
//                                                     {delivery.status === 'Scheduled' && <Clock className="w-3 h-3 mr-1" />}
//                                                     {delivery.status}
//                                                 </span>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-900">
//                                                 <div className="flex items-center gap-1">
//                                                     <Clock className="w-3 h-3 text-gray-400" />
//                                                     {delivery.scheduled}
//                                                 </div>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm text-gray-900">
//                                                 <div className="flex items-center gap-1">
//                                                     {delivery.actual !== '-' && <Clock className="w-3 h-3 text-gray-400" />}
//                                                     {delivery.actual}
//                                                 </div>
//                                             </td>
//                                             <td className="py-3 px-4 text-sm">
//                                                 {delivery.onTime === 'Yes' ? (
//                                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                         <CheckCircle className="w-3 h-3 mr-1" />
//                                                         Yes
//                                                     </span>
//                                                 ) : delivery.onTime === 'No' ? (
//                                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                         <AlertCircle className="w-3 h-3 mr-1" />
//                                                         No
//                                                     </span>
//                                                 ) : (
//                                                     <span className="text-gray-400">-</span>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Table Summary */}
//                         <div className="mt-4 flex justify-between items-center">
//                             <div className="text-sm text-gray-500">
//                                 Showing <span className="font-medium">8</span> of <span className="font-medium">1247</span> deliveries
//                             </div>
//                             <div className="flex gap-2">
//                                 <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
//                                     Previous
//                                 </button>
//                                 <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
//                                     1
//                                 </button>
//                                 <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
//                                     Next
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )
//         }
//     ];

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
//                 {/* Modal Header */}
//                 <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-indigo-100 p-2 rounded-lg">
//                             <BarChart3 className="w-6 h-6 text-indigo-600" />
//                         </div>
//                         <div>
//                             <h2 className="text-xl font-bold text-gray-900">Delivery Performance Analytics</h2>
//                             <p className="text-sm text-gray-500">Detailed insights and metrics</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                         <X className="w-5 h-5 text-gray-500" />
//                     </button>
//                 </div>

//                 {/* Modal Tabs */}
//                 <div className="border-b border-gray-200">
//                     <div className="flex space-x-1 px-6">
//                         {modalTabs.map(tab => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id)}
//                                 className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id
//                                     ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
//                                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                                     }`}
//                             >
//                                 {tab.icon}
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Modal Content */}
//                 <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
//                     {modalTabs.find(tab => tab.id === activeTab)?.content}
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Close
//                     </button>
//                     <button
//                         onClick={() => {/* Add export functionality */ }}
//                         className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                         Export Report
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const DeliveriesPage = () => {
//     const [deliveries, setDeliveries] = useState<Delivery[]>([
//         // ... [deliveries data remains exactly the same as previous version]
//     ]);

//     const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
//     const [isDeliveryDetailsModalOpen, setIsDeliveryDetailsModalOpen] = useState(false);
//     const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
//     const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
//     const [deliveryToReschedule, setDeliveryToReschedule] = useState<Delivery | null>(null);

//     // Function to update delivery priority
//     const handlePriorityUpdate = (deliveryId: string, priority: 'high' | 'medium' | 'low') => {
//         setDeliveries(prev => prev.map(delivery => 
//             delivery.id === deliveryId ? { ...delivery, priority } : delivery
//         ));
//     };

//     // Function to handle reschedule delivery
//     const handleRescheduleDelivery = (deliveryId: string, newDate: string, reason: string) => {
//         setDeliveries(prev => prev.map(delivery => 
//             delivery.id === deliveryId ? { 
//                 ...delivery, 
//                 deliveryDate: newDate,
//                 status: 'scheduled' as const
//             } : delivery
//         ));
//         // You can add API call here to update the delivery in the backend
//         alert(`Delivery ${deliveryId} rescheduled to ${new Date(newDate).toLocaleDateString()}`);
//     };

//     // Open delivery details modal
//     const openDeliveryDetails = (delivery: Delivery) => {
//         setSelectedDelivery(delivery);
//         setIsDeliveryDetailsModalOpen(true);
//     };

//     // Close delivery details modal
//     const closeDeliveryDetails = () => {
//         setIsDeliveryDetailsModalOpen(false);
//         setSelectedDelivery(null);
//     };

//     // Open reschedule modal
//     const openRescheduleModal = (delivery: Delivery) => {
//         setDeliveryToReschedule(delivery);
//         setIsRescheduleModalOpen(true);
//     };

//     // Close reschedule modal
//     const closeRescheduleModal = () => {
//         setIsRescheduleModalOpen(false);
//         setDeliveryToReschedule(null);
//     };

//     // Delete a delivery
//     const handleDeleteDelivery = (deliveryId: string) => {
//         if (window.confirm('Are you sure you want to delete this delivery?')) {
//             setDeliveries(prev => prev.filter(delivery => delivery.id !== deliveryId));
//         }
//     };

//     const getStatusIcon = (status: Delivery['status']) => {
//         switch (status) {
//             case 'active':
//                 return <Clock className="w-4 h-4 text-blue-500" />;
//             case 'scheduled':
//                 return <Calendar className="w-4 h-4 text-green-500" />;
//             case 'completed':
//                 return <CheckCircle className="w-4 h-4 text-green-600" />;
//             case 'cancelled':
//                 return <AlertCircle className="w-4 h-4 text-red-500" />;
//             default:
//                 return <Clock className="w-4 h-4 text-gray-500" />;
//         }
//     };

//     const getPriorityBadge = (priority: Delivery['priority']) => {
//         const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
//         switch (priority) {
//             case 'high':
//                 return `${baseClasses} bg-red-100 text-red-800 flex items-center gap-1`;
//             case 'medium':
//                 return `${baseClasses} bg-yellow-100 text-yellow-800 flex items-center gap-1`;
//             case 'low':
//                 return `${baseClasses} bg-green-100 text-green-800 flex items-center gap-1`;
//             default:
//                 return `${baseClasses} bg-gray-100 text-gray-800`;
//         }
//     };

//     const getPriorityIcon = (priority: Delivery['priority']) => {
//         switch (priority) {
//             case 'high':
//                 return <ArrowUp className="w-3 h-3" />;
//             case 'medium':
//                 return <span className="w-2 h-2 bg-current rounded-full" />;
//             case 'low':
//                 return <ArrowDown className="w-3 h-3" />;
//             default:
//                 return null;
//         }
//     };

//     // Helper functions for filtering
//     const getTodayDate = () => new Date().toISOString().split('T')[0];
//     const getTomorrowDate = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];

//     const getThisWeekDates = () => {
//         const today = new Date();
//         const startOfWeek = new Date(today);
//         startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
//         const endOfWeek = new Date(today);
//         endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday

//         return {
//             start: startOfWeek.toISOString().split('T')[0],
//             end: endOfWeek.toISOString().split('T')[0]
//         };
//     };

//     // Calculate statistics
//     const totalDeliveries = deliveries.length;
//     const todayDeliveries = deliveries.filter(delivery => delivery.deliveryDate === getTodayDate()).length;
//     const completedDeliveries = deliveries.filter(delivery => delivery.status === 'completed').length;
//     const activeDeliveries = deliveries.filter(delivery => delivery.status === 'active').length;

//     const TableContent = ({ filterType }: { filterType: 'all' | 'today' | 'tomorrow' | 'this-week' | 'scheduled' }) => {
//         let filteredDeliveries: Delivery[] = [];

//         switch (filterType) {
//             case 'all':
//                 filteredDeliveries = deliveries;
//                 break;
//             case 'today':
//                 filteredDeliveries = deliveries.filter(delivery => delivery.deliveryDate === getTodayDate());
//                 break;
//             case 'tomorrow':
//                 filteredDeliveries = deliveries.filter(delivery => delivery.deliveryDate === getTomorrowDate());
//                 break;
//             case 'this-week':
//                 const weekDates = getThisWeekDates();
//                 filteredDeliveries = deliveries.filter(delivery =>
//                     delivery.deliveryDate >= weekDates.start && delivery.deliveryDate <= weekDates.end
//                 );
//                 break;
//             case 'scheduled':
//                 filteredDeliveries = deliveries.filter(delivery =>
//                     delivery.status === 'scheduled' && delivery.deliveryDate > getTomorrowDate()
//                 );
//                 break;
//         }

//         if (filteredDeliveries.length === 0) {
//             return (
//                 <div className="text-center py-8 text-gray-500">
//                     <p>No deliveries found for {filterType}.</p>
//                 </div>
//             );
//         }

//         return (
//             <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
//                 {/* Optimized Table Header with Better Column Distribution */}
//                 <div className="grid grid-cols-12 bg-appTitleBgColor px-6 py-4 gap-4">
//                     <div className="col-span-2 font-medium text-xs text-white uppercase tracking-wider text-center">ORDER ID</div>
//                     <div className="col-span-2 font-medium text-xs text-white uppercase tracking-wider text-center">CUSTOMER</div>
//                     <div className="col-span-4 font-medium text-xs text-white uppercase tracking-wider text-center">DELIVERY ADDRESS</div>
//                     <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">SCHEDULE</div>
//                     <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">STATUS</div>
//                     <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">PRIORITY</div>
//                     <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">ACTIONS</div>
//                 </div>

//                 <div className="divide-y divide-gray-100">
//                     {filteredDeliveries.map((delivery) => (
//                         <div key={delivery.id} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors duration-150 gap-4 items-center">
//                             {/* Order ID */}
//                             <div className="col-span-2 flex items-center justify-center">
//                                 <div className="flex items-center gap-3">
//                                     <div className="bg-indigo-100 p-2 rounded-lg">
//                                         <Package className="text-indigo-600 w-4 h-4" />
//                                     </div>
//                                     <span className="font-medium text-gray-900 text-sm">{delivery.orderId}</span>
//                                 </div>
//                             </div>

//                             {/* Customer */}
//                             <div className="col-span-2 flex items-center justify-center">
//                                 <div className="flex items-center gap-2">
//                                     <User className="text-gray-400 w-4 h-4" />
//                                     <span className="text-sm text-gray-600 truncate max-w-[120px]">{delivery.customer}</span>
//                                 </div>
//                             </div>

//                             {/* Delivery Address - More Space */}
//                             <div className="col-span-4 flex items-start justify-center">
//                                 <div className="flex items-start gap-3 w-full max-w-none">
//                                     <MapPin className="text-red-400 mt-0.5 flex-shrink-0 w-4 h-4" />
//                                     <span className="text-sm text-gray-600 leading-tight text-left flex-1">{delivery.deliveryAddress}</span>
//                                 </div>
//                             </div>

//                             {/* Schedule */}
//                             <div className="col-span-1 flex items-center justify-center">
//                                 <div className="flex flex-col items-center gap-1">
//                                     <Clock className="text-gray-400 w-4 h-4" />
//                                     <span className="text-xs text-gray-600 text-center leading-tight">{delivery.schedule}</span>
//                                 </div>
//                             </div>

//                             {/* Status */}
//                             <div className="col-span-1 flex items-center justify-center">
//                                 <div className="flex flex-col items-center gap-1">
//                                     {getStatusIcon(delivery.status)}
//                                     <span className="capitalize text-xs text-gray-700">{delivery.status}</span>
//                                 </div>
//                             </div>

//                             {/* Priority */}
//                             <div className="col-span-1 flex items-center justify-center">
//                                 <div className="flex justify-center">
//                                     <span className={getPriorityBadge(delivery.priority)}>
//                                         {getPriorityIcon(delivery.priority)}
//                                         <span className="hidden sm:inline">{delivery.priority}</span>
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Action */}
//                             <div className="col-span-1 flex items-center justify-center gap-2">
//                                 <button
//                                     onClick={() => openDeliveryDetails(delivery)}
//                                     className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
//                                     title="View Details"
//                                 >
//                                     <Eye className="w-4 h-4" />
//                                 </button>

//                                 <button
//                                     onClick={() => openRescheduleModal(delivery)}
//                                     className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
//                                     title="Reschedule Delivery"
//                                 >
//                                     <Briefcase className="w-4 h-4" />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Table Footer */}
//                 <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
//                     <div className="text-sm text-gray-500">
//                         Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDeliveries.length}</span> of{' '}
//                         <span className="font-medium">{filteredDeliveries.length}</span> deliveries
//                     </div>
//                     <div className="flex space-x-2">
//                         <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
//                             Previous
//                         </button>
//                         <button className="px-3 py-1 rounded-md bg-appTitleBgColor text-white text-sm font-medium hover:bg-indigo-700">
//                             1
//                         </button>
//                         <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // Calculate counts for each tab
//     const todayCount = deliveries.filter(delivery => delivery.deliveryDate === getTodayDate()).length;
//     const tomorrowCount = deliveries.filter(delivery => delivery.deliveryDate === getTomorrowDate()).length;
//     const thisWeekCount = deliveries.filter(delivery => {
//         const weekDates = getThisWeekDates();
//         return delivery.deliveryDate >= weekDates.start && delivery.deliveryDate <= weekDates.end;
//     }).length;
//     const scheduledCount = deliveries.filter(delivery =>
//         delivery.status === 'scheduled' && delivery.deliveryDate > getTomorrowDate()
//     ).length;

//     const tabs = [
//         {
//             id: 'all',
//             label: `All Deliveries (${deliveries.length})`,
//             content: <TableContent filterType="all" />,
//         },
//         {
//             id: 'today',
//             label: `Today (${todayCount})`,
//             content: <TableContent filterType="today" />,
//         },
//         {
//             id: 'tomorrow',
//             label: `Tomorrow (${tomorrowCount})`,
//             content: <TableContent filterType="tomorrow" />,
//         },
//         {
//             id: 'this-week',
//             label: `This Week (${thisWeekCount})`,
//             content: <TableContent filterType="this-week" />,
//         },
//         {
//             id: 'scheduled',
//             label: `Scheduled (${scheduledCount})`,
//             content: <TableContent filterType="scheduled" />
//         },
//     ];

//     return (
//         <DriverDashboardLayout>
//             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
//                 <div className="flex justify-between items-center mb-8">
//                     <h2 className="text-3xl font-bold text-gray-900">Delivery Management</h2>
//                     <div className="flex items-center gap-4">
//                         <span className="text-sm text-gray-500">Last updated: Today</span>
//                         <button
//                             onClick={() => setIsPerformanceModalOpen(true)}
//                             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                         >
//                             <BarChart3 className="w-4 h-4" />
//                             Delivery Performance
//                         </button>
//                     </div>
//                 </div>

//                 {/* Statistics Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {/* Total Deliveries Card */}
//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total Deliveries</h3>
//                                 <p className="text-3xl font-bold mt-2 text-gray-900">{totalDeliveries}</p>
//                             </div>
//                             <div className="bg-blue-100 p-2 rounded-lg">
//                                 <Truck className="h-6 w-6 text-blue-600" />
//                             </div>
//                         </div>
//                         <p className="text-xs text-blue-500 mt-4 flex items-center">
//                             <span className="bg-blue-200 rounded-full px-2 py-1 flex items-center">
//                                 <TrendingUp className="h-3 w-3 mr-1" />
//                                 All time deliveries
//                             </span>
//                         </p>
//                     </div>

//                     {/* Today's Deliveries Card */}
//                     <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-100">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="text-sm font-medium text-green-600 uppercase tracking-wider">Today's Deliveries</h3>
//                                 <p className="text-3xl font-bold mt-2 text-gray-900">{todayDeliveries}</p>
//                             </div>
//                             <div className="bg-green-100 p-2 rounded-lg">
//                                 <Calendar className="h-6 w-6 text-green-600" />
//                             </div>
//                         </div>
//                         <p className="text-xs text-green-500 mt-4 flex items-center">
//                             <span className="bg-green-200 rounded-full px-2 py-1 flex items-center">
//                                 <Clock className="h-3 w-3 mr-1" />
//                                 Scheduled for today
//                             </span>
//                         </p>
//                     </div>

//                     {/* Completed Deliveries Card */}
//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-100">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wider">Completed</h3>
//                                 <p className="text-3xl font-bold mt-2 text-gray-900">{completedDeliveries}</p>
//                             </div>
//                             <div className="bg-purple-100 p-2 rounded-lg">
//                                 <CheckCircle className="h-6 w-6 text-purple-600" />
//                             </div>
//                         </div>
//                         <p className="text-xs text-purple-500 mt-4 flex items-center">
//                             <span className="bg-purple-200 rounded-full px-2 py-1 flex items-center">
//                                 <TrendingUp className="h-3 w-3 mr-1" />
//                                 Successfully delivered
//                             </span>
//                         </p>
//                     </div>

//                     {/* Active Deliveries Card */}
//                     <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-100">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="text-sm font-medium text-orange-600 uppercase tracking-wider">Active Now</h3>
//                                 <p className="text-3xl font-bold mt-2 text-gray-900">{activeDeliveries}</p>
//                             </div>
//                             <div className="bg-orange-100 p-2 rounded-lg">
//                                 <Package className="h-6 w-6 text-orange-600" />
//                             </div>
//                         </div>
//                         <p className="text-xs text-orange-500 mt-4">
//                             <span className="bg-orange-200 rounded-full px-2 py-1">In progress deliveries</span>
//                         </p>
//                     </div>
//                 </div>

//                 {/* Tabs Section */}
//                 <div className="w-full">
//                     <Tabs tabs={tabs} defaultTab="today" />
//                 </div>

//                 {/* Delivery Performance Modal */}
//                 <DeliveryPerformanceModal
//                     isOpen={isPerformanceModalOpen}
//                     onClose={() => setIsPerformanceModalOpen(false)}
//                 />

//                 {/* Delivery Details Modal */}
//                 <DeliveryDetailsModal
//                     isOpen={isDeliveryDetailsModalOpen}
//                     onClose={closeDeliveryDetails}
//                     delivery={selectedDelivery}
//                     onPriorityUpdate={handlePriorityUpdate}
//                 />

//                 {/* Reschedule Delivery Modal */}
//                 <RescheduleDeliveryModal
//                     isOpen={isRescheduleModalOpen}
//                     onClose={closeRescheduleModal}
//                     delivery={deliveryToReschedule}
//                     onReschedule={handleRescheduleDelivery}
//                 />
//             </div>
//         </DriverDashboardLayout>
//     );
// };

// export default DeliveriesPage;




"use client";
import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
import Tabs from "@/app/components/drivercomponents/Tabs";
import { ArrowUp, ArrowDown, Clock, Star, AlertCircle, CheckCircle, MoreVertical, MapPin, User, Calendar, Eye, Trash2, Package, Truck, DollarSign, TrendingUp, X, BarChart3, Map, Package2, BarChart2, LineChart, Navigation, FileText, History, Copy, Car, Phone, Mail, CreditCard, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Delivery {
    id: string;
    orderId: string;
    customer: string;
    deliveryAddress: string;
    schedule: string;
    status: 'active' | 'scheduled' | 'completed' | 'cancelled';
    priority: 'high' | 'medium' | 'low';
    deliveryDate: string; // YYYY-MM-DD format
    customerEmail?: string;
    customerPhone?: string;
    customerImage?: string;
    driverName?: string;
    driverEmail?: string;
    driverPhone?: string;
    vehicleType?: string;
    vehicleModel?: string;
    plateNumber?: string;
    paymentStatus?: 'paid' | 'not-paid' | 'pending';
}


interface DeliveryItem {
    id: number;
    name: string;
    quantity: number;
    weight: string;
    fragile: boolean;
    price?: number;
    status: 'paid' | 'not-paid' | 'pending';
}

// Reschedule Delivery Modal Component
const RescheduleDeliveryModal = ({ 
    isOpen, 
    onClose, 
    delivery, 
    onReschedule 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    delivery: Delivery | null;
    onReschedule: (deliveryId: string, newDate: string, reason: string) => void;
}) => {
    const [newDate, setNewDate] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (delivery) {
            // Set default new date to current delivery date
            setNewDate(delivery.deliveryDate);
            setReason('');
        }
    }, [delivery]);

    if (!isOpen || !delivery) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDate && reason.trim()) {
            onReschedule(delivery.id, newDate, reason.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Reschedule Delivery</h2>
                            <p className="text-sm text-gray-500">Update delivery schedule for {delivery.orderId}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* New Delivery Date Section */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3">New Delivery Date</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div className="flex-1">
                                    <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Select New Delivery Date
                                    </label>
                                    <input
                                        type="date"
                                        id="deliveryDate"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            {newDate && (
                                <p className="text-sm text-gray-600">
                                    New delivery date: <span className="font-medium text-blue-600">{new Date(newDate).toLocaleDateString()}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Reason for Reschedule Section */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Reason for Reschedule</h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                                <div className="flex-1">
                                    <label htmlFor="rescheduleReason" className="block text-sm font-medium text-gray-700 mb-1">
                                        Explain why you need to reschedule
                                    </label>
                                    <textarea
                                        id="rescheduleReason"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                                        placeholder="Please provide the reason for rescheduling this delivery..."
                                        required
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Provide a clear reason for rescheduling to help with logistics planning.
                            </p>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-appTitleBgColor rounded-lg hover:bg-appBanner transition-colors flex items-center gap-2"
                            disabled={!newDate || !reason.trim()}
                        >
                            <Briefcase className="w-4 h-4" />
                            Reschedule Delivery
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// Delivery Details Modal Component (unchanged except for the History tab)
const DeliveryDetailsModal = ({ isOpen, onClose, delivery, onPriorityUpdate }: { isOpen: boolean; onClose: () => void; delivery: Delivery | null; onPriorityUpdate: (deliveryId: string, priority: 'high' | 'medium' | 'low') => void }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(delivery);

    // Update local state when delivery prop changes
    useEffect(() => {
        setCurrentDelivery(delivery);
    }, [delivery]);

    if (!isOpen || !currentDelivery) return null;

    // Function to copy order ID to clipboard
    const copyOrderId = () => {
        navigator.clipboard.writeText(currentDelivery.orderId);
        // You can add a toast notification here if needed
        alert('Order ID copied to clipboard!');
    };

    // Function to handle priority button click
    const handlePriorityClick = (priority: 'high' | 'medium' | 'low') => {
        // Update local state immediately for responsive UI
        setCurrentDelivery(prev => prev ? { ...prev, priority } : null);
        // Call the parent update function
        onPriorityUpdate(currentDelivery.id, priority);
    };

    // Sample delivery items data with payment status
    const deliveryItems: DeliveryItem[] = [
        { id: 1, name: 'Electronics Package', quantity: 1, weight: '2.5kg', fragile: true, price: 299.99, status: 'paid' },
        { id: 2, name: 'Documents', quantity: 1, weight: '0.5kg', fragile: false, price: 15.50, status: 'not-paid' },
        { id: 3, name: 'Clothing Package', quantity: 2, weight: '1.8kg', fragile: false, price: 89.99, status: 'pending' },
        { id: 4, name: 'Books Collection', quantity: 5, weight: '3.2kg', fragile: false, price: 45.75, status: 'paid' }
    ];

    // Function to get payment status badge
    const getPaymentStatusBadge = (status: 'paid' | 'not-paid' | 'pending') => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
        switch (status) {
            case 'paid':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'not-paid':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    // Function to get payment status icon
    const getPaymentStatusIcon = (status: 'paid' | 'not-paid' | 'pending') => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="w-3 h-3" />;
            case 'not-paid':
                return <AlertCircle className="w-3 h-3" />;
            case 'pending':
                return <Clock className="w-3 h-3" />;
            default:
                return <CreditCard className="w-3 h-3" />;
        }
    };

    const modalTabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <FileText className="w-4 h-4" />,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-3">Delivery Information</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Order ID:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{currentDelivery.orderId}</span>
                                        <button 
                                            onClick={copyOrderId}
                                            className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="Copy Order ID"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium capitalize ${currentDelivery.status === 'completed' ? 'text-green-600' : currentDelivery.status === 'active' ? 'text-blue-600' : 'text-yellow-600'}`}>
                                        {currentDelivery.status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Priority:</span>
                                    <span className={`font-medium capitalize ${currentDelivery.priority === 'high' ? 'text-red-600' : currentDelivery.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {currentDelivery.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className={getPaymentStatusBadge(currentDelivery.paymentStatus || 'pending')}>
                                        {getPaymentStatusIcon(currentDelivery.paymentStatus || 'pending')}
                                        <span className="capitalize">{(currentDelivery.paymentStatus || 'pending').replace('-', ' ')}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {currentDelivery.customerImage ? (
                                            <Image 
                                                src={currentDelivery.customerImage} 
                                                alt={currentDelivery.customer}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            currentDelivery.customer.split(' ').map(n => n[0]).join('').toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">{currentDelivery.customer}</div>
                                        <div className="text-xs text-gray-500">{currentDelivery.customerEmail || 'customer@example.com'}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium">{currentDelivery.customerEmail || 'customer@example.com'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-medium">{currentDelivery.customerPhone || '+1 (555) 123-4567'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Schedule Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Date:</span>
                                <span className="font-medium">{new Date(currentDelivery.deliveryDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Address:</span>
                                <span className="font-medium text-right max-w-[200px]">{currentDelivery.deliveryAddress}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button 
                                onClick={() => handlePriorityClick('high')}
                                className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                                    currentDelivery.priority === 'high' 
                                        ? 'bg-red-600 text-white border-2 border-red-700 shadow-md' 
                                        : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                }`}
                            >
                                High Priority
                            </button>
                            <button 
                                onClick={() => handlePriorityClick('medium')}
                                className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                                    currentDelivery.priority === 'medium' 
                                        ? 'bg-yellow-600 text-white border-2 border-yellow-700 shadow-md' 
                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200'
                                }`}
                            >
                                In-Transit
                            </button>
                            <button 
                                onClick={() => handlePriorityClick('low')}
                                className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                                    currentDelivery.priority === 'low' 
                                        ? 'bg-green-600 text-white border-2 border-green-700 shadow-md' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                }`}
                            >
                                Express
                            </button>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'route',
            label: 'Route',
            icon: <Navigation className="w-4 h-4" />,
            content: (
                <div className="space-y-6">
                    {/* Delivery Address Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Delivery Address</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{currentDelivery.deliveryAddress}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Navigation className="w-3 h-3 text-blue-600" />
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Distance:</span>
                                                <p className="text-sm">8.5 km</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <Clock className="w-3 h-3 text-green-600" />
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Time Taken:</span>
                                                <p className="text-sm">25 mins</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Driver Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Delivery Driver</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {currentDelivery.driverName ? (
                                        currentDelivery.driverName.split(' ').map(n => n[0]).join('').toUpperCase()
                                    ) : (
                                        'JD'
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-800">{currentDelivery.driverName || 'John Driver'}</div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            <span>{currentDelivery.driverEmail || 'john.driver@example.com'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            <span>{currentDelivery.driverPhone || '+1 (555) 987-6543'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Car className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Vehicle Type</p>
                                        <p className="font-medium text-gray-800">
                                            {currentDelivery.vehicleType || 'Toyota'} {currentDelivery.vehicleModel && `(${currentDelivery.vehicleModel})`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Plate Number</p>
                                        <p className="font-medium text-gray-800">{currentDelivery.plateNumber || 'ABC-1234'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Route Map */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Delivery Route</h4>
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Route map visualization</p>
                                <p className="text-sm text-gray-500">From Warehouse to {currentDelivery.deliveryAddress}</p>
                            </div>
                        </div>
                    </div>

                </div>
            )
        },
        {
            id: 'items',
            label: 'Items',
            icon: <Package2 className="w-4 h-4" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Delivery Items</h4>
                        <div className="space-y-3">
                            {deliveryItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h5 className="font-medium text-gray-800">{item.name}</h5>
                                                <span className={getPaymentStatusBadge(item.status)}>
                                                    {getPaymentStatusIcon(item.status)}
                                                    <span className="capitalize">{item.status.replace('-', ' ')}</span>
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium text-gray-700">Quantity:</span>
                                                    <p>{item.quantity}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Weight:</span>
                                                    <p>{item.weight}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Price:</span>
                                                    <p>${item.price?.toFixed(2) || '0.00'}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Condition:</span>
                                                    <p>
                                                        {item.fragile ? (
                                                            <span className="text-red-600 font-medium">Fragile</span>
                                                        ) : (
                                                            <span className="text-green-600">Standard</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Package className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">Package Summary</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Items:</span>
                                    <span className="font-medium">{deliveryItems.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Weight:</span>
                                    <span className="font-medium">
                                        {deliveryItems.reduce((total, item) => {
                                            const weight = parseFloat(item.weight);
                                            return total + (isNaN(weight) ? 0 : weight);
                                        }, 0).toFixed(1)} kg
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fragile Items:</span>
                                    <span className="font-medium">{deliveryItems.filter(item => item.fragile).length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Value:</span>
                                    <span className="font-medium text-green-600">
                                        ${deliveryItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">Payment Summary</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Paid Items:</span>
                                    <span className="font-medium text-green-600">
                                        {deliveryItems.filter(item => item.status === 'paid').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Not Paid Items:</span>
                                    <span className="font-medium text-red-600">
                                        {deliveryItems.filter(item => item.status === 'not-paid').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pending Items:</span>
                                    <span className="font-medium text-yellow-600">
                                        {deliveryItems.filter(item => item.status === 'pending').length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className={getPaymentStatusBadge(currentDelivery.paymentStatus || 'pending')}>
                                        {getPaymentStatusIcon(currentDelivery.paymentStatus || 'pending')}
                                        <span className="capitalize">{(currentDelivery.paymentStatus || 'pending').replace('-', ' ')}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'history',
            label: 'History',
            icon: <History className="w-4 h-4" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Delivery Timeline</h4>
                        <div className="space-y-4">
                            {[
                                { 
                                    time: 'Jan 19, 2024 at 2:30PM', 
                                    status: 'Arrival at Warehouse', 
                                    description: '' 
                                },
                                { 
                                    time: 'Jan 19, 2024 at 2:30PM', 
                                    status: 'Vehicle Inspection', 
                                    description: '' 
                                },
                                { 
                                    time: 'Jan 19, 2024 at 2:30PM', 
                                    status: 'Goods Loading', 
                                    description: '' 
                                },
                                { 
                                    time: 'Jan 19, 2024 at 2:30PM', 
                                    status: 'End Route', 
                                    description: '' 
                                },
                                { 
                                    time: 'Expected', 
                                    status: 'Delivery Completed', 
                                    description: '' 
                                }
                            ].map((event, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full ${index === 4 ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                                        {index < 4 && <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="font-medium text-gray-800">{event.status}</h5>
                                                {event.description && (
                                                    <p className="text-sm text-gray-600">{event.description}</p>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">{event.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[94vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
                            <p className="text-sm text-gray-500">Complete Information about the scheduled delivery</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex space-x-1 px-6">
                        {modalTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {modalTabs.find(tab => tab.id === activeTab)?.content}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-appTitleBgColor rounded-lg hover:bg-appBanner transition-colors">
                        Start Delivery
                    </button>
                </div>
            </div>
        </div>
    );
};



const DeliveryPerformanceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

    const monthlyData = [
        { month: 'Jan', onTime: 85, delayed: 15 },
        { month: 'Feb', onTime: 88, delayed: 12 },
        { month: 'Mar', onTime: 82, delayed: 18 },
        { month: 'Apr', onTime: 90, delayed: 10 },
        { month: 'May', onTime: 87, delayed: 13 },
        { month: 'Jun', onTime: 92, delayed: 8 },
        { month: 'Jul', onTime: 89, delayed: 11 },
        { month: 'Aug', onTime: 91, delayed: 9 },
        { month: 'Sep', onTime: 86, delayed: 14 },
        { month: 'Oct', onTime: 93, delayed: 7 },
        { month: 'Nov', onTime: 88, delayed: 12 },
        { month: 'Dec', onTime: 94, delayed: 6 }
    ];

    // Pie chart data
    const deliveryStatusData = [
        { status: 'On-Time', percentage: 89, color: '#3b82f6' },
        { status: 'Delayed', percentage: 11, color: '#ef4444' }
    ];

    const delayReasonsData = [
        { reason: 'Goods Damage', percentage: 25, color: '#ef4444' },
        { reason: 'Weather Conditions', percentage: 20, color: '#f59e0b' },
        { reason: 'Congestion', percentage: 18, color: '#8b5cf6' },
        { reason: 'Incorrect Address', percentage: 15, color: '#06b6d4' },
        { reason: 'Vehicle Breakdown', percentage: 12, color: '#84cc16' },
        { reason: 'Others', percentage: 10, color: '#64748b' }
    ];

    // Pie chart component
    const PieChart = ({ data, size = 160 }: { data: Array<{ status?: string; reason?: string; percentage: number; color: string }>, size?: number }) => {
        const radius = size / 2 - 10;
        const circumference = 2 * Math.PI * radius;

        let currentPercentage = 0;

        return (
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    {data.map((item, index) => {
                        const strokeDasharray = circumference;
                        const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
                        const previousPercentage = currentPercentage;
                        currentPercentage += item.percentage;

                        return (
                            <circle
                                key={index}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={item.color}
                                strokeWidth="20"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                style={{
                                    transform: `rotate(${previousPercentage * 3.6}deg)`,
                                    transformOrigin: 'center',
                                    transition: 'all 0.5s ease'
                                }}
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{data[0].percentage}%</div>
                        <div className="text-xs text-gray-500">On-Time</div>
                    </div>
                </div>
            </div>
        );
    };

    const modalTabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <BarChart3 className="w-4 h-4" />,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-blue-800">Total Deliveries</h4>
                                <Package2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-900 mt-2">1,247</p>
                            <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-green-800">On-Time Rate</h4>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-900 mt-2">94.2%</p>
                            <p className="text-xs text-green-600 mt-1">+2.1% improvement</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-purple-800">Avg. Delivery Time</h4>
                                <Clock className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-900 mt-2">38min</p>
                            <p className="text-xs text-purple-600 mt-1">-5min from last week</p>
                        </div>
                    </div>

                    {/* Updated Delivery Performance Trends Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Delivery Performance Trends</h4>
                                <p className="text-sm text-gray-500 mt-1">Monthly on-time vs. delayed delivery percentages</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setChartType('bar')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${chartType === 'bar'
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                        }`}
                                >
                                    <BarChart2 className="w-4 h-4" />
                                    Bar Chart
                                </button>
                                <button
                                    onClick={() => setChartType('line')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${chartType === 'line'
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                                        }`}
                                >
                                    <LineChart className="w-4 h-4" />
                                    Line Chart
                                </button>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-8">
                                <span>100</span>
                                <span>75</span>
                                <span>50</span>
                                <span>25</span>
                                <span>0</span>
                            </div>

                            {/* Chart Area */}
                            <div className="ml-8 border-l border-b border-gray-300 pl-4 pb-6">
                                {chartType === 'bar' ? (
                                    // Bar Chart
                                    <div className="flex items-end justify-between h-48 gap-2">
                                        {monthlyData.map((data, index) => (
                                            <div key={data.month} className="flex flex-col items-center flex-1 gap-1">
                                                <div className="flex items-end justify-center gap-1 w-full" style={{ height: '160px' }}>
                                                    {/* On-Time Bar */}
                                                    <div
                                                        className="w-4 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 relative group"
                                                        style={{ height: `${data.onTime * 1.6}px` }}
                                                    >
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            On-Time: {data.onTime}%
                                                        </div>
                                                    </div>
                                                    {/* Delayed Bar */}
                                                    <div
                                                        className="w-4 bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600 relative group"
                                                        style={{ height: `${data.delayed * 1.6}px` }}
                                                    >
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            Delayed: {data.delayed}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    // Line Chart
                                    <div className="relative h-48">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0">
                                            {[0, 25, 50, 75, 100].map((value) => (
                                                <div
                                                    key={value}
                                                    className="absolute left-0 right-4 border-t border-gray-200"
                                                    style={{ bottom: `${value * 1.6}px` }}
                                                ></div>
                                            ))}
                                        </div>

                                        {/* On-Time Line */}
                                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path
                                                d={`M0,${100 - monthlyData[0].onTime} ${monthlyData.map((data, index) => `L${(index / (monthlyData.length - 1)) * 100},${100 - data.onTime}`).join(' ')}`}
                                                fill="none"
                                                stroke="#3b82f6"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            {monthlyData.map((data, index) => (
                                                <circle
                                                    key={`onTime-${index}`}
                                                    cx={`${(index / (monthlyData.length - 1)) * 100}`}
                                                    cy={`${100 - data.onTime}`}
                                                    r="2"
                                                    fill="#3b82f6"
                                                    className="hover:r-3 transition-all"
                                                />
                                            ))}
                                        </svg>

                                        {/* Delayed Line */}
                                        <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path
                                                d={`M0,${100 - monthlyData[0].delayed} ${monthlyData.map((data, index) => `L${(index / (monthlyData.length - 1)) * 100},${100 - data.delayed}`).join(' ')}`}
                                                fill="none"
                                                stroke="#ef4444"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            {monthlyData.map((data, index) => (
                                                <circle
                                                    key={`delayed-${index}`}
                                                    cx={`${(index / (monthlyData.length - 1)) * 100}`}
                                                    cy={`${100 - data.delayed}`}
                                                    r="2"
                                                    fill="#ef4444"
                                                    className="hover:r-3 transition-all"
                                                />
                                            ))}
                                        </svg>

                                        {/* X-axis labels */}
                                        <div className="flex justify-between mt-2">
                                            {monthlyData.map((data) => (
                                                <span key={data.month} className="text-xs text-gray-600 flex-1 text-center">
                                                    {data.month}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                <span className="text-sm text-gray-600">On-Time Deliveries</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded"></div>
                                <span className="text-sm text-gray-600">Delayed Deliveries</span>
                            </div>
                        </div>
                    </div>

                    {/* Pie Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* On-Time vs Delayed Deliveries Pie Chart */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">On-Time vs Delayed Deliveries</h4>
                                <p className="text-sm text-gray-500 mt-1">Distribution of delivery statuses</p>
                            </div>
                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                <PieChart data={deliveryStatusData} size={160} />
                                <div className="space-y-3 flex-1">
                                    {deliveryStatusData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: item.color }}
                                                ></div>
                                                <span className="text-sm text-gray-700">{item.status}</span>
                                            </div>
                                            <span className="font-medium text-gray-800">{item.percentage}%</span>
                                        </div>
                                    ))}
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Deliveries</span>
                                            <span className="font-medium text-gray-800">1,247</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delay Reasons Pie Chart */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">Delay Reasons</h4>
                                <p className="text-sm text-gray-500 mt-1">Common causes for delivery delays</p>
                            </div>
                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                <PieChart data={delayReasonsData} size={160} />
                                <div className="space-y-3 flex-1">
                                    {delayReasonsData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: item.color }}
                                                ></div>
                                                <span className="text-sm text-gray-700">{item.reason}</span>
                                            </div>
                                            <span className="font-medium text-gray-800">{item.percentage}%</span>
                                        </div>
                                    ))}
                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Delayed</span>
                                            <span className="font-medium text-gray-800">137</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'region',
            label: 'Region',
            icon: <Map className="w-4 h-4" />,
            content: (
                <div className="space-y-6">
                    {/* Regional Performance Bar Chart */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-800">Regional Performance</h4>
                            <p className="text-sm text-gray-500 mt-1">Delivery performance across different regions</p>
                        </div>

                        {/* Regional Bar Chart Data */}
                        {(() => {
                            const regionalMonthlyData = [
                                { month: 'Jan', north: 92, south: 88, east: 85, west: 90 },
                                { month: 'Feb', north: 94, south: 86, east: 87, west: 91 },
                                { month: 'Mar', north: 91, south: 89, east: 84, west: 92 },
                                { month: 'Apr', north: 93, south: 87, east: 86, west: 89 },
                                { month: 'May', north: 95, south: 85, east: 88, west: 90 },
                                { month: 'Jun', north: 92, south: 90, east: 83, west: 91 },
                                { month: 'Jul', north: 90, south: 88, east: 85, west: 93 },
                                { month: 'Aug', north: 93, south: 86, east: 87, west: 89 },
                                { month: 'Sep', north: 91, south: 89, east: 84, west: 92 },
                                { month: 'Oct', north: 94, south: 87, east: 86, west: 90 },
                                { month: 'Nov', north: 92, south: 85, east: 88, west: 91 },
                                { month: 'Dec', north: 95, south: 90, east: 83, west: 93 }
                            ];

                            const regionColors = {
                                north: '#059669', // Deep Green
                                south: '#2563eb', // Deep Blue
                                east: '#7c3aed',  // Deep Purple
                                west: '#db2777'   // Deep Pink
                            };

                            return (
                                <div className="relative">
                                    {/* Y-axis labels */}
                                    <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-8">
                                        <span>100</span>
                                        <span>75</span>
                                        <span>50</span>
                                        <span>25</span>
                                        <span>0</span>
                                    </div>

                                    {/* Chart Area */}
                                    <div className="ml-8 border-l border-b border-gray-300 pl-4 pb-6">
                                        <div className="flex items-end justify-between h-48 gap-1">
                                            {regionalMonthlyData.map((monthData, index) => (
                                                <div key={monthData.month} className="flex flex-col items-center flex-1 gap-1">
                                                    <div className="flex items-end justify-center gap-1 w-full" style={{ height: '160px' }}>
                                                        {/* North Bar */}
                                                        <div
                                                            className="w-3 rounded-t transition-all duration-300 hover:opacity-80 relative group"
                                                            style={{
                                                                height: `${monthData.north * 1.6}px`,
                                                                backgroundColor: regionColors.north
                                                            }}
                                                        >
                                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                North: {monthData.north}%
                                                            </div>
                                                        </div>
                                                        {/* South Bar */}
                                                        <div
                                                            className="w-3 rounded-t transition-all duration-300 hover:opacity-80 relative group"
                                                            style={{
                                                                height: `${monthData.south * 1.6}px`,
                                                                backgroundColor: regionColors.south
                                                            }}
                                                        >
                                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                South: {monthData.south}%
                                                            </div>
                                                        </div>
                                                        {/* East Bar */}
                                                        <div
                                                            className="w-3 rounded-t transition-all duration-300 hover:opacity-80 relative group"
                                                            style={{
                                                                height: `${monthData.east * 1.6}px`,
                                                                backgroundColor: regionColors.east
                                                            }}
                                                        >
                                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                East: {monthData.east}%
                                                            </div>
                                                        </div>
                                                        {/* West Bar */}
                                                        <div
                                                            className="w-3 rounded-t transition-all duration-300 hover:opacity-80 relative group"
                                                            style={{
                                                                height: `${monthData.west * 1.6}px`,
                                                                backgroundColor: regionColors.west
                                                            }}
                                                        >
                                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                                West: {monthData.west}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-600 mt-2">{monthData.month}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Regional Legend */}
                        <div className="flex justify-center gap-6 mt-6 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#059669' }}></div>
                                <span className="text-sm text-gray-600">North</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#2563eb' }}></div>
                                <span className="text-sm text-gray-600">South</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#7c3aed' }}></div>
                                <span className="text-sm text-gray-600">East</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#db2777' }}></div>
                                <span className="text-sm text-gray-600">West</span>
                            </div>
                        </div>
                    </div>

                    {/* Regional Details Table */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-800">Regional Details</h4>
                            <p className="text-sm text-gray-500 mt-1">Detailed performance metrics for each region</p>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-appTitleBgColor text-white border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Region</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">On-Time %</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Delay %</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Successful Deliveries</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Cancel Deliveries</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Top Reasons</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {[
                                        {
                                            region: 'North',
                                            onTime: 92,
                                            delay: 8,
                                            successfulDeliveries: 324,
                                            cancelDeliveries: 12,
                                            topReasons: ['Weather Conditions', 'Traffic Congestion']
                                        },
                                        {
                                            region: 'South',
                                            onTime: 88,
                                            delay: 12,
                                            successfulDeliveries: 287,
                                            cancelDeliveries: 18,
                                            topReasons: ['Traffic Congestion', 'Vehicle Issues']
                                        },
                                        {
                                            region: 'East',
                                            onTime: 85,
                                            delay: 15,
                                            successfulDeliveries: 198,
                                            cancelDeliveries: 23,
                                            topReasons: ['Weather Conditions', 'Incorrect Address']
                                        },
                                        {
                                            region: 'West',
                                            onTime: 90,
                                            delay: 10,
                                            successfulDeliveries: 256,
                                            cancelDeliveries: 9,
                                            topReasons: ['Traffic Congestion', 'Weather Conditions']
                                        }
                                    ].map((region, index) => (
                                        <tr key={region.region} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded"
                                                        style={{
                                                            backgroundColor:
                                                                region.region === 'North' ? '#059669' :
                                                                    region.region === 'South' ? '#2563eb' :
                                                                        region.region === 'East' ? '#7c3aed' : '#db2777'
                                                        }}
                                                    ></div>
                                                    {region.region}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                <span className="font-medium text-green-600">{region.onTime}%</span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                <span className="font-medium text-red-600">{region.delay}%</span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                <span className="font-medium">{region.successfulDeliveries}</span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                <span className="font-medium text-orange-600">{region.cancelDeliveries}</span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                <div className="flex flex-wrap gap-2">
                                                    {region.topReasons.map((reason, reasonIndex) => (
                                                        <span
                                                            key={reasonIndex}
                                                            className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200"
                                                        >
                                                            <AlertCircle className="w-3 h-3" />
                                                            {reason}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'deliveries',
            label: 'Deliveries',
            icon: <Package2 className="w-4 h-4" />,
            content: (
                <div className="space-y-6">
                    {/* Recent Deliveries Table */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-800">Recent Deliveries</h4>
                            <p className="text-sm text-gray-500 mt-1">Detailed list of recent deliveries and their performance</p>
                        </div>

                        {/* Recent Deliveries Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-appTitleBgColor text-white border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">ORDER ID</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">CUSTOMER</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">DESTINATION</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">STATUS</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">SCHEDULED</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">ACTUAL</th>
                                        <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">ON TIME</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {[
                                        {
                                            orderId: 'ORD-001',
                                            customer: 'John Smith',
                                            destination: '123 Main St, New York',
                                            status: 'Delivered',
                                            scheduled: '10:00 AM',
                                            actual: '9:45 AM',
                                            onTime: 'Yes'
                                        },
                                        {
                                            orderId: 'ORD-002',
                                            customer: 'Sarah Johnson',
                                            destination: '456 Oak Ave, Brooklyn',
                                            status: 'Delivered',
                                            scheduled: '11:30 AM',
                                            actual: '12:15 PM',
                                            onTime: 'No'
                                        },
                                        {
                                            orderId: 'ORD-003',
                                            customer: 'Mike Davis',
                                            destination: '789 Pine St, Queens',
                                            status: 'In Transit',
                                            scheduled: '2:00 PM',
                                            actual: '-',
                                            onTime: '-'
                                        },
                                        {
                                            orderId: 'ORD-004',
                                            customer: 'Emily Wilson',
                                            destination: '321 Elm St, Manhattan',
                                            status: 'Delivered',
                                            scheduled: '3:45 PM',
                                            actual: '3:30 PM',
                                            onTime: 'Yes'
                                        },
                                        {
                                            orderId: 'ORD-005',
                                            customer: 'David Brown',
                                            destination: '654 Maple Rd, Brooklyn',
                                            status: 'Delivered',
                                            scheduled: '1:15 PM',
                                            actual: '2:30 PM',
                                            onTime: 'No'
                                        },
                                        {
                                            orderId: 'ORD-006',
                                            customer: 'Lisa Taylor',
                                            destination: '987 Cedar Ln, Queens',
                                            status: 'Scheduled',
                                            scheduled: '4:30 PM',
                                            actual: '-',
                                            onTime: '-'
                                        },
                                        {
                                            orderId: 'ORD-007',
                                            customer: 'Robert Clark',
                                            destination: '159 Birch St, Manhattan',
                                            status: 'Delivered',
                                            scheduled: '9:00 AM',
                                            actual: '8:45 AM',
                                            onTime: 'Yes'
                                        },
                                        {
                                            orderId: 'ORD-008',
                                            customer: 'Jennifer Lee',
                                            destination: '753 Spruce Ave, Brooklyn',
                                            status: 'Delivered',
                                            scheduled: '10:45 AM',
                                            actual: '11:20 AM',
                                            onTime: 'No'
                                        }
                                    ].map((delivery, index) => (
                                        <tr key={delivery.orderId} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {delivery.orderId}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                {delivery.customer}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-gray-400" />
                                                    <span className="truncate max-w-[150px]">{delivery.destination}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${delivery.status === 'Delivered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : delivery.status === 'In Transit'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {delivery.status === 'In Transit' && <Truck className="w-3 h-3 mr-1" />}
                                                    {delivery.status === 'Delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                    {delivery.status === 'Scheduled' && <Clock className="w-3 h-3 mr-1" />}
                                                    {delivery.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    {delivery.scheduled}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                <div className="flex items-center gap-1">
                                                    {delivery.actual !== '-' && <Clock className="w-3 h-3 text-gray-400" />}
                                                    {delivery.actual}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {delivery.onTime === 'Yes' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Yes
                                                    </span>
                                                ) : delivery.onTime === 'No' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        No
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Summary */}
                        <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">8</span> of <span className="font-medium">1247</span> deliveries
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                    Previous
                                </button>
                                <button className="px-3 py-1 text-sm bg-appTitleBgColor text-white rounded hover:appBanner transition-colors">
                                    1
                                </button>
                                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[94vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Delivery Performance Analytics</h2>
                            <p className="text-sm text-gray-500">Detailed insights and metrics</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex space-x-1 px-6">
                        {modalTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id
                                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {modalTabs.find(tab => tab.id === activeTab)?.content}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {/* Add export functionality */ }}
                        className="px-4 py-2 text-sm font-medium text-white bg-appTitleBgColor rounded-lg hover:bg-appBanner transition-colors"
                    >
                        Export Report
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeliveriesPage = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([
        // Today's Deliveries
        {
            id: '1',
            orderId: 'ORD-001',
            customer: 'John Smith',
            deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
            schedule: 'ASAP',
            status: 'active',
            priority: 'high',
            deliveryDate: new Date().toISOString().split('T')[0], // Today
            customerEmail: 'john.smith@example.com',
            customerPhone: '+1 (555) 123-4567',
            driverName: 'Michael Johnson',
            driverEmail: 'michael.johnson@delivery.com',
            driverPhone: '+1 (555) 987-6543',
            vehicleType: 'Toyota',
            vehicleModel: 'Camry',
            plateNumber: 'ABC-1234',
            paymentStatus: 'paid'
        },
        {
            id: '2',
            orderId: 'ORD-002',
            customer: 'Sarah Johnson',
            deliveryAddress: '456 Oak Ave, Suite 200, Brooklyn, NY 11201',
            schedule: 'Within 2 hours',
            status: 'active',
            priority: 'medium',
            deliveryDate: new Date().toISOString().split('T')[0], // Today
            customerEmail: 'sarah.johnson@example.com',
            customerPhone: '+1 (555) 234-5678',
            driverName: 'David Wilson',
            driverEmail: 'david.wilson@delivery.com',
            driverPhone: '+1 (555) 876-5432',
            vehicleType: 'Honda',
            vehicleModel: 'Civic',
            plateNumber: 'XYZ-5678',
            paymentStatus: 'not-paid'
        },
        {
            id: '3',
            orderId: 'ORD-003',
            customer: 'Mike Davis',
            deliveryAddress: '789 Pine St, Floor 3, Queens, NY 11355',
            schedule: 'Today EOD',
            status: 'active',
            priority: 'low',
            deliveryDate: new Date().toISOString().split('T')[0], // Today
            customerEmail: 'mike.davis@example.com',
            customerPhone: '+1 (555) 345-6789',
            driverName: 'Robert Brown',
            driverEmail: 'robert.brown@delivery.com',
            driverPhone: '+1 (555) 765-4321',
            vehicleType: 'Ford',
            vehicleModel: 'Transit',
            plateNumber: 'DEF-9012',
            paymentStatus: 'pending'
        },
        // Tomorrow's Deliveries
        {
            id: '4',
            orderId: 'ORD-004',
            customer: 'Emily Wilson',
            deliveryAddress: '321 Elm St, Unit 5, Manhattan, NY 10016',
            schedule: 'Tomorrow 10:00 AM',
            status: 'scheduled',
            priority: 'high',
            deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            customerEmail: 'emily.wilson@example.com',
            customerPhone: '+1 (555) 456-7890',
            driverName: 'James Taylor',
            driverEmail: 'james.taylor@delivery.com',
            driverPhone: '+1 (555) 654-3210',
            vehicleType: 'Toyota',
            vehicleModel: 'RAV4',
            plateNumber: 'GHI-3456',
            paymentStatus: 'paid'
        },
        {
            id: '5',
            orderId: 'ORD-005',
            customer: 'David Brown',
            deliveryAddress: '654 Maple Rd, Brooklyn, NY 11215',
            schedule: 'Tomorrow 2:30 PM',
            status: 'scheduled',
            priority: 'medium',
            deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            customerEmail: 'david.brown@example.com',
            customerPhone: '+1 (555) 567-8901',
            driverName: 'Thomas Clark',
            driverEmail: 'thomas.clark@delivery.com',
            driverPhone: '+1 (555) 543-2109',
            vehicleType: 'Nissan',
            vehicleModel: 'Altima',
            plateNumber: 'JKL-7890',
            paymentStatus: 'not-paid'
        },
        // This Week Deliveries
        {
            id: '6',
            orderId: 'ORD-006',
            customer: 'Lisa Taylor',
            deliveryAddress: '987 Cedar Ln, Queens, NY 11354',
            schedule: 'Dec 15, 11:00 AM',
            status: 'scheduled',
            priority: 'low',
            deliveryDate: '2024-12-15',
            customerEmail: 'lisa.taylor@example.com',
            customerPhone: '+1 (555) 678-9012',
            driverName: 'Jennifer Lee',
            driverEmail: 'jennifer.lee@delivery.com',
            driverPhone: '+1 (555) 432-1098',
            vehicleType: 'Hyundai',
            vehicleModel: 'Elantra',
            plateNumber: 'MNO-1234',
            paymentStatus: 'pending'
        },
        {
            id: '7',
            orderId: 'ORD-007',
            customer: 'Robert Clark',
            deliveryAddress: '159 Birch St, Manhattan, NY 10022',
            schedule: 'Dec 16, 3:00 PM',
            status: 'scheduled',
            priority: 'medium',
            deliveryDate: '2024-12-16',
            customerEmail: 'robert.clark@example.com',
            customerPhone: '+1 (555) 789-0123',
            driverName: 'Maria Garcia',
            driverEmail: 'maria.garcia@delivery.com',
            driverPhone: '+1 (555) 321-0987',
            vehicleType: 'Chevrolet',
            vehicleModel: 'Malibu',
            plateNumber: 'PQR-5678',
            paymentStatus: 'paid'
        },
        // Scheduled Deliveries (Future dates)
        {
            id: '8',
            orderId: 'ORD-008',
            customer: 'Jennifer Lee',
            deliveryAddress: '753 Spruce Ave, Brooklyn, NY 11217',
            schedule: 'Dec 20, 1:00 PM',
            status: 'scheduled',
            priority: 'high',
            deliveryDate: '2024-12-20',
            customerEmail: 'jennifer.lee@example.com',
            customerPhone: '+1 (555) 890-1234',
            driverName: 'Daniel Martinez',
            driverEmail: 'daniel.martinez@delivery.com',
            driverPhone: '+1 (555) 210-9876',
            vehicleType: 'Toyota',
            vehicleModel: 'Corolla',
            plateNumber: 'STU-9012',
            paymentStatus: 'not-paid'
        },
        {
            id: '9',
            orderId: 'ORD-009',
            customer: 'Thomas White',
            deliveryAddress: '486 Walnut St, Queens, NY 11356',
            schedule: 'Dec 22, 4:30 PM',
            status: 'scheduled',
            priority: 'medium',
            deliveryDate: '2024-12-22',
            customerEmail: 'thomas.white@example.com',
            customerPhone: '+1 (555) 901-2345',
            driverName: 'Sarah Davis',
            driverEmail: 'sarah.davis@delivery.com',
            driverPhone: '+1 (555) 098-7654',
            vehicleType: 'Kia',
            vehicleModel: 'Optima',
            plateNumber: 'VWX-3456',
            paymentStatus: 'pending'
        },
        // Completed Deliveries
        {
            id: '10',
            orderId: 'ORD-010',
            customer: 'Maria Garcia',
            deliveryAddress: '624 Cherry Blvd, Manhattan, NY 10019',
            schedule: 'Dec 8, 2:00 PM',
            status: 'completed',
            priority: 'high',
            deliveryDate: '2024-12-08',
            customerEmail: 'maria.garcia@example.com',
            customerPhone: '+1 (555) 012-3456',
            driverName: 'Kevin Anderson',
            driverEmail: 'kevin.anderson@delivery.com',
            driverPhone: '+1 (555) 876-5432',
            vehicleType: 'Ford',
            vehicleModel: 'Focus',
            plateNumber: 'YZA-7890',
            paymentStatus: 'paid'
        },
        {
            id: '11',
            orderId: 'ORD-011',
            customer: 'James Wilson',
            deliveryAddress: '357 Oak Street, Bronx, NY 10458',
            schedule: 'Dec 7, 11:00 AM',
            status: 'completed',
            priority: 'medium',
            deliveryDate: '2024-12-07',
            customerEmail: 'james.wilson@example.com',
            customerPhone: '+1 (555) 123-4567',
            driverName: 'Amanda Thompson',
            driverEmail: 'amanda.thompson@delivery.com',
            driverPhone: '+1 (555) 765-4321',
            vehicleType: 'Toyota',
            vehicleModel: 'Prius',
            plateNumber: 'BCD-1234',
            paymentStatus: 'paid'
        }
    ]);

    const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
    const [isDeliveryDetailsModalOpen, setIsDeliveryDetailsModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    const [deliveryToReschedule, setDeliveryToReschedule] = useState<Delivery | null>(null);

    // Function to update delivery priority
    const handlePriorityUpdate = (deliveryId: string, priority: 'high' | 'medium' | 'low') => {
        setDeliveries(prev => prev.map(delivery =>
            delivery.id === deliveryId ? { ...delivery, priority } : delivery
        ));
    };

    // Function to handle reschedule delivery
    const handleRescheduleDelivery = (deliveryId: string, newDate: string, reason: string) => {
        setDeliveries(prev => prev.map(delivery =>
            delivery.id === deliveryId ? {
                ...delivery,
                deliveryDate: newDate,
                status: 'scheduled' as const
            } : delivery
        ));
        // You can add API call here to update the delivery in the backend
        alert(`Delivery ${deliveryId} rescheduled to ${new Date(newDate).toLocaleDateString()}`);
    };

    // Open delivery details modal
    const openDeliveryDetails = (delivery: Delivery) => {
        setSelectedDelivery(delivery);
        setIsDeliveryDetailsModalOpen(true);
    };

    // Close delivery details modal
    const closeDeliveryDetails = () => {
        setIsDeliveryDetailsModalOpen(false);
        setSelectedDelivery(null);
    };

    // Open reschedule modal
    const openRescheduleModal = (delivery: Delivery) => {
        setDeliveryToReschedule(delivery);
        setIsRescheduleModalOpen(true);
    };

    // Close reschedule modal
    const closeRescheduleModal = () => {
        setIsRescheduleModalOpen(false);
        setDeliveryToReschedule(null);
    };

    // Delete a delivery
    const handleDeleteDelivery = (deliveryId: string) => {
        if (window.confirm('Are you sure you want to delete this delivery?')) {
            setDeliveries(prev => prev.filter(delivery => delivery.id !== deliveryId));
        }
    };

    const getStatusIcon = (status: Delivery['status']) => {
        switch (status) {
            case 'active':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'scheduled':
                return <Calendar className="w-4 h-4 text-green-500" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'cancelled':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getPriorityBadge = (priority: Delivery['priority']) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (priority) {
            case 'high':
                return `${baseClasses} bg-red-100 text-red-800 flex items-center gap-1`;
            case 'medium':
                return `${baseClasses} bg-yellow-100 text-yellow-800 flex items-center gap-1`;
            case 'low':
                return `${baseClasses} bg-green-100 text-green-800 flex items-center gap-1`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getPriorityIcon = (priority: Delivery['priority']) => {
        switch (priority) {
            case 'high':
                return <ArrowUp className="w-3 h-3" />;
            case 'medium':
                return <span className="w-2 h-2 bg-current rounded-full" />;
            case 'low':
                return <ArrowDown className="w-3 h-3" />;
            default:
                return null;
        }
    };

    // Helper functions for filtering
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const getThisWeekDates = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday

        return {
            start: startOfWeek.toISOString().split('T')[0],
            end: endOfWeek.toISOString().split('T')[0]
        };
    };

    // Calculate statistics
    const totalDeliveries = deliveries.length;
    const todayDeliveries = deliveries.filter(delivery => delivery.deliveryDate === getTodayDate()).length;
    const completedDeliveries = deliveries.filter(delivery => delivery.status === 'completed').length;
    const activeDeliveries = deliveries.filter(delivery => delivery.status === 'active').length;

    const TableContent = ({ filterType }: { filterType: 'all' | 'today' | 'tomorrow' | 'this-week' | 'scheduled' }) => {
        let filteredDeliveries: Delivery[] = [];

        switch (filterType) {
            case 'all':
                filteredDeliveries = deliveries;
                break;
            case 'today':
                filteredDeliveries = deliveries.filter(delivery => delivery.deliveryDate === getTodayDate());
                break;
            case 'tomorrow':
                filteredDeliveries = deliveries.filter(delivery => delivery.deliveryDate === getTomorrowDate());
                break;
            case 'this-week':
                const weekDates = getThisWeekDates();
                filteredDeliveries = deliveries.filter(delivery =>
                    delivery.deliveryDate >= weekDates.start && delivery.deliveryDate <= weekDates.end
                );
                break;
            case 'scheduled':
                filteredDeliveries = deliveries.filter(delivery =>
                    delivery.status === 'scheduled' && delivery.deliveryDate > getTomorrowDate()
                );
                break;
            default:
                filteredDeliveries = deliveries;
        }

        if (filteredDeliveries.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <p>No deliveries found for {filterType}.</p>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                {/* Optimized Table Header with Better Column Distribution */}
                <div className="grid grid-cols-12 bg-appTitleBgColor px-6 py-4 gap-4">
                    <div className="col-span-2 font-medium text-xs text-white uppercase tracking-wider text-center">ORDER ID</div>
                    <div className="col-span-2 font-medium text-xs text-white uppercase tracking-wider text-center">CUSTOMER</div>
                    <div className="col-span-4 font-medium text-xs text-white uppercase tracking-wider text-center">DELIVERY ADDRESS</div>
                    <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">SCHEDULE</div>
                    <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">STATUS</div>
                    <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">PRIORITY</div>
                    <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">ACTIONS</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredDeliveries.map((delivery) => (
                        <div key={delivery.id} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors duration-150 gap-4 items-center">
                            {/* Order ID */}
                            <div className="col-span-2 flex items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <Package className="text-indigo-600 w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-gray-900 text-sm">{delivery.orderId}</span>
                                </div>
                            </div>

                            {/* Customer */}
                            <div className="col-span-2 flex items-center justify-center">
                                <div className="flex items-center gap-2">
                                    <User className="text-gray-400 w-4 h-4" />
                                    <span className="text-sm text-gray-600 truncate max-w-[120px]">{delivery.customer}</span>
                                </div>
                            </div>

                            {/* Delivery Address - More Space */}
                            <div className="col-span-4 flex items-start justify-center">
                                <div className="flex items-start gap-3 w-full max-w-none">
                                    <MapPin className="text-red-400 mt-0.5 flex-shrink-0 w-4 h-4" />
                                    <span className="text-sm text-gray-600 leading-tight text-left flex-1">{delivery.deliveryAddress}</span>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="col-span-1 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-1">
                                    <Clock className="text-gray-400 w-4 h-4" />
                                    <span className="text-xs text-gray-600 text-center leading-tight">{delivery.schedule}</span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-1 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-1">
                                    {getStatusIcon(delivery.status)}
                                    <span className="capitalize text-xs text-gray-700">{delivery.status}</span>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="col-span-1 flex items-center justify-center">
                                <div className="flex justify-center">
                                    <span className={getPriorityBadge(delivery.priority)}>
                                        {getPriorityIcon(delivery.priority)}
                                        <span className="hidden sm:inline">{delivery.priority}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="col-span-1 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => openDeliveryDetails(delivery)}
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => openRescheduleModal(delivery)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                    title="Reschedule Delivery"
                                >
                                    <Briefcase className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Footer */}
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDeliveries.length}</span> of{' '}
                        <span className="font-medium">{filteredDeliveries.length}</span> deliveries
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="px-3 py-1 rounded-md bg-appTitleBgColor text-white text-sm font-medium hover:bg-appBanner">
                            1
                        </button>
                        <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Calculate counts for each tab
    const todayCount = deliveries.filter(delivery => delivery.deliveryDate === getTodayDate()).length;
    const tomorrowCount = deliveries.filter(delivery => delivery.deliveryDate === getTomorrowDate()).length;
    const thisWeekCount = deliveries.filter(delivery => {
        const weekDates = getThisWeekDates();
        return delivery.deliveryDate >= weekDates.start && delivery.deliveryDate <= weekDates.end;
    }).length;
    const scheduledCount = deliveries.filter(delivery =>
        delivery.status === 'scheduled' && delivery.deliveryDate > getTomorrowDate()
    ).length;

    const tabs = [
        {
            id: 'all',
            label: `All Deliveries (${totalDeliveries})`,
            content: <TableContent filterType="all" />,
        },
        {
            id: 'today',
            label: `Today (${todayCount})`,
            content: <TableContent filterType="today" />,
        },
        {
            id: 'tomorrow',
            label: `Tomorrow (${tomorrowCount})`,
            content: <TableContent filterType="tomorrow" />,
        },
        {
            id: 'this-week',
            label: `This Week (${thisWeekCount})`,
            content: <TableContent filterType="this-week" />,
        },
        {
            id: 'scheduled',
            label: `Scheduled (${scheduledCount})`,
            content: <TableContent filterType="scheduled" />
        },
    ];

    return (
        <DriverDashboardLayout>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">My Deliveries</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Last updated: Today</span>
                        <button
                            onClick={() => setIsPerformanceModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Delivery Performance
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Deliveries Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total Deliveries</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">{totalDeliveries}</p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Truck className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-xs text-blue-500 mt-4 flex items-center">
                            <span className="bg-blue-200 rounded-full px-2 py-1 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                All time deliveries
                            </span>
                        </p>
                    </div>

                    {/* Today's Deliveries Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-green-600 uppercase tracking-wider">Today's Deliveries</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">{todayDeliveries}</p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Calendar className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-xs text-green-500 mt-4 flex items-center">
                            <span className="bg-green-200 rounded-full px-2 py-1 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Scheduled for today
                            </span>
                        </p>
                    </div>

                    {/* Completed Deliveries Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wider">Completed</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">{completedDeliveries}</p>
                            </div>
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-xs text-purple-500 mt-4 flex items-center">
                            <span className="bg-purple-200 rounded-full px-2 py-1 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Successfully delivered
                            </span>
                        </p>
                    </div>

                    {/* Active Deliveries Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-orange-600 uppercase tracking-wider">Active Now</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">{activeDeliveries}</p>
                            </div>
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Package className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-xs text-orange-500 mt-4">
                            <span className="bg-orange-200 rounded-full px-2 py-1">In progress deliveries</span>
                        </p>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="w-full">
                    <Tabs tabs={tabs} defaultTab="all" />
                </div>

                {/* Delivery Performance Modal */}
                <DeliveryPerformanceModal
                    isOpen={isPerformanceModalOpen}
                    onClose={() => setIsPerformanceModalOpen(false)}
                />

                {/* Delivery Details Modal */}
                <DeliveryDetailsModal
                    isOpen={isDeliveryDetailsModalOpen}
                    onClose={closeDeliveryDetails}
                    delivery={selectedDelivery}
                    onPriorityUpdate={handlePriorityUpdate}
                />

                {/* Reschedule Delivery Modal */}
                <RescheduleDeliveryModal
                    isOpen={isRescheduleModalOpen}
                    onClose={closeRescheduleModal}
                    delivery={deliveryToReschedule}
                    onReschedule={handleRescheduleDelivery}
                />

            </div>
        </DriverDashboardLayout>
    );
};

export default DeliveriesPage;