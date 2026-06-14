"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { History } from "lucide-react"
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "../theme-toggle"

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-5 z-50 flex justify-center px-4"
    >
      <div className="relative flex h-16 w-full max-w-5xl items-center justify-between overflow-hidden rounded-2xl border border-border/60 bg-background/65 px-5 shadow-2xl backdrop-blur-xl">

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/5 via-transparent to-primary/5" />

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex items-center justify-center overflow-hidden rounded-xl">
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
            <Image
              src="/logo.png"
              alt="Minutely Logo"
              width={120}
              height={120}
              className="relative h-10 w-auto object-contain"
            />
          </div>
          <span className="logo hidden text-lg tracking-wide md:inline-block">
            Minutely
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
<div className="flex items-center gap-2">


  

 

  <Link href="/upload">
    <Button className="rounded-xl px-5 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
      Upload
    </Button>
  </Link>  
 <AuthButton />
 
  <ThemeToggle />
</div>
      </div>
    </motion.header>
  )
}

function AuthButton() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <>
       

        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 rounded-xl",
            },
          }}
        /> 
        
        <Link href="/history">
          <Button variant="ghost" className="hidden items-center gap-2 rounded-xl sm:inline-flex">
            <History className="h-4 w-4" />
            History
          </Button>
        </Link>
      </>
    )
  }

  return (
    <SignInButton mode="modal">
      <Button variant="ghost" className="hidden rounded-xl sm:inline-flex">
        Login
      </Button>
    </SignInButton>
  )
}