"use client";

import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import db from "@/lib/db";

interface ProgressBarProps {
  currentValue: number;
  limit: number;
  onLimitChange: (newLimit: number) => void;
}

export default function ProgressBar({
  currentValue,
  limit,
  onLimitChange,
}: ProgressBarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newLimit, setNewLimit] = useState(limit.toString());
  const percentage = Math.min((currentValue / limit) * 100, 100);

  const getBarColor = (percent: number) => {
    if (percent >= 80) return "bg-red-500";
    if (percent >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSave = async () => {
    const limitNum = parseInt(newLimit);
    if (limitNum > 0) {
      await db.setCalorieLimit(limitNum);
      onLimitChange(limitNum);
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between mb-1 text-sm items-center">
        <div className="text-2xl font-bold mb-2">
          {currentValue} / {limit} cal
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Settings"
          >
            <IoSettingsOutline className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor(
            percentage
          )}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isSettingsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg p-4 z-50 w-64">
            <h3 className="font-medium mb-3">Daily Calorie Limit</h3>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              placeholder="Enter calorie limit"
              min="1"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
