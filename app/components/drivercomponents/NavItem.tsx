import Link from 'next/link';
import { ReactNode } from 'react';

interface NavItemProps {
    href: string;
    active: boolean;
    icon: ReactNode;
    children: ReactNode;
    onClick?: () => void;
}

const NavItem = ({ href, active, icon, children, onClick }: NavItemProps) => {
    return (
        <Link
            href={href}
            className={`flex items-center p-3 rounded-lg ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
            onClick={onClick}
        >
            <span className="mr-3">{icon}</span>
            <span>{children}</span>
        </Link>
    );
};

export default NavItem;