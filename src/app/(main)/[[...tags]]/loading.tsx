import { Skeleton } from "@/components/ui/skeleton";

const getHeaderWidth = (i: number) => {
  return i % 2 === 0 ? "w-[180px]" : "w-[160px]";
};

export default function Loading() {
  return (
    <div className="w-full relative top-[0px]">
      <Skeleton className="h-9 w-[140px] mb-12" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-[750px]" />
        <Skeleton className="h-4 w-[600px]" />
      </div>
      <div className="h-1" />
      {[...new Array(2)].map((_, i) => (
        <div key={i} className="">
          <Skeleton className={`h-6 ${getHeaderWidth(i)} mt-14`} />
          <div className="flex items-center justify-start border border-gray-100 rounded-sm pl-4 py-4 mt-5">
            {[...Array(4)].map((_, j) => (
              <Skeleton
                key={j}
                className="h-[200px] w-[210px] min-w-[210px]  mr-4 overflow-auto px-2"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
