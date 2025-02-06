import { format } from "date-fns";
import { useState } from "react";
import EntryDetails from "./EntryDetails";

const CATEGORY_STYLES = {
  Breakfast: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    ring: "ring-yellow-600/20",
  },
  Lunch: {
    bg: "bg-green-100",
    text: "text-green-800",
    ring: "ring-green-600/20",
  },
  Dinner: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    ring: "ring-purple-600/20",
  },
  Snack: { bg: "bg-blue-100", text: "text-blue-800", ring: "ring-blue-600/20" },
} as const;

export type CalorieEntry = {
  id?: number;
  calories: number;
  description: string;
  timestamp: number;
  imageUrl?: string;
};

interface EntryListProps {
  entries: CalorieEntry[];
  onDelete?: (id: number) => void;
  showDate?: boolean;
}

export default function EntryList({
  entries,
  onDelete,
  showDate = false,
}: EntryListProps) {
  const [selectedEntry, setSelectedEntry] = useState<CalorieEntry | null>(null);

  const getCategoryFromDescription = (description: string) => {
    const match = description.match(/^\[(.*?)\]/);
    return match ? match[1] : null;
  };

  const getDescriptionWithoutCategory = (description: string) => {
    return description.replace(/^\[(.*?)\]\s*/, "");
  };

  return (
    <div className="divide-y divide-gray-100">
      {entries.map((entry) => {
        const category = getCategoryFromDescription(entry.description);
        const cleanDescription = getDescriptionWithoutCategory(
          entry.description
        );
        const categoryStyle = category
          ? CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES]
          : null;

        return (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">
                  {entry.calories} cal
                </span>
                <div className="flex items-center gap-2">
                  {category && categoryStyle && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset
                        ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.ring}`}
                    >
                      {category}
                    </span>
                  )}
                  <h3 className="flex-1 min-w-0">{cleanDescription}</h3>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {showDate
                  ? format(entry.timestamp, "MMM d, h:mm a")
                  : format(entry.timestamp, "h:mm a")}
              </p>
            </div>
            {onDelete && entry.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry.id!);
                }}
                className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-150"
                aria-label="Delete entry"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            )}
          </div>
        );
      })}

      {selectedEntry && (
        <EntryDetails
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}

      {entries.length === 0 && (
        <p className="py-8 text-center text-gray-500">No entries to display</p>
      )}
    </div>
  );
}
