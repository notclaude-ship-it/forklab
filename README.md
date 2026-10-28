# FORKLAB — Break the Rules of Reality

> A local-first, open-source laboratory game about discovering hidden rules, running controlled experiments, and exploring alternate timelines.

**Status:** concept / early project scaffold · **License:** MIT · **Target:** modern desktop and mobile browsers; no special hardware.

FORKLAB asks: *Can you understand a system well enough to change its outcome?* Each challenge presents a deterministic world with unknown or partially documented rules. Players observe, form hypotheses, spend a limited experiment budget, and test alternate choices in timeline branches. A challenge is complete only when its explicit success conditions are satisfied.

> **Project honesty:** this repository currently establishes the vision and architecture. Gameplay systems described below are planned unless marked implemented. This scaffold is not yet a playable game.

## Contents
- [Design pillars](#design-pillars)
- [Core gameplay loop](#core-gameplay-loop)
- [Challenge design](#what-makes-a-good-challenge)
- [Roadmap](#feature-roadmap)
- [Technical direction](#technical-direction)
- [Getting started](#getting-started)
- [Challenge format](#challenge-format)
- [Determinism and verification](#determinism-and-verification)
- [Accessibility and privacy](#accessibility-and-privacy)
- [Contributing](#contributing)
- [Testing](#testing-strategy)
- [Security](#security)
- [License](#license)

## Design pillars
1. **Experiment, don't guess.** Isolate variables, compare outcomes, and learn from failure.
2. **Explainable results.** The simulation is deterministic and replayable; success is evaluated by explicit rules.
3. **Branches are cheap, insights are valuable.** Fork a timeline, try another action, compare with the baseline.
4. **Constraints create creativity.** Limited actions, energy, or time encourage multiple viable solutions.
5. **Create and share.** Human-authored challenge packs and readable data formats make community content approachable.
6. **Local-first by default.** The core game should work offline, without accounts, paid APIs, telemetry, or dedicated hardware.

## Core gameplay loop
1. **Inspect** the world state, controls, known facts, and objective.
2. **Hypothesize** which rule or dependency explains the behaviour.
3. **Experiment** by advancing the simulation or applying a permitted intervention.
4. **Fork** from a recorded state to test a counterfactual without losing the baseline.
5. **Compare** state changes, resource use, and objective progress.
6. **Solve and explain** the causal chain, optionally earning a bonus for a concise explanation.

### Example challenge
A tiny ecosystem must survive 30 simulation ticks. Water is limited, plant growth changes humidity, and a fan removes humidity but consumes energy. The player has three interventions and must keep every species alive while staying under an energy budget. A safe-looking immediate action may cause a delayed failure.

This is an illustrative design example, not an implemented level.

## What makes a good challenge
- Clear objective and measurable failure conditions.
- Small initial state understandable without a long tutorial.
- At least two meaningful hypotheses to test.
- A finite, visible experiment budget.
- Delayed effects or interacting rules, not arbitrary surprises.
- Deterministic replay so bugs and solutions can be reproduced.
- Optional scoring for actions, energy, time, or robustness without enforcing a single solution.
- No external service, physical sensor, or specialised hardware requirement.

## Feature roadmap
Roadmap items are intentions, not promises of completion.

### Phase 0 — Repository foundation
- [x] Project identity and design README.
- [x] Contribution, security, and issue templates.
- [ ] Runnable browser prototype.
- [ ] Automated tests and continuous integration.

### Phase 1 — Playable vertical slice
- [ ] Deterministic tick-based simulation engine.
- [ ] One ecosystem challenge and one machine challenge.
- [ ] Inspectable state, action budget, and success/failure feedback.
- [ ] Save and replay an experiment sequence.
- [ ] Responsive keyboard- and touch-friendly interface.

### Phase 2 — Timeline laboratory
- [ ] Fork any recorded simulation state.
- [ ] Compare branches side by side.
- [ ] Timeline tree with labels and notes.
- [ ] Export/import experiment runs as JSON.

### Phase 3 — Challenge authoring
- [ ] Versioned JSON challenge schema.
- [ ] Local challenge editor and validator.
- [ ] Challenge packs and curated difficulty progression.
- [ ] Reproducible score calculation and solution verification.

### Phase 4 — Procedural generation
- [ ] Compose rule modules from a constrained library.
- [ ] Generate candidate objectives and resource constraints.
- [ ] Reject impossible or trivial challenges with bounded search/simulation.
- [ ] Save a seed and generator version with every generated level.

### Phase 5 — Community polish
- [ ] Optional shareable challenge codes or static challenge packs.
- [ ] Localization and accessibility review.
- [ ] Performance budgets and browser compatibility matrix.
- [ ] Release packaging and documented versioning.

## Technical direction
The first implementation should favour a small dependency footprint and transparent mechanics.
- **Interface:** HTML, CSS, and modern JavaScript modules; no framework required for the first vertical slice.
- **Simulation:** pure functions and explicit state transitions, separated from rendering.
- **Challenge data:** versioned JSON with schema validation.
- **Persistence:** browser storage for local progress; JSON import/export for portability.
- **Testing:** Node.js built-in test runner where available, plus browser checks when needed.
- **Distribution:** static files that can run locally or on any static web host.

Introduce a framework, build step, backend, or multiplayer service only when a demonstrated need outweighs its complexity. Simulation must not depend on wall-clock timing: rendering may animate, but state advances only through explicit steps.

## Repository layout
```text
forklab/
├── .github/ISSUE_TEMPLATE/
├── docs/                 # Design notes and decisions
├── levels/               # Versioned challenge packs (planned)
├── src/                  # Interface and simulation engine (planned)
├── tests/                # Automated tests (planned)
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SECURITY.md
```

## Getting started
This repository is currently a design scaffold; there is no runnable game entry point yet.

### Planned prerequisites
- Git
- A modern browser
- Node.js (for the planned test suite and developer scripts)

When the browser prototype exists, the intended workflow is to clone the repository, serve the project directory with any static HTTP server, and open it in a modern browser. Exact commands will be documented alongside the entry point and test scripts.

## Challenge format
Challenges are intended to be data-driven and versioned. A future challenge file may contain fields like these:
```json
{
  "schemaVersion": 1,
  "id": "ecosystem-001",
  "title": "Thirty Ticks to Live",
  "description": "Keep every species alive for 30 ticks.",
  "seed": 104729,
  "simulation": { "tickLimit": 30, "initialState": {}, "rules": [] },
  "constraints": { "interventions": 3, "energyBudget": 12 },
  "goal": { "allSpeciesAliveAtTick": 30 }
}
```

This is conceptual, not a validated schema. The eventual format should reject unsafe executable content; rules should use documented declarative operations rather than arbitrary code embedded in a level.

## Determinism and verification
- State changes happen through explicit, ordered transitions.
- Randomness, where allowed, is seeded and the seed is saved with the run.
- A replay records actions and the initial state/version, not just screenshots.
- Goal evaluation is independent of rendering and animation frame rate.
- Scores derive from documented, reproducible metrics.
- Imported challenge data is validated before use.

Procedural generation must not claim a level is solvable until a verifier finds a valid solution under its constraints. If exhaustive verification is too expensive, the UI must label the result unverified rather than implying certainty.

## Accessibility and privacy
- Essential actions should work with keyboard and touch.
- Never communicate success or danger by colour alone.
- Respect reduced-motion preferences and provide readable contrast.
- Keep progress local unless an opt-in sharing feature is explicitly added.
- No telemetry or account requirement is planned for the core game.
- Challenge files should remain human-readable and portable.

## Contributing
Contributions are welcome, especially small, testable changes to simulation design, challenge examples, accessibility, documentation, and tests.
1. Read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
2. Search existing issues before opening a new one.
3. For gameplay changes, describe the rule, expected state transition, and test plan.
4. Keep simulation logic deterministic and independent of the UI.
5. Explain why any new dependency is necessary.
6. Never commit credentials, private user data, or machine-specific paths.

Until the first implementation lands, open an issue before investing in a large feature.

## Testing strategy
Planned coverage includes:
- Unit tests for each rule and state transition.
- Invariant tests for resource quantities, legal actions, and terminal states.
- Replay tests proving the same seed and action list yield the same final state.
- Validation tests for malformed and unsupported challenge data.
- Verifier tests for known-solvable and deliberately impossible examples.
- UI smoke tests for keyboard navigation, small viewports, and readable status messages.

## Security
See [SECURITY.md](SECURITY.md). Challenge packs are untrusted input: validation, bounded execution, and avoidance of arbitrary code evaluation are requirements for the eventual implementation.

## License
Released under the MIT License; see [LICENSE](LICENSE).