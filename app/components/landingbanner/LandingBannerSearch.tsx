import React from 'react'

const LandingBannerSearch = () => {
  return (
      <div className=" flex justify-start items-center py-7 md:px-[23px] relative w-full">
          <input
              className="text-base font-semibold leading-none text-left text-black px-4 py-3 md:py-6 w-full border rounded-lg border-gray-300 outline-none focus:border-appBanner focus:ring-1 focus:ring-appBanner/20 transition-all shadow-sm placeholder-gray-400"
              type="text"
              placeholder="Search"
          />
          <button type="submit" className="absolute right-1 md:right-7 rounded-md bg-appTitleBgColor px-4 py-2 md:py-4 text-sm md:text-base font-bold text-appWhite shadow-md hover:shadow-lg hover:bg-black transition-all z-10">
            Track Orders
          </button>
      </div>
  )
}

export default LandingBannerSearch