---
description: "Execute a specific TASK from the BIFFCO playbook with verification"
---

# Execute Task

Execute a TASK from the BIFFCO Fase 0 playbook step by step.

## Steps

1. Ask which TASK number to execute (TASK-001 through TASK-017).
2. Display the TASK description, owner, estimated time, and dependencies.
3. Verify all dependencies (Deps) are completed before starting.
4. Execute each step sequentially as documented in the playbook.
5. After each step, run the verification command (marked with ✅ VERIFICATION).
6. If any verification fails → stop and fix before proceeding.
7. When complete, prepare a PR with descriptive title: `TASK-XXX: [description]`.
8. Include all verification outputs in the PR description.
9. Create/close the corresponding GitHub Issue.
