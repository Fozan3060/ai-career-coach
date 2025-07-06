import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { FileUp, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { v7 } from 'uuid'
import axios from 'axios'

interface ResumeDialogueProps {
  children: React.ReactNode
}

export function ResumeDialogue ({ children }: ResumeDialogueProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setError(null)
    } else {
      setSelectedFile(null)
    }
  }
  const handleAnalyzeResume = async () => {
    if (!selectedFile) {
      setError('Please select a resume file to analyze.')
      return
    }
    try {
      const formData = new FormData()
      const id = v7()
      formData.append('recordId', id)
      formData.append('resumeFile', selectedFile)
      const result = await axios.post('/api/ai-resume-agent', formData)
      console.log(result.data)
      setIsAnalyzing(true)
    } catch {
    } finally {
      setIsAnalyzing(false), setSelectedFile(null)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className='
          sm:max-w-[550px] md:max-w-[700px] lg:max-w-[800px]
          bg-gray-900 border border-gray-700 text-white
          rounded-2xl shadow-2xl shadow-purple-900/30
          overflow-hidden
          data-[state=open]:animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-10
        '
      >
        <DialogHeader className='p-6 border-b border-gray-800/50 '>
          <DialogTitle className='text-2xl font-bold text-white flex items-center gap-3'>
            <Sparkles className='w-6 h-6 text-purple-400 animate-pulse' /> AI
            Resume Analyzer
          </DialogTitle>
          <DialogDescription className='text-gray-400 text-base'>
            Upload your resume (PDF, DOCX) and get instant AI-powered feedback
            and improvement suggestions.
          </DialogDescription>
        </DialogHeader>
        <div className='p-6 space-y-6'>
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
}
