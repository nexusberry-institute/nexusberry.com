import Image from 'next/image'
import React from 'react'
import img from "../../_assets/images/free.webp"
import { CircleCheck } from 'lucide-react'

const FeeStructure = ({ crossPrice, price }: { crossPrice: number | null | undefined, price: number | null | undefined }) => {
    const featureData = [
        {
            boldText: "Live instruction",
            text: "from Industry Veterans",
        },
        {
            boldText: "Official certification",
            text: "in Human Resources",
        },
        {
            boldText: "Vibrant community",
            text: "just like a College Campus",
        },
        {
            boldText: "Hand-on curriculum",
            text: "with Real-Life Projects",
        },
    ]
    return (
        <div className="container mx-auto mt-20 py-4 px-4 lg:px-40">
            <div className=" text-center my-4">
                <h1 className="animate-slide-btt text-[2rem] text-foreground font-semibold ">
                    Fee structure of this program
                </h1>
            </div>
            <div className="flex px-4 mt-8 border border-foreground border-r-4 border-b-4 rounded-2xl py-2 lg:py-6 text-foreground">
                <div className="hidden lg:w-[50%] lg:block">
                    <Image src={img} alt="img" width={400} height={400} />
                </div>
                <div className="flex flex-col my-7 justify-start lg:gap-2">
                    <p className="text-[14px] lg:text-[12px] text-center ml-8 mb-4 lg:mb-0 lg:ml-0 lg:text-start font-medium text-muted-foreground">Total Program Fee:</p>
                    <h1 className="text-2xl lg:text-3xl font-semibold">PKR {price}/- <del className="text-[1rem] font-medium text-muted-foreground">PKR {crossPrice}/-</del></h1>
                    <ul className="mt-4">
                        {featureData.map((item, index) => (
                            <div key={index} className="flex mb-2 gap-2 items-center">
                                <CircleCheck fill="#FDB034" color="#ffffff" className="w-5 h-5 lg:w-6 lg:h-6" />
                                <li className="text-[12px] font-medium text-muted-foreground">
                                    <span className="font-semibold text-muted-foreground">{item.boldText}</span> {item.text}
                                </li>
                            </div>
                        ))}
                    </ul>
                    <button className="bg-primary-500 p-3 rounded-xl text-card font-semibold  items-center w-32 mt-4 hover:border-r-2 hover:border-b-2">Apply Now</button>
                </div>
            </div>
        </div>
    )
}

export default FeeStructure