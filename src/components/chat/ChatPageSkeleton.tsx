export function ChatPageSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-48 bg-slate-700 rounded-lg"></div>
          <div className="h-8 w-8 bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-10 w-28 bg-slate-700 rounded-lg"></div>
      </div>

      {/* Chat Messages Area Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 p-6 space-y-6">
        {/* Welcome Screen / Initial Suggestions Skeleton */}
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl mx-auto mb-6"></div>
            <div className="h-8 w-64 bg-slate-700 rounded-lg mb-4 mx-auto"></div>
            <div className="h-6 w-48 bg-slate-700 rounded-lg mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-slate-800/50 border-slate-700 rounded-xl h-24">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="p-4 md:p-6 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 h-12 bg-slate-700 rounded-xl"></div>
          <div className="h-12 w-12 bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}
