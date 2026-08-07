(() => {
"use strict";

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

window.addEventListener("hashchange", () => requestAnimationFrame(applyArchiveFraming));
requestAnimationFrame(applyArchiveFraming);
})();
