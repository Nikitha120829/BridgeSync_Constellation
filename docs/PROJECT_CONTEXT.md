# BridgeSync Project Context

Last updated: 27 November 2026

## Product and repository

BridgeSync is a local enterprise SaaS prototype for collaboration between synthetic organizations: Apex Motors (buyer) and Nova Components (supplier). The application uses a React/Vite frontend, an Express/Mongoose API, MongoDB-backed sessions, and server-derived company and role authorization.

## Approved and published scope

### Part 1 — Application foundation and company dashboards (approved)

- Company workspace sign-in context; authenticated backend identity determines company and role.
- Mongo-backed sessions, password verification and logout.
- Server-side company-type and role permission checks with company-scoped dashboard queries.
- Separate Apex Motors buyer and Nova Components supplier dashboards using database-backed order, inventory snapshot, activity and approval summary data.
- Eight synthetic role accounts and sample dashboard data through a development-only seed script.
- Authorization denial diagnostics omit passwords, cookies, tokens and request query strings.

### Part 2 — Procurement and inventory intelligence (local development; not approved as a complete milestone)

The development worktree contains Part 2 code. Browser verification reported successful sign-in for both companies, order creation and supplier visibility, completion of a 300-unit order with reservation, dispatch and delivery records, supplier availability checks, and detection of a 110-unit shortage against a request for 500 when 390 units were available. These results do not verify the full Part 2 acceptance criteria and this Part 2 code is not included in the Part 1 publication.

Still pending or unverified: the complete shortage fulfilment lifecycle, partial delivery and backorder completion, inventory and shipment accounting edge cases, real AI responses, shared collaboration/realtime updates, approvals, invoices, payments, MCP/ERP integration and deployment.

## Selected AI technology

Google Gemini with Gemini 2.5 Flash is the selected model. Backend integration using an environment-stored Gemini API key is planned; no Gemini request or real model response is claimed as working. Planned uses include procurement intelligence, shortage explanations, fulfilment recommendations, shipment-risk explanations and invoice discrepancy analysis.

## Data and security boundaries

- Demo records are synthetic. Do not use demo accounts or passwords in production.
- The frontend workspace selector is sign-in context only; the backend identity is authoritative.
- Company data remains private unless an explicitly authorized workflow shares it.
- Never commit `.env`, credentials, API keys, logs or generated output.
- Keep development local until the owner approves subsequent milestones; no cloud deployment is configured here.