import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

const MessageSkeleton = ({ messages = 6 }) => {
  return (
    <div className="flex flex-col w-full h-full z-0 py-10  rounded-2xl   shadow-sm overflow-hidden p-4 space-y-4">
      {Array.from({ length: messages }).map((_, i) => (
        <BubbleSkeleton key={i} align={i % 2 === 0 ? "left" : "right"} />
      ))}
    </div>
  )
}

function BubbleSkeleton({ align = "left" }) {
  const isLeft = align === "left"

  return (
    <div className={`flex ${isLeft ? "justify-start" : "justify-end"} w-full h-1/6 `}>
      <div
        className={`flex items-start gap-2 w-1/2 h-full ${
          isLeft ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* Profile avatar skeleton */}
        <Skeleton className="h-8 w-8 rounded-full bg-[#000]/2 dark:bg-white/1 " />

        {/* Chat text bubble skeleton */}
        <Skeleton className="h-full w-full rounded-2xl bg-[#000]/2 dark:bg-white/1" />
      </div>
    </div>
  )
}

export default MessageSkeleton
