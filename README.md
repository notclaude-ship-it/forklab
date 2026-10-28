# FORKLAB

> A deterministic experimental puzzle game about hidden rules, limited experiments, and branching realities.

FORKLAB is an open-source, local-first browser game. You are given a small ecosystem, a limited number of interventions, and a biological rule you cannot see. Learn by changing one variable at a time, record what happens, and create timeline snapshots before taking risks.

**Current version: 0.1.0 — playable prototype.**

## Play locally

Requirements: Python 3 or any static file server. No build step, dependencies, account, or API key.

```bash
git clone https://github.com/notclaude-ship-it/forklab.git
cd forklab
python3 -m http.server 4173
```

Open http://localhost:4173 in your browser.

Alternatively, with Node.js 18 or newer:

```bash
npm start
```

## Gameplay

The first protocol gives you a 3 × 3 ecosystem and eight cycles to grow at least four life units.

- **Observe:** select any plot to inspect its water, nutrient, and temperature values.
- **Intervene:** add water, add nutrients, heat, or cool a selected plot. Each action consumes one experiment.
- **Advance time:** run one simulation cycle to apply environmental drift and the ecosystem's hidden rule.
- **Branch:** save a named snapshot at any point. Restore it later to return to that exact state and explore a different course.
- **Compare:** the observation journal records interventions and cycle results.

The simulation is intentionally deterministic: the same state and action sequence always produce the same outcome. There is no random-number source in the core engine.

## Design principles

1. **Knowledge is earned.** The game exposes measurable variables, not the rule that connects them.
2. **Experiments have a cost.** A limited budget makes careful experiments more valuable than indiscriminate clicking.
3. **Failure is informative.** A failed branch is still a useful comparison point.
4. **Reproducibility matters.** The core simulation is a pure, testable module separated from the UI.
5. **Local-first.** Gameplay runs in the browser and does not need a server, login, telemetry, or third-party API.

## Project layout

```text
forklab/
├── index.html              # Game interface and layout
├── src/
│   ├── engine.js           # Deterministic simulation rules and snapshots
│   ├── main.js             # Browser UI and event handling
│   └── style.css           # Responsive visual design
├── tests/
│   └── engine.test.js      # Built-in Node.js test suite
├── docs/
│   └── PROJECT_VISION.md   # Long-term product vision
├── .github/workflows/ci.yml
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE
```

## Development

Node.js 18+ is recommended for the test suite. The game itself needs only a modern browser and a static HTTP server.

```bash
npm test       # Run deterministic engine tests
npm run check  # Syntax checks and tests
npm start      # Serve on http://localhost:4173
```

The engine exports `createInitialState`, `applyAction`, `advanceCycle`, `countLife`, `getLivingPlots`, `getOutcome`, `makeSnapshot`, and `restoreSnapshot`. State updates are immutable: an action returns a new state instead of mutating its input.

## Roadmap

- [x] Repository foundation and project vision
- [x] Playable first ecosystem protocol
- [x] Deterministic simulation engine
- [x] Limited experiments and hidden biological rule
- [x] Named timeline snapshots and restore
- [x] Observation journal and responsive interface
- [x] Automated engine tests and GitHub Actions
- [ ] Side-by-side branch comparison
- [ ] More protocols and rule families
- [ ] Seeded challenge codes and shareable replays
- [ ] User-authored challenges and a validation format
- [ ] Accessibility pass and expanded keyboard navigation

## Contributing

Bug reports, new challenge ideas, accessibility improvements, and small pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Keep core simulation changes deterministic and add tests for new rules.

## Security

The current prototype stores no account information and makes no network requests during gameplay. See [SECURITY.md](SECURITY.md) for reporting guidance.

## License

MIT. See [LICENSE](LICENSE).