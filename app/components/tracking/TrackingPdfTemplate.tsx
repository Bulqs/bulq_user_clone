import React, { forwardRef } from 'react';
import { MapPin, Calendar, FileText } from 'lucide-react';
import QRCode from "react-qr-code";
import Image from 'next/image';
import logoImage from '@/public/images/logo5.svg';

interface PdfProps {
    data: any;
}

const TrackingPdfTemplate = forwardRef<HTMLDivElement, PdfProps>(({ data }, ref) => {
    // 1. SAFETY CHECK
    if (!data || !data.currentStatus) return null;

    const trackingUrl = `https://yourdomain.com/track/${data?.trackingNumber}`;

    return (
        // REMOVED 'overflow-hidden' to prevent cutting off bottom content
        <div ref={ref} className="w-[800px] bg-white text-gray-800 font-sans relative">

            {/* 1. Header with QR Code */}
            <div className="bg-gradient-to-r from-appBanner to-appNav p-8 text-white relative">
                <div className="flex justify-between items-start">
                    {/* Left Side: Logo & Brand */}
                    <div className="flex items-center gap-4">
                        
                        {/* CLEANED UP LOGO SECTION: Removed double nesting to save height */}
                        <div className="w-24 h-24 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex-shrink-0 flex items-center justify-center shadow-sm">
                            <Image
                                src={logoImage}
                                alt="Logo"
                                className="object-contain w-full h-full"
                                unoptimized
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight">BulQ Logistics</h1>
                            <p className="text-blue-100 text-sm font-medium opacity-90">Shipment Manifest & Status Report</p>
                            <p className="text-[10px] mt-2 opacity-70 uppercase tracking-widest">
                                Generated: {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: QR Code Box */}
                    <div className="bg-white p-2 rounded-lg shadow-lg">
                        <div className="h-20 w-20">
                            <QRCode
                                value={trackingUrl}
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <p className="text-[8px] text-center text-gray-900 font-bold mt-1 uppercase tracking-wider">
                            Scan to Verify
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* 2. Tracking Badge (Tightened spacing mb-6 instead of mb-8) */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Official Tracking Number</p>
                        <h2 className="text-5xl font-mono font-bold text-gray-900 tracking-tight">{data?.trackingNumber}</h2>
                    </div>
                    <div className="text-right">
                        <span className="inline-block px-8 py-3 rounded-full bg-appBanner/10 text-appBanner font-bold border border-appBanner/20 text-lg shadow-sm">
                            {data?.currentStatus?.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                {/* 3. Shipment Details */}
                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <MapPin className="text-appBanner" size={20} />
                            <h3 className="font-bold text-gray-700">Current Location</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{data?.currentLocation || 'N/A'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Last Update: {data?.lastUpdated ? new Date(data?.lastUpdated).toLocaleString() : '---'}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <Calendar className="text-appBanner" size={20} />
                            <h3 className="font-bold text-gray-700">Estimated Delivery</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {data?.estimatedDaysRemaining ? `${data?.estimatedDaysRemaining} Days` : 'Processing'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Standard Shipping</p>
                    </div>
                </div>

                {/* 4. Recent Activity (Reduced margin) */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Recent Activity</h3>
                    <div className="space-y-3">
                        {Array.isArray(data?.stages) && data?.stages.slice(0, 3).map((stage: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className={`mt-1 w-3 h-3 rounded-full ${idx === 0 ? 'bg-appBanner' : 'bg-gray-300'}`} />
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{stage.stage}</p>
                                    <p className="text-[10px] text-gray-500">{stage.date} • {stage.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Shipping Instructions & Operations Manual */}
                <div className="mt-6 border-t-4 border-appBanner pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-appBanner" />
                        Shipping Instructions & Operations Manual
                    </h3>

                    <div className="grid grid-cols-2 gap-8 text-[10px] text-gray-600 leading-relaxed">
                        {/* Column 1 */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1 text-xs">1.1 Package Acceptance Policy</h4>
                                <p><span className="font-semibold text-gray-800">Permitted:</span> Clothing, books, electronics, gadgets.</p>
                                <p className="mt-1"><span className="font-semibold text-gray-800">Limit:</span> Items below $5000 declared value.</p>
                                <p className="mt-1"><span className="font-semibold text-red-600">Restricted:</span> Perishables, Gold, Cash, Liquids.</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-1 text-xs">1.2 Intake Checks</h4>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Inspected for damage.</li>
                                    <li>Weighed & scanned.</li>
                                    <li>Assigned barcode.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1 text-xs">1.3 Unshippable Items</h4>
                                <p>Violations held 14 days. Unclaimed items (60+ days) auctioned.</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-1 text-xs">1.4 Security</h4>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>24/7 surveillance.</li>
                                    <li>Barcode tracking.</li>
                                    <li>Staff checks.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                    <p>© 2026 BulQ Logistics Inc.</p>
                    <p>Support: help@bulq.com</p>
                </div>
            </div>
        </div>
    );
});

TrackingPdfTemplate.displayName = "TrackingPdfTemplate";
export default TrackingPdfTemplate;