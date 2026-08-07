(() => {
"use strict";

function currentDossierState() {
  const parts = location.hash.replace(/^#/, "").split("/").filter(Boolean);
  if (parts[0] !== "dossier") return null;
  return { key: parts[1], tab: parts[2] || "overview" };
}

function applyArchiveFraming() {
  const route = location.hash.replace(/^#/, "").split("/")[0] || "crew";
  if (route !== "crew") return;

  const heroTagline = document.querySelector(".hero-panel > p");
  if (heroTagline && heroTagline.textContent !== "Eight dossiers. One crew to assemble. Impossible jobs ahead.") {
    heroTagline.textContent = "Eight dossiers. One crew to assemble. Impossible jobs ahead.";
  }

  const status = document.querySelector(".status-panel");
  if (status) {
    const heading = status.querySelector("h3");
    const state = status.querySelector("strong");
    const summary = status.querySelector("p");

    if (heading) heading.textContent = "Selection status";
    if (state) state.textContent = "Roster Under Review";
    if (summary) summary.textContent = "Eight operative dossiers are under consideration. The final crew has not yet been selected; operation records remain empty.";
  }

  const rosterHeading = document.querySelector("#roster-heading");
  const rosterSubtitle = rosterHeading?.nextElementSibling;
  if (rosterSubtitle) rosterSubtitle.textContent = "Level-10 operative candidates";
}

function applyCharacterSheetAccess() {
  const dossier = currentDossierState();
  if (!dossier) return;

  const member = window.HEIST_CREW_DATA?.crew?.find(person => person.key === dossier.key);
  if (!member?.sourceUrl) return;

  if (dossier.tab === "overview") {
    const panels = [...document.querySelectorAll(".tab-panel .panel")];
    const identityPanel = panels.find(panel => panel.querySelector("h2")?.textContent.trim() === "Identity");

    if (identityPanel && !identityPanel.querySelector("[data-character-sheet-link]")) {
      const link = document.createElement("a");
      link.href = member.sourceUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.dataset.characterSheetLink = "";
      link.className = "button";
      link.textContent = "Open D&D Beyond Character Sheet ↗";
      link.setAttribute("aria-label", `Open ${member.display} character sheet on D&D Beyond in a new tab`);
      link.style.cssText = "display:inline-flex;align-items:center;justify-content:center;margin-top:1rem;text-decoration:none;width:100%;text-align:center;line-height:1.35;";
      identityPanel.append(link);
    }
  }

  if (dossier.tab === "notes") {
    const panels = [...document.querySelectorAll(".tab-panel .panel")];
    const sourcePanel = panels.find(panel => panel.querySelector("h2")?.textContent.trim() === "Source record");
    const oldLink = sourcePanel?.querySelector("a[href*='dndbeyond.com']");
    if (oldLink) oldLink.closest("p")?.remove();
  }
}

function applyEnhancements() {
  applyArchiveFraming();
  applyCharacterSheetAccess();
}

window.addEventListener("hashchange", () => requestAnimationFrame(applyEnhancements));
requestAnimationFrame(applyEnhancements);
})();
