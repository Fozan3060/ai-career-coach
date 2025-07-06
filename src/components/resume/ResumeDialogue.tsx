import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FileUp, Loader2, Sparkles } from 'lucide-react'
import { useImperativeHandle, useRef, useState, forwardRef } from 'react'
import { v7 } from 'uuid'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export type ResumeDialogueRef = {
  open: () => void
}

export const ResumeDialogue = forwardRef<ResumeDialogueRef>((_, ref) => {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resumeid = v7()

  const router = useRouter()
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true)
  }))

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file || null)
    setError(null)
  }

  const handleAnalyzeResume = async () => {
    if (!selectedFile) {
      setError('Please select a resume file to analyze.')
      return
    }
    try {
      setIsAnalyzing(true)
      const formData = new FormData()
      formData.append('recordId', resumeid)
      formData.append('resumeFile', selectedFile)
      const result = await axios.post('/api/ai-resume-agent', formData)
      console.log(result.data)
    } catch (e) {
      console.error('Resume analysis failed', e)
    } finally {
      router.push('/ai-tools/ai-resume-analyzer/' + resumeid)
      setIsAnalyzing(false)
      setSelectedFile(null)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='bg-gray-900 text-white rounded-2xl shadow-xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl flex gap-2 items-center'>
            <Sparkles className='text-purple-400' />
            AI Resume Analyzer
          </DialogTitle>
          <DialogDescription>
            Upload your resume and get AI feedback instantly.
          </DialogDescription>
        </DialogHeader>

        <div className=' space-y-6'>
          <div className='flex flex-col gap-4'>
            <label
              htmlFor='resume-upload'
              className='text-lg font-medium text-gray-300'
            >
              Upload your Resume
            </label>
            <div className='relative flex items-center'>
              <Input
                id='resume-upload'
                type='file'
                accept='.pdf'
                onChange={handleFileChange}
                className='
                  flex-1 pr-12 py-2 h-full
                  bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500
                  focus:border-purple-500 focus:ring-purple-500/20
                  rounded-xl transition-all duration-300
                  file:mr-4  file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white
                  file:hover:from-blue-700 file:hover:to-purple-700
                  file:transition-all file:duration-300
                '
              />
              <FileUp className='absolute right-4 w-5 h-5 text-gray-400 pointer-events-none' />
            </div>
            {selectedFile && (
              <p className='text-sm text-gray-400'>
                Selected file: {selectedFile.name}
              </p>
            )}
            {error && <p className='text-sm text-red-400'>{error}</p>}
          </div>

          <Button
            onClick={handleAnalyzeResume}
            disabled={isAnalyzing || !selectedFile}
            className='
              w-full h-12 text-lg font-semibold rounded-xl
              bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
              text-white shadow-lg hover:shadow-purple-500/25
              transition-all duration-300 transform hover:scale-[1.01]
              flex items-center justify-center gap-2
            '
          >
            {isAnalyzing ? (
              <>
                <Loader2 className='w-5 h-5 animate-spin' /> Analyzing...
              </>
            ) : (
              <>
                <Sparkles className='w-5 h-5' /> Analyze Resume
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})

ResumeDialogue.displayName = 'ResumeDialogue'
