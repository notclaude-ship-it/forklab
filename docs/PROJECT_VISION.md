# Project vision and non-goals

## Vision
Make the joy of scientific discovery playable: small deterministic worlds, meaningful experiments, counterfactual branches, and challenges whose outcomes can be reproduced and verified.

## Audience
Players who enjoy systems thinking, puzzle games, automation, logic, and experimentation. No programming knowledge should be required to play. Creating advanced challenge packs may optionally appeal to technical users.

## Differentiators to validate
- Timeline branches are a first-class mechanic, not just undo/redo.
- Experiments are recorded and comparable.
- Challenges state constraints precisely and can be checked by a verifier.
- A level editor and portable text format make user-generated content practical.

These are product hypotheses, not claims that no other game has similar features. Before public launch, compare the implemented experience against existing puzzle, simulation, and programming games and refine the differentiation honestly.

## Non-goals for the first release
- No required multiplayer, accounts, cloud saves, or monetisation.
- No dependence on AI APIs or external services.
- No arbitrary scripts supplied by challenge files.
- No claim of guaranteed solvability for procedurally generated challenges without verification.
- No requirement for dedicated hardware or a high-end GPU.

## Initial success criteria
1. A new player can understand the first challenge in under two minutes.
2. A run can be replayed to the same state from its seed and action sequence.
3. At least one challenge has two independently verifiable solutions.
4. A malformed challenge is rejected safely with a useful error.
5. The prototype runs offline in a modern browser.