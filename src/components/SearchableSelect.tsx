"use client";

import { useState, useRef } from "react";
import { useCombobox } from "downshift";

interface Item {
  description: string;
  calories: number;
}

interface SearchableSelectProps {
  items: Item[];
  value: string;
  onChange: (value: string, calories?: number) => void;
  placeholder?: string;
}

export default function SearchableSelect({
  items,
  value,
  onChange,
  placeholder,
}: SearchableSelectProps) {
  const [inputItems, setInputItems] = useState(items);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: inputItems,
    inputValue: value,
    itemToString: (item) => item?.description || "",
    onInputValueChange: ({ inputValue }) => {
      const newValue = inputValue?.toLowerCase() || "";
      setInputItems(
        items.filter((item) =>
          item.description.toLowerCase().includes(newValue)
        )
      );
      onChange(inputValue || "");
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onChange(selectedItem.description, selectedItem.calories);
      }
    },
  });

  return (
    <div className="relative">
      <input
        {...getInputProps({
          ref: inputRef,
          className:
            "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
          placeholder: placeholder,
        })}
      />
      <ul
        {...getMenuProps()}
        className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${
          isOpen && inputItems.length > 0 ? "" : "hidden"
        }`}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              key={item.description}
              {...getItemProps({ item, index })}
              className={`px-3 py-2 cursor-pointer ${
                highlightedIndex === index ? "bg-blue-100" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between">
                <span>{item.description}</span>
                <span className="text-gray-500">{item.calories} cal</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
