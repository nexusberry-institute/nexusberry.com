"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "../_providers/Auth"
import { motion } from "framer-motion"
import { Loader } from "lucide-react"

export default function Logout() {
  const { logout } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    logout().then(res => {
      if (res.success) {
        toast({
          title: "Successfully Logged Out",
          description: "You have been logged out of your account.",
          variant: "success",
        })
        // Hard navigation so the server re-renders the header with isLoggedIn=false
        window.location.href = "/"
      } else {
        toast({
          title: "Logout Failed",
          description: res.message || "There was an issue logging you out.",
          variant: "destructive",
        })
        window.location.href = document.referrer || "/"
      }
    }).catch(() => {
      toast({
        title: "Logout Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive",
      })
      window.location.href = document.referrer || "/"
    })
  }, [logout, toast])

  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const dotVariants = {
    initial: { opacity: 0, y: 0 },
    animate: {
      opacity: [0, 1, 0],
      y: [0, -5, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5,
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-primary-500/90 to-secondary-500/90 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg flex flex-col items-center">
        <Loader className="h-10 w-10 animate-spin text-white mb-4" />

        {/* Animated heading with dots */}
        <div className="flex items-center">
          <motion.h1
            className="text-xl font-medium text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Signing out
          </motion.h1>

          <motion.div
            className="flex ml-1"
            variants={dotsVariants}
            initial="initial"
            animate="animate"
          >
            <motion.span variants={dotVariants} className="text-xl text-white">.</motion.span>
            <motion.span variants={dotVariants} className="text-xl text-white">.</motion.span>
            <motion.span variants={dotVariants} className="text-xl text-white">.</motion.span>
          </motion.div>
        </div>

        <motion.p
          className="text-white/80 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Please wait while we securely sign you out.
        </motion.p>
      </div>
    </div>
  )
}
