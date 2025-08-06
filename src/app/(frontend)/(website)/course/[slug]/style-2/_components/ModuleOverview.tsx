import RichText from '@/components/RichText'
import React from 'react'

const ModuleOverview = ({learningOutcomes}: any) => {
    return (
        <div className='bg-primary-500'>
            { 
            learningOutcomes ? 
            <div className='container text-background padding-x space-y-5 max-sm:space-y-2 py-20 max-xl:py-14 max-sm:py-6'>
                <RichText data={learningOutcomes} className='min-w-full p-0 m-0'/>
            </div>:
            <div className='text-card font-bold text-center text-2xl py-8'>no RichText found</div>
         }
        </div>
    )
}

export default ModuleOverview
