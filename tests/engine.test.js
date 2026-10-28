import test from "node:test";
import assert from "node:assert/strict";
import { CONFIG, createInitialState, applyAction, advanceCycle, countLife, makeSnapshot, restoreSnapshot } from "../src/engine.js";

test("initial state is stable and contains nine plots", () => {
  const a = createInitialState();
  const b = createInitialState();
  assert.equal(a.plots.length, 9);
  assert.deepEqual(a, b);
  assert.equal(a.experiments, CONFIG.maxExperiments);
});

test("an intervention changes only the selected variable and spends one experiment", () => {
  const initial = createInitialState();
  const result = applyAction(initial, "water", 0);
  assert.equal(result.error, null);
  assert.equal(result.state.plots[0].water, initial.plots[0].water + 1);
  assert.equal(result.state.experiments, initial.experiments - 1);
  assert.equal(result.state.plots[0].nutrients, initial.plots[0].nutrients);
  assert.equal(initial.plots[0].water, 1, "input state must be immutable");
});

test("invalid actions and exhausted experiments are rejected", () => {
  const initial = createInitialState();
  assert.ok(applyAction(initial, "teleport", 0).error);
  assert.ok(applyAction(initial, "water", 99).error);
  const exhausted = { ...initial, experiments: 0 };
  assert.ok(applyAction(exhausted, "water", 0).error);
});

test("environment simulation is deterministic", () => {
  const a = advanceCycle(createInitialState()).state;
  const b = advanceCycle(createInitialState()).state;
  assert.deepEqual(a, b);
  assert.equal(a.cycle, 1);
});

test("balanced conditions produce life", () => {
  let state = createInitialState();
  state = { ...state, plots: state.plots.map((p, i) => i === 0 ? { ...p, water: 2, nutrients: 2, heat: 2 } : p) };
  const result = advanceCycle(state);
  assert.equal(result.state.plots[0].life, 1);
  assert.equal(countLife(result.state), 1);
});

test("snapshots restore a previous timeline without aliasing", () => {
  const state = createInitialState();
  const snapshot = makeSnapshot(state, "Test", 3);
  const altered = applyAction(state, "water", 4).state;
  assert.equal(altered.plots[4].water, state.plots[4].water + 1);
  const restored = restoreSnapshot(snapshot);
  assert.deepEqual(restored, state);
  restored.plots[0].water = 99;
  assert.notEqual(snapshot.state.plots[0].water, 99);
});

test("cycle cap ends a failed run and success is terminal", () => {
  let state = createInitialState();
  for (let i = 0; i < CONFIG.maxCycles; i += 1) state = advanceCycle(state).state;
  assert.equal(state.cycle, CONFIG.maxCycles);
  assert.equal(state.lost, true);
  assert.ok(advanceCycle(state).error);
});