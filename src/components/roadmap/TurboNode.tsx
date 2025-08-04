"use client"

import { Handle, Position } from "@xyflow/react"
import { memo } from "react"
import { LinkIcon } from "lucide-react"

interface TurboNodeData {
  title: string
  icon?: string
  subline?: string
  description?: string
  link?: string
  [key: string]: unknown
}

interface TurboNodeProps {
  data: TurboNodeData
  type: string
}

const TurboNode = ({ data, type }: TurboNodeProps) => {
  // Determine node styling based on type
  const getNodeStyling = (nodeType: string) => {
    switch (nodeType) {
      case "input":
        return "bg-gradient-to-br from-purple-700/90 to-blue-700/90 border-purple-500/50 shadow-purple-500/20 shadow-lg"
      case "output":
        return "bg-gradient-to-br from-green-700/90 to-emerald-700/90 border-green-500/50 shadow-green-500/20 shadow-lg"
      default:
        return "bg-gradient-to-br from-gray-800/90 to-gray-700/90 border-gray-600/50 shadow-gray-500/20 shadow-lg"
    }
  }

  return (
    <div
      className={`
        ${getNodeStyling(type)}
        text-white p-5 rounded-xl border backdrop-blur-sm
        w-[300px] min-h-[160px]
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
        relative flex flex-col justify-between
      `}
    >
      {/* Node content */}
      <div className="space-y-3 flex-1">
        <div className="font-semibold text-lg leading-tight">{data.title || "Untitled"}</div>

        <div className="text-sm text-gray-200 leading-relaxed flex-1">
          {typeof data.description === 'string' ? data.description : "No description"}
        </div>

        {/* Learn more link if available */}
        {typeof data.link === 'string' && data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 transition-colors duration-200 mt-3 font-medium"
            onClick={(e) => e.stopPropagation()} // Prevent node selection when clicking link
          >
            <LinkIcon className="w-3 h-3" />
            Learn More
          </a>
        )}
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-lg -top-1.5"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white shadow-lg -bottom-1.5"
      />

      {/* Node type indicator */}
      {type === "input" && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
      )}
      {type === "output" && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
      )}
    </div>
  )
}

export default memo(TurboNode)
