"use client";

import { format } from "date-fns";
import { IoClose } from "react-icons/io5";
import EntryImage from "./EntryImage";
import { CalorieEntry } from "./EntryList";

interface EntryDetailsProps {
  entry: CalorieEntry;
  onClose: () => void;
}

export default function EntryDetails({ entry, onClose }: EntryDetailsProps) {
  const category = entry.description.match(/^\[(.*?)\]/)?.[1];
  const description = entry.description.replace(/^\[(.*?)\]\s*/, "");

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl p-4 z-50 max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Entry Details</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3">
            {entry.imageUrl && (
              <div className="relative w-full h-64">
                <EntryImage imageId={entry.imageUrl} />
              </div>
            )}

            <div className="grid gap-4">
              <div>
                <span className="text-sm text-gray-500 block">Category</span>
                <p className="font-medium">{category}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500 block">Description</span>
                <p className="font-medium">{description}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500 block">Calories</span>
                <p className="font-medium">{entry.calories} cal</p>
              </div>

              <div>
                <span className="text-sm text-gray-500 block">Time</span>
                <p className="font-medium">
                  {format(entry.timestamp, "MMM d, yyyy h:mm a")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
