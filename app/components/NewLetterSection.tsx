"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import logo from '../../public/images/logo5.svg'
import Link from 'next/link'


export const NewLetterSection: React.FC = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your newsletter signup logic here (e.g., sending a request to your backend)
    };
    return (
        <div className="border-b-2 border-appWhite bg-appLightBlack h-auto p-2 flex flex-shrink overflow-hidden text-appWhite">
            <div className="mx-auto max-w-full lg:py-8 sm:px-2 py-4 md:py-10 lg:px-4 h-auto ">
                <div className="mt-0 grid grid-cols-1 gap-x-16 gap-y-5 lg:grid-cols-3 px-7">

                    <div className="mx-0 flex mt-0">
                        <div className="items-center justify-start md:justify-center flex flex-grow">
                            <Image
                                src={logo}
                                alt="Description of the image"
                                width={300} // The width of the displayed image
                                height={300} // The height of the displayed image
                                className='w-[150px] md:w-[400px] hidden sm:block'
                            />
                        </div>
                    </div>

                    {/* News Letter Form Section Goes Here */}
                    <div className="flex flex-col">
                        <div className="sm:flex-shrink-0 mt-0 xl:mt-4 lg:mt-4">
                            <h3 className="text-lg md:text-2xl leading-6">NEW TO BULQ?</h3>
                            <p className="text-sm md:text-base leading-4 mt-2">Subscribe to our newsletter to get updates on our latest offers</p>
                        </div>
                        <div className="sm:flex items-center justify-evenly mt-4 xl:mt-4 lg:mt-4 xl:pb-0 lg:pb-0 pb-4">
                            <div className="w-full">
                                <form onSubmit={handleSubmit} className='w-full lg:flex items-center justify-center gap-3'>
                                    <div className='lg:flex flex-grow w-full'>
                                        <div className='bg-white flex items-center justify-evenly w-full p-2 xl:px-2 xl:py-1 lg:px-2 lg:py-1'>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="2.0em" viewBox="0 0 512 512" fill='#008080'>
                                                    <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 
                                            64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                                                </svg>
                                            </span>

                                            <input
                                                type="email"
                                                className="p-2 w-full text-base font-medium leading-none text-gray-600 placeholder-gray-600 focus:outline-none bg-gray-100"
                                                placeholder="Enter your email address here"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <button
                                                type='submit'
                                                className="focus:outline-none hover:bg-appTitleBgColor text-sm md:text-base font-medium leading-none text-white py-4 px-6 bg-appNav sm:ml-2 sm:w-auto w-full mt-1 xl:mt-0 lg:mt-0">SUBSCRIBE</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* News Letter Form Section Ends Here */}

                    {/* DOWNLOAD SECTION */}
                    <div className="sm:flex lg:block items-center md:justify-evenly pb-3 ">
                        <div className="flex-col md:flex-row mr-1 gap-4 flex items-center md:justify-center ">
                            <Image
                                src={logo}
                                alt="Description of the image"
                                className="w-[80px] md:w-[170px] hidden sm:block"
                            />
                            <div className="flex items-start justify-start flex-col mt-1 ">
                                <h4 className="eading-5 text-lg">DOWNLOAD BULQ FREE APP</h4>
                                <p className="text-base leading-4 mt-1">Get access to exclusive offers!</p>
                            </div>
                        </div>

                        <div className="sm:flex-shrink-0 flex mt-3 items-center justify-center ">
                            <div className='flex justify-between gap-x-3 gap-y-6 md:justify-evenly w-11/12 md:w-full'>
                                <Link href={'/'} className='download-app-button'>
                                    <div className='md:mr-2 mr-4'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' className=' h-7 md:h-10' viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                                    </div>
                                    <div className='flex items-center flex-col gap-x-1 md:gap-x-2'>
                                        <span className='font-medium  tracking-normal hidden sm:block'> Download on</span>
                                        <p className="text-base mt-0 font-bold">APP STORE</p>
                                    </div>
                                </Link>
                               
                                <Link href={'/'} className='download-app-button'>
                                    <div className='md:mr-2 mr-4'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='#fff' className=' h-6 md:h-10' viewBox="0 0 512 512"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" /></svg>
                                    </div>
                                    <div className='flex items-center flex-col gap-x-1 md:gap-x-2'>
                                        <span className='font-medium  tracking-normal hidden sm:block'> Download on</span>
                                        <p className="text-base mt-0 font-bold">PLAY STORE</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}
