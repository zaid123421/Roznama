import React from "react";

export default function Pagination ({ currentPage, lastPage, onPrevPage, onNextPage }) {
  return (
    <div className="flex items-center justify-center gap-4 mt-4 mb-[15px]">
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-2xl duration-300 bg-gray-300 ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
        }`}
      >
        السابق
      </button>
      <span className="text-lg font-bold">
        {currentPage} / {lastPage}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage === lastPage}
        className={`px-4 py-2 rounded-2xl duration-300 bg-gray-300 ${
          currentPage === lastPage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
        }`}
      >
        التالي
      </button>
    </div>
  );
}