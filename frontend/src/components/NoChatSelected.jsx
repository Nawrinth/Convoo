import { Leaf } from 'lucide-react'
import React from 'react'

const NoChatSelected = () => {
  return (
   <div className='w-full h-full hidden md:block'>
      <div className='w-full h-full flex flex-col gap-8 items-center justify-center'>
        {/* LOGO  */}
          <div className=''>
              <div className='space-y-2 flex flex-col items-center'>
                  <Leaf className='p-4 size-18 bg-primary/80 rounded-xl text-white'/>
                  <h2 className='text-xl text-primary/80 font-semibold'>Convoo</h2>
              </div>
          </div>
          <p className='opacity-70'>Select a chat to begin your conversation.</p>

      </div>

   </div>
    
  )
}

export default NoChatSelected