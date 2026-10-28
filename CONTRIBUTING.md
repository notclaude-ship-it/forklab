# Contributing to FORKLAB

Thanks for helping build a thoughtful, reproducible experimentation game.

## Before starting
- Check open issues and discussions for overlapping work.
- For substantial changes, propose the design before writing a large patch.
- Be clear whether a change is implemented, proposed, or experimental.

## Development principles
- Keep the simulation deterministic and independent from rendering.
- Prefer small pure functions and explicit state transitions.
- Include tests for new rules, constraints, and edge cases.
- Challenge data must be declarative, versioned, and validated. Do not use `eval` or execute code from challenge files.
- Avoid unnecessary dependencies and network requirements.
- Preserve keyboard accessibility and reduced-motion support.

## Pull requests
Describe the motivation, design, testing performed, compatibility impact, and remaining limitations. Link related issues. Do not include secrets, personal data, generated build output, or unrelated formatting changes.

## Challenge contributions
A challenge proposal should include its objective, initial state, rules, permitted actions, constraints, expected difficulty, and at least one reproducible solution or an explanation of how solvability will be verified.