# Security, Trust and Approvals

## Security principles

1. **Partner control:** Each organisation decides which systems and capabilities it exposes.
2. **Least privilege:** Expose only the tools and data required for the workflow.
3. **Authentication:** Verify the identity of users and services.
4. **Authorisation:** Enforce partner, role and action permissions on the server.
5. **Input validation:** Validate tool arguments and retrieved data.
6. **Human approval:** Require explicit approval before consequential business actions.
7. **Auditability:** Record who requested, approved and executed an action, along with its outcome.
8. **Secret management:** Keep credentials in environment variables or an appropriate secret manager; never commit secrets.

## TrustLink

TrustLink is the proposed application-level layer for partner-scoped access checks, approvals and activity tracking. It is not a feature supplied automatically by the MCP protocol.

## AI safety and reliability

- Treat external tool output and partner-provided text as untrusted data.
- Do not let retrieved content override system instructions or access policies.
- Use deterministic code for critical arithmetic and rule checks.
- Ground AI suggestions in retrieved evidence.
- Present uncertainty and missing information clearly.
- Do not execute sensitive actions solely because an LLM suggested them.

## Current status

These are proposed design principles. They should only be described as implemented after the corresponding controls have been built and tested.
