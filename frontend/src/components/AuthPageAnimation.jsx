import React from 'react'

const AuthPageAnimation = () => {
  return (
    <div className='grid grid-cols-3 grid-rows-3 gap-8'>
        {[...Array(9)].map((_,index)=>{
            return(
                <div key={index} className={`h-35 hover:scale-105 duration-200 w-35 rounded-lg animate-pulse ${(index%2==0)?"bg-primary/40":"bg-primary/35 delay-1000 "}`}>

                </div>
            )
            }
        )}
    </div>
  )
}

export default AuthPageAnimation