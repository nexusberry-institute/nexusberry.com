import Image from 'next/image'
import React from 'react'
import ajmal from '../../_assets/images/rana-ajmal.webp'

export const MentorsBox = () => [
    {
        id: 0,
        name: 'Rana Ajaml 1',
        image: ajmal,
    },
    {
        id: 1,
        name: 'Rana Ajaml 2',
        image: ajmal,
    },
    {
        id: 2,
        name: 'Rana Ajaml 3',
        image: ajmal,
    },
    {
        id: 3,
        name: 'Rana Ajaml 4',
        image: ajmal,
    },
    {
        id: 4,
        name: 'Rana Ajaml 1',
        image: ajmal,
    },
    {
        id: 5,
        name: 'Rana Ajaml 2',
        image: ajmal,
    },
    {
        id: 6,
        name: 'Rana Ajaml 3',
        image: ajmal,
    },
    {
        id: 7,
        name: 'Rana Ajaml 4',
        image: ajmal,
    }
]

const Mentors = ({instructor}: any) => {
  return (
    <div className="bg-background ">
        <div className='container mx-auto mt-20 py-4 px-4 lg:px-40 text-foreground'> 
            <div className='animate-slide-ltr flex flex-col justify-center items-center lg:items-start lg:justify-start'>
                <h1 className="text-[2rem] mt-4 text-foreground font-semibold ">
                    Meet Your Mentors
                </h1>
                <p className="mt-4 text-[14px] text-muted-foreground">Learn directly from the experts & industry stalwarts.</p>
            </div>
            <div className="h-[700px] lg:w-full lg:h-[432px] flex flex-col lg:flex-row items-center gap-8 mt-8 lg:mt-0">
                <div className='lg:w-[30%] h-full flex flex-col justify-center items-center '>
                    <div className="animate-slide-btt overflow-hidden mb-6 border-r-4 border-b-4 border-foreground rounded-full">
                        <Image src={instructor?.image?.url ?? "/placeHolders/NexusBerry_favi.jpg"} width={288} height={288} alt="ajmal" className='rounded-full object-cover w-72 h-72' />
                    </div>
                    <div className='text-center'>
                        <h1 className='text-[22px] font-semibold'>{instructor?.name ?? "NexusBerry"}</h1>
                        <p className='text-[14px] text-muted-foreground'>Founder, NexusBerry</p>
                    </div>
                </div>
                <div className="w-[100%] lg:w-[70%] h-full flex justify-center items-center overflow-hidden">
                    {
                        MentorsBox().map((item) => (
                                <div key={item.id} className="animate-stream-rtl min-w-48 flex flex-col items-center justify-center overflow-hidden mb-6">
                                    <div className=''>
                                        <Image src={instructor?.image?.url ?? "/placeHolders/NexusBerry_favi.jpg" } alt="ajmal" width={120} height={120}  className='object-cover rounded-full mb-3 border-r-4 border-b-4 border-foreground' />
                                    </div>
                                    <h1 className='text-[1rem] font-semibold'>{instructor?.name ?? "NexusBerry"}</h1> 
                                </div>
                        ))
                    }
                </div>
            </div>
    </div>
    </div>
  )
}

export default Mentors