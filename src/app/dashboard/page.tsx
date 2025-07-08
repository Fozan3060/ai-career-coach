
import { HeroSection } from '@/components/complex/Herosection'
import AItoolSection from '@/components/complex/AItoolSection'
export default function AICareerCoachLanding () {
  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <HeroSection />

      <section className='py-20 bg-gray-900/50'>
        <div className='container mx-auto '>
          <div className='text-center mb-16'>
            <h2 className='text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Available AI Tools
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
              Start Building and Shape Your Career with these exclusive AI Tools
            </p>
          </div>
        </div>
        <AItoolSection/>
      </section>
    </div>
  )
}
function uuidv4 () {
  throw new Error('Function not implemented.')
}
