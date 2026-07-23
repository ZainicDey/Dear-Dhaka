"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "!bg-brand-yellow/20 !backdrop-blur-md !text-[#301010] !border-none !shadow-lg !rounded-4xl !px-6 !py-3.5 !font-semibold !text-[14px] !justify-center !text-center",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
