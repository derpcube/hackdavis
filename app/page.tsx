'use client';

import React, { useState } from 'react';
import { Card, Title, Text, Metric, AreaChart } from '@tremor/react';
import { MapIcon, FireIcon, BellAlertIcon, UserGroupIcon, ChartBarIcon, CameraIcon, BuildingLibraryIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// Mock data for the chart
const chartdata = [
  { date: "Jan 22", "Active Fires": 12 },
  { date: "Feb 22", "Active Fires": 15 },
  { date: "Mar 22", "Active Fires": 18 },
  { date: "Apr 22", "Active Fires": 22 },
  { date: "May 22", "Active Fires": 25 },
];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('map');

  return (
    <main className="min-h-screen bg-[#0A0E17] text-white">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-[#0A0E17]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <FireIcon className="h-8 w-8 text-red-500" />
                <span className="ml-2 text-xl font-semibold tracking-wider">PYROSPHERE</span>
              </Link>
              <div className="hidden md:flex space-x-1">
                <Link href="/" className="px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all">Overview</Link>
                <Link href="/resources" className="px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all">Resources</Link>
                <Link href="/intelligence" className="px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all">Intelligence</Link>
                <Link href="/analytics" className="px-3 py-2 rounded text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all">Analytics</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-all">
                Report Incident
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#1A1F2B] border-gray-800">
              <Title className="text-gray-400 mb-4 text-sm font-medium">SYSTEM STATUS</Title>
              <div className="space-y-6">
                <div>
                  <Text className="text-gray-400 text-xs">ACTIVE FIRES</Text>
                  <div className="flex items-baseline space-x-2">
                    <Metric className="text-white">24</Metric>
                    <Text className="text-red-500 text-sm">+2 last hour</Text>
                  </div>
                </div>
                <div>
                  <Text className="text-gray-400 text-xs">DEPLOYED UNITS</Text>
                  <div className="flex items-baseline space-x-2">
                    <Metric className="text-white">156</Metric>
                    <Text className="text-green-500 text-sm">92% available</Text>
                  </div>
                </div>
                <div>
                  <Text className="text-gray-400 text-xs">MONITORED REGIONS</Text>
                  <div className="flex items-baseline space-x-2">
                    <Metric className="text-white">1,144</Metric>
                    <Text className="text-blue-500 text-sm">cameras active</Text>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1A1F2B] border-gray-800">
              <Title className="text-gray-400 mb-4 text-sm font-medium">FIRE TREND</Title>
              <AreaChart
                className="h-32"
                data={chartdata}
                index="date"
                categories={["Active Fires"]}
                colors={["red"]}
                showXAxis={false}
                showYAxis={false}
                showLegend={false}
              />
            </Card>

            <Card className="bg-[#1A1F2B] border-gray-800">
              <Title className="text-gray-400 mb-4 text-sm font-medium">QUICK ACTIONS</Title>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-[#2A303C] hover:bg-[#323847] rounded-lg flex flex-col items-center transition-all">
                  <BellAlertIcon className="h-6 w-6 text-red-500 mb-2" />
                  <Text className="text-gray-300 text-sm">Report Fire</Text>
                </button>
                <button className="p-4 bg-[#2A303C] hover:bg-[#323847] rounded-lg flex flex-col items-center transition-all">
                  <UserGroupIcon className="h-6 w-6 text-blue-500 mb-2" />
                  <Text className="text-gray-300 text-sm">Request Help</Text>
                </button>
              </div>
            </Card>
          </div>

          {/* Center Panel - Map */}
          <Card className="lg:col-span-2 bg-[#1A1F2B] border-gray-800">
            <div className="h-[800px] relative">
              <div className="absolute inset-0 bg-[#2A303C] rounded-lg">
                <div className="p-4 flex justify-between items-center border-b border-gray-800">
                  <Text className="text-gray-400 font-medium">TACTICAL MAP</Text>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-[#323847] rounded-md transition-all">
                      <CameraIcon className="h-5 w-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#323847] rounded-md transition-all">
                      <BuildingLibraryIcon className="h-5 w-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-[#323847] rounded-md transition-all">
                      <ChartBarIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Panel - Active Incidents */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#1A1F2B] border-gray-800">
              <Title className="text-gray-400 mb-4 text-sm font-medium">ACTIVE INCIDENTS</Title>
              <div className="space-y-4">
                {[1, 2, 3].map((incident) => (
                  <div key={incident} className="p-3 bg-[#2A303C] hover:bg-[#323847] rounded-lg cursor-pointer transition-all">
                    <div className="flex justify-between items-center">
                      <Text className="text-white font-medium">Incident #{incident}</Text>
                      <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-500 font-medium">Active</span>
                    </div>
                    <Text className="text-gray-400 text-sm mt-1">Davis, CA</Text>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-[#2A303C]"></div>
                        <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-[#2A303C]"></div>
                        <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-[#2A303C]"></div>
                      </div>
                      <Text className="text-gray-400 text-xs">3 units responding</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-[#1A1F2B] border-gray-800">
              <Title className="text-gray-400 mb-4 text-sm font-medium">RESOURCE STATUS</Title>
              <div className="space-y-4">
                <div className="p-3 bg-[#2A303C] rounded-lg">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-400">Fire Crews</Text>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-500 text-sm">12 Available</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-[#2A303C] rounded-lg">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-400">Aerial Resources</Text>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-yellow-500 text-sm">3 Deployed</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-[#2A303C] rounded-lg">
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-400">Fire Stations</Text>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-500 text-sm">5 Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
} 