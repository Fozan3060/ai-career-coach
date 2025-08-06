"use client"

import { useState, useCallback, useEffect } from "react"
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Controls,
  MiniMap,
  Background,
} from "@xyflow/react"
import TurboNode from "./TurboNode"
import "@xyflow/react/dist/style.css"

interface RoadmapCanvasProps {
  initialNodes: Node[]
  initialEdges: Edge[]
}

const createHierarchicalLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  const adjacencyList: Record<string, string[]> = {}
  const inDegree: Record<string, number> = {}

  // Initialize
  nodes.forEach((node) => {
    adjacencyList[node.id] = []
    inDegree[node.id] = 0
  })

  // Build adjacency list and calculate in-degrees
  edges.forEach((edge) => {
    adjacencyList[edge.source].push(edge.target)
    inDegree[edge.target] = (inDegree[edge.target] || 0) + 1
  })

  // Topological sort to determine levels
  const levels: string[][] = []
  const queue: string[] = []
  const visited = new Set<string>()

  // Find nodes with no dependencies (level 0)
  Object.keys(inDegree).forEach((nodeId) => {
    if (inDegree[nodeId] === 0) {
      queue.push(nodeId)
    }
  })

  while (queue.length > 0) {
    const currentLevel: string[] = []
    const levelSize = queue.length

    for (let i = 0; i < levelSize; i++) {
      const nodeId = queue.shift()!
      currentLevel.push(nodeId)
      visited.add(nodeId)

      // Add children to next level
      adjacencyList[nodeId].forEach((childId) => {
        inDegree[childId]--
        if (inDegree[childId] === 0 && !visited.has(childId)) {
          queue.push(childId)
        }
      })
    }

    if (currentLevel.length > 0) {
      levels.push(currentLevel)
    }
  }

  // Add any remaining nodes (in case of cycles or disconnected components)
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      levels.push([node.id])
    }
  })

  // Calculate positions based on levels
  const nodeWidth = 320
  const nodeHeight = 180
  const horizontalGap = 100
  const verticalGap = 120

  const positionedNodes = nodes.map((node) => {
    // Find which level this node belongs to
    let levelIndex = 0
    let positionInLevel = 0

    for (let i = 0; i < levels.length; i++) {
      const nodeIndex = levels[i].indexOf(node.id)
      if (nodeIndex !== -1) {
        levelIndex = i
        positionInLevel = nodeIndex
        break
      }
    }

    const levelWidth = levels[levelIndex].length
    const totalLevelWidth = levelWidth * nodeWidth + (levelWidth - 1) * horizontalGap
    const startX = -totalLevelWidth / 2

    const x = startX + positionInLevel * (nodeWidth + horizontalGap)
    const y = levelIndex * (nodeHeight + verticalGap)

    return {
      ...node,
      position: { x, y },
    }
  })

  return positionedNodes
}

export default function RoadmapCanvas({ initialNodes, initialEdges }: RoadmapCanvasProps) {
  const layoutNodes = createHierarchicalLayout(initialNodes, initialEdges)

  const [nodes, setNodes] = useState<Node[]>(layoutNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  // Update layout when props change
  useEffect(() => {
    const newLayoutNodes = createHierarchicalLayout(initialNodes, initialEdges)
    setNodes(newLayoutNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges])

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((ns) => applyNodeChanges(changes, ns)), [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((es) => applyEdgeChanges(changes, es)), [])

  const onConnect = useCallback((params: Connection) => setEdges((es) => addEdge(params, es)), [])

  const nodeTypes = {
    input: TurboNode,
    default: TurboNode,
    output: TurboNode,
    turbo: TurboNode,
  }

  return (
    <div className="w-full h-[700px] bg-gray-900 rounded-xl overflow-hidden border border-gray-700/50 shadow-xl shadow-gray-900/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{
          padding: 0.15,
          minZoom: 0.3,
          maxZoom: 1.0,
        }}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          style: {
            stroke: "#6b7280",
            strokeWidth: 2,
          },
          type: "smoothstep",
          animated: true,
        }}
        className="bg-gray-900"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.2}
        maxZoom={1.5}
      >
        {/* Controls for zoom, fit view, etc. */}
        <Controls
          className="bg-gray-800/80 border border-gray-700 rounded-lg text-gray-300 [&>button]:hover:bg-gray-700/50 [&>button]:border-b [&>button]:border-gray-700/50 [&>button:last-child]:border-b-0"
          showInteractive={false}
        />

        {/* Mini map */}
        <MiniMap
          nodeColor={(node) => {
            if (node.type === "input") return "#8b5cf6" // purple
            if (node.type === "output") return "#10b981" // green
            return "#6b7280" // gray
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="bg-gray-800/50 border border-gray-700 rounded-lg"
          position="bottom-right"
        />

        {/* Background pattern */}
        <Background
        //@ts-expect-error - Background variant type mismatch
        variant="dots" gap={20} size={1} color="#4b5563" />
      </ReactFlow>
    </div>
  )
}
