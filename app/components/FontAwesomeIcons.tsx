import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image'
import twitter from '../../public/images/twitter.svg';
import instagram from '../../public/images/instagram.svg';
import facebook from '../../public/images/facebook.svg';
import linkedin from '../../public/images/linkedin.svg';
import tiktok from '../../public/images/tiktok.svg';

export const FontAwesomeIcons: React.FC = () => {
    return (
        <div className=' flex w-full rounded-md'>
            <div className="flex items-center justify-between gap-2">
                <Link href="#" className="flex items-center justify-center bg-white rounded-md">
                    <Image
                        src={twitter}
                        alt="Description of the image"
                        className='h-6 md:h-10 w-6 md:w-10'
                    />
                </Link>
                <Link href="#" className="flex items-center justify-center bg-white rounded-md">
                    <Image
                        src={instagram}
                        alt="Description of the image"
                        className='h-6 md:h-10 w-6 md:w-10'
                    />
                </Link>
                <Link href="#" className="flex items-center justify-center bg-white rounded-md">
                    <Image
                        src={facebook}
                        alt="Description of the image"
                        className='h-6 md:h-10 w-6 md:w-10'
                    />
                </Link>
                <Link href="#" className="flex items-center justify-center bg-white rounded-md">
                    <Image
                        src={linkedin}
                        alt="Description of the image"
                        className='h-6 md:h-10 w-6 md:w-10'
                    />
                </Link>
                <Link href="#" className="flex items-center justify-center bg-white rounded-md">
                    <Image
                        src={tiktok}
                        alt="Description of the image"
                        className='h-6 md:h-10 w-6 md:w-10'
                    />
                </Link>
            </div>
        </div>
    )
}
