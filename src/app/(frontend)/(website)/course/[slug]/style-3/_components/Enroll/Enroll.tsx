import Image from 'next/image'
import React from 'react'
import company from '../../_assets/images/top-company-hiring.webp'

const Enroll = () => {
  return (
    <div className='bg-gradient-to-r from-primary-400 to-primary-700'>
        <div className='container mx-auto text-card h-[700px] lg:h-[420px]'>
            <div className='flex lg:flex-row flex-col justify-center items-center gap-7'>
                <div className="lg:w-[50%] lg:h-[432px] flex flex-col justify-center items-center gap-7 px-4">                 
                    <h1 className='text-[2rem] text-center lg:text-start font-semibold mb-4 lg:mb-0 mt-8 lg:mt-0'>Still Confused? Want to know more?</h1>
                    <div className='flex flex-col lg:flow-row items-center gap-3 w-full'>
                        <div className="w-full lg:w-[60%] p-5 bg-card rounded-xl">
                            <input type="tel"  maxLength={13} autoComplete="tel" pattern="03[0-9]{2}-[0-9]{7}" inputMode="tel" placeholder="03XX-XXXXXXX" className="text-foreground w-full outline-none" />
                        </div>
                        <button className="w-full lg:w-[40%] bg-warning text-foreground cursor-pointer p-5 rounded-xl">
                            <h1 className='text-[1rem] text-center font-semibold '>Book Demo Now</h1>
                        </button>
                    </div>
                    <p className="hidden lg:block text-[14px] mt-4">Secure your spot quickly—seats are filling fast! Don&apos;t miss out—enroll now and take the first step towards transforming your career!</p>     
                </div>
                <div className="lg:w-[50%] flex flex-col px-4">
                    <p className='text-[14px] font-medium mb-4 text-center lg:text-start'>NexusBerry TECH GRADUATES HAVE BEEN HIRED BY</p>
                    <Image src={company} alt='company' className='rounded-xl' />
                    <p className="lg:hidden flex text-center  text-[20px] mt-6">Secure your spot quickly—seats are filling fast! Don&apos;t miss out—enroll now and take the first step towards transforming your career!</p> 
                </div>
            </div>
        </div>
    </div>
  )
}

export default Enroll