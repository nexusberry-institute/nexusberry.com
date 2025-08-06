'use client'
import Image from 'next/image'
import React from 'react'
import { useState,useEffect } from 'react'

export default function  HeroVideo({image}:any) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  useEffect(() => {
    const setPassive = (event: any) => event.preventDefault();
    window.addEventListener('touchstart', setPassive, { passive: true });
  
    return () => {
      window.removeEventListener('touchstart', setPassive);
    };
  }, []);
  
    return (
      <div className='w-full aspect-video relative rounded-xl ' >
        {!videoLoaded && <Image 
            src={image.url} 
            fill 
            priority 
            alt="thambnail" 
            className='object-cover rounded-xl'
            sizes='(max-width: 768px) 40vw, (max-width: 1200px) 30vw, 20vw'
        />}
        <iframe  
          src='https://www.youtube.com/embed/w1cR08GLqiQ' 
          className='w-full h-full rounded-xl'
          title="YouTube Video"
          allow="encrypted-media; picture-in-picture"
          onLoad={() => setVideoLoaded(true)}
        />
      </div>
    )
  }