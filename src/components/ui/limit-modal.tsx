'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Crown, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LimitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName: string
}

export function LimitModal({ open, onOpenChange, featureName }: LimitModalProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/billing')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white rounded-2xl shadow-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex gap-2 items-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
            Limit Reached
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            You&apos;ve reached your usage limit for this feature.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {featureName}
              </h3>
              <p className="text-gray-400 text-sm">
                You&apos;ve used all 3 free uses
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Upgrade to Premium</span>
              </div>
              <p className="text-gray-300 text-sm">
                Get unlimited access to all AI tools and features
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl py-3"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
            
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-xl py-3"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 