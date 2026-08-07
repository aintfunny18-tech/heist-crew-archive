(() => {
  "use strict";

  const data = window.HEIST_CREW_DATA;
  if (!data?.crew) return;

  const STORAGE_KEY = "crew-archive-role-ranking-v1";

  const roleOptions = () => data.crew
    .map(member => `<option value="${member.key}">${member.display} — ${member.quote}</option>`)
    .join("");

  function roleName(key) {
    return data.crew.find(member => member.key === key)?.display || key;
  }

  function ensureDialog() {
    let dialog = document.querySelector("[data-ranking-dialog]");
    if (dialog) return dialog;

    dialog = document.createElement("dialog");
    dialog.className = "ranking-dialog";
    dialog.dataset.rankingDialog = "";
    dialog.innerHTML = `
      <form method="dialog" class="ranking-shell" data-ranking-form>
        <header class="ranking-header">
          <div>
            <span class="eyebrow">Character selection</span>
            <h2>Rank your roles</h2>
            <p>Choose three different roles in order of preference. A hard no is optional.</p>
          </div>
          <button class="ranking-close" type="button" data-ranking-close aria-label="Close ranking form">×</button>
        </header>

        <div class="ranking-fields">
          <label class="ranking-field ranking-name">
            <span>Your name</span>
            <input name="player" type="text" autocomplete="name" placeholder="Name" required />
          </label>
          <label class="ranking-field">
            <span>First choice</span>
            <select name="first" required><option value="">Select a role</option>${roleOptions()}</select>
          </label>
          <label class="ranking-field">
            <span>Second choice</span>
            <select name="second" required><option value="">Select a role</option>${roleOptions()}</select>
          </label>
          <label class="ranking-field">
            <span>Third choice</span>
            <select name="third" required><option value="">Select a role</option>${roleOptions()}</select>
          </label>
          <label class="ranking-field">
            <span>Hard no <small>optional</small></span>
            <select name="hardNo"><option value="">None</option>${roleOptions()}</select>
          </label>
        </div>

        <p class="ranking-error" data-ranking-error role="alert" hidden></p>

        <div class="ranking-preview-wrap" hidden data-ranking-preview-wrap>
          <label for="ranking-preview">Ready to paste into Discord</label>
          <textarea id="ranking-preview" data-ranking-preview readonly rows="7"></textarea>
        </div>

        <footer class="ranking-actions">
          <button class="button" type="button" data-ranking-copy>Copy ranking for Discord</button>
          <button class="button ranking-secondary" type="button" data-ranking-clear>Clear</button>
        </footer>
      </form>`;

    document.body.append(dialog);

    const form = dialog.querySelector("[data-ranking-form]");
    const close = dialog.querySelector("[data-ranking-close]");
    const copy = dialog.querySelector("[data-ranking-copy]");
    const clear = dialog.querySelector("[data-ranking-clear]");

    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });

    form.addEventListener("input", () => {
      saveDraft(form);
      clearError(dialog);
    });

    copy.addEventListener("click", async () => {
      const result = buildRanking(form);
      if (!result.ok) {
        showError(dialog, result.message);
        return;
      }

      const previewWrap = dialog.querySelector("[data-ranking-preview-wrap]");
      const preview = dialog.querySelector("[data-ranking-preview]");
      preview.value = result.text;
      previewWrap.hidden = false;

      try {
        await navigator.clipboard.writeText(result.text);
        copy.textContent = "Copied — paste into Discord";
        setTimeout(() => { copy.textContent = "Copy ranking for Discord"; }, 2200);
      } catch {
        preview.focus();
        preview.select();
        showError(dialog, "Clipboard access was blocked. The ranking is selected below; copy it and paste it into Discord.");
      }
    });

    clear.addEventListener("click", () => {
      form.reset();
      localStorage.removeItem(STORAGE_KEY);
      dialog.querySelector("[data-ranking-preview-wrap]").hidden = true;
      clearError(dialog);
    });

    restoreDraft(form);
    return dialog;
  }

  function buildRanking(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    const player = String(values.player || "").trim();
    const ranks = [values.first, values.second, values.third].filter(Boolean);

    if (!player) return { ok: false, message: "Enter your name before copying the ranking." };
    if (ranks.length !== 3) return { ok: false, message: "Choose a first, second, and third choice." };
    if (new Set(ranks).size !== 3) return { ok: false, message: "Your first, second, and third choices must be three different roles." };
    if (values.hardNo && ranks.includes(values.hardNo)) return { ok: false, message: "A role cannot be both ranked and marked as a hard no." };

    const text = [
      `**Crew Role Ranking — ${player}**`,
      `1. ${roleName(values.first)}`,
      `2. ${roleName(values.second)}`,
      `3. ${roleName(values.third)}`,
      `Hard No: ${values.hardNo ? roleName(values.hardNo) : "None"}`
    ].join("\n");

    return { ok: true, text };
  }

  function saveDraft(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(values)); } catch { /* no-op */ }
  }

  function restoreDraft(form) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const values = JSON.parse(raw);
      for (const [name, value] of Object.entries(values)) {
        const field = form.elements.namedItem(name);
        if (field && typeof value === "string") field.value = value;
      }
    } catch { /* no-op */ }
  }

  function showError(dialog, message) {
    const error = dialog.querySelector("[data-ranking-error]");
    error.textContent = message;
    error.hidden = false;
  }

  function clearError(dialog) {
    const error = dialog.querySelector("[data-ranking-error]");
    error.hidden = true;
    error.textContent = "";
  }

  function enhanceSelectionBrief() {
    const brief = document.querySelector("[data-selection-brief]");
    if (!brief || brief.querySelector("[data-open-ranking]")) return;

    const header = brief.querySelector(".selection-brief-header");
    if (!header) return;

    const action = document.createElement("div");
    action.className = "selection-ranking-action";
    action.innerHTML = `
      <button class="button selection-ranking-button" type="button" data-open-ranking>
        Rank your choices
      </button>
      <span>Generates a clean ranking you can paste into Discord.</span>`;
    brief.append(action);

    action.querySelector("[data-open-ranking]").addEventListener("click", () => {
      const dialog = ensureDialog();
      clearError(dialog);
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
  }

  const observer = new MutationObserver(enhanceSelectionBrief);
  observer.observe(document.querySelector("#main") || document.body, { childList: true, subtree: true });
  window.addEventListener("hashchange", () => requestAnimationFrame(enhanceSelectionBrief));
  requestAnimationFrame(enhanceSelectionBrief);
})();
