import Header from "./assets/components/Header";
import Search from "./assets/components/Search";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import MovieCard from "./assets/components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./lib/appwrite";

// --------------------
// API CONFIG
// --------------------
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

// --------------------
// TYPES
// --------------------
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  original_language: string;
  vote_average: number;
  release_date: string;
  adult: boolean;
};

type ApiResponse = {
  results: Movie[];
};

type TrendingMovie = {
  $id: string;
  searchTerm: string;
  count: number;
  poster_url: string | null;
  movie_id: string;
};

// --------------------
// APP
// --------------------
function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    1000,
    [searchTerm],
  );

  // --------------------
  // FETCH MOVIES
  // --------------------
  const fetchMovies = async (query: string = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=true&language=en-US&page=1`
        : `${API_BASE_URL}/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data: ApiResponse = await response.json();

      if (!data.results?.length) {
        setMoviesList([]);
        setErrorMessage("No results found");
        return;
      }

      setMoviesList(data.results);

      // --------------------
      // APPWRITE TRACKING
      // --------------------
      if (query.trim()) {
        const validMovie = data.results.find((m) => m.poster_path);

        if (validMovie) {
          try {
            await updateSearchCount(query.trim(), validMovie);
            await loadTrendingMovies();
          } catch (err) {
            console.log("Appwrite update failed:", err);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while fetching movies.");
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------
  // TRENDING
  // --------------------
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies as TrendingMovie[]);
    } catch (error) {
      console.error("Trending error:", error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // --------------------
  // UI
  // --------------------
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <Header />

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* TRENDING */}
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2 className="mb-4">Top Searched Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id} className="flex items-center gap-3">
                    <p>{index + 1}</p>

                    <img
                      src={
                        movie.poster_url || "https://via.placeholder.com/50x75"
                      }
                      alt={movie.searchTerm}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* MOVIES */}
          <section className="all-movies mt-10">
            <h2 className="mb-6">All Movies</h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <CircularProgress color="secondary" />
              </div>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {moviesList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
