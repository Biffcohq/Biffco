export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F9FAFB] p-6 pt-12 dark:bg-[#0C111D] animate-in fade-in duration-300">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Header Skeleton */}
        <header className="flex flex-col items-center space-y-3">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
        </header>

        {/* Main Card Skeleton */}
        <main className="rounded-xl border border-[#EAECF0] bg-white p-6 shadow-sm dark:border-[#1F242F] dark:bg-[#161B26] space-y-6">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
          
          <div className="grid grid-cols-2 gap-4 rounded bg-[#F2F4F7] p-4 dark:bg-[#1C222E]">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-28 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-36 bg-slate-300 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
             <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
             <div className="h-16 w-full rounded border border-dashed border-[#EAECF0] bg-[#F9FAFB] dark:border-[#1F242F] dark:bg-[#0C111D] animate-pulse"></div>
          </div>
        </main>
        
      </div>
    </div>
  );
}
