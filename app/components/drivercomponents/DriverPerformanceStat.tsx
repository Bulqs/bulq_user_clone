"use client"

import { ArrowUp, ArrowDown, Gauge, Zap, Clock, Package, Fuel, Activity } from 'lucide-react';

type DriverPerformanceStatProps = {
    title: string;
    value: string | number;
    change: string;
    percentage?: number;
    iconType?: 'delivery' | 'fuel' | 'time' | 'speed' | 'utilization' | 'default';
    trend: 'up' | 'down' | 'neutral';
    bgColor?: string;
    borderColor?: string;
};

const getIcon = (iconType: DriverPerformanceStatProps['iconType']) => {
    switch (iconType) {
        case 'delivery':
            return <Package size={16} className="text-blue-500" />;
        case 'fuel':
            return <Fuel size={16} className="text-green-500" />;
        case 'time':
            return <Clock size={16} className="text-amber-500" />;
        case 'speed':
            return <Zap size={16} className="text-purple-500" />;
        case 'utilization':
            return <Activity size={16} className="text-red-500" />;
        default:
            return <Gauge size={16} className="text-gray-500" />;
    }
};

const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
};

const DriverPerformanceStat = ({
    title,
    value,
    change,
    percentage,
    iconType = 'default',
    trend,
    bgColor = 'bg-white',
    borderColor = 'border-gray-200'
}: DriverPerformanceStatProps) => (
    <div className={`flex flex-col p-6 rounded-xl shadow-sm border ${borderColor} flex-1 min-w-[200px] ${bgColor}`}>
        <div className="flex items-center justify-between w-full text-gray-600 mb-2">
            <p className="font-medium text-sm">{title}</p>
            {getIcon(iconType)}
        </div>
        <p className="font-bold text-2xl mb-1 text-gray-800">{value}</p>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' :
            trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
            {trend === 'up' ? <ArrowUp size={14} /> : trend === 'down' ? <ArrowDown size={14} /> : null}
            <span className="ml-1">{change}</span>
        </div>

        {percentage !== undefined && (
            <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${getPercentageColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{percentage}%</span>
                    <span>100%</span>
                </div>
            </div>
        )}
    </div>
);

export default DriverPerformanceStat;