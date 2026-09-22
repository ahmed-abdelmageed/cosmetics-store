import Spinner from "./spinner";

export default function PageLoading() {
  return (
    <div className="container-app py-24 flex flex-col items-center justify-center gap-4">
      <Spinner size={36} />
      <p className="text-amber-600 text-sm font-medium">جارٍ التحميل...</p>
    </div>
  );
}
