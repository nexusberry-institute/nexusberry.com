'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import logo from '../../_assets/logo/reverse-logo.png'
import { Menu, X, ChevronDown } from 'lucide-react'

const Nav = () => {
  const [showMenu, setShowMenu] = useState(false)

  const handleMenu = () => {
    setShowMenu(!showMenu)
  }

  return (
    <>
      <nav className="bg-[#14386A] container mx-auto py-7 px-4 outline-none">
        <div className="flex justify-between items-center">
          <div className="w-40 h-10">
            <Image src={logo} alt="logo" className="object-contain" />
          </div>
          {showMenu && (
            <div className="">
              <button className="rounded-xl border border-blue-900 flex items-center px-4 py-2 hover:bg-white text-white hover:text-black transition-all duration-300">
                <span className="font-semibold">Courses</span>
                <ChevronDown />
              </button>
            </div>
          )}
          <div>
            {showMenu ? <X onClick={() => handleMenu()} /> : <Menu onClick={() => handleMenu()} />}
          </div>
        </div>
      </nav>
      {showMenu && (
        <div className="bg-[#14386A] w-[80%] h-[100vh] py-4 px-8 flex flex-col gap-5 ">
          <span className="text-sm font-medium">About Us</span>
          <span>Apply as Mentor</span>
          <span>Contact Us</span>
        </div>
      )}
    </>
  )
}

export default Nav
