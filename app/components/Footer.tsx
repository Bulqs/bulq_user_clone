import React from 'react'
import Link from 'next/link';
import Image from 'next/image'
import { navigation } from '@/data/data';
import { FontAwesomeIcons } from './FontAwesomeIcons';
import mastercard2 from '../../public/images/mastercard2.png';
import stripe from '../../public/images/stripe.png';

const Footer = () => {
    return (
        <footer className="bg-appTitleBgColor px-10 pt-10" aria-labelledby="footer-heading">
            <div className="mt-0 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {navigation.map((item) => (
                    <div key={item.title} className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-appTitleBgColor lg:aspect-none xl:h-80 lg:h-80">
                            <ul className=''>
                                <h4 className="text-appWhite font-inter font-bold mb-1 md:mb-3 text-base md:text-lg">{item.title}</h4>
                                <li className='inline'>
                                    {item.links.map((item) => (
                                        <Link key={item.title} href={item.url} className=" italic leading-4 md:leading-8 font-lato text-sm md:text-base text-appWhite hover:text-white">
                                            {item.title}
                                            <span> <br /> </span>
                                        </Link>
                                    ))}
                                </li>
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-full px-0  pb-8 pt-10  lg:px-0 bg-appTitleBgColor">
                <div className="mt-0 pt-0 sm:mt-10 flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between lg:mt-0 bg-appTitleBgColor">
                    <div className="md:order-2 bg-appTitleBgColor gap-3">
                        <div>
                            <h4 className="text-appWhite font-inter text-base md:text-xl"> Join Bulq on</h4>
                        </div>
                        <div className='mt-4'>
                            <FontAwesomeIcons />
                        </div>
                    </div>

                    <div className="flex md:space-x-2 md:order-2 xl:mt-12 items-center justify-center">
                        <Image
                            src={mastercard2}
                            alt="Description of the image"
                            className='h-8 md:h-10 w-8 md:w-10'
                        />

                        <Image
                            src={stripe}
                            alt="Description of the image"
                            className='h-8 md:h-10 w-8 md:w-10'
                        />
                        <p className=' font-semibold text-sm  md:text-base md:font-bold text-white'>&copy; {new Date().getFullYear()} BULQ LOGISTICS </p>
                    </div>

                    <div className="flex space-x-6 md:order-2 xl:mt-12 items-center justify-center">
                        <p className="font-bold mt-8 leading-5 text-appWhite font-inter md:order-1 md:mt-0 text-sm md:text-lg">
                            <span className="font-semibold"> Powered By: </span>
                            <span className="font-bold"> Coming Soon </span>
                        </p>
                    </div>

                </div>
            </div>
        </footer >
    )
}

export default Footer;
