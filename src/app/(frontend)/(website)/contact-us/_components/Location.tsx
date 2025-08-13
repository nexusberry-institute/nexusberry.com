import Image from "next/image";
import { Map, bgImg, nexusBerryImg } from "@/app/(frontend)/(website)/_assets/images";
import { getSettings } from '@/lib/getSettings';


export default async function Location() {

    const settings = await getSettings();
    const latitude = settings?.mapLocation?.latitude
    const longitude = settings?.mapLocation?.longitude

    if (!latitude || !longitude) {
        return (
            <div className="w-full container mx-auto px-4 max-sm:px-6 py-8">
                <div className="bg-foreground rounded-lg overflow-hidden h-[70vh] shadow-md flex items-center justify-center">
                    <p className="text-muted-foreground">Map location not configured</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex mx-4 my-12 max-lg:mt-10 max-sm:mt-8 max-md:flex-col">
            <div className="relative aspect-video md:w-1/2 max-md:w-full">
                <Image
                    alt="institue"
                    fill
                    src={nexusBerryImg}
                    sizes=""
                    className="object-cover md:rounded-l-2xl max-md:rounded-t-2xl"
                />
            </div>
            <div className="relative md:w-1/2 max-md:w-full aspect-[337/240]">
                <iframe
                    src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen={true}
                    loading="lazy"
                    title={`Map showing location at ${latitude}, ${longitude}`}
                />
            </div>
        </div>
    )
}