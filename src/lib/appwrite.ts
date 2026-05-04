import { Client, Account, Databases, Query, ID } from "appwrite";

// --------------------
// ENV CONFIG
// --------------------
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = "metrics";

// --------------------
// CLIENT
// --------------------
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// --------------------
// TYPES
// --------------------
export type Movie = {
  id: number;
  poster_path: string | null;
};

export type MetricDoc = {
  $id: string;
  searchTerm: string;
  count: number;
  poster_url: string | null;
  movie_id: string;
};

// --------------------
// UPDATE SEARCH COUNT
// --------------------
export const updateSearchCount = async (
  searchTerm: string,
  movie: Movie,
): Promise<void> => {
  try {
    if (!searchTerm.trim()) return;

    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0] as unknown as MetricDoc;

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: (doc.count ?? 0) + 1,
      });
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm.trim(),
        count: 1,
        movie_id: String(movie.id),
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
      });
    }
  } catch (error) {
    console.error("updateSearchCount error:", error);
  }
};

// --------------------
// GET TRENDING MOVIES (FIXED)
// --------------------
export const getTrendingMovies = async (): Promise<MetricDoc[]> => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents.map((doc) => ({
      $id: doc.$id,
      searchTerm: doc.searchTerm,
      count: doc.count,
      poster_url: doc.poster_url,
      movie_id: doc.movie_id,
    })) as MetricDoc[];
  } catch (error) {
    console.error("getTrendingMovies error:", error);
    return [];
  }
};
