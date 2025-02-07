"use client";

import { useEffect, useState } from "react";
import db from "@/lib/db";
import Image from "next/image";

export default function EntryImage({ imageId }: { imageId: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const blob = await db.getImage(imageId);
      if (blob) {
        setImageUrl(URL.createObjectURL(blob));
      }
    };

    loadImage();
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId]);

  if (!imageUrl) return null;

  return (
    <div className="relative w-full h-32">
      <Image
        src={imageUrl}
        alt="Entry"
        fill
        unoptimized
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, 300px"
      />
    </div>
  );
}
