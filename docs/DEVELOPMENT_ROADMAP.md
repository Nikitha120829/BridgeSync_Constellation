# BridgeSync Development Roadmap

Last updated: 27 November 2026

## Part 1 — Application foundation and company dashboards

**Status: Approved and validated.**

- Login, Mongo-backed sessions and server-derived identity.
- Server-enforced company and role authorization.
- Separate Apex Motors buyer and Nova Components supplier dashboards.
- Company-scoped dashboard summaries, order tables, inventory snapshots and activity.
- Eight synthetic accounts and safe local startup instructions.

## Part 2 — Procurement and inventory intelligence

**Status: In local development; not approved as a complete milestone. Part 2 implementation is retained locally and excluded from the Part 1 publication.**

Browser checks reported as passed: both company logins, order creation, supplier visibility, a completed 300-unit order with reservation/dispatch/delivery records, availability checking, and a 110-unit shortage result for a 500-unit request when 390 units were available.

Remaining before Part 2 approval: full shortage fulfilment lifecycle, partial delivery/backorder completion, inventory and shipment accounting edge cases, company/role acceptance across all procurement routes, live automated procurement tests, full browser review and owner approval.

## Selected AI technology

Google Gemini 2.5 Flash is selected. Backend-side integration with an environment-stored Gemini API key, and actual response verification, remain planned. Procurement intelligence, shortage explanations, fulfilment suggestions, shipment-risk analysis and invoice discrepancy analysis are not operational in this publication.

## Later milestones — Not started

- Shared case workspace and real-time cross-company updates.
- Supply proposals, approvals, invoices and payments.
- MCP provider discovery and ERP integrations.
- Cloud deployment after core milestones are reviewed and approved.

Do not begin later milestones or deploy until the owner explicitly approves them.