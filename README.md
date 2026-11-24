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

BridgeSync is a proposed MCP-powered, AI-assisted cross-company collaboration and resolution platform. It is designed to help business partners investigate operational exceptions, discuss possible responses, approve actions and track agreed resolutions in a shared case workflow.

**Project status:** Ideation-stage project blueprint. The repository currently contains project documentation and synthetic demonstration data. Features described as proposed or planned should not be interpreted as completed integrations or tested functionality.

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

## Proposed Technology

| Layer | Proposed technology |
|---|---|
| Frontend | React.js + Vite |
| Backend | Node.js + Express |
| MCP | Official TypeScript MCP SDK |
| AI | LLM API with tool calling |
| Database | MongoDB |
| Security | Authentication, role-based access checks and server-side approval controls |

The technology choices are proposed for the planned prototype and may change during implementation.

## Architecture

See [docs/architecture.md](docs/architecture.md) for the proposed architecture and MCP interaction flow.

## Repository Contents

- `docs/` – problem, solution, architecture, security and team documentation.
- `data/sample-data.json` – synthetic buyer and supplier records for a possible demonstration.
- `demo/demo-steps.md` – proposed end-to-end demonstration sequence.
- `.env.example` – names of configuration variables, with no real credentials.
- `.gitignore` – files and folders excluded from version control.

## Demo Status

The data and demo sequence in this repository are illustrative. They do not establish that MCP servers, ERP integrations, AI analysis, approval workflows or a frontend have been implemented. These components must be built and tested before being described as working.

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
