'use client'

import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage () {
  return (
    <div className='flex mt-20 justify-center'>
      <UserProfile appearance={
        
        {elements:{profileSectionPrimaryButton:"!text-white",
          scrollBox:"bg-gradient-to-b from-gray-900 to-gray-950",
          navbar:"!bg-gradient-to-b from-gray-800 to-gray-950",
          badge:"!text-white ",
          tabButton:"!text-white",
        },
          variables:{
            colorBackground:"transparent",
        colorText:"white",
      }}}
     />
    </div>
  )
}
