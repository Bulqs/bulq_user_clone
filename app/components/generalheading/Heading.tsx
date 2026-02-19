import React, { FC } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingColor = 'primary' | 'secondary' | 'accent' | 'dark' | 'light';
type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type HeadingAlign = 'left' | 'center' | 'right' | 'justify';

interface HeadingProps {
    level: HeadingLevel;
    color?: HeadingColor;
    weight?: HeadingWeight;
    align?: HeadingAlign;
    className?: string;
    children: React.ReactNode;
}

const Heading: FC<HeadingProps> = ({
    level,
    color = 'dark',
    weight = 'bold',
    align = 'left',
    className = '',
    children,
}) => {
    // Color mapping
    const colorStyles = {
        primary: 'text-blue-600 dark:text-blue-400',
        secondary: 'text-gray-600 dark:text-gray-400',
        accent: 'text-indigo-600 dark:text-indigo-400',
        dark: 'text-gray-900 dark:text-gray-100',
        light: 'text-gray-900 dark:text-gray-800',
    };

    // Weight mapping
    const weightStyles = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
    };

    // Alignment mapping
    const alignStyles = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
    };

    // Size styles for each heading level
    const sizeStyles = {
        h1: 'text-4xl md:text-5xl mb-6',
        h2: 'text-3xl md:text-4xl mb-5',
        h3: 'text-2xl md:text-3xl mb-4',
        h4: 'text-xl md:text-2xl mb-3',
        h5: 'text-lg md:text-xl mb-2',
        h6: 'text-base md:text-lg mb-1',
    };

    const combinedClasses = `font-sans ${sizeStyles[level]} ${colorStyles[color]} ${weightStyles[weight]} ${alignStyles[align]} ${className}`;

    return React.createElement(
        level,
        { className: combinedClasses },
        children
    );
};

export default Heading;