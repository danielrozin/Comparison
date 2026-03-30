"use client";

import { useState, useEffect, useCallback } from "react";
import { trackComparisonVote } from "@/lib/utils/analytics";

interface PollEntity {
  name: string;
  imageUrl: string | null;
  position: number;
}

interface ComparisonPollProps {
  comparisonId: string;
  comparisonSlug: string;
  entities: PollEntity[];
}

const COOKIE_NAME = "poll_session_id";
const VOTED_KEY_PREFIX = "poll_voted_";

function getSessionId(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (match) return decodeURIComponent(match[1]);
  const id = crypto.randomUUID();
  document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  return id;
}

function getVotedChoice(comparisonId: string): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(`${VOTED_KEY_PREFIX}${comparisonId}`);
}

function setVotedChoice(comparisonId: string, choice: string) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(`${VOTED_KEY_PREFIX}${comparisonId}`, choice);
  }
}

export function ComparisonPoll({ comparisonId, comparisonSlug, entities }: ComparisonPollProps) {
  const [voted, setVoted] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const entityA = entities.find((e) => e.position === 0) || entities[0];
  const entityB = entities.find((e) => e.position === 1) || entities[1];

  useEffect(() => {
    setMounted(true);
    const existingVote = getVotedChoice(comparisonId);
    if (existingVote) {
      setVoted(existingVote);
      // Fetch current results
      fetch(`/api/comparisons/poll?comparisonId=${encodeURIComponent(comparisonId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.votes) {
            setVotes(data.votes);
            setTotal(data.total);
          }
        })
        .catch(() => {});
    }
  }, [comparisonId]);

  const handleVote = useCallback(
    async (entityName: string) => {
      if (voted || loading) return;
      setLoading(true);

      try {
        const sessionId = getSessionId();
        const res = await fetch("/api/comparisons/poll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comparisonId, entityChoice: entityName, sessionId }),
        });

        if (res.status === 409) {
          // Already voted — fetch results
          setVotedChoice(comparisonId, entityName);
          setVoted(entityName);
          const resultsRes = await fetch(`/api/comparisons/poll?comparisonId=${encodeURIComponent(comparisonId)}`);
          const data = await resultsRes.json();
          if (data.votes) {
            setVotes(data.votes);
            setTotal(data.total);
          }
          return;
        }

        const data = await res.json();
        if (data.success) {
          setVotedChoice(comparisonId, entityName);
          setVoted(entityName);
          setVotes(data.votes);
          setTotal(data.total);
          trackComparisonVote(entityA.name, entityB.name, entityName);
        }
      } catch {
        // Silent fail — non-critical engagement feature
      } finally {
        setLoading(false);
      }
    },
    [comparisonId, voted, loading, entityA.name, entityB.name]
  );

  if (!entityA || !entityB) return null;
  if (!mounted) {
    // SSR placeholder to avoid hydration mismatch
    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white border border-border rounded-xl p-5 sm:p-6 animate-pulse">
          <div className="h-6 bg-surface-alt rounded w-48 mx-auto mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-surface-alt rounded-lg" />
            <div className="h-24 bg-surface-alt rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  const votesA = votes[entityA.name] || 0;
  const votesB = votes[entityB.name] || 0;
  const pctA = total > 0 ? Math.round((votesA / total) * 100) : 50;
  const pctB = total > 0 ? 100 - pctA : 50;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white border border-border rounded-xl p-5 sm:p-6">
        <h3 className="text-center text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Which do you prefer?
        </h3>

        {!voted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <VoteButton
              entity={entityA}
              onClick={() => handleVote(entityA.name)}
              loading={loading}
              colorClass="primary"
            />
            <VoteButton
              entity={entityB}
              onClick={() => handleVote(entityB.name)}
              loading={loading}
              colorClass="accent"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <ResultBar
                name={entityA.name}
                pct={pctA}
                count={votesA}
                isChosen={voted === entityA.name}
                colorClass="bg-primary"
              />
              <ResultBar
                name={entityB.name}
                pct={pctB}
                count={votesB}
                isChosen={voted === entityB.name}
                colorClass="bg-accent"
              />
            </div>
            <p className="text-center text-xs text-text-secondary">
              {total.toLocaleString()} vote{total !== 1 ? "s" : ""} total
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function VoteButton({
  entity,
  onClick,
  loading,
  colorClass,
}: {
  entity: PollEntity;
  onClick: () => void;
  loading: boolean;
  colorClass: "primary" | "accent";
}) {
  const bgHover = colorClass === "primary" ? "hover:border-primary hover:bg-primary-50" : "hover:border-accent hover:bg-purple-50";
  const textColor = colorClass === "primary" ? "text-primary-700" : "text-purple-700";

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`group relative flex flex-col items-center justify-center gap-2 p-5 border-2 border-border rounded-xl transition-all cursor-pointer ${bgHover} disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {entity.imageUrl ? (
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-alt">
          <img src={entity.imageUrl} alt={entity.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
          colorClass === "primary" ? "bg-primary-100 text-primary-600" : "bg-purple-100 text-purple-600"
        }`}>
          {entity.name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className={`font-semibold text-sm ${textColor}`}>{entity.name}</span>
    </button>
  );
}

function ResultBar({
  name,
  pct,
  count,
  isChosen,
  colorClass,
}: {
  name: string;
  pct: number;
  count: number;
  isChosen: boolean;
  colorClass: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium ${isChosen ? "text-text" : "text-text-secondary"}`}>
          {name}
          {isChosen && (
            <span className="ml-1.5 inline-flex items-center text-xs text-green-600">
              <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your vote
            </span>
          )}
        </span>
        <span className="text-sm font-semibold text-text">{pct}%</span>
      </div>
      <div className="h-3 bg-surface-alt rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
          style={{
            width: `${pct}%`,
            animation: "barGrow 0.7s ease-out",
          }}
        />
      </div>
      <p className="text-xs text-text-secondary mt-0.5">{count.toLocaleString()} vote{count !== 1 ? "s" : ""}</p>
    </div>
  );
}
