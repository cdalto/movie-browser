import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import type Movie from "@/types/Movie"

interface MovieCardProps {
  movie: Movie
}

function getRatingClassName(rating: number) {
  if (rating >= 7) return "bg-green-100 text-green-700"
  if (rating >= 5) return "bg-amber-100 text-amber-700"
  return "bg-red-100 text-red-700"
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="relative">
        <div className="absolute inset-0 bg-black/35" />
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
          alt={`Poster for ${movie.title}`}
          className="aspect-[2/3] w-full object-cover brightness-60"
        />
      </div>
      <CardHeader>
        <CardAction>
          <Badge className={getRatingClassName(movie.rating)}>{movie.rating}</Badge>
        </CardAction>
        <CardTitle>{movie.title}</CardTitle>
        <CardDescription>
          {new Date(movie.releaseDate).getFullYear()} • {movie.genre}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{movie.description}</p>
      </CardContent>
    </Card>
  )
}