"use client";

import { useRef, useState } from "react";
import { IoCamera } from "react-icons/io5";
import Image from "next/image";

interface ImageCaptureProps {
  onCapture: (blob: Blob) => void;
}

export default function ImageCapture({ onCapture }: ImageCaptureProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (file: File) => {
    // Create preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Process image - resize if needed
    const img = document.createElement("img");
    img.src = url;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Resize to max 800px width/height while maintaining aspect ratio
    const maxSize = 800;
    let width = img.width;
    let height = img.height;

    if (width > height && width > maxSize) {
      height *= maxSize / width;
      width = maxSize;
    } else if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          console.log("Created blob:", blob.size, "bytes"); // Debug log
          onCapture(blob);
        }
      },
      "image/jpeg",
      0.8
    );
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleCapture(file);
        }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <IoCamera className="w-5 h-5" />
        Take Photo
      </button>

      {previewUrl && (
        <div className="relative">
          <div className="relative w-full h-full">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              unoptimized
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
