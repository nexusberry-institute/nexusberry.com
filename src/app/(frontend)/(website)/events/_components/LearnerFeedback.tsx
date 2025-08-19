import { Star, User } from 'lucide-react'
import React from 'react'

const feedBacks = [
  {
    name: 'Ali Kaleem',
    rating: 5,
    review: 'The Web Development course was well-structured and covered all modern technologies. The hands-on projects were amazing!',
  },
  {
    name: 'Amir Zada',
    rating: 4,
    review: 'Web Development  concepts were explained in a simple way. Would have loved more practical examples, but overall a great course!',
  },
  {
    name: 'Ahamd',
    rating: 3,
    review: 'The Mobile App Development course had good content, but some parts felt rushed. More real-world examples would help.',
  },
  {
    name: 'Shams Ur Rehman',
    rating: 5,
    review: 'Digital Marketing strategies were explained brilliantly. The case studies really helped me understand real-world applications.',
  },
  {
    name: 'Naseem',
    rating: 4,
    review: 'The Web Development course covered both frontend and backend well. A bit more focus on performance optimization would be great.',
  },
  {
    name: 'Aun',
    rating: 2,
    review: 'Machine Learning course was informative but too theoretical. More coding exercises would make it better.',
  },
  {
    name: 'Maid Nuro',
    rating: 5,
    review: 'I loved the Mobile App Development course! The instructor explained Flutter and React Native in a very easy-to-understand way.',
  },
  {
    name: 'Zeeshan',
    rating: 3,
    review: 'Digital Marketing course had good insights but lacked hands-on exercises. A more interactive approach would improve it.',
  },
  {
    name: 'Hafeez',
    rating: 4,
    review: 'Web Development course was solid. It gave me the confidence to start freelancing, which is exactly what I needed!',
  },
];

export default function LearnerFeedback() {
  return (
    <div className="rounded-xl lg:mb-20 mb-10 mt-5 lg:mt-20  overflow-hidden">
      <h4 className="mb-12 text-center font-semibold text-3xl leading-[48px]">
        See what learners are saying
      </h4>
      <div className="flex gap-5 animate-stream-rtl hover:[animation-play-state:paused] ">
        {feedBacks.map((feedBack, ind) => (
          <div
            className="w-[33%] max-lg:w-1/2 max-sm:w-[80%] max-xs:w-[96%]  flex-shrink-0 bg-secondary-100 p-6 rounded-xl space-y-4"
            key={ind}
          >
            <div className=" rounded-xl ring-1 ring-green-300w  py-4 px-4 w-fit">
              <User strokeWidth={2} className="fill-secondary-200 stroke-secondary-100" size={50} />
            </div>
            <div className="flex gap-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Star className="fill-secondary stroke-secondary" size={16} />
                  </div>
                ))}
            </div>
            <p className="line-clamp-5">
              {feedBack.review}
            </p>
            <h3 className="font-semibold text-lg">{feedBack.name}</h3>
          </div>
        ))}

        {feedBacks.map((feedBack, ind) => (
          <div
            className="w-[33%]  flex-shrink-0 bg-secondary-100 p-6 rounded-xl space-y-4"
            key={ind}
          >
            <div className=" rounded-xl ring-1 ring-green-300  py-4 px-4 w-fit">
              <User strokeWidth={2} className="fill-secondary-200 stroke-secondary-100" size={50} />
            </div>
            <div className="flex gap-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Star className="fill-secondary stroke-secondary" size={16} />
                  </div>
                ))}
            </div>
            <p className="line-clamp-5">
              {feedBack.review}
            </p>
            <h3 className="font-semibold text-lg">{feedBack.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
