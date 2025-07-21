import React, { useState } from 'react'
import { DragDropQuestion as DDQuestion, DragDropAnswer } from '../../types/core'
import { GripVertical } from 'lucide-react'

interface DragDropQuestionProps {
  question: DDQuestion
  selectedPlacements: DragDropAnswer
  onPlacementsChange: (selectedPlacements: DragDropAnswer) => void
  // disabled?: boolean
}

const DragDropQuestion: React.FC<DragDropQuestionProps> = ({ question, selectedPlacements, onPlacementsChange }) => {
  // State to track the currently dragged item
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  const currentPlacements = selectedPlacements?.drop_placements || []

  const handleDragStart = (e: React.DragEvent, itemIndex: number) => {
    setDraggedItem(itemIndex)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, zoneIndex: number) => {
    e.preventDefault()
    if (draggedItem === null) return

    const newPlacements = currentPlacements.filter((p) => p.item_id !== draggedItem && p.zone_id !== zoneIndex)
    newPlacements.push({ item_id: draggedItem, zone_id: zoneIndex })

    onPlacementsChange({ drop_placements: newPlacements })
    setDraggedItem(null)
  }

  const getItemInZone = (zoneIndex: number) => {
    const placement = currentPlacements.find((p) => p.zone_id === zoneIndex)
    return placement ? placement.item_id : null
  }

  const getUnplacedItems = () => {
    const placedItems = currentPlacements.map((p) => p.item_id)
    return question.items.map((item, index) => ({ item, index })).filter(({ index }) => !placedItems.includes(index))
  }

  return (
    <div className="space-y-6">
      <p className="mb-4 text-sm text-gray-600">Drag items from the list below to the correct positions.</p>

      {/* Drop Zones */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {question.drop_zones.map((zone, zoneIndex) => {
          const itemIndex = getItemInZone(zoneIndex)

          return (
            <div
              key={zoneIndex}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zoneIndex)}
              className={`min-h-[80px] rounded-lg border-2 border-dashed p-4 transition-all ${
                itemIndex !== null ? 'border-green-300 bg-green-50' : 'hover:border-primary-300 border-gray-300 bg-gray-50'
              }`}
            >
              <div className="text-center">
                <p className="mb-2 text-sm font-medium text-gray-600">{zone}</p>
                {itemIndex !== null && (
                  <div className="rounded border bg-white p-2 shadow-sm">
                    <span className="text-sm">{question.items[itemIndex]}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Available Items */}
      <div className="space-y-2">
        <h5 className="font-medium text-gray-700">Available Items:</h5>
        <div className="flex flex-wrap gap-2">
          {getUnplacedItems().map(({ item, index }) => (
            <div
              key={index}
              draggable={!false}
              onDragStart={(e) => handleDragStart(e, index)}
              className={`flex cursor-move items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md ${
                false ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>

        {getUnplacedItems().length === 0 && <p className="text-sm text-gray-500 italic">All items have been placed</p>}
      </div>
    </div>
  )
}

export default DragDropQuestion
