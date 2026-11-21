function CardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5]" />
      <div className="skeleton h-3.5 w-4/5 mt-3" />
      <div className="skeleton h-3.5 w-1/3 mt-2" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="container-app py-10 md:py-14">
      <div className="skeleton h-9 w-56 mb-8" />
      <div className="flex gap-2 flex-wrap mb-8 pb-8 border-b border-line">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-9 w-20" />
        ))}
      </div>
      <ProductGridSkeleton />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="container-app py-8 md:py-12">
      <div className="skeleton h-3 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 md:gap-14">
        <div className="skeleton aspect-[4/5]" />
        <div>
          <div className="skeleton h-4 w-24 mb-3" />
          <div className="skeleton h-10 w-4/5 mb-4" />
          <div className="skeleton h-7 w-32 mb-8" />
          <div className="skeleton h-14 w-full mb-8" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-11/12 mb-2" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div>
      <div className="bg-cream">
        <div className="container-app grid lg:grid-cols-2 gap-12 items-center lg:min-h-[calc(100svh-108px)] py-12">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="skeleton h-8 w-64 !rounded-full" />
            <div className="skeleton h-14 w-4/5" />
            <div className="skeleton h-14 w-3/5" />
            <div className="skeleton h-5 w-full max-w-xl mt-2" />
            <div className="skeleton h-14 w-72 !rounded-full mt-4" />
            <div className="skeleton h-24 w-full max-w-lg !rounded-2xl mt-6" />
          </div>
          <div className="skeleton !rounded-full aspect-square w-full max-w-[460px] mx-auto" />
        </div>
      </div>
      <div className="container-app py-14 md:py-20 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="skeleton aspect-[4/3]" />
          <div className="skeleton aspect-[4/3]" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
