---
description: How to setup and manage Agent Teams in Biffco
---
## Requirements
- Ensure `.claudecode/settings.json` has `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: "1"`.
- This feature allows parallel execution of tasks.

## Managing the Team
1. **Spawn**: Ask to create a team for parallel components (e.g. `Create a team of 2: one for UI, one for API`).
2. **Assign**: Tasks are assigned automatically from the project plan or manually.
3. **Approval**: Always require plan approval for an "Architect" teammate in complex refactors.

## Interaction
- Use `Shift+Down` to cycle through teammates in the terminal.
- Use `broadcast` for messages to all agents simultaneously.
