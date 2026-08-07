(() => {
  "use strict";

  const data = window.HEIST_CREW_DATA;
  if (!data?.crew) return;

  const profiles = {
    conman: {
      quote: "I can be anybody.",
      tagline: "Identity, deception & social access",
      summary: `The Conman is built for identity work and social access. Changeling Shapechanger handles the body and voice, while Mask of Many Faces supplies at-will disguise self for clothing, equipment, and the details a physical transformation cannot cover. Actor adds advantage on Deception and Performance checks when passing as somebody else, plus the ability to mimic voices. Then Eloquence Bard stacks +12 expertise in Deception and Persuasion with Silver Tongue, so a die result below 10 becomes a 10 — currently a minimum 22 on either check before advantage or any other help. The build is not relying on one good disguise roll; it has several overlapping layers for creating and maintaining a cover identity.

Once the Conman is inside, the rest of the kit helps figure out what story will work. The Medallion of Thoughts supplies detect thoughts, while gift of gab, suggestion, fast friends, charm monster, and similar spells provide different ways to steer a conversation. Unsettling Words can soften a target's next saving throw before one of those spells lands, Universal Speech removes language as an obstacle, and Cartomancer can hide an action-casting spell in a card and release it later as a bonus action. If the identity finally stops holding, the Cape of the Mountebank supplies a once-per-day dimension door.`
    },
    distraction: {
      quote: "All eyes on me.",
      tagline: "Diversion, crowds & concealment",
      summary: `The Distraction is built to control attention. With 20 Charisma, +13 Performance and Persuasion, a Fairy's flight, and the College of Glamour toolkit, they can make a room much easier for the rest of the crew to work in. Enthralling Performance can charm an audience after a minute-long performance, Mantle of Inspiration gives allies temporary hit points and lets them immediately move without provoking opportunity attacks, and Blessing of the Trickster can give another crew member advantage on Stealth for an hour. Invoke Duplicity adds an illusory double that can move independently and serve as the point of origin for the Distraction's spells.

The strongest synergy is Mantle of Majesty: for up to a minute, the Distraction can cast command as a bonus action every turn without spending spell slots, and creatures already charmed by them automatically fail those saves. Enthrall, hypnotic pattern, Nathair's mischief, suggestion, and charm monster give other options for different kinds of crowds and situations. The Deck of Illusions can add still more things for a room to look at, while the Portable Hole can make people, equipment, or a large piece of loot disappear from sight when that is more useful than another spectacle.`
    },
    driver: {
      quote: "Everybody gets out.",
      tagline: "Positioning, vehicles & extraction",
      summary: `The Driver is built around getting people from here to there, especially when the obvious route has stopped being usable. Fey Step and misty step handle personal repositioning; vortex warp moves somebody else; thunder step and dimension door can take another person along; fly and haste solve distance in different ways; and the Wildfire Spirit adds another source of short-range teleportation for nearby allies. Proficiency with both land and water vehicles covers the more literal version of the job. The result is a character with several independent answers to the same basic problem instead of one signature escape spell.

Metamagic is what makes those movement tools scale with the crew. Twinned Spell can put haste on two people instead of one, Distant Spell can double the reach of a spell such as vortex warp, Subtle Spell can remove the verbal and somatic signs that magic is being cast, and Quickened Spell can compress an action spell into a bonus action when the turn is crowded. The Eversmoking Bottle can create heavy concealment around an extraction, and the Folding Boat means nearby water can become a route out rather than a boundary.`
    },
    hacker: {
      quote: "I'm in.",
      tagline: "Surveillance, wards & bypass",
      summary: `The Hacker is built to understand security before trying to beat it. They have 20 Intelligence, +13 Investigation, +9 Arcana and History, and proficiency with thieves' tools, tinker's tools, mason's tools, and alchemist's supplies. Find familiar and arcane eye provide two different forms of remote surveillance, while detect magic, identify, see invisibility, locate object, locate creature, and the Wand of Secrets help reveal what is actually protecting a target. By the time the crew commits to an approach, the Hacker has a strong chance of knowing what the obstacle is rather than just guessing at it.

Once the system is understood, the spellbook is full of ways around it: knock for locks, dispel magic for active wards, vortex warp for positioning, greater invisibility for concealment, and passwall for the wonderfully direct solution of making a route where there was not one. Illusion Wizard features make the misdirection side unusually flexible: Improved Minor Illusion can combine sound and image, and Malleable Illusions can rewrite an ongoing illusion after it has already been cast. The Ring of Spell Storing can also hold up to five levels of spells for the wearer to cast later, letting the Hacker package a magical solution for another specialist to carry into the field.`
    },
    pickpocket: {
      quote: "It's already gone.",
      tagline: "Stealth, locks & acquisition",
      summary: `The Pickpocket is the precision thief: 20 Dexterity, +13 Stealth, +13 Sleight of Hand, +13 with thieves' tools under the campaign's tool convention, and +10 Perception and Insight. Naturally Stealthy lets a Lightfoot Halfling hide behind larger creatures, while Cunning Action makes hiding, dashing, and disengaging cheap enough to use constantly. The Ring of X-ray Vision can reveal what is behind a wall or inside a container before anybody commits to opening it, and the Rope of Climbing creates vertical routes that ordinary patrol patterns may not account for.

Arcane Trickster turns those excellent thief numbers into remote tools. Mage Hand Legerdemain makes the hand invisible and lets it stow or retrieve objects from another creature's container, pick locks, or disarm traps from a distance; Cunning Action can control it as a bonus action. Invisibility, disguise self, locate object, suggestion, and the rest of the small spell list give the Pickpocket options when pure stealth is not enough. Metamagic Adept adds Subtle Spell and Quickened Spell to that limited casting, creating a few carefully chosen turns where even the magic can be harder to notice or faster to deploy.`
    },
    "vent-guy": {
      quote: "Small entrance. Big exit.",
      tagline: "Infiltration, scouting & muscle",
      summary: `The Vent Guy / Muscle is built around Wild Shape doing two very different jobs. Cat, rat, spider, owl, octopus, and other small forms can scout spaces the rest of the crew cannot easily enter, while Perception, Survival, Mask of the Wild, and pass without trace support more conventional reconnaissance. At 10th-level Moon Druid, Wild Shape can also reach CR 3 beasts and has no swimming or flying restriction, so the available scouting routes include walls, air, water, narrow gaps, and places where a humanoid simply does not fit. Utility spells such as enhance ability, water breathing, freedom of movement, stone shape, and tree stride widen that access even further.

The same build can shift into the crew's heavy physical option when that is what the situation calls for. Giant Scorpion, Giant Constrictor Snake, Saber-Toothed Tiger, and other combat forms bring separate pools of hit points and strong control tools, while Elemental Wild Shape can spend both uses to become an air, earth, fire, or water elemental. Guardian of Nature provides another combat-mode boost without replacing Wild Shape. The Immovable Rod and Iron Bands of Bilarro add two more pieces of physical problem-solving: one can anchor an object in space, while the other can restrain a target at range.`
    },
    hitter: {
      quote: "I hit things.",
      tagline: "Breach, capture & protection",
      summary: `The Hitter is built around physical control rather than simply chasing the largest damage number. With 20 Strength, +13 Athletics, Bugbear Long-Limbed reach, Powerful Build, and the Unarmed Fighting style, they are extremely good at getting hands on a problem and deciding where it is allowed to go. Grappling Strike can turn a successful melee hit into a bonus-action grapple while adding the superiority die to that already excellent Athletics check; Trip Attack can put the target on the floor; Disarming Attack can remove a weapon; and Crusher can move a creature five feet when a bludgeoning hit lands.

There is a second optimization loop around acting before the opposition does. Bugbear Surprise Attack adds 2d6 damage when the Hitter hits a creature that has not taken a turn yet, while the Ambush maneuver can add a superiority die to initiative or Stealth to help make that happen. Bait and Switch can trade places with a teammate without provoking opportunity attacks and give one of them an AC bonus, and Commanding Presence can add a superiority die to selected social checks outside a fight. The Eldritch Claw Tattoo improves the unarmed package and can extend its reach, while the Ring of the Ram adds ranged force and an object-breaking option.`
    },
    cleaner: {
      quote: "I handle the mess.",
      tagline: "Removal, evidence & recovery",
      summary: `The Cleaner is built for the problems that appear around the edges of a clean plan: an injured teammate, an unexpected witness, a dangerous prisoner, poison, evidence, or the small detail everybody else missed. They have 18 Dexterity and Wisdom, 18 AC, 50 feet of movement, and proficiency across Stealth, Sleight of Hand, Investigation, Medicine, Insight, and Perception. Knowledge from a Past Life can add a d6 to an important skill check several times per day, and the Eyes of Minute Seeing grant advantage on close-range Investigation involving an object or area within a foot. Way of Mercy then gives the same character strong tools for both quiet removal and emergency stabilization.

Stunning Strike and the Dimensional Shackles are deliberately paired. A successful Stunning Strike leaves a target stunned — and therefore incapacitated — until the end of the Cleaner's next turn, opening the exact window the Shackles require: the Cleaner can use that next action to place them on the incapacitated target. Once secured, the target is restrained and cannot use extradimensional movement to escape. Physician's Touch creates another two-way synergy: Hand of Harm can poison a target until the end of the next turn without a separate save, while Hand of Healing can also remove disease or conditions including blinded, deafened, paralyzed, poisoned, and stunned.`
    }
  };

  for (const member of data.crew) {
    const profile = profiles[member.key];
    if (profile) Object.assign(member, profile);
  }

  // Campaign-book correction: the current Vent Guy / Muscle preparation uses
  // Guardian of Nature rather than Conjure Minor Elementals.
  const vent = data.crew.find(member => member.key === "vent-guy");
  if (vent?.spells) {
    vent.spells = vent.spells.filter(spell => spell.name !== "Conjure Minor Elementals");
    if (!vent.spells.some(spell => spell.name === "Guardian of Nature")) {
      vent.spells.push({
        name: "Guardian of Nature",
        level: 4,
        source: "Druid",
        prepared: true,
        concentration: true,
        ritual: false,
        description: "Calls on nature spirits to assume a powerful Primal Beast or Great Tree aspect for up to one minute."
      });
    }
  }
})();
