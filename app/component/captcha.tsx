"use client";

import { useState, useEffect } from "react";
import { Check, RefreshCw } from "lucide-react";

interface CaptchaData {
  images: Array<{ image: string; type: string }>;
  correctDogIndices: number[];
  timestamp: number;
}

export default function Captcha() {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNewCaptcha = async () => {
    setIsLoading(true);
    setSelectedImages([]);
    
    try {
      const response = await fetch('/api/captcha-random');
      const data = await response.json();
      setCaptchaData(data);
    } catch (error) {
      console.error('Failed to load captcha:', error);
      alert('Failed to load captcha. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNewCaptcha();
  }, []);

  const handleImageClick = (index: number) => {
    if (isLoading) return;
    
    setSelectedImages(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const verifyCaptcha = () => {
    if (!captchaData || isLoading) return;
    
    const sortedSelected = [...selectedImages].sort((a, b) => a - b);
    const sortedCorrect = [...captchaData.correctDogIndices].sort((a, b) => a - b);

    const isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((v, i) => v === sortedCorrect[i]);

    if (isCorrect) {
      alert("Success! You correctly identified all the dogs!");
      loadNewCaptcha();
    } else {
      alert("Failed! Please try again. Make sure to select ALL dogs and ONLY dogs.");
    }
  };

  if (typeof window !== 'undefined') {
    (window as any).captchaVerify = verifyCaptcha;
  }

  const imageLocation = captchaData?.images?.map((item, index) => 
    `/api/captcha-image/${index}?image=${item.image}&t=${captchaData.timestamp}`
  ) || [];

  return (
    <div className="w-90 rounded-xl border bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800 flex items-center justify-between">
        <span>
          Select all images with <span className="text-blue-600">dogs</span>
        </span>
        <button
          onClick={loadNewCaptcha}
          disabled={isLoading}
          className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
          title="Refresh images"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-3 gap-0.5 bg-gray-300 p-0.5">
        {Array.from({ length: 9 }).map((_, index) => {
          const isSelected = selectedImages.includes(index);
          const imgUrl = imageLocation[index];

          return (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className={`relative aspect-square cursor-pointer bg-white
                transition-all duration-200
                ${isSelected ? "ring-4 ring-blue-500" : "hover:ring-2 hover:ring-blue-300"}
                ${isLoading ? 'opacity-50' : ''}
              `}
            >
              {isLoading ? (
                <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : imgUrl ? (
                <img
                  src={imgUrl}
                  alt={`Captcha image ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.log(`Failed to load image: ${imgUrl}`);
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No image</span>
                </div>
              )}

              {/* Selected overlay */}
              {isSelected && !isLoading && (
                <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                  <Check className="text-white w-8 h-8" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs text-gray-500">
          Selected: {selectedImages.length}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedImages([])}
            disabled={isLoading}
            className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-100 transition disabled:opacity-50"
          >
            Clear
          </button>
          <button
            onClick={verifyCaptcha}
            disabled={isLoading}
            className="text-sm px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
