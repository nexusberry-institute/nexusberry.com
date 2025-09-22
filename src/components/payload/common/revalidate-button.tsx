import { Button } from '@/components/ui/button'
import { revalidateTag } from 'next/cache';
import React from 'react'

const RevalidateButton = ({ type, value }: { type: "path | tag", value: string }) => {
    const handleClick = () => {
        revalidateTag
    };

    return (
        <Button onClick={handleClick}>RevalidateButton</Button>
    )
}

export default RevalidateButton