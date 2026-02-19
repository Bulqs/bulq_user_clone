'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    X, Search, Truck, MapPin, Clock, AlertCircle, Package
} from 'lucide-react';
import { getFullTracking } from '@/lib/driver/trackpackage.actions';
import { DisplayTracking } from '@/types/driver';

interface TrackingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTrackingNumber?: string;
}

const TrackingModal = ({ isOpen, onClose, initialTrackingNumber = '' }: TrackingModalProps) => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [currentPkg, setCurrentPkg] = useState<DisplayTracking | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Reusable search function
    const performSearch = useCallback(async (numberToTrack: string) => {
        if (!numberToTrack.trim()) return;

        setIsSearching(true);
        setError(null);
        setCurrentPkg(null);

        try {
            const data = await getFullTracking(numberToTrack);

            if (data.error) {
                setError(data.message || "Package not found");
                return;
            }

            const mappedData: DisplayTracking = {
                ...data,
                stages: data.events.map((event: any) => ({
                    stage: event.eventType.replace(/_/g, ' '),
                    date: new Date(event.eventTime).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                    }),
                    time: new Date(event.eventTime).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit'
                    }),
                    description: event.description,
                    completed: true
                }))
            };

            setCurrentPkg(mappedData);
        } catch (err) {
            setError("Unable to fetch tracking details. Please try again.");
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Auto-search effect when modal opens
    useEffect(() => {
        if (isOpen && initialTrackingNumber) {
            setTrackingNumber(initialTrackingNumber);
            performSearch(initialTrackingNumber);
        } else if (isOpen) {
             setTrackingNumber('');
             setCurrentPkg(null);
             setError(null);
        }
    }, [isOpen, initialTrackingNumber, performSearch]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(trackingNumber);
    };

    const handleClose = () => {
        setTrackingNumber('');
        setCurrentPkg(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent flex items-center gap-2">
                        <Truck className="text-appNav" size={24} />
                        Track Your Shipment
                    </h2>
                    <button 
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Search Bar */}
                    <div className="mb-8">
                        <form onSubmit={handleFormSubmit} className="relative">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter Tracking Number (e.g. BULQ-123...)"
                                className="w-full px-5 py-4 pl-12 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-appNav/20 focus:border-appNav transition-all outline-none text-gray-800"
                                autoFocus
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search size={20} />
                            </div>
                            <button
                                disabled={isSearching}
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-appNav to-appTitleBgColor text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-70 transition-all"
                            >
                                {isSearching ? '...' : 'Track'}
                            </button>
                        </form>
                    </div>

                    <div className="min-h-[200px]">
                        
                        {/* Loading State */}
                        {isSearching && (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <div className="w-12 h-12 border-4 border-appBanner/20 border-t-appBanner rounded-full animate-spin mb-4" />
                                <p>Locating package...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {!isSearching && error && (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-red-50 rounded-xl border border-red-100">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                    <AlertCircle className="text-red-600" size={24} />
                                </div>
                                <h3 className="text-red-900 font-bold">Tracking Failed</h3>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isSearching && !currentPkg && !error && (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                                <Package size={48} className="mb-3 opacity-20" />
                                <p>Enter a tracking number to see details</p>
                            </div>
                        )}

                        {/* Result State */}
                        {!isSearching && currentPkg && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500">
                                {/* Result Header */}
                                <div className="bg-gradient-to-r from-appTitleBgColor to-appNav rounded-xl p-6 text-white mb-6 relative overflow-hidden">
                                    {/* Decorative Blur */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-appBanner/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    
                                    <div className="relative z-10 flex justify-between items-start">
                                        <div>
                                            <p className="text-appBanner/80 text-xs font-bold uppercase tracking-wider mb-1">Tracking Number</p>
                                            <h3 className="text-2xl font-bold font-mono tracking-wide">{currentPkg.trackingNumber}</h3>
                                        </div>
                                        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                                            <span className="text-sm font-medium">{currentPkg.currentStatus.replace(/_/g, ' ')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-100 text-appNav rounded-lg">
                                                <MapPin size={18} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Current Location</span>
                                        </div>
                                        <p className="font-bold text-gray-900">{currentPkg.currentLocation}</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                                <Clock size={18} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Est. Delivery</span>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            {currentPkg.estimatedDaysRemaining 
                                                ? `${currentPkg.estimatedDaysRemaining} Days` 
                                                : 'Calculating...'}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-5 bg-appNav rounded-full"></div>
                                        Shipment Progress
                                    </h4>
                                    
                                    <div className="space-y-6 relative pl-2">
                                        {/* Vertical Line */}
                                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

                                        {currentPkg.stages.map((stage, idx) => (
                                            <div key={idx} className="relative flex items-start gap-4 group">
                                                {/* Dot */}
                                                <div className={`relative z-10 w-6 h-6 rounded-full border-4 border-white flex-shrink-0 ${idx === 0 ? 'bg-appNav ring-2 ring-appNav/20' : 'bg-gray-300'}`} />
                                                
                                                {/* Content */}
                                                <div className="flex-1 -mt-1">
                                                    <div className="flex justify-between items-start">
                                                        <h5 className={`font-bold text-sm ${idx === 0 ? 'text-appNav' : 'text-gray-700'}`}>
                                                            {stage.stage}
                                                        </h5>
                                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                            {stage.date}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">{stage.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;