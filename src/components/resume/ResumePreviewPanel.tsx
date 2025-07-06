import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

interface ResumePreviewPanelProps {
  pdfUrl: string | null
}

export function ResumePreviewPanel ({ pdfUrl }: ResumePreviewPanelProps) {
  return (
    <Card className='bg-gray-800/50 border border-gray-700 backdrop-blur-sm shadow-lg shadow-gray-900/10 h-full flex flex-col'>
      <CardHeader className='pb-4 border-b border-gray-700/50'>
        <CardTitle className='text-2xl font-bold text-white flex items-center gap-2'>
          <FileText className='w-6 h-6 text-blue-400' /> Resume Preview
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-1 p-0 overflow-hidden'>
        {pdfUrl ? (
          <iframe
            src={pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0'}
            className='w-full h-full min-h-[600px] border-none rounded-b-xl scrollbar-hide'
            title='Resume Preview'
            aria-label='Resume Preview'
          />
        ) : (
          <div className='flex items-center justify-center h-full text-gray-400 text-lg'>
            No resume uploaded or preview available.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
