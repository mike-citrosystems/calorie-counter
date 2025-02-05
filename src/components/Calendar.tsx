"use client";

import { useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  isToday,
  endOfWeek,
  addMonths,
  subMonths,
} from "date-fns";

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

export default function Calendar({
  onSelectDate,
  selectedDate,
}: CalendarProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const weeks = [];
  let days = [];
  let day = startDate;

  // Calendar header with days
  const daysHeader = ["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
    <div key={idx} className="font-semibold text-center p-1 text-sm">
      {d}
    </div>
  ));

  // Generate calendar cells
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = new Date(day);
      days.push(
        <button
          key={day.toString()}
          onClick={() => onSelectDate(cloneDay)}
          className={`
            relative w-full aspect-square flex items-center justify-center
            ${!isSameMonth(day, monthStart) ? "text-gray-300" : ""}
            ${
              isSameDay(day, selectedDate)
                ? "bg-blue-500 text-white rounded-full"
                : "hover:bg-gray-50 rounded-full"
            }
            ${isToday(day) ? "font-bold" : ""}
          `}
        >
          {format(day, "d")}
        </button>
      );
      day = addDays(day, 1);
    }
    weeks.push(
      <div key={days[0].key} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="font-semibold">{format(currentMonth, dateFormat)}</h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Next month"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">{daysHeader}</div>
      <div className="space-y-1">{weeks}</div>
    </div>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}
