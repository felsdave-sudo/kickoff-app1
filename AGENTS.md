# Custom Instructions for AI Coding Agents

The user has explicitly requested the following project-specific rule, which must be strictly followed and preserved in all future changes:

## Core Requirements

- **Proposed Meeting Agenda & Client Actions Required**: Always keep the **Proposed Meeting Agenda** and **Immediate Client Actions Required** sections in all email drafts.
  - The API schema (`/api/generate-email`) must always require and return `keyMeetingAgenda` (3-5 high-level agenda topics) and `clientToDos` (2-4 immediate actions).
  - The user interface (`src/App.tsx`) must always render these sections prominently alongside or within the generated email draft.
  - Never remove, combine, or omit these from either the server-side API or the client-side rendering views.
