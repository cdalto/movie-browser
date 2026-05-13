import { Card, CardAction, CardContent, CardHeader } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export default function MovieCardSkeleton() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <Skeleton className="aspect-[2/3] w-full rounded-none rounded-t-xl" />
      <CardHeader>
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardAction>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  )
}