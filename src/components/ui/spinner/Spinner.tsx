'use client';

import Image from 'next/image';
import React from 'react';

type SpinnerProps = {
  text?: string;
  logoSrc?: string;
  brandName?: string;
};

export default function Spinner({
  text = 'Loading your Project & Task Management System. Please wait...',
  logoSrc = '/images/visitors/Location.png',
  brandName = 'InvicTask',
}: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
      {/* Logo and Brand */}
      <div className="mb-4 flex items-center space-x-2">
        <Image
          src={logoSrc}
          alt={`${brandName} Logo`}
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <h1 className="text-2xl font-bold text-brand-600 dark:text-white">
          {brandName}
        </h1>
      </div>

      {/* Spinner Animation */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-l-brand-600 border-r-brand-600 animate-spin shadow-md"></div>
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-brand-200 animate-ping opacity-20"></div>
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-gray-600 dark:text-white/70 text-sm text-center max-w-sm">
        {text}
      </p>
    </div>
  );
}
