# Proposed Demonstration Steps

**Status:** Demonstration plan. Complete each step in the application before claiming it works.

## Scenario

Use the synthetic records in `data/sample-data.json`.

- Buyer requirement: 1,000 engine units.
- Supplier availability by deadline: 700 units.
- Expected unfulfilled quantity: 300 units.

## Intended walkthrough

1. Start the buyer-side and supplier-side MCP servers.
2. Start the BridgeSync backend and frontend.
3. Connect to both MCP servers.
4. Discover the tools exposed by each server.
5. Invoke the buyer order tool and supplier availability tool.
6. Map and validate the returned data.
7. Calculate the shortfall using deterministic application logic.
8. Display the exception in a shared case.
9. Show evidence-based resolution suggestions.
10. Select a proposed response and demonstrate the permission and human-approval step.
11. Record the simulated action and update the case status.

## What to show evaluators

- Evidence that both endpoints are MCP servers.
- Tool discovery and tool invocation.
- The source data used in the comparison.
- The calculated result.
- The approval gate.
- The resulting case history.

Do not present a planned step as a working feature. Label synthetic records and simulated actions clearly.
