import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useFetch } from '../hooks/useFetch'
import type Movie from '../types/Movie';
import MovieCard from '@/components/MovieCard';
import MovieCardSkeleton from '@/components/MovieCardSkeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

const API_KEY = import.meta.env.VITE_API_KEY;

export default function MovieBrowser() {
  const MOVIES_PER_PAGE = 6;

  // State for search input
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);
  const query = debouncedInput.toLowerCase().trim();

  // State for sorting
  const [sortBy, setSortBy] = useState<"rating" | "year">("rating");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch and map movies and genres
  const { data: movieData, loading, error } = useFetch<any>(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`)
  const { data: genreData } = useFetch<{ genres: { id: number; name: string }[] }>(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
  );

  const genreMap = useMemo(() => {
    const map = new Map<number, string>();
    genreData?.genres.forEach(genre => map.set(genre.id, genre.name));
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

  const totalPages = Math.ceil(sortedMovies.length / MOVIES_PER_PAGE);

  const paginatedMovies = useMemo(() => {
    const map = new Map<number, Movie[]>();
    Array.from({ length: totalPages }, (_, i) => i + 1)
      .forEach(page =>
        map.set(page, sortedMovies.slice((page - 1) * MOVIES_PER_PAGE, page * MOVIES_PER_PAGE))
      )
    return map;
  }, [sortedMovies])

  useEffect(() => { setCurrentPage(1) }, [query])

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <div className="flex flex-row items-center gap-3">
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
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : (paginatedMovies.get(currentPage) ?? []).length > 0
            ? (paginatedMovies.get(currentPage) ?? []).map(movie => <MovieCard key={movie.id} movie={movie} />)
            : <div className="col-span-full py-12 text-center text-muted-foreground">No movies found.</div>
        }
      </section>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              onClick={currentPage === 1 ? undefined : () => setCurrentPage(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page: number) =>
            <PaginationItem key={page}>
              <PaginationLink href="#" isActive={page === currentPage} onClick={() => setCurrentPage(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage === totalPages}
              onClick={currentPage === totalPages ? undefined : () => setCurrentPage(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}