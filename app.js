(() => {
"use strict";
const data = window.HEIST_CREW_DATA;
const main = document.querySelector("#main");
const topnav = document.querySelector(".topnav");
const menuButton = document.querySelector(".menu-button");
const navLinks = [...document.querySelectorAll("[data-route]")];
const crewByKey = new Map(data.crew.map(member => [member.key, member]));
const tabs = ["overview", "abilities", "equipment", "spells", "notes", "relationships"];
const state = { dossierTab: "overview" };
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
}[char]));
const mod = score => {
const value = Math.floor((score - 10) / 2);
return value >= 0 ? `+${value}` : String(value);
};
const signed = value => Number(value) >= 0 ? `+${value}` : String(value);
function setAccent(member) {
const root = document.documentElement;
root.style.setProperty("--accent", member?.accent || "#c9a96d");
root.style.setProperty("--accent-2", member?.accent2 || "#654c27");
}
function parseHash() {
const raw = location.hash.replace(/^#/, "") || "crew";
const parts = raw.split("/").filter(Boolean);
if (parts[0] === "dossier" && crewByKey.has(parts[1])) {
return { route: "dossier", key: parts[1], tab: tabs.includes(parts[2]) ? parts[2] : state.dossierTab };
}
if (parts[0] === "archive") return { route: "archive", section: parts[1] || null };
if (["crew","dossiers","operations","whiteboard","relationships"].includes(parts[0])) return { route: parts[0] };
return { route: "crew" };
}
function updateNavigation(route) {
navLinks.forEach(link => {
const matches = route === "dossier" ? link.dataset.route === "dossiers" : link.dataset.route === route;
link.toggleAttribute("aria-current", matches);
});
topnav.classList.remove("open");
menuButton.setAttribute("aria-expanded", "false");
menuButton.setAttribute("aria-label", "Open navigation");
}
function pageHeader(title, kicker, stamp = "Confidential") {
return `<header class="page-header">
<div><h1>${esc(title)}</h1><p>${esc(kicker)}</p></div>
<span class="stamp">${esc(stamp)}</span>
</header>`;
}
function crewCard(member) {
return `<article class="crew-card" style="--card-accent:${member.accent}">
<button type="button" data-open-dossier="${member.key}" aria-label="Open ${esc(member.display)} dossier">
<span class="card-portrait${member.key === "conman" ? " conman-transition" : ""}" style="--portrait-position:${esc(member.portraitPosition || "50% 18%")}">
<img class="portrait-primary" src="${member.portrait}" alt="${esc(member.display)} — ${esc(member.visual)}" />
${member.key === "conman" ? `<img class="portrait-reveal" src="portraits/conman-reveal.svg" alt="" aria-hidden="true" />` : ""}
</span>
<span class="crew-card-copy">
<h3>${esc(member.display)}</h3>
<p>${esc(member.race)} · ${esc(member.classSplit)}</p>
<small>${esc(member.tagline)}</small>
</span>
</button>
</article>`;
}
function renderCrew() {
setAccent(null);
main.innerHTML = `
<section class="hero-layout">
<div class="hero-panel">
<strong>The Crew Archive</strong>
<h2>The<br>Crew</h2>
<p>Eight operatives. One impossible job.</p>
</div>
<aside class="status-panel">
<h3>Current status</h3>
<strong>No Active Operation</strong>
<p>The crew has not yet entered the field. Dossiers are verified; operation records remain empty.</p>
<hr style="width:100%;border:0;border-top:1px solid var(--line)">
<span class="eyebrow">Rules baseline</span>
<p>${esc(data.meta.rules)}</p>
</aside>
</section>
<section aria-labelledby="roster-heading">
<div class="page-header"><div><h1 id="roster-heading" style="font-size:2rem">Roster</h1><p>Active level-10 operatives</p></div></div>
<div class="roster-grid">${data.crew.map(crewCard).join("")}</div>
</section>`;
bindDossierButtons();
}
function renderDossiers() {
setAccent(null);
main.innerHTML = `
${pageHeader("Dossiers", "Select an operative")}
<div class="roster-grid">${data.crew.map(crewCard).join("")}</div>
<p class="source-note">Every card and dossier view uses the same canonical portrait asset; alternate crops are generated through CSS rather than separate images.</p>`;
bindDossierButtons();
}
function renderRelationshipsOverview() {
setAccent(null);
main.innerHTML = `${pageHeader("Relationships", "Crew connections")}
<div class="empty-state">
<span class="empty-icon">◎</span>
<h2>No relationship notes entered</h2>
<p>The roster is complete, but interpersonal history has not yet been recorded. Relationship entries can be added after character selection and play establish what is actually true.</p>
</div>`;
}
function statStrip(member) {
return `<div class="stat-strip">
<div class="stat"><span>Armor class</span><strong>${member.armorClass}</strong></div>
<div class="stat"><span>Hit points</span><strong>${member.hitPoints}</strong></div>
<div class="stat"><span>Initiative</span><strong>${signed(member.initiative)}</strong></div>
<div class="stat"><span>Proficiency</span><strong>${signed(member.proficiencyBonus)}</strong></div>
</div>`;
}
function overviewPanel(member) {
const strongest = member.skills.slice(0, 5);
return `<div class="dossier-grid">
<section class="panel">
<h2>Operational profile</h2>
<p>${esc(member.summary)}</p>
<h3>Background</h3>
<p>${esc(member.background)} · ${esc(member.backgroundFeature)}</p>
</section>
<section class="panel">
<h2>Identity</h2>
<dl class="key-value">
<div><dt>Species</dt><dd>${esc(member.race)}</dd></div>
<div><dt>Class</dt><dd>${esc(member.classSplit)}</dd></div>
<div><dt>Level</dt><dd>${member.level}</dd></div>
<div><dt>Role</dt><dd>${esc(member.tagline)}</dd></div>
</dl>
</section>
<section class="panel">
<h2>Strongest skills</h2>
<dl class="key-value">${strongest.map(skill => `<div><dt>${esc(skill.name)}</dt><dd>${signed(skill.bonus)}</dd></div>`).join("")}</dl>
<h3>Passive scores</h3>
<div class="tag-list">${Object.entries(member.passives).map(([name,value]) => `<span class="tag">${esc(name)} ${value}</span>`).join("")}</div>
</section>
</div>`;
}
function abilitiesPanel(member) {
const abilities = Object.entries(member.abilities);
const features = member.features.map(feature => `<details><summary><span>${esc(feature.name)} <small>· ${esc(feature.source)}</small></span></summary><div class="detail-body">${esc(feature.summary)}</div></details>`).join("");
const actions = member.actions.map(action => `<details><summary><span>${esc(action.name)} <small>· ${esc(action.group)}</small></span></summary><div class="detail-body">${esc(action.summary)}</div></details>`).join("");
return `${statStrip(member)}
<div class="dossier-grid">
<section class="panel">
<h2>Ability scores</h2>
<div class="ability-grid">${abilities.map(([name,value]) => `<div class="ability"><span>${name}</span><strong>${value}</strong><small>${mod(value)}</small></div>`).join("")}</div>
</section>
<section class="panel">
<h2>Movement & senses</h2>
<dl class="key-value">
${Object.entries(member.movement).map(([name,value]) => `<div><dt>${esc(name)}</dt><dd>${value} ft.</dd></div>`).join("")}
${Object.entries(member.passives).map(([name,value]) => `<div><dt>Passive ${esc(name)}</dt><dd>${value}</dd></div>`).join("")}
</dl>
</section>
<section class="panel">
<h2>Saving throws</h2>
<dl class="key-value">${member.savingThrows.map(save => `<div><dt>${esc(save.ability)}${save.proficient ? " · proficient" : ""}</dt><dd>${signed(save.bonus)}</dd></div>`).join("")}</dl>
</section>
</div>
<section class="panel" style="margin-top:1rem"><h2>Skills</h2>
<div class="table-wrap"><table><thead><tr><th>Skill</th><th>Ability</th><th>Bonus</th><th>Rank</th></tr></thead><tbody>
${member.skills.map(skill => `<tr><td><strong>${esc(skill.name)}</strong></td><td>${esc(skill.ability)}</td><td>${signed(skill.bonus)}</td><td>${skill.rank === 2 ? "Expertise" : skill.rank === 1 ? "Proficient" : "Untrained"}</td></tr>`).join("")}
</tbody></table></div>
</section>
<div class="dossier-grid" style="margin-top:1rem">
<section class="panel"><h2>Features</h2><div class="details-stack">${features || `<p>No features recorded.</p>`}</div></section>
<section class="panel" style="grid-column:span 2"><h2>Actions & limited techniques</h2><div class="details-stack">${actions || `<p>No actions recorded.</p>`}</div></section>
</div>`;
}
function equipmentPanel(member) {
const equipped = member.equipped.map(item => `<tr><td><strong>${esc(item.name)}</strong></td><td>${esc(item.type)}</td><td>${item.magic ? esc(item.rarity || "Magic") : "Mundane"}</td></tr>`).join("");
const items = member.magicItems.map(item => `<details><summary><span>${esc(item.name)} <small>· ${esc(item.rarity)}</small></span></summary><div class="detail-body">${esc(item.effect)}${item.attunement ? " Requires attunement." : ""}</div></details>`).join("");
const tools = member.tools.map(tool => `<span class="tag">${esc(tool.name)}${tool.expertise ? " · expertise" : tool.proficient ? " · proficient" : ""}</span>`).join("");
return `<div class="dossier-grid">
<section class="panel" style="grid-column:span 2">
<h2>Equipped loadout</h2>
<div class="table-wrap"><table><thead><tr><th>Item</th><th>Type</th><th>Status</th></tr></thead><tbody>${equipped}</tbody></table></div>
</section>
<section class="panel"><h2>Tools</h2><div class="tag-list">${tools || `<span class="tag">None recorded</span>`}</div></section>
</div>
<section class="panel" style="margin-top:1rem"><h2>Active permanent magic items</h2><div class="details-stack">${items || `<p>No permanent magic items recorded.</p>`}</div></section>`;
}
function spellsPanel(member) {
if (!member.spells.length) {
return `<div class="empty-state"><span class="empty-icon">✦</span><h2>No spellcasting exposed</h2><p>This character's current verified sheet does not expose a spell list. Class techniques and magic items remain available under Abilities and Equipment.</p></div>`;
}
const grouped = Map.groupBy ? Map.groupBy(member.spells, spell => spell.level) : member.spells.reduce((map, spell) => {
(map[spell.level] ||= []).push(spell); return map;
}, {});
const levels = grouped instanceof Map ? [...grouped.entries()] : Object.entries(grouped);
const rows = levels.sort((a,b) => Number(a[0])-Number(b[0])).map(([level, spells]) => `<details ${Number(level) <= 1 ? "open" : ""}>
<summary><span>${Number(level) === 0 ? "Cantrips" : `Level ${level}`} <small>· ${spells.length} options</small></span></summary>
<div class="detail-body spell-list">
${spells.map(spell => {
const flags = [spell.prepared && "Prepared", spell.concentration && "Concentration", spell.ritual && "Ritual", spell.freeUses && `${spell.freeUses} free use`].filter(Boolean);
return `<details class="spell-entry">
<summary><span><strong>${esc(spell.name)}</strong><small>${esc(spell.source || "Character sheet")}${flags.length ? ` · ${esc(flags.join(" · "))}` : ""}</small></span></summary>
<div class="detail-body spell-description">${esc(spell.description || "No description was exposed by the current character record.")}</div>
</details>`;
}).join("")}
</div></details>`).join("");
return `<section class="panel"><h2>Spell library</h2><div class="details-stack">${rows}</div></section>`;
}
function notesPanel(member) {
return `<div class="dossier-grid">
<section class="panel">
<h2>Campaign notes</h2>
<div class="note-box">No campaign-specific notes have been entered. This space is reserved for confirmed history, habits, liabilities, and player-approved characterization.</div>
</section>
<section class="panel">
<h2>Data warnings</h2>
${member.warnings.length ? `<ul>${member.warnings.map(w => `<li>${esc(w)}</li>`).join("")}</ul>` : `<p>No current verification warnings.</p>`}
</section>
<section class="panel">
<h2>Source record</h2>
<dl class="key-value">
<div><dt>Retrieved</dt><dd>${esc(member.retrievedAt)}</dd></div>
<div><dt>Rules</dt><dd>${esc(data.meta.rules)}</dd></div>
</dl>
<p><a href="${esc(member.sourceUrl)}" target="_blank" rel="noreferrer">Open D&D Beyond source</a></p>
</section>
</div>`;
}
function relationshipsPanel(member) {
const others = data.crew.filter(person => person.key !== member.key);
return `<section class="panel">
<h2>Relationship file</h2>
<p>No interpersonal claims are being fabricated before play. These entries remain neutral placeholders until the crew's actual history is established.</p>
<div class="relationship-grid">${others.map(person => `<article class="relationship">
<img src="${person.portrait}" alt="" />
<div><strong>${esc(person.display)}</strong><span>No confirmed relationship note.</span></div>
</article>`).join("")}</div>
</section>`;
}
function dossierBody(member, tab) {
if (tab === "overview") return overviewPanel(member);
if (tab === "abilities") return abilitiesPanel(member);
if (tab === "equipment") return equipmentPanel(member);
if (tab === "spells") return spellsPanel(member);
if (tab === "notes") return notesPanel(member);
if (tab === "relationships") return relationshipsPanel(member);
return overviewPanel(member);
}
function renderDossier(member, tab = "overview") {
state.dossierTab = tab;
setAccent(member);
main.style.setProperty("--character-accent", member.accent);
main.innerHTML = `
<section class="dossier-heading" style="--character-accent:${member.accent}">
<figure class="dossier-portrait">
<div class="dossier-portrait-frame${member.key === "conman" ? " conman-transition" : ""}" style="--portrait-position:${esc(member.portraitPosition || "50% 18%")}">
<img class="portrait-primary" src="${member.portrait}" alt="${esc(member.display)} — ${esc(member.visual)}" />
${member.key === "conman" ? `<img class="portrait-reveal" src="portraits/conman-reveal.svg" alt="" aria-hidden="true" />` : ""}
</div>
${member.key === "conman" ? `<button class="reveal-control" type="button" data-reveal-identity aria-pressed="false">Reveal identity</button>` : ""}
<figcaption>${esc(member.race)} · ${esc(member.classSplit)} · Level ${member.level}</figcaption>
</figure>
<header class="dossier-title">
<a class="back" href="#dossiers">← Back to roster</a>
<span class="eyebrow">Operation dossier</span>
<h1>${esc(member.display)}</h1>
<p class="role">${esc(member.tagline)}</p>
<p>${esc(member.summary)}</p>
<blockquote>“${esc(member.quote)}”</blockquote>
</header>
</section>
<nav class="dossier-tabs" aria-label="${esc(member.display)} dossier sections" style="--character-accent:${member.accent}">
${tabs.map(name => `<button type="button" role="tab" data-tab="${name}" aria-selected="${name === tab}">${name}</button>`).join("")}
</nav>
<section class="tab-panel" role="tabpanel">${dossierBody(member, tab)}</section>`;
main.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => {
const next = button.dataset.tab;
state.dossierTab = next;
history.pushState(null, "", `#dossier/${member.key}/${next}`);
renderDossier(member, next);
updateNavigation("dossier");
window.scrollTo({ top: 0, behavior: "smooth" });
}));
const revealControl = main.querySelector("[data-reveal-identity]");
if (revealControl) {
revealControl.addEventListener("click", () => {
const frame = main.querySelector(".dossier-portrait-frame");
const revealed = frame.classList.toggle("reveal-active");
revealControl.setAttribute("aria-pressed", String(revealed));
revealControl.textContent = revealed ? "Show primary portrait" : "Reveal identity";
});
}
}
function renderOperations() {
setAccent(null);
main.innerHTML = `${pageHeader("Operations", "Archive & debriefs")}
<div class="empty-state">
<span class="empty-icon">▱</span>
<h2>No operations archived</h2>
<p>The crew has not yet entered the field. When play begins, this archive can hold mission briefings, confirmed objectives, complications, outcomes, rewards, consequences, and debrief records—without assuming that the original plan survived contact with the job.</p>
</div>`;
}
function renderWhiteboard() {
setAccent(null);
main.innerHTML = `${pageHeader("Whiteboard", "Ephemeral working space", "Scratch")}
<section class="whiteboard-shell">
<p class="whiteboard-note">This board is deliberately noncanonical and does not persist after a refresh. It is a flexible scratch surface, not a structured promise about how a mission will unfold.</p>
<div class="whiteboard-toolbar">
<button class="button" type="button" data-add-note>Add loose note</button>
<button class="button" type="button" data-clear-board>Clear board</button>
</div>
<div class="whiteboard" aria-label="Working operation whiteboard">
<h2 class="board-heading" contenteditable="true">Working Operation</h2>
<div class="board-lanes">
<section class="board-lane"><h3>What we know</h3><textarea class="sticky" aria-label="Known information note" placeholder="Target, client, constraints, timing…"></textarea></section>
<section class="board-lane"><h3>What we might do</h3><textarea class="sticky" aria-label="Possible approach note" placeholder="Approaches, covers, contingencies…"></textarea></section>
<section class="board-lane"><h3>What could go wrong</h3><textarea class="sticky" aria-label="Risk note" placeholder="Security, rivals, unknowns, escape problems…"></textarea></section>
</div>
</div>
</section>`;
main.querySelector("[data-add-note]").addEventListener("click", () => {
const lane = [...main.querySelectorAll(".board-lane")].sort((a,b) => a.querySelectorAll(".sticky").length - b.querySelectorAll(".sticky").length)[0];
const note = document.createElement("textarea");
note.className = "sticky";
note.setAttribute("aria-label", "Loose whiteboard note");
note.placeholder = "Loose note…";
lane.append(note);
note.focus();
});
main.querySelector("[data-clear-board]").addEventListener("click", () => {
main.querySelectorAll(".sticky").forEach((note, index) => {
if (index < 3) note.value = "";
else note.remove();
});
});
}
function renderArchive(section = null) {
setAccent(null);
const cards = [
{ key:"assets", title:"Assets", count:data.archive.assets.length, text:"Crew-wide resources, safehouses, vehicles, shared equipment, forged documents, and custody of mission-specific items.", list:["No shared assets recorded","Personal equipment remains in individual dossiers"] },
{ key:"intel", title:"Intel", count:data.archive.intel.length, text:"NPC dossiers, factions, target locations, security systems, open leads, and unresolved operational questions.", list:["No field intelligence recorded","No targets or organizations indexed"] },
{ key:"timeline", title:"Timeline", count:data.archive.timeline.length, text:"Completed operations, campaign milestones, consequences, changes in reputation, and unresolved story threads.", list:["No timeline entries","The crew has not yet entered the field"] }
];
main.innerHTML = `${pageHeader("Archive", "Assets, intel & history")}
<div class="archive-grid">${cards.map(card => `<article id="${card.key}" class="archive-card">
<span class="count">${card.count} records</span><h2>${card.title}</h2><p>${card.text}</p><ul>${card.list.map(item => `<li>${item}</li>`).join("")}</ul>
</article>`).join("")}</div>`;
if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ behavior:"smooth", block:"center" }));
}
function bindDossierButtons() {
main.querySelectorAll("[data-open-dossier]").forEach(button => button.addEventListener("click", () => {
location.hash = `dossier/${button.dataset.openDossier}/overview`;
}));
}
function render() {
const locationState = parseHash();
updateNavigation(locationState.route);
if (locationState.route === "crew") renderCrew();
else if (locationState.route === "dossiers") renderDossiers();
else if (locationState.route === "relationships") renderRelationshipsOverview();
else if (locationState.route === "dossier") renderDossier(crewByKey.get(locationState.key), locationState.tab);
else if (locationState.route === "operations") renderOperations();
else if (locationState.route === "whiteboard") renderWhiteboard();
else if (locationState.route === "archive") renderArchive(locationState.section);
main.focus({ preventScroll: true });
}
menuButton.addEventListener("click", () => {
const open = topnav.classList.toggle("open");
menuButton.setAttribute("aria-expanded", String(open));
menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
window.addEventListener("hashchange", render);
window.addEventListener("popstate", render);
render();
})();