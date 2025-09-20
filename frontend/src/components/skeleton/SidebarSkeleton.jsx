import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"


const SidebarSkeleton = () => {
  return (
    <div className='space-y-8'>
        {Array(9).fill(0).map((_,index) => (
             <div key={index} className="flex items-center justify-center space-x-4 ">
                <Skeleton className="h-12 w-12 rounded-full dark:bg-gray-500" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] dark:bg-gray-500" />
                    <Skeleton className="h-4 w-[200px] dark:bg-gray-500" />
                </div>
            </div>
                    ))
            }
    </div>
  )
}

export default SidebarSkeleton