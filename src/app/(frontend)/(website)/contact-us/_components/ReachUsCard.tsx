import React from 'react'


type CardProps = {
  icon: React.ReactNode
  title: string
  details: string[]
}

type ReachUsCardProps = {
  cardData: CardProps[]
}

const Card = ({ icon, title, details }: CardProps) => (
  <div className='flex max-md:flex-col max-md:items-center max-md:text-center bg-card border-2 border-dashed border-primary-400 gap-4 rounded-2xl px-8 max-xs:px-4 py-6 max-xs:py-4'>
    <div className='block'>
      {icon}
    </div>
    <div className='space-y-2 text-lg max-sm:text-base'>
      <h1 className='text-2xl font-bold font-openSans'>{title}</h1>
      <div>
        {details.map((detail, index) => (
          <p key={index}>{detail}</p>
        ))}
      </div>
    </div>
  </div>
)

const ReachUsCard = ({ cardData }: ReachUsCardProps) => {
  return (
    <>
      {cardData.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </>
  )
}

export default ReachUsCard
