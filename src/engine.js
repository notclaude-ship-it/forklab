/**
 * FORKLAB simulation engine.
 * Deterministic by design: no random calls, dates, or external state.
 */
export const CONFIG = Object.freeze({
  width: 3,
  height: 3,
  maxCycles: 8,
  maxExperiments: 12,
  targetLife: 4,
  maxWater: 5,
  maxNutrients: 5,
  minHeat: 0,
  maxHeat: 5,
});

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const clone = (value) => JSON.parse(JSON.stringify(value));

export function createInitialState() {
  const plots = [];
  for (let i = 0; i < CONFIG.width * CONFIG.height; i += 1) {
    // A fixed, asymmetric starting layout makes runs reproducible.
    plots.push({
      id: i,
      water: [1, 2, 0, 1, 0, 2, 0, 1, 1][i],
      nutrients: [1, 0, 2, 1, 1, 0, 0, 2, 1][i],
      heat: [2, 2, 1, 3, 1, 2, 2, 3, 1][i],
      life: 0,
      stress: 0,
    });
  }
  return {
    cycle: 0,
    experiments: CONFIG.maxExperiments,
    actionCount: 0,
    selectedPlot: 4,
    plots,
    won: false,
    lost: false,
    history: [],
  };
}

export function applyAction(state, action, plotId = state.selectedPlot) {
  if (state.won || state.lost) return { state, error: "Le protocole est terminé." };
  if (state.experiments <= 0) return { state, error: "Plus d'expériences disponibles." };
  if (!["water", "nutrient", "heat", "cool"].includes(action)) {
    return { state, error: "Intervention inconnue." };
  }
  const index = Number(plotId);
  if (!Number.isInteger(index) || index < 0 || index >= state.plots.length) {
    return { state, error: "Parcelle invalide." };
  }
  const next = clone(state);
  const plot = next.plots[index];
  if (action === "water") plot.water = clamp(plot.water + 1, 0, CONFIG.maxWater);
  if (action === "nutrient") plot.nutrients = clamp(plot.nutrients + 1, 0, CONFIG.maxNutrients);
  if (action === "heat") plot.heat = clamp(plot.heat + 1, CONFIG.minHeat, CONFIG.maxHeat);
  if (action === "cool") plot.heat = clamp(plot.heat - 1, CONFIG.minHeat, CONFIG.maxHeat);
  next.selectedPlot = index;
  next.experiments -= 1;
  next.actionCount += 1;
  next.history.push({ type: "action", action, plotId: index, cycle: next.cycle });
  return { state: next, error: null };
}

export function advanceCycle(state) {
  if (state.won || state.lost) return { state, error: "Le protocole est terminé." };
  if (state.cycle >= CONFIG.maxCycles) return { state, error: "Le cycle maximum est atteint." };
  const next = clone(state);
  next.cycle += 1;
  for (const plot of next.plots) {
    // Environmental drift is explicit and deterministic.
    if (plot.water > 0) plot.water -= 1;
    // The hidden biological rule: balanced moisture, rich soil and mild warmth.
    const viable = plot.water >= 1 && plot.water <= 3
      && plot.nutrients >= 2
      && plot.heat >= 2 && plot.heat <= 3;
    if (viable) {
      plot.life = Math.min(3, plot.life + 1);
      plot.stress = 0;
    } else {
      plot.stress += 1;
      if (plot.stress >= 2 && plot.life > 0) plot.life -= 1;
    }
  }
  const totalLife = countLife(next);
  next.won = totalLife >= CONFIG.targetLife;
  next.lost = !next.won && (next.cycle >= CONFIG.maxCycles || next.experiments <= 0);
  next.history.push({ type: "cycle", cycle: next.cycle, life: totalLife });
  return { state: next, error: null };
}

export function countLife(state) {
  return state.plots.reduce((sum, plot) => sum + plot.life, 0);
}

export function getLivingPlots(state) {
  return state.plots.filter((plot) => plot.life > 0).length;
}

export function getOutcome(state) {
  if (state.won) return "won";
  if (state.lost) return "lost";
  return "active";
}

export function makeSnapshot(state, name, id) {
  const cleanName = String(name ?? "").trim().slice(0, 22) || `Branche ${id}`;
  return { id, name: cleanName, cycle: state.cycle, state: clone(state), createdAtAction: state.actionCount };
}

export function restoreSnapshot(snapshot) {
  return clone(snapshot.state);
}