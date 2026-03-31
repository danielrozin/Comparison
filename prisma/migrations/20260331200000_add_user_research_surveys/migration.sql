-- CreateTable
CREATE TABLE "intercept_surveys" (
    "id" TEXT NOT NULL,
    "comparison_slug" TEXT NOT NULL,
    "category" TEXT,
    "device_type" TEXT,
    "referral_source" TEXT,
    "q1_intent" TEXT,
    "q2_found" BOOLEAN,
    "q2_missing" TEXT,
    "q3_rating" INTEGER,
    "q4_improvement" TEXT,
    "q5_discovery" TEXT,
    "opt_in_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intercept_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smartreview_surveys" (
    "id" TEXT NOT NULL,
    "user_type" TEXT,
    "action_type" TEXT,
    "category" TEXT,
    "review_completion_time_sec" INTEGER,
    "form_fields_filled" INTEGER,
    "survey_completed" BOOLEAN NOT NULL DEFAULT false,
    "q1_intent" TEXT,
    "q2_found" BOOLEAN,
    "q2_missing" TEXT,
    "q3_rating" INTEGER,
    "q4_improvement" TEXT,
    "q5_discovery" TEXT,
    "device_type" TEXT,
    "referral_source" TEXT,
    "opt_in_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "smartreview_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "intercept_surveys_created_at_idx" ON "intercept_surveys"("created_at");

-- CreateIndex
CREATE INDEX "intercept_surveys_category_idx" ON "intercept_surveys"("category");

-- CreateIndex
CREATE INDEX "intercept_surveys_comparison_slug_idx" ON "intercept_surveys"("comparison_slug");

-- CreateIndex
CREATE INDEX "smartreview_surveys_created_at_idx" ON "smartreview_surveys"("created_at");

-- CreateIndex
CREATE INDEX "smartreview_surveys_category_idx" ON "smartreview_surveys"("category");
