

import { UserProfile } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default async function ProfilePage () {
  const { has } = await auth()
  const hasPremiumPlan = has({ plan: 'premium' })
  console.log(hasPremiumPlan,"premium")
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
