"use client"

import { ArrowUp, ArrowDown } from 'lucide-react';

type StatCardProps = {
    title: string;
    value: string | number;
    change: string;
    icon: React.ReactNode;
    trend: 'up' | 'down' | 'neutral';
    bgColor?: string;
    borderColor?: string;
};

const StatCard = ({
    title,
    value,
    change,
    icon,
    trend,
    bgColor = 'bg-white',
    borderColor = 'border-gray-200'
}: StatCardProps) => (
    <div className={`flex flex-col p-6 rounded-xl shadow-sm border ${borderColor} flex-1 min-w-[200px] ${bgColor}`}>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
            {icon}
            <p className="font-medium text-sm">{title}</p>
        </div>
        <p className="font-bold text-2xl mb-1 text-gray-800">{value}</p>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' :
                trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
            {trend === 'up' ? <ArrowUp size={14} /> : trend === 'down' ? <ArrowDown size={14} /> : null}
            <span className="ml-1">{change}</span>
        </div>
    </div>
);

export default StatCard;