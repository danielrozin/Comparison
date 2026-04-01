"use client";

import { useState, useCallback } from "react";

const TOTAL_PAGES = 6;

type Answers = Record<string, string | string[] | Record<string, string> | null>;

export function SurveyForm() {
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = useCallback((key: string, value: string | string[] | Record<string, string> | null) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const get = useCallback(
    (key: string) => answers[key] as string | undefined,
    [answers]
  );
  const getArr = useCallback(
    (key: string) => (answers[key] as string[]) || [],
    [answers]
  );

  function toggleCheckbox(key: string, value: string, max?: number) {
    const arr = getArr(key);
    if (arr.includes(value)) {
      set(key, arr.filter((v) => v !== value));
    } else {
      if (max && arr.length >= max) return;
      set(key, [...arr, value]);
    }
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    switch (page) {
      case 1:
        if (!get("q1")) errs.q1 = "Please select an option";
        if (!get("q2")) errs.q2 = "Please select an option";
        if (!get("q3")) errs.q3 = "Please select an option";
        if ((get("q3") === "Partially" || get("q3") === "No") && !get("q3a"))
          errs.q3a = "Please share your feedback";
        break;
      case 2:
        if (!get("q4")) errs.q4 = "Please select an option";
        if (get("q4") !== "Yes" && getArr("q5").length === 0)
          errs.q5 = "Please select at least one option";
        break;
      case 3:
        if (!get("q7")) errs.q7 = "Please select an option";
        if (
          !get("q8a") ||
          !get("q8b") ||
          !get("q8c") ||
          !get("q8d") ||
          !get("q8e")
        )
          errs.q8 = "Please rate all features";
        if (!get("q9")) errs.q9 = "Please select an option";
        break;
      case 4:
        if (!get("q10")) errs.q10 = "Please select an option";
        if (get("q10") !== "No" && !get("q11"))
          errs.q11 = "Please select an option";
        if (getArr("q12").length === 0)
          errs.q12 = "Please select at least one option";
        break;
      case 5:
        if (!get("q13")) errs.q13 = "Please select a rating";
        if (getArr("q14").length === 0)
          errs.q14 = "Please select at least one option";
        if (!get("q15")) errs.q15 = "Please select an option";
        break;
      case 6:
        if (!get("q16")) errs.q16 = "Please select an option";
        {
          const cats = getArr("q17");
          if (cats.length === 0 || cats.length > 3)
            errs.q17 = "Please select 1-3 categories";
        }
        break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleNext() {
    if (!validate()) return;

    if (page === TOTAL_PAGES) {
      setSubmitting(true);
      const data = {
        timestamp: new Date().toISOString(),
        visitIntent: get("q1"),
        visitIntentOther: get("q1_other") || null,
        discoveryChannel: get("q2"),
        discoveryChannelOther: get("q2_other") || null,
        foundWhatLooking: get("q3"),
        whatWasMissing: get("q3a") || null,
        hasWrittenReview: get("q4"),
        reviewBarriers: getArr("q5"),
        reviewBarriersOther: get("q5_other") || null,
        wouldMotivateReview: get("q6") || null,
        hasAccount: get("q7"),
        featureInterest: {
          trackProducts: get("q8a"),
          smartScoreAlerts: get("q8b"),
          personalizedRecs: get("q8c"),
          saveComparisons: get("q8d"),
          followCategories: get("q8e"),
        },
        preferredSignup: get("q9"),
        wouldSubscribe: get("q10"),
        notificationFrequency: get("q11") || null,
        valuableEmailContent: getArr("q12"),
        aiTrustLevel: get("q13"),
        trustIncreaseFactors: getArr("q14"),
        scoreDisagreeBehavior: get("q15"),
        visitFrequency: get("q16"),
        categories: getArr("q17"),
        categoriesOther: get("q17_other") || null,
        openFeedback: get("q18") || null,
      };

      try {
        localStorage.setItem("sr_survey_" + Date.now(), JSON.stringify(data));
      } catch {}

      try {
        const res = await fetch("/api/survey/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("API error");
      } catch {
        console.warn("Survey API unavailable, saved locally");
      }

      setDone(true);
      setSubmitting(false);
      return;
    }

    setPage((p) => p + 1);
    window.scrollTo(0, 0);
  }

  function handlePrev() {
    setPage((p) => Math.max(1, p - 1));
    window.scrollTo(0, 0);
  }

  if (done) {
    return (
      <div className="max-w-[640px] mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank you!</h2>
        <p className="text-gray-500">
          Your feedback helps us build a better SmartReview.
          <br />
          You can close this tab now.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center pb-6 border-b-2 border-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Help Shape SmartReview
        </h1>
        <p className="text-gray-500 text-[0.95rem]">
          Your feedback directly shapes what we build next. Takes about 3
          minutes. All responses are anonymous.
        </p>
        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-400"
            style={{ width: `${(page / TOTAL_PAGES) * 100}%` }}
          />
        </div>
      </div>

      {/* Page 1 */}
      {page === 1 && (
        <div>
          <SectionTitle>About Your Visit</SectionTitle>
          <RadioQuestion
            label="What is the main reason you visited SmartReview today?"
            required
            name="q1"
            value={get("q1")}
            onChange={(v) => set("q1", v)}
            error={errors.q1}
            options={[
              "Compare specific products side-by-side",
              "Read user reviews before buying",
              "Research a product category",
              "Check SmartScore ratings",
              "Browse/discover new products",
              "Other",
            ]}
            otherValue={get("q1_other")}
            onOtherChange={(v) => set("q1_other", v)}
          />
          <RadioQuestion
            label="How did you find SmartReview?"
            required
            name="q2"
            value={get("q2")}
            onChange={(v) => set("q2", v)}
            error={errors.q2}
            options={[
              "Google/search engine",
              "Social media",
              "Direct link / typed URL",
              "Referral from another site or friend",
              "Other",
            ]}
            otherValue={get("q2_other")}
            onOtherChange={(v) => set("q2_other", v)}
          />
          <RadioQuestion
            label="Did you find what you were looking for today?"
            required
            name="q3"
            value={get("q3")}
            onChange={(v) => set("q3", v)}
            error={errors.q3}
            options={["Yes, completely", "Partially", "No"]}
          />
          {(get("q3") === "Partially" || get("q3") === "No") && (
            <TextAreaQuestion
              label="What was missing or hard to find?"
              required
              value={get("q3a") || ""}
              onChange={(v) => set("q3a", v)}
              error={errors.q3a}
              placeholder="Tell us what you couldn't find..."
            />
          )}
        </div>
      )}

      {/* Page 2 */}
      {page === 2 && (
        <div>
          <SectionTitle>Your Experience with Reviews</SectionTitle>
          <RadioQuestion
            label="Have you ever written a review on SmartReview?"
            required
            name="q4"
            value={get("q4")}
            onChange={(v) => set("q4", v)}
            error={errors.q4}
            options={[
              "Yes",
              "No, but I've considered it",
              "No, and I haven't considered it",
            ]}
          />
          {get("q4") && get("q4") !== "Yes" && (
            <>
              <CheckboxQuestion
                label="What stops you from writing reviews? (select all that apply)"
                required
                values={getArr("q5")}
                onChange={(v) => toggleCheckbox("q5", v)}
                error={errors.q5}
                options={[
                  "Too much effort",
                  "Don't trust reviews are valued",
                  "Don't want account",
                  "Not sure what to write",
                  "Privacy concerns",
                  "Prefer other platforms",
                  "Other",
                ]}
                otherValue={get("q5_other")}
                onOtherChange={(v) => set("q5_other", v)}
              />
              <TextAreaQuestion
                label="What would make you more likely to contribute a review?"
                value={get("q6") || ""}
                onChange={(v) => set("q6", v)}
                placeholder="Your ideas..."
              />
            </>
          )}
        </div>
      )}

      {/* Page 3 */}
      {page === 3 && (
        <div>
          <SectionTitle>Account & Features</SectionTitle>
          <RadioQuestion
            label="Do you currently have a SmartReview account?"
            required
            name="q7"
            value={get("q7")}
            onChange={(v) => set("q7", v)}
            error={errors.q7}
            options={["Yes", "No"]}
          />
          <div className="mb-7">
            <span className="font-semibold text-[0.95rem] block mb-2.5">
              How interested would you be in creating an account for these
              features?
              <span className="text-red-500 ml-0.5">*</span>
            </span>
            <div className="flex justify-between text-xs text-gray-400 mb-4 px-1">
              <span>1 = Not interested</span>
              <span>5 = Very interested</span>
            </div>
            {[
              { key: "q8a", label: "Track products you've reviewed" },
              { key: "q8b", label: "Get SmartScore change alerts" },
              { key: "q8c", label: "Personalized product recommendations" },
              { key: "q8d", label: "Save comparisons for later" },
              { key: "q8e", label: "Follow specific product categories" },
            ].map((item) => (
              <ScaleRow
                key={item.key}
                label={item.label}
                value={get(item.key)}
                onChange={(v) => set(item.key, v)}
              />
            ))}
            {errors.q8 && <ErrorText>{errors.q8}</ErrorText>}
          </div>
          <RadioQuestion
            label="What sign-up method would you prefer?"
            required
            name="q9"
            value={get("q9")}
            onChange={(v) => set("q9", v)}
            error={errors.q9}
            options={[
              "Email + password",
              "Google sign-in",
              "Apple sign-in",
              "GitHub sign-in",
              "No account",
            ]}
          />
        </div>
      )}

      {/* Page 4 */}
      {page === 4 && (
        <div>
          <SectionTitle>Email & Notifications</SectionTitle>
          <RadioQuestion
            label="Would you subscribe to email notifications about SmartScore changes?"
            required
            name="q10"
            value={get("q10")}
            onChange={(v) => set("q10", v)}
            error={errors.q10}
            options={[
              "Yes, definitely",
              "Maybe, depends on frequency",
              "No",
            ]}
          />
          {get("q10") && get("q10") !== "No" && (
            <RadioQuestion
              label="How often would you want to receive these notifications?"
              required
              name="q11"
              value={get("q11")}
              onChange={(v) => set("q11", v)}
              error={errors.q11}
              options={[
                "Immediately on significant change",
                "Weekly digest",
                "Monthly digest",
                "Only major changes",
              ]}
            />
          )}
          <CheckboxQuestion
            label="What other email content would be valuable to you? (select all that apply)"
            required
            values={getArr("q12")}
            onChange={(v) => toggleCheckbox("q12", v)}
            error={errors.q12}
            options={[
              "New comparisons in followed categories",
              "Price drop alerts",
              "Best of roundups",
              "New review summaries",
              "None",
            ]}
          />
        </div>
      )}

      {/* Page 5 */}
      {page === 5 && (
        <div>
          <SectionTitle>Trust in AI Summaries</SectionTitle>
          <div className="mb-7">
            <span className="font-semibold text-[0.95rem] block mb-2.5">
              How much do you trust SmartReview&apos;s AI-generated review
              summaries?
              <span className="text-red-500 ml-0.5">*</span>
            </span>
            <div className="flex justify-between text-xs text-gray-400 mb-4 px-1">
              <span>1 = Not at all</span>
              <span>5 = Completely</span>
            </div>
            <ScaleRow
              label=""
              value={get("q13")}
              onChange={(v) => set("q13", v)}
            />
            {errors.q13 && <ErrorText>{errors.q13}</ErrorText>}
          </div>
          <CheckboxQuestion
            label="What would increase your trust in AI-generated summaries? (select all that apply)"
            required
            values={getArr("q14")}
            onChange={(v) => toggleCheckbox("q14", v)}
            error={errors.q14}
            options={[
              "Show original reviews",
              "Confidence score/sample size",
              "Flag inaccuracies",
              "Show last updated",
              "Direct quotes",
              "Explain methodology",
              "Already trust",
              "Never trust",
            ]}
          />
          <RadioQuestion
            label="When a SmartScore disagrees with your personal experience, what do you do?"
            required
            name="q15"
            value={get("q15")}
            onChange={(v) => set("q15", v)}
            error={errors.q15}
            options={[
              "Trust SmartScore",
              "Trust my experience",
              "Read individual reviews",
              "Leave site",
            ]}
          />
        </div>
      )}

      {/* Page 6 */}
      {page === 6 && (
        <div>
          <SectionTitle>About You</SectionTitle>
          <RadioQuestion
            label="How often do you visit SmartReview?"
            required
            name="q16"
            value={get("q16")}
            onChange={(v) => set("q16", v)}
            error={errors.q16}
            options={[
              "First visit",
              "Few times a year",
              "Monthly",
              "Weekly or more",
            ]}
          />
          <CheckboxQuestion
            label="What product categories do you most often research? (pick up to 3)"
            required
            values={getArr("q17")}
            onChange={(v) => toggleCheckbox("q17", v, 3)}
            error={errors.q17}
            options={[
              "Electronics / Tech",
              "Software / SaaS",
              "Home & Kitchen",
              "Health & Fitness",
              "Automotive",
              "Fashion / Beauty",
              "Other",
            ]}
            otherValue={get("q17_other")}
            onOtherChange={(v) => set("q17_other", v)}
            note="Select up to 3"
          />
          <TextAreaQuestion
            label="Any other feedback for SmartReview?"
            value={get("q18") || ""}
            onChange={(v) => set("q18", v)}
            placeholder="Share anything else on your mind... (optional)"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 gap-3">
        {page > 1 ? (
          <button
            onClick={handlePrev}
            className="px-7 py-3 bg-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={handleNext}
          disabled={submitting}
          className="px-7 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Submitting..."
            : page === TOTAL_PAGES
              ? "Submit"
              : "Next"}
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-indigo-600 mb-5 pb-2 border-b border-gray-200">
      {children}
    </h2>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-red-500 text-sm mt-1">{children}</p>;
}

function RadioQuestion({
  label,
  required,
  name,
  value,
  onChange,
  error,
  options,
  otherValue,
  onOtherChange,
}: {
  label: string;
  required?: boolean;
  name: string;
  value?: string;
  onChange: (v: string) => void;
  error?: string;
  options: string[];
  otherValue?: string;
  onOtherChange?: (v: string) => void;
}) {
  return (
    <div className="mb-7">
      <span className="font-semibold text-[0.95rem] block mb-2.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="space-y-1">
        {options.map((opt) => (
          <label
            key={`${name}-${opt}`}
            className={`flex items-start p-2.5 px-3.5 border rounded-lg cursor-pointer transition-all text-sm ${
              value === opt
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300 hover:bg-purple-50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="mr-2.5 mt-0.5 accent-indigo-500 shrink-0"
            />
            {opt}
          </label>
        ))}
      </div>
      {value === "Other" && onOtherChange && (
        <input
          type="text"
          value={otherValue || ""}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Please specify..."
          className="mt-1.5 w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
        />
      )}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function CheckboxQuestion({
  label,
  required,
  values,
  onChange,
  error,
  options,
  otherValue,
  onOtherChange,
  note,
}: {
  label: string;
  required?: boolean;
  values: string[];
  onChange: (v: string) => void;
  error?: string;
  options: string[];
  otherValue?: string;
  onOtherChange?: (v: string) => void;
  note?: string;
}) {
  return (
    <div className="mb-7">
      <span className="font-semibold text-[0.95rem] block mb-2.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <div className="space-y-1">
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex items-start p-2.5 px-3.5 border rounded-lg cursor-pointer transition-all text-sm ${
              values.includes(opt)
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300 hover:bg-purple-50"
            }`}
          >
            <input
              type="checkbox"
              checked={values.includes(opt)}
              onChange={() => onChange(opt)}
              className="mr-2.5 mt-0.5 accent-indigo-500 shrink-0"
            />
            {opt}
          </label>
        ))}
      </div>
      {values.includes("Other") && onOtherChange && (
        <input
          type="text"
          value={otherValue || ""}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Please specify..."
          className="mt-1.5 w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
        />
      )}
      {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function TextAreaQuestion({
  label,
  required,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-7">
      <span className="font-semibold text-[0.95rem] block mb-2.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm resize-y min-h-[80px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ScaleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      {label && (
        <span className="text-sm font-medium block mb-1.5">{label}</span>
      )}
      <div className="flex">
        {["1", "2", "3", "4", "5"].map((n, i) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex-1 py-2 text-sm border border-gray-200 transition-all cursor-pointer ${
              i === 0
                ? "rounded-l-lg"
                : i === 4
                  ? "rounded-r-lg"
                  : ""
            } ${i > 0 ? "-ml-px" : ""} ${
              value === n
                ? "bg-indigo-500 text-white border-indigo-500 z-10 relative"
                : "hover:bg-purple-50"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
