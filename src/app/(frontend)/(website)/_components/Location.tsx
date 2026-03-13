import type { Setting } from '@/payload-types'

type LocationProps = {
    settings: Setting
}

const Location = ({ settings }: LocationProps) => {
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
        <div className="w-full container mx-auto px-4 max-sm:px-6 py-8">
            <div className="bg-foreground rounded-lg overflow-hidden h-[70vh] shadow-md">
                <div className="relative w-full h-full">
                    <iframe
                        src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allowFullScreen={true}
                        loading="lazy"
                        title={`Map showing location at ${latitude}, ${longitude}`}
                    />
                </div>
            </div>
        </div>
    )
}

export default Location
