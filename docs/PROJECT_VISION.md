# FORKLAB — Project Vision

## Premise

FORKLAB is an experimental puzzle game about learning systems from evidence. Each level presents a compact world with measurable properties and an unknown rule. Players spend a limited number of interventions, compare outcomes, and use timeline branches to distinguish correlation from cause.

## The core loop

1. Observe a baseline.
2. State a hypothesis.
3. Change one variable.
4. Advance the simulation.
5. Record the result.
6. Compare against a branch.
7. Apply the learned rule to solve the objective.

## Product pillars

- **Legible complexity:** a small number of variables should create meaningful deductions.
- **Deterministic outcomes:** a replay must be reproducible from the same initial state and action list.
- **Useful failure:** every experiment should produce interpretable evidence.
- **Timeline thinking:** snapshots let players compare counterfactuals without erasing prior work.
- **Offline-first:** the game should remain usable without an account or remote service.

## Prototype scope

The first playable protocol uses nine plots, three environmental variables, four intervention types, a twelve-action budget, and an eight-cycle deadline. The ecosystem's growth rule is intentionally hidden from the player. The goal is to produce at least four units of life.

## Next design questions

- How can the game help players compare two branches without revealing the answer?
- How can new levels describe rules safely, without executing arbitrary code?
- How can replay codes remain compact and verifiable?
- What keyboard-only and reduced-motion affordances should be mandatory?
- How can challenge difficulty be measured from the number of experiments needed?

## Non-goals for the first prototype

No accounts, multiplayer, telemetry, monetization, external API dependencies, or user-generated executable code.