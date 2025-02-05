"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import SearchableSelect from "./SearchableSelect";
import db from "@/lib/db";
import ImageCapture from "./ImageCapture";

interface AddCaloriesProps {
  onAdd: (
    calories: number,
    description: string,
    timestamp?: number,
    imageBlob?: Blob
  ) => void;
}

const CATEGORIES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
] as const;

type Category = (typeof CATEGORIES)[number]["id"];

export default function AddCalories({ onAdd }: AddCaloriesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [category, setCategory] = useState<Category>("snack");
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [pastEntries, setPastEntries] = useState<
    Array<{
      description: string;
      calories: number;
    }>
  >([]);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const loadPastEntries = async () => {
      try {
        const entries = await db.getAllEntries();
        const processedEntries = entries.map((entry) => ({
          description: entry.description.replace(/^\[(.*?)\]\s*/, ""),
          calories: entry.calories,
        }));

        // Remove duplicates by description
        const uniqueEntries = Array.from(
          new Map(
            processedEntries.map((entry) => [entry.description, entry])
          ).values()
        );

        setPastEntries(uniqueEntries);
      } catch (error) {
        console.error("Failed to load past entries:", error);
      }
    };

    if (isOpen) {
      loadPastEntries();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !calories) return;

    const timestamp = useCustomDate
      ? new Date(customDate).getTime()
      : undefined;

    const fullDescription = `[${
      CATEGORIES.find((c) => c.id === category)?.label
    }] ${description}`;

    await onAdd(
      Number(calories),
      fullDescription,
      timestamp,
      imageBlob || undefined
    );
    setIsOpen(false);
    setDescription("");
    setCalories("");
    setCategory("snack");
    setUseCustomDate(false);
    setCustomDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setImageBlob(null);
  };

  const handleDescriptionChange = (
    newDescription: string,
    calories?: number
  ) => {
    setDescription(newDescription);
    if (calories) {
      setCalories(calories.toString());
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        aria-label="Add calories"
      >
        Add Entry
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsOpen(false)}
        role="presentation"
      />
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl p-4 z-50 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-4 rounded-lg border ${
                    category === cat.id
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <SearchableSelect
              items={pastEntries}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="What did you eat?"
            />
          </div>

          <div>
            <label
              htmlFor="calories"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Calories
            </label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Calories"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useCustomDate}
                onChange={(e) => setUseCustomDate(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Set custom date and time
              </span>
            </label>
          </div>

          {useCustomDate && (
            <div>
              <label
                htmlFor="datetime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date and Time
              </label>
              <input
                type="datetime-local"
                id="datetime"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo
            </label>
            <ImageCapture onCapture={setImageBlob} />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              aria-label="Submit calories"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
