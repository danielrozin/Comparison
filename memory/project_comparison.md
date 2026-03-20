---
name: Comparison Platform Overview
description: A Versus B comparison platform - stack, architecture, current state, and features
type: project
---

**A Versus B** (aversusb.net) is an AI-powered comparison platform built with Next.js 15, TypeScript, Tailwind, Prisma (PostgreSQL), Upstash Redis, and Claude API.

**Current features (as of 2026-03-19):**
- AI comparison generation via Claude Haiku
- 100+ mock comparisons with Prisma DB layer ready (needs DATABASE_URL)
- Visual comparison charts (bar, radar, score card) via Recharts
- Public REST API v1 + embeddable widget system
- Content velocity pipeline (DataForSEO keyword discovery + auto-generation)
- Version history tracking (Redis-backed)
- Admin dashboard with pipeline controls
- SEO: OG images, JSON-LD, sitemaps, Google Analytics
- Comments, likes, share functionality

**Why:** Building a scalable comparison content platform to compete with versus.com, diffen.com.

**How to apply:** Database connection (Neon PostgreSQL) is the next critical step to unlock persistence. DataForSEO credentials are configured. Pipeline is ready to generate content at scale once DB is connected.
