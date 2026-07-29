# Mortgage Compass service access

Mortgage Compass is a public browser-based mortgage planning application at https://mortgage.utilitas.app.

## Public access

- Public calculators and guides do not require authentication.
- Calculator inputs are processed in the browser.
- Saved scenarios use browser local storage.
- Shared URLs and downloaded files are created only when the user chooses those actions.

## Available agent-facing capabilities

- HTML pages with semantic metadata and structured data
- Plain-text indexes at `/llms.txt` and `/llms-full.txt`
- `Accept: text/markdown` negotiation for HTML pages
- Browser-side WebMCP tools when a compatible user agent exposes `document.modelContext`
- Agent Skills discovery at `/.well-known/agent-skills/index.json`

## Unsupported capabilities

Mortgage Compass does not offer user accounts, an OAuth issuer, a remote MCP server, an A2A endpoint, a lender API, rate quotes, application submission, document upload, or personalized lending advice.

## Contact

General questions: mailto:contact@utilitas.app
