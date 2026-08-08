(() => {
"use strict";

const data = window.HEIST_CREW_DATA;
const main = document.querySelector("#main");
let enhancementScheduled = false;

function routeParts() {
  return location.hash.replace(/^#/, "").split("/").filter(Boolean);
}

function currentRoute() {
  return routeParts()[0] || "crew";
}

function currentDossierState() {
  const parts = routeParts();
  if (parts[0] !== "dossier") return null;
  return { key: parts[1], tab: parts[2] || "overview" };
}

function setText(node, text) {
  if (node && node.textContent !== text) node.textContent = text;
}

function applySelectionFooter() {
  const bar = document.querySelector(".operation-bar");
  if (!bar) return;

  bar.setAttribute("aria-label", "Character selection");
  bar.classList.add("selection-bar");

  const cells = [...bar.children];
  const content = [
    ["Selection phase", "Open"],
    ["Candidates", `${data?.crew?.length || 8} level-10 roles`],
    ["Submit", "Top 3 + optional hard no"],
    ["Starting level", "10"]
  ];

  cells.forEach((cell, index) => {
    if (!content[index]) return;
    const [label, value] = content[index];
    setText(cell.querySelector("span"), label);
    setText(cell.querySelector("strong"), value);
  });
}

function applyArchiveFraming() {
  if (currentRoute() !== "crew") return;

  const heroTagline = document.querySelector(".hero-panel > p");
  setText(heroTagline, "Eight dossiers. One crew to assemble. Impossible jobs ahead.");

  const status = document.querySelector(".status-panel");
  if (status) {
    setText(status.querySelector("h3"), "Selection status");
    setText(status.querySelector("strong"), "Roster Under Review");
    setText(status.querySelector("p"), "Eight operative dossiers have been assembled for review. Compare the builds, rank the roles that interest you, and help determine which specialists make the crew.");
  }

  const rosterHeading = document.querySelector("#roster-heading");
  const rosterSubtitle = rosterHeading?.nextElementSibling;
  setText(rosterSubtitle, "Level-10 operative candidates");

  applySelectionBrief();
}

function applySelectionBrief() {
  if (currentRoute() !== "crew" || document.querySelector("[data-selection-brief]")) return;

  const rosterSection = document.querySelector("[aria-labelledby='roster-heading']");
  if (!rosterSection) return;

  const brief = document.createElement("section");
  brief.className = "selection-brief";
  brief.dataset.selectionBrief = "";
  brief.innerHTML = `
    <header class="selection-brief-header">
      <div>
        <span class="eyebrow">Character selection</span>
        <h2>Pick the job you want to be great at.</h2>
      </div>
      <p>Each dossier presents a finished level-10 character build designed to excel at a particular part of a heist. You are choosing a role and a mechanical toolkit; the character's personality, history, appearance, and relationships remain yours to define.</p>
    </header>
    <div class="selection-steps">
      <article><strong>01</strong><h3>Review</h3><p>Open every dossier. Overview starts with the two-paragraph role and build showcase; the other tabs expose the verified stats, equipment, abilities, and spells behind it.</p></article>
      <article><strong>02</strong><h3>Rank</h3><p>Submit a first, second, and third choice, plus an optional hard no. Rank the role you most want to play, not the one you think the crew "needs."</p></article>
      <article><strong>03</strong><h3>Make it yours</h3><p>Once roles are assigned, the selected build becomes your character. You decide who they are, where they came from, how they connect to the crew, and everything the sheet does not answer.</p></article>
    </div>`;

  rosterSection.parentNode.insertBefore(brief, rosterSection);
}

function applyRosterCardFraming() {
  document.querySelectorAll(".crew-card [data-open-dossier]").forEach(button => {
    const member = data?.crew?.find(person => person.key === button.dataset.openDossier);
    const copy = button.querySelector(".crew-card-copy");
    const functionLine = copy?.querySelector("small");
    if (!member || !copy || !functionLine) return;

    functionLine.classList.add("card-function");
    if (!copy.querySelector(".card-quote")) {
      const quote = document.createElement("span");
      quote.className = "card-quote";
      quote.textContent = `“${member.quote}”`;
      copy.insertBefore(quote, functionLine);
    }
  });
}

function applyDossiersFraming() {
  if (currentRoute() !== "dossiers") return;

  const header = document.querySelector(".page-header");
  setText(header?.querySelector("h1"), "Candidate Dossiers");
  setText(header?.querySelector("p"), "Review the assembled files before ranking your choices");
  setText(header?.querySelector(".stamp"), "Selection");

  const note = document.querySelector(".source-note");
  setText(note, "These dossiers were assembled to compare eight specialists for the final crew. Start with Overview for the role and build showcase; the remaining tabs expose the verified sheet details, equipment, spells, and source character sheet.");
}

function applyDossierProfile() {
  const dossier = currentDossierState();
  if (!dossier) return;

  const member = data?.crew?.find(person => person.key === dossier.key);
  if (!member) return;

  setText(document.querySelector(".dossier-title .eyebrow"), "Candidate dossier");

  const duplicateSummary = [...document.querySelectorAll(".dossier-title > p")].find(node => !node.classList.contains("role"));
  duplicateSummary?.remove();

  if (dossier.tab === "overview") {
    const panels = [...document.querySelectorAll(".tab-panel .panel")];
    const profilePanel = panels.find(panel => {
      const title = panel.querySelector("h2")?.textContent.trim();
      return title === "Operational profile" || title === "Role & Build Showcase";
    });
    const identityPanel = panels.find(panel => panel.querySelector("h2")?.textContent.trim() === "Identity");
    const skillsPanel = panels.find(panel => panel.querySelector("h2")?.textContent.trim() === "Strongest skills");

    const grid = profilePanel?.closest(".dossier-grid");
    grid?.classList.add("overview-grid");
    profilePanel?.classList.add("profile-panel");
    identityPanel?.classList.add("identity-panel");
    skillsPanel?.classList.add("skills-panel");

    if (profilePanel) {
      setText(profilePanel.querySelector("h2"), "Role & Build Showcase");
      if (!profilePanel.querySelector(".profile-copy")) {
        const oldParagraph = [...profilePanel.children].find(node => node.tagName === "P");
        const copy = document.createElement("div");
        copy.className = "profile-copy";

        const paragraphs = String(member.summary || "")
          .split(/(?:\r?\n){2,}/)
          .map(paragraph => paragraph.trim())
          .filter(Boolean);

        paragraphs.forEach(paragraph => {
          const p = document.createElement("p");
          p.textContent = paragraph;
          copy.append(p);
        });

        if (oldParagraph) oldParagraph.replaceWith(copy);
        else profilePanel.append(copy);
      }
    }
  }

  if (dossier.tab === "notes") {
    const panels = [...document.querySelectorAll(".tab-panel .panel")];
    const notesPanel = panels.find(panel => panel.querySelector("h2")?.textContent.trim() === "Campaign notes");
    if (notesPanel) {
      setText(notesPanel.querySelector("h2"), "Character development");
      setText(notesPanel.querySelector(".note-box"), "No personality or personal history has been locked in. Those details are established after selection and can continue to grow through play.");
    }
  }

  if (dossier.tab === "relationships") {
    const panel = document.querySelector(".tab-panel .panel");
    if (panel) {
      const intro = [...panel.children].find(node => node.tagName === "P");
      setText(intro, "Relationship history is intentionally open during selection. Once roles are assigned, these files can record the connections the players establish among the crew and the wider professional network.");
    }
  }
}

function applyCharacterSheetAccess() {
  const dossier = currentDossierState();
  if (!dossier) return;

  const member = data?.crew?.find(person => person.key === dossier.key);
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
      link.className = "button character-sheet-link";
      link.textContent = "Open D&D Beyond Character Sheet ↗";
      link.setAttribute("aria-label", `Open ${member.display} character sheet on D&D Beyond in a new tab`);
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

function applyPreplayEmptyStates() {
  const route = currentRoute();

  if (route === "operations") {
    const state = document.querySelector(".empty-state");
    setText(state?.querySelector("h2"), "Reserved for play");
    setText(state?.querySelector("p"), "Mission briefings, complications, outcomes, and debrief records will begin populating here once the crew is selected and enters the field.");
  }

  if (route === "archive") {
    const header = document.querySelector(".page-header p");
    setText(header, "Assets, intel & history — populated through play");
  }
}

function applyEnhancements() {
  applySelectionFooter();
  applyArchiveFraming();
  applyRosterCardFraming();
  applyDossiersFraming();
  applyDossierProfile();
  applyCharacterSheetAccess();
  applyPreplayEmptyStates();
}

function scheduleEnhancements() {
  if (enhancementScheduled) return;
  enhancementScheduled = true;
  requestAnimationFrame(() => {
    enhancementScheduled = false;
    applyEnhancements();
  });
}

window.addEventListener("hashchange", scheduleEnhancements);
window.addEventListener("popstate", scheduleEnhancements);

if (main) {
  new MutationObserver(scheduleEnhancements).observe(main, { childList: true, subtree: true });
}

scheduleEnhancements();
})();
