import React from 'react'
import { BadgeCheck, Linkedin, Network, Star, ThumbsUp, UsersRound } from 'lucide-react'
import Image from 'next/image'
import heroImg from '../../_assets/images/hero.png'

const Hero = ({ title, summary, instructor }: any) => {
  const img = [
    { id: 1, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-adobe-icon.svg" },
    { id: 2, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-mamaearth-icon.svg" },
    { id: 3, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-accenture-icon.svg" },
    { id: 4, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-google-icon.svg" },
    { id: 5, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-meta-icon.svg" },
    { id: 6, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-airbnb-icon.svg" },
    { id: 7, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-expedia-icon.svg" },
    { id: 8, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-lens-cart-icon.svg" },
    { id: 9, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-ola-icon.svg" },
    { id: 10, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-wallmart-icon.svg" },
    { id: 11, img: "https://deen3evddmddt.cloudfront.net/images/home-images/company-logo/white-duolingo-icon.svg" },
  ]
  const stats = [
    {
      icon: <Star className="lg:w-7 lg:h-7" />,
      value: "4.9",
      description: "( 919 Reviews )",
    },
    {
      icon: <UsersRound className="lg:w-7 lg:h-7" />,
      value: "17,000+",
      description: "Aspirants Mentored",
    },
    {
      icon: <Network className="lg:w-7 lg:h-7" />,
      value: "11+",
      description: "Industry Mentors",
    },
  ];
  return (
    <section className=" bg-primary-500 text-card ">
      <div className='container mx-auto flex flex-col lg:flex-row py-8 px-4'>
        <div className="lg:w-[50%]">
          <div className="hidden  bg-warning md:w-[240px] lg:w-[33%] lg:flex items-center justify-center gap-2 py-1 px-2 text-foreground rounded-full ">
            <BadgeCheck className='w-[1rem]' />
            <h1 className="text-[14px] font-medium">Job Ready Program</h1>
          </div>
          <h1 className="animate-fadeIn text-[2rem] lg:text-[40px] font-semibold text-center lg:text-start">{title} with NexusBerry
          </h1>
          <p className='animate-slide-btt text-[1rem] lg:text-[18px] text-center lg:text-start [line-height: 27px] mt-5'>
            {summary}
          </p>
          <hr className='mt-8 w-[95%]' />
          <ul className=' flex justify-around py-4'>
            {stats.map((stat, index) => (
              <li key={index} className="animate-slide-ltr flex flex-col gap-2 items-center">
                <div className="flex flex-col lg:flex-row gap-2 items-center">
                  {stat.icon}
                  <span className="text-[1rem] lg:text-[22px] font-semibold [line-height: 33px]">
                    {stat.value}
                  </span>
                </div>
                <span className="text-[14px] lg:text-[1rem] [line-height: 24px]">
                  {stat.description}
                </span>
              </li>
            ))}
          </ul>
          <hr className='mb-8 w-[95%]' />
          <div className="hidden lg:flex flex-col lg:flex-row gap-4 justify-center">
            <button className='font-semibold text-[18px] text-center w-[219px] h-[56px] bg-primary-400 hover:border-b-2 hover:border-card rounded-xl tracking-wider'>Book Demo Now</button>
            <button className='font-semibold text-[18px] text-center w-[219px] h-[56px] bg-card text-foreground hover:border-b-2 hover:border-primary-400 rounded-xl tracking-wider'>Download Curriculum</button>
          </div>
        </div>
        <div className="lg:w-[50%]">
          <div className="animate-fadeIn w-full  lg:w-[70%] h-[95%] lg:ml-32 bg-card rounded-xl text-foreground flex flex-col  lg:justify-end relative">
            <div className='ml-20 relative aspect-square w-64'>
              <Image src={instructor?.profileImage?.url ?? '/placeHolders/Nexusberry_favi.jpg'} fill alt="heroImg" className='object-cover' />
            </div>
            <div className='flex'>
              <div className='bg-muted w-[50%] h-40 flex flex-col items-center justify-center gap-2 '>
                <Linkedin color="#1434A4" fill='#1434A4' className="w-7" />
                <h1 className="text-[20px] font-semibold">3,200++</h1>
                <p className="text-[12px]">Jobs on LinkedIn Alone</p>
              </div>
              <div className='w-[50%] h-40 flex flex-col items-center justify-center gap-2 '>
                <ThumbsUp color="#1434A4" fill='#1434A4' className="w-7" />
                <h1 className="text-[20px] font-semibold">PKR 500,000</h1>
                <p className="text-[12px]">Maximum Compensation</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden flex flex-col lg:flex-row gap-4 mt-4 justify-center items-center">
          <button className='font-semibold text-[18px] text-center w-full h-[56px] bg-primary-400 hover:border-b-2 hover:border-card rounded-xl tracking-wider'>Book Demo Now</button>
          <button className='font-semibold text-[18px] text-center w-full h-[56px] bg-card text-foreground hover:border-b-2 hover:border-primary-400 rounded-xl tracking-wider'>Download Curriculum</button>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 pb-4 mt-4'>
        <h1 className='text-[1rem] lg:text-lg font-semibold'>Our learners work at top companies</h1>
        <div className=" overflow-hidden ">
          <div className='animate-stream-rtl hover:[animation-play-state:paused] flex items-center justify-center gap-4'>
            {img.map((item) => (
              <Image src={item.img} alt="img" width={140} height={140} key={item.id} />
            ))}
            {img.map((item) => (
              <Image src={item.img} alt="img" width={140} height={140} key={item.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
