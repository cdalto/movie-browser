import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useFetch } from '../hooks/useFetch'
import type Movie from '../types/Movie';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

const API_KEY = import.meta.env.VITE_API_KEY;

export default function MovieBrowser() {
  const [input, setInput] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "year">("rating");
  const debouncedInput = useDebounce(input, 500);
  const query = debouncedInput.toLowerCase().trim();

  const { data: movieData, loading, error } = useFetch<any>(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`)
  const { data: genreData } = useFetch<{ genres: { id: number; name: string }[] }>(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
  );

  const genreMap = useMemo(() => {
    const map = new Map<number, string>();
    genreData?.genres.forEach(g => map.set(g.id, g.name));
    return map;
  }, [genreData]);

  const movies: Movie[] = (movieData?.results ?? []).map((m: any) => ({
    id: m.id,
    title: m.title,
    releaseDate: new Date(m.release_date),
    genre: genreMap.get(m.genre_ids[0]) ?? 'Unknown',
    rating: Number(m.vote_average.toFixed(2)),
    description: m.overview,
    poster: m.poster_path
  }))

  const filteredMovies = movies?.filter(movie =>
    movie.title.toLowerCase().includes(query) ||
    new Date(movie.releaseDate).getFullYear().toString().includes(query) ||
    movie.genre.toLowerCase().includes(query)
  )

  const sortedMovies = useMemo(() => {
    const list = [...filteredMovies];
    if (sortBy === "rating") return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "year") return list.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    return list;
  }, [filteredMovies, sortBy]);

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <div className="flex flex-row items-center gap-3 mb-6">
        <Input placeholder='Search...' value={input} onChange={(e) => setInput(e.target.value)} />
        <Select defaultValue="rating" onValueChange={(value) => setSortBy(value as "rating" | "year")}>
          <SelectTrigger className="h-9 w-[160px] shrink-0 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              <SelectItem value="rating">Best Rated</SelectItem>
              <SelectItem value="year">Newest</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : sortedMovies.length > 0
            ? sortedMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)
            : <div className="col-span-full py-12 text-center text-muted-foreground">No movies found.</div>
        }
      </section>
    </>
  )
}