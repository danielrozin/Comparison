import type { Metadata } from "next";
import { RequestForm } from "@/components/requests/RequestForm";
import { RequestList } from "@/components/requests/RequestList";

export const metadata: Metadata = {
  title: "Request a Comparison | A Versus B",
  description:
    "Suggest comparisons you'd like to see on A Versus B. Vote on existing requests to help us prioritize what to build next.",
};

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Request a Comparison
          </h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Suggest it and vote on others&apos;
            requests. Top-voted comparisons get built first!
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Suggest a Comparison
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  Tell us what you&apos;d like to see compared.
                </p>
                <RequestForm />
              </div>
            </div>
          </div>

          {/* Request List */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Community Requests
            </h2>
            <RequestList />
          </div>
        </div>
      </div>
    </div>
  );
}
