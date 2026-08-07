(() => {
  "use strict";

  const crew = window.HEIST_CREW_DATA?.crew;
  if (!crew) return;

  const hitter = crew.find(member => member.key === "hitter");
  if (hitter?.summary) {
    hitter.summary = hitter.summary.replace(
      "There is a second optimization loop around acting before the opposition does. Bugbear Surprise Attack adds 2d6 damage when the Hitter hits a creature that has not taken a turn yet, while the Ambush maneuver can add a superiority die to initiative or Stealth to help make that happen.",
      "There is a second optimization loop around acting before the opposition does. Bugbear Surprise Attack adds 2d6 damage to each qualifying hit against a creature that has not taken a turn yet, while the Ambush maneuver can add a superiority die to initiative to help make that happen. If the Hitter wins initiative, Action Surge can turn the opening turn into four attacks before that target acts, each potentially carrying the extra 2d6."
    );
  }

  const vent = crew.find(member => member.key === "vent-guy");
  if (vent?.summary) {
    vent.summary = vent.summary.replace(
      "Guardian of Nature provides another combat-mode boost without replacing Wild Shape.",
      "Guardian of Nature adds another layer to the combat forms: it can be cast before a bonus-action Wild Shape and maintained after transforming, letting the Primal Beast aspect strengthen Strength-based beast attacks while the druid still gets the separate Wild Shape hit-point pool."
    );
  }

  const cleaner = crew.find(member => member.key === "cleaner");
  if (cleaner?.summary) {
    cleaner.summary = cleaner.summary.replace(
      "Once secured, the target is restrained and cannot use extradimensional movement to escape.",
      "Once secured, the shackles function as exceptionally difficult-to-break manacles and prevent the target from using extradimensional movement to escape."
    );
  }

  const shackles = cleaner?.magicItems?.find(item => item.name === "Dimensional Shackles");
  if (shackles) {
    shackles.effect = "Can be placed as an action on an incapacitated Small-to-Large creature; functions as manacles and prevents the bound creature from using extradimensional movement, including teleportation and planar travel.";
  }
})();
