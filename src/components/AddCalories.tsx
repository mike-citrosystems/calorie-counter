"use client";

import { useState } from "react";
import { PiPaperPlaneTiltBold } from "react-icons/pi";

interface AddCaloriesProps {
  onAdd: (calories: number, description: string) => void;
}

export default function AddCalories({ onAdd }: AddCaloriesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [calories, setCalories] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calories && description.trim()) {
      onAdd(Number(calories), description.trim());
      setCalories("");
      setDescription("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-all duration-200"
        aria-label="Add calories"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-4 min-w-[300px] z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What did you eat?"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Calories"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition-colors duration-200"
                    aria-label="Submit calories"
                  >
                    <PiPaperPlaneTiltBold className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
