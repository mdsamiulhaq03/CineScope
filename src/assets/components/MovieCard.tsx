import React, { useState } from "react";
import noPoster from "../images/No-Poster.png";

function MovieCard({ movie }) {
  const [saved, setSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 w-full max-w-[280px] font-sans">
      {/* Poster */}
      <div className="relative h-[360px] bg-[#0d0d1a] overflow-hidden group">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : noPoster
          }
          alt={movie.title}
          className="w-full h-full object-cover opacity-90 transition duration-300 group-hover:scale-110"
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide">
            {movie.original_language}
          </span>

          {movie.vote_average > 0 && (
            <span
              className="text-white text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, #7C3AED, #A855F7, #6D28D9)",
                boxShadow: "0 0 10px rgba(139,92,246,0.4)",
              }}
            >
              ★ {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>

        {/* Title overlay */}
        <div
          className="absolute bottom-0 inset-x-0 px-4 pt-10 pb-4"
          style={{
            background:
              "linear-gradient(to top, rgba(10,5,28,0.95) 0%, rgba(10,5,28,0.6) 55%, transparent 100%)",
          }}
        >
          <h3 className="text-white text-[17px] font-medium leading-snug m-0">
            {movie.title}
          </h3>

          <p className="text-white/50 text-xs mt-0.5">
            {movie.release_date?.slice(0, 4)}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-3.5 pb-4">
        <p
          className={`text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3.5 ${
            showDetails ? "" : "line-clamp-3"
          }`}
        >
          {movie.overview}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className="cursor-pointer flex-1 py-2 rounded-lg text-[13px] font-medium text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
            style={{
              background: saved
                ? "linear-gradient(135deg, #6D28D9, #7C3AED, #5B21B6)"
                : "linear-gradient(135deg, #7C3AED, #A855F7, #6D28D9)",
              boxShadow: "0 2px 12px rgba(139,92,246,0.35)",
            }}
          >
            {saved ? "✓ Saved" : "+ Watchlist"}
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="cursor-pointer px-3.5 py-2 rounded-lg text-[13px] text-gray-500 border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {showDetails ? "Hide" : "Details"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
