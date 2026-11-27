# BridgeSync – Intelligent Cross-Company Collaboration

**Team:** Constellation  
**Institution:** New Horizon College of Engineering  
**Event:** wHACKiest 2026  
**Track:** Make MCP Matter

## Team Members

| Member | USN |
|---|---|
| Nikitha Oruganti | 1NH25CS263-T |
| Nelaturu Alekhya | 1NH25CS403-T |
| N. Sai Nishitha | 1NH25CS076-T |
| P. Shivaani | 1NH25CS269-T |

## Overview

BridgeSync is an enterprise SaaS prototype for secure collaboration between business partners. The approved Part 1 implementation provides authentication, company-scoped authorization and separate buyer and supplier dashboards for fictional demonstration companies.

**Project status:** Part 1 is implemented and approved. Part 2 procurement and inventory work remains in local development and is not included in this Part 1 publication. Browser checks in the development worktree verified login for both companies, order creation and supplier visibility, a completed 300-unit order with reservation/dispatch/delivery records, live availability checking, and a 110-unit shortage result for a 500-unit request when 390 units were available. This does not constitute approval of the full Part 2 milestone.

## Problem

Businesses work with multiple partners to manage orders, supplies and deliveries, but when each partner uses different systems and processes, sharing information and resolving issues together becomes difficult.

Existing ERP, EDI, API, integration and supplier-collaboration platforms already support many partner processes. BridgeSync proposes a focused shared workflow for investigating and coordinating operational exceptions across organisations.

## Illustrative Scenario

A hypothetical vehicle manufacturer requires 1,000 engines by a deadline. Its supplier can provide 700 by that date, leaving 300 unfulfilled. BridgeSync's proposed workflow would bring the relevant order and availability information together, identify the shortfall, help partners consider options and track an approved response.

This is a synthetic example, not an actual supply disruption involving any named company.

## Proposed Workflow

1. Connect to independently controlled partner MCP servers.
2. Discover and invoke authorised tools to retrieve order, inventory and delivery information.
3. Map partner-specific fields into a common representation and validate the data.
4. Compare requirements and commitments using deterministic business rules.
5. Use an LLM to explain the exception and suggest possible responses based on available evidence.
6. Create a shared case for partner discussion and decision-making.
7. Check permissions and obtain human approval before any consequential action.
8. Record approved actions and track the case through resolution.

## Proposed Key Features

- Partner-scoped MCP connectivity.
- Operational exception identification.
- AI-assisted explanations and resolution suggestions.
- Shared cross-company case workspace.
- Permission checks, human approvals and audit history.
- Resolution and commitment tracking.

## Technology Stack and Selected AI

| Layer | Proposed technology |
|---|---|
| Frontend | React.js + Vite |
| Backend | Node.js + Express |
| MCP | Official TypeScript MCP SDK |
| LLM Provider | Google Gemini (selected technology) |
| Selected Model | Gemini 2.5 Flash |
| AI Integration | Planned backend-side API integration; Gemini API key will be stored in an environment variable |
| Database | MongoDB |
| Security | Authentication, role-based access checks and server-side approval controls |

The React/Vite frontend, Node.js/Express backend and MongoDB foundation are implemented for Part 1. Gemini 2.5 Flash is the selected model. Gemini API integration and actual Gemini response verification are not implemented in this publication. The planned purpose is procurement intelligence: shortage explanations, fulfilment recommendations, shipment-risk explanations and invoice discrepancy analysis. These capabilities must not be represented as operational until implemented and tested.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the proposed architecture and MCP interaction flow.

## Repository Contents

- `docs/` – problem, solution, architecture, security and team documentation.
- `data/sample-data.json` – synthetic buyer and supplier records for a possible demonstration.
- `demo/demo-steps.md` – proposed end-to-end demonstration sequence.
- `.env.example` – names of configuration variables, with no real credentials.
- `.gitignore` – files and folders excluded from version control.

## Demo Status

Part 1 login, server-side authentication, session management, company and role authorization, and separate database-backed dashboards are implemented. The seed command creates synthetic companies, users and sample dashboard records. Part 2 browser-verified workflows remain in local development and are not included in this Part 1 publication. Shortage fulfilment completion, inventory accounting edge cases, real Gemini responses, MCP integration, shared real-time collaboration, approval workflows, invoice verification and payment processing remain unverified or unimplemented.

## Local Development Setup

Requirements: Node.js 20.19 or newer and access to a MongoDB Atlas database.

1. Install dependencies from the repository root with `npm install`.
2. Copy `.env.example` to `.env`, then set `MONGODB_URI`, a random `SESSION_SECRET` of at least 32 characters, and a local `DEMO_USER_PASSWORD` of at least 12 characters. Keep `.env` private.
3. Seed the synthetic Part 1 demo users and dashboard records with `npm run seed`.
4. Start the API and frontend in separate terminals with `npm run dev:api` and `npm run dev:web`, or use `npm run dev:all` on Windows to launch both services in persistent terminals.
5. Open `http://127.0.0.1:5181`.

The API requires MongoDB and does not fall back to in-memory data. The same local `DEMO_USER_PASSWORD` is used for all seeded demo accounts; the seed hashes it before storage.
## Security Principles

- Each organisation controls its own systems and credentials.
- Only explicitly authorised tools and data should be exposed.
- Validate retrieved data and tool inputs.
- Enforce permissions on the server, not only in the user interface.
- Require human approval for consequential actions.
- Keep an auditable record of approvals and actions.
- Never commit API keys, passwords or `.env` files.

## Future Scope

- Build two independently running MCP servers with synthetic buyer and supplier systems.
- Implement MCP tool discovery and invocation.
- Add schema mapping and deterministic exception checks.
- Build the shared case interface.
- Add AI-assisted explanations and suggestions.
- Implement server-side authorisation, human approval and audit tracking.
- Evaluate real partner integrations only with explicit partner permission, credentials and testing.
