import { Suspense } from "react";
import { isUserGenerationEnabled } from "@/lib/generation/user-generation-guard";
import { SearchContent } from "./search-content";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>}>
      <SearchContent generationEnabled={isUserGenerationEnabled()} />
    </Suspense>
  );
}
