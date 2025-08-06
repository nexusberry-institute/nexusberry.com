import Image from "next/image";
import { Map, bgImg } from "@/app/(frontend)/(website)/_assets/images";

export default function Location() {
    return (
        <div className="flex mx-4 my-12 max-lg:mt-10 max-sm:mt-8 max-md:flex-col">
            <div className="relative aspect-video md:w-1/2 max-md:w-full">
                <Image
                    alt="institue"
                    fill
                    src={bgImg}
                    sizes=""
                    className="object-cover md:rounded-l-2xl max-md:rounded-t-2xl"
                />
            </div>
            <div className="relative md:w-1/2 max-md:w-full aspect-[337/240]">
                <Image
                    alt="location"
                    fill
                    src={Map}
                    sizes=""
                    className="object-cover md:rounded-r-2xl max-md:rounded-b-2xl"
                />
            </div>
        </div>
    )
}