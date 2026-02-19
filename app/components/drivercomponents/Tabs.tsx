"use client"

import { useState } from 'react';

type Tab = {
    id: string;
    label: string;
    content: React.ReactNode;
};

type TabsProps = {
    tabs: Tab[];
    defaultTab?: string;
};

export default function Tabs({ tabs, defaultTab }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    return (
        <div className="flex flex-col w-full">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-200 w-full gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`px-6 py-3 font-medium text-sm focus:outline-none transition-all duration-200 ${activeTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 w-full">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
        </div>
    );
}