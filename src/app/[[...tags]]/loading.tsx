import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative top-[12px]">
      <div className="space-y-3">
        <Skeleton className="h-8 w-[750px]" />
        <Skeleton className="h-4 w-[600px]" />
      </div>
      <div className="h-1" />
      {[...new Array(2)].map(() => (
        <div className="">
          <Skeleton className="h-6 w-[140px] mt-14" />
          <div className="flex items-center justify-start bg-gray-100 rounded-sm pl-4 py-4 mt-6">
            {[...Array(4)].map(() => (
              <Skeleton className="h-[270px] w-[210px]  mr-4 overflow-auto px-2 bg-gray-50" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
