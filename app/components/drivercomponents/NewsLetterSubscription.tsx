"use client"
import React, { useState } from 'react'
import { FiMail, FiSend, FiBell } from 'react-icons/fi'

const NewsLetterSubscription: React.FC = () => {
    const [email, setEmail] = useState('')
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle subscription logic here
        console.log('Subscribed with email:', email)
        setIsSubscribed(true)
        setEmail('') // Reset the form

        // Reset success message after 3 seconds
        setTimeout(() => {
            setIsSubscribed(false)
        }, 3000)
    }

    return (
        <div className="w-full relative py-16 bg-appTitleBgColor border-b-4 border-white overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10 w-full flex flex-col items-center justify-center max-w-6xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <FiBell className="text-white text-xl" />
                        </div>
                        <h4 className='text-3xl font-bold text-white tracking-tight'>
                            STAY UPDATED
                        </h4>
                    </div>

                    <div className="w-20 h-1 bg-white/30 mx-auto mb-4 rounded-full"></div>

                    <h6 className='text-lg font-medium text-white/90 text-center max-w-2xl leading-relaxed'>
                        Get the latest news, updates, and exclusive offers delivered straight to your inbox
                    </h6>
                </div>

                {/* Subscription Form */}
                <div className="w-full max-w-2xl">
                    {isSubscribed ? (
                        <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                            <div className="flex items-center justify-center gap-3 text-white mb-3">
                                <div className="p-2 bg-green-500/20 rounded-full">
                                    <FiSend className="text-green-400" />
                                </div>
                                <span className="text-lg font-semibold">Successfully Subscribed!</span>
                            </div>
                            <p className="text-white/80 text-sm">
                                Thank you for subscribing to our newsletter. We'll keep you updated with the latest news.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-4 w-full"
                        >
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiMail className="text-appNav" size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="pl-12 w-full px-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-200 text-lg"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="group bg-appNav hover:bg-appNav/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center gap-2 justify-center min-w-[140px] shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <span>Subscribe</span>
                                <FiSend className="group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                        </form>
                    )}
                </div>

                {/* Additional Info */}
                <div className="text-center mt-6">
                    <p className="text-white/70 text-sm max-w-md">
                        Join thousands of subscribers. No spam, unsubscribe at any time.
                    </p>
                </div>
            </div>

            {/* Bottom decorative border */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        </div>
    )
}

export default NewsLetterSubscription