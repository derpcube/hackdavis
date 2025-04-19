'use client';

import React, { useState } from 'react';
import { Card, Title, Text } from '@tremor/react';
import { FireIcon, MapIcon, ClockIcon, UserGroupIcon, BuildingLibraryIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Resource {
  id: string;
  type: 'Tank' | 'Fighter' | 'Amphibious' | 'Cargo' | 'Facility';
  status: 'active' | 'deployed' | 'maintenance';
  priority: number;
  location: string;
  readiness: number;
}

// Mock data
const initialResources = {
  'priority-1': [
    { id: 'fighter-1', type: 'Fighter', status: 'active', location: 'Marina.1' },
    { id: 'fighter-2', type: 'Fighter', status: 'active', location: 'Pacific.1' },
  ],
  'priority-2': [
    { id: 'tank-1', type: 'Tank', status: 'deployed', location: 'North Beach.1' },
    { id: 'amphibious-1', type: 'Amphibious', status: 'active', location: 'Waterway.3' },
  ],
  'priority-3': [
    { id: 'cargo-1', type: 'Cargo', status: 'maintenance', location: 'Presidio.2' },
    { id: 'facility-1', type: 'Facility', status: 'active', location: 'Marina.3' },
  ],
};

export default function Resources() {
  const [resources, setResources] = useState(initialResources);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const items = Array.from(resources[source.droppableId]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setResources({
        ...resources,
        [source.droppableId]: items,
      });
    } else {
      const sourceItems = Array.from(resources[source.droppableId]);
      const destItems = Array.from(resources[destination.droppableId]);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setResources({
        ...resources,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0E17] text-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-800 bg-[#1A1F2B] px-4 py-2">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-3 py-1 bg-[#2A303C] rounded text-sm text-gray-300 hover:bg-[#323847]">
            <MapIcon className="h-4 w-4" />
            <span>Add target</span>
          </button>
          <div className="flex items-center space-x-2 px-3 py-1 bg-[#2A303C] rounded">
            <input type="text" placeholder="Search targets..." className="bg-transparent text-sm text-gray-300 outline-none" />
          </div>
          <button className="px-3 py-1 bg-[#2A303C] rounded text-sm text-gray-300 hover:bg-[#323847]">
            Time created
            <ChevronDownIcon className="h-4 w-4 inline ml-1" />
          </button>
          <button className="px-3 py-1 bg-[#2A303C] rounded text-sm text-gray-300 hover:bg-[#323847]">
            Priority
            <ChevronDownIcon className="h-4 w-4 inline ml-1" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Column - Confirm Targets */}
        <div className="w-1/5 border-r border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <Text className="text-gray-300 text-sm font-medium">CONFIRM TARGETS</Text>
            </div>
            <span className="text-gray-500 text-sm">14</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#1A1F2B] border-gray-800 hover:bg-[#2A303C] cursor-pointer transition-all">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-[#2A303C] rounded">
                    <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <Text className="text-gray-300 text-sm font-medium">Tank {i}</Text>
                    <Text className="text-gray-500 text-xs">HPTL priority</Text>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Center Columns - Different Priority Levels */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 grid grid-cols-3 gap-px bg-gray-800">
            {Object.entries(resources).map(([columnId, items], index) => (
              <div key={columnId} className="bg-[#0A0E17] p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <Text className="text-gray-300 text-sm font-medium">HPTL PRIORITY {index + 1}</Text>
                  </div>
                  <span className="text-gray-500 text-sm">{items.length}</span>
                </div>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2"
                    >
                      {items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-[#1A1F2B] border-gray-800 hover:bg-[#2A303C] cursor-pointer transition-all ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                              }`}
                              onClick={() => setSelectedResource(item.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-[#2A303C] rounded">
                                  <FireIcon className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                  <Text className="text-gray-300 text-sm font-medium">{item.type}</Text>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Text className="text-gray-500 text-xs">{item.location}</Text>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Right Panel - Details */}
        <div className="w-1/4 border-l border-gray-800 bg-[#1A1F2B]">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Text className="text-gray-300 font-medium">DETAILS</Text>
              <div className="flex space-x-2">
                <button className="p-1.5 hover:bg-[#2A303C] rounded">
                  <MapIcon className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-[#2A303C] rounded">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          {selectedResource && (
            <div className="p-4 space-y-4">
              <div>
                <Text className="text-gray-500 text-xs mb-1">TYPE</Text>
                <div className="flex items-center space-x-2">
                  <FireIcon className="h-5 w-5 text-red-500" />
                  <Text className="text-gray-300">
                    {resources[Object.keys(resources).find(key => 
                      resources[key].some(item => item.id === selectedResource)
                    ) || ''].find(item => item.id === selectedResource)?.type}
                  </Text>
                </div>
              </div>
              <div>
                <Text className="text-gray-500 text-xs mb-1">LOCATION</Text>
                <Text className="text-gray-300">
                  {resources[Object.keys(resources).find(key => 
                    resources[key].some(item => item.id === selectedResource)
                  ) || ''].find(item => item.id === selectedResource)?.location}
                </Text>
              </div>
              <div>
                <Text className="text-gray-500 text-xs mb-1">STATUS</Text>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Text className="text-gray-300">
                    {resources[Object.keys(resources).find(key => 
                      resources[key].some(item => item.id === selectedResource)
                    ) || ''].find(item => item.id === selectedResource)?.status}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 