import { cn } from '../../lib/utils';

export const Skeleton = ({ className }) => <div className={cn('skeleton', className)} aria-hidden="true" />;

export const CardSkeleton = () => (
  <div className="card overflow-hidden" aria-hidden="true">
    <Skeleton className="aspect-[16/10] rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }, (_, i) => <CardSkeleton key={i} />)}
  </div>
);

export const PageSkeleton = () => (
  <div className="container-x space-y-6 py-32" role="status" aria-label="Loading">
    <Skeleton className="h-10 w-1/2" />
    <Skeleton className="h-5 w-2/3" />
    <GridSkeleton count={3} />
  </div>
);
