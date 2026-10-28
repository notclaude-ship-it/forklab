import { CONFIG, createInitialState, applyAction, advanceCycle, countLife, getLivingPlots, getOutcome, makeSnapshot, restoreSnapshot } from "./engine.js";

let state = createInitialState();
let branches = [];
let nextBranchId = 2;
let logItems = [];
let toastTimer;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const grid = $("#world-grid");
const actionNames = { water: "Ajout d'eau", nutrient: "Ajout de nutriments", heat: "Chauffage", cool: "Refroidissement" };
const plotName = (id) => `${String.fromCharCode(65 + Math.floor(id / CONFIG.width))}${(id % CONFIG.width) + 1}`;

function addLog(message, type = "normal") {
  logItems.unshift({ message, type, cycle: state.cycle });
  logItems = logItems.slice(0, 24);
  renderLog();
}
function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}
function renderGrid() {
  grid.innerHTML = "";
  state.plots.forEach((plot) => {
    const button = document.createElement("button");
    button.className = "plot" + (plot.id === state.selectedPlot ? " selected" : "") + (plot.life ? " has-life" : "");
    button.type = "button";
    button.setAttribute("aria-label", `Parcelle ${plotName(plot.id)}, eau ${plot.water}, nutriments ${plot.nutrients}, température ${plot.heat}, vie ${plot.life}`);
    button.setAttribute("aria-pressed", String(plot.id === state.selectedPlot));
    const dots = Array.from({ length: plot.life }, () => '<i class="life-spark"></i>').join("");
    button.innerHTML = `<span class="plot-name">${plotName(plot.id)}</span><span class="plot-life">${dots}</span><span class="plot-values"><i>≈${plot.water}</i><i>✳${plot.nutrients}</i></span><span class="plot-temp">${plot.heat}°</span>`;
    button.addEventListener("click", () => { state.selectedPlot = plot.id; render(); });
    grid.append(button);
  });
}
function setMeter(id, value, max) {
  $(`#${id}-meter`).style.width = `${(value / max) * 100}%`;
  $(`#${id}-value`).textContent = value;
}
function renderDetail() {
  const plot = state.plots[state.selectedPlot];
  $("#selected-name").textContent = plotName(plot.id);
  setMeter("water", plot.water, CONFIG.maxWater);
  setMeter("nutrient", plot.nutrients, CONFIG.maxNutrients);
  setMeter("heat", plot.heat, CONFIG.maxHeat);
}
function renderBranches() {
  const list = $("#branch-list");
  list.innerHTML = "";
  if (!branches.length) {
    list.innerHTML = '<div class="empty-branches">Aucune branche sauvegardée.<br><span>Crée un instantané avant de tester une hypothèse risquée.</span></div>';
    return;
  }
  branches.forEach((branch) => {
    const item = document.createElement("div");
    item.className = "branch-item";
    const info = document.createElement("div");
    info.className = "branch-info";
    const name = document.createElement("strong");
    name.textContent = branch.name;
    const meta = document.createElement("span");
    meta.textContent = `α-${String(branch.id).padStart(2, "0")} · cycle ${branch.cycle} · ${countLife(branch.state)} vie`;
    info.append(name, meta);
    const actions = document.createElement("div");
    actions.className = "branch-actions";
    const restore = document.createElement("button");
    restore.className = "restore-button";
    restore.textContent = "Restaurer ↶";
    restore.addEventListener("click", () => {
      state = restoreSnapshot(branch);
      addLog(`Retour à « ${branch.name} ». Le présent a bifurqué.`, "branch");
      $("#branch-foot").textContent = `Retour à ${branch.name}`;
      render();
      notify("Branche restaurée.");
    });
    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Supprimer ${branch.name}`);
    remove.addEventListener("click", () => { branches = branches.filter((b) => b.id !== branch.id); renderBranches(); });
    actions.append(restore, remove);
    item.append(info, actions);
    list.append(item);
  });
}
function renderLog() {
  const list = $("#event-log");
  list.innerHTML = "";
  if (!logItems.length) {
    list.innerHTML = '<li class="log-empty">En attente de la première expérience…</li>';
    return;
  }
  logItems.forEach((entry) => {
    const item = document.createElement("li");
    item.className = `log-entry ${entry.type}`;
    const cycle = document.createElement("span");
    cycle.className = "log-cycle";
    cycle.textContent = `C${String(entry.cycle).padStart(2, "0")}`;
    const message = document.createElement("span");
    message.textContent = entry.message;
    item.append(cycle, message);
    list.append(item);
  });
}
function render() {
  const life = countLife(state);
  const outcome = getOutcome(state);
  $("#cycle-value").innerHTML = `${String(state.cycle).padStart(2, "0")} <small>/ ${CONFIG.maxCycles}</small>`;
  $("#experiments-value").innerHTML = `${state.experiments} <small>restantes</small>`;
  $("#life-value").innerHTML = `${life} <small>/ ${CONFIG.targetLife}</small>`;
  $("#branch-value").textContent = `α-${String(nextBranchId - 1).padStart(2, "0")}`;
  $("#action-count").textContent = `${state.actionCount} action${state.actionCount === 1 ? "" : "s"}`;
  $("#objective-progress").style.width = `${Math.min(100, life / CONFIG.targetLife * 100)}%`;
  $("#progress-percent").textContent = `${Math.min(100, Math.round(life / CONFIG.targetLife * 100))}%`;
  $("#objective-state").textContent = outcome === "won" ? "Protocole réussi" : outcome === "lost" ? "Protocole échoué" : "Protocole non résolu";
  $("#environment-tag").textContent = outcome === "won" ? "OBJECTIF ATTEINT" : outcome === "lost" ? "PROTOCOLE CLOS" : "EN OBSERVATION";
  $("#advance-btn").disabled = outcome !== "active";
  $$(".action-card").forEach((button) => { button.disabled = outcome !== "active" || state.experiments <= 0; });
  renderGrid();
  renderDetail();
  renderBranches();
  if (outcome === "won") $("#objective-state").textContent = "PROTOCOLE RÉUSSI · RÈGLE DÉCOUVERTE";
}
$$(".action-card").forEach((button) => {
  button.addEventListener("click", () => {
    const result = applyAction(state, button.dataset.action, state.selectedPlot);
    if (result.error) { notify(result.error); return; }
    state = result.state;
    const plot = state.plots[state.selectedPlot];
    addLog(`${actionNames[button.dataset.action]} sur ${plotName(plot.id)}. Variables mises à jour.`, "action");
    render();
  });
});
$("#advance-btn").addEventListener("click", () => {
  const previousLife = countLife(state);
  const result = advanceCycle(state);
  if (result.error) { notify(result.error); return; }
  state = result.state;
  const life = countLife(state);
  const livingPlots = getLivingPlots(state);
  addLog(`Cycle ${state.cycle} terminé : ${life} organisme(s) sur ${livingPlots} parcelle(s).`, life > previousLife ? "success" : "normal");
  if (state.won) { addLog("Objectif atteint. La règle biologique a été suffisamment exploitée.", "success"); notify("Protocole réussi !"); }
  else if (state.lost) { addLog("Fin du protocole : ressources épuisées ou limite de cycles atteinte.", "warning"); notify("Protocole terminé."); }
  render();
});
$("#save-branch-btn").addEventListener("click", () => {
  if (branches.length >= 8) { notify("Maximum de 8 branches atteint."); return; }
  const branch = makeSnapshot(state, $("#branch-name").value, nextBranchId++);
  branches.unshift(branch);
  $("#branch-name").value = "";
  $("#branch-foot").textContent = `Instantané α-${String(branch.id).padStart(2, "0")}`;
  addLog(`Instantané « ${branch.name} » créé. Tu peux explorer une autre piste.`, "branch");
  render();
  notify("Branche sauvegardée.");
});
$("#reset-btn").addEventListener("click", () => {
  state = createInitialState();
  branches = [];
  nextBranchId = 2;
  logItems = [];
  $("#branch-foot").textContent = "Réalité initiale";
  addLog("Nouvelle simulation initialisée. Les conditions sont reproductibles.", "normal");
  render();
});
$("#clear-log-btn").addEventListener("click", () => { logItems = []; renderLog(); });
$("#branch-name").addEventListener("keydown", (event) => {
  if (event.key === "Enter") $("#save-branch-btn").click();
});
addLog("Simulation initialisée. Neuf parcelles prêtes à être étudiées.", "normal");
render();