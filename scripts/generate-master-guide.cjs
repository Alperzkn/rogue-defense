#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "src", "data", "gameData.json");
const OUT_PATH = path.join(
  __dirname,
  "..",
  "assets",
  "Rogue Defense - Master Guide.md"
);

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

const tierLabel = { 1: "Initial Unlocked", 2: "Star Tier 2 Unlock", 3: "Star Tier 3 Unlock" };

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ratingStars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function skillAnchor(id) {
  return id; // kebab-case ids work as markdown anchors
}

// --- Skills ---
function renderSkillSection(skill) {
  const lines = [];
  lines.push(`## ${skill.name}`);
  lines.push("");
  lines.push(`**Type:** ${capitalize(skill.type)}`);
  lines.push("");
  lines.push(`> ${skill.description}`);
  lines.push("");

  const tiers = [1, 2, 3];
  for (const tier of tiers) {
    const cards = skill.cards.filter((c) => c.tier === tier);
    if (cards.length === 0) continue;
    lines.push(`### ${tierLabel[tier]}`);
    lines.push("");
    lines.push("| Card Name | Type | Rarity | Effect |");
    lines.push("|-----------|------|--------|--------|");
    for (const card of cards) {
      const type = card.tag === "Standard" ? "—" : card.tag;
      const rarity = card.isSpecial ? "★ Special" : "Normal";
      let effect = card.description;
      if (card.requiresCards && card.requiresCards.length > 0) {
        effect += ` *(Requires: ${card.requiresCards.join(", ")})*`;
      }
      lines.push(`| ${card.name} | ${type} | ${rarity} | ${effect} |`);
    }
    lines.push("");
  }

  if (skill.tips && skill.tips.length > 0) {
    lines.push("**Tips:**");
    for (const tip of skill.tips) {
      lines.push(`- ${tip}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// --- Synergy Builds ---
function renderCombo(combo) {
  const skillNames = combo.skills.map((id) => {
    const s = data.skills.find((sk) => sk.id === id);
    return s ? s.name : id;
  });

  const lines = [];
  lines.push(`## ${combo.name} (${ratingStars(combo.rating)})`);
  lines.push("");
  lines.push(`**Skills:** ${skillNames.join(", ")}`);
  lines.push("");
  lines.push(`> ${combo.description}`);
  lines.push("");
  lines.push(`**Synergy:** ${combo.synergy}`);
  lines.push("");
  lines.push(`**Playstyle:** ${combo.playstyle}`);
  lines.push("");
  lines.push(`**Key Cards:** ${combo.cards.join(", ")}`);
  lines.push("");
  if (combo.tips && combo.tips.length > 0) {
    lines.push("**Tips:**");
    for (const tip of combo.tips) {
      lines.push(`- ${tip}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

// --- Status Effects ---
function renderStatusEffect(effect) {
  const lines = [];
  lines.push(`## ${effect.icon} ${effect.name}`);
  lines.push("");
  lines.push(effect.description);
  lines.push("");
  if (effect.sources && effect.sources.length > 0) {
    lines.push("**Sources:**");
    for (const src of effect.sources) {
      lines.push(`- ${src}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

// --- Enemies ---
function renderEnemyGroup(type, enemies) {
  const lines = [];
  const label = type === "boss" ? "Bosses" : capitalize(type) + "s";
  lines.push(`## ${label}`);
  lines.push("");
  lines.push("| Name | Ability | Type | First Stage | Stages | Fire | Electric | Energy | Physical | Field |");
  lines.push("|------|---------|------|-------------|--------|------|----------|--------|----------|-------|");
  for (const enemy of enemies) {
    const r = enemy.resistances;
    const fmt = (v) => v === 0 ? "—" : (v > 0 ? `+${v}%` : `${v}%`);
    const stages = enemy.stages.join(", ");
    lines.push(`| ${enemy.name} | ${enemy.ability} | ${capitalize(enemy.type)} | ${enemy.firstStage} | ${stages} | ${fmt(r.fire)} | ${fmt(r.electric)} | ${fmt(r.energy)} | ${fmt(r.physical)} | ${fmt(r.field)} |`);
  }
  lines.push("");
  return lines.join("\n");
}

// --- Chip Sockets ---
function renderChipSocket(socket) {
  const lines = [];
  lines.push(`## ${socket.icon} ${socket.name}`);
  lines.push("");
  lines.push(socket.description);
  lines.push("");
  lines.push("| Stat | Drop Rate | Ultra Rare |");
  lines.push("|------|-----------|------------|");
  for (const stat of socket.stats) {
    const pct = parseFloat(stat.chance.toFixed(2)) + "%";
    const ultra = stat.isUltraRare ? "⭐" : "";
    lines.push(`| ${stat.description} | ${pct} | ${ultra} |`);
  }
  lines.push("");
  return lines.join("\n");
}

// --- Assemble ---
const sections = [];

// Header
sections.push(`# Rogue Defense — Master Guide

A comprehensive reference for all Skill Cards, Synergy Builds, Status Effects, and Chip Sockets in Rogue Defense.

Cards marked with ★ Special have a purple background in-game, indicating they are enhanced/rare variants.

---

## Table of Contents

- [Skill Cards](#skill-cards)
${data.skills.filter((s) => s.cards.length > 0).map((s) => `  - [${s.name}](#${skillAnchor(s.id)})`).join("\n")}
- [Synergy Builds](#synergy-builds)
- [Status Effects](#status-effects)
- [Enemies](#enemies)
- [Chip Sockets](#chip-sockets)
${data.chipSockets.map((cs) => `  - [${cs.name}](#${cs.id})`).join("\n")}

---

# Skill Cards

Each skill has cards organized into tiers: Tier 1 (Initial), Tier 2 (Star Tier 2), and Tier 3 (Star Tier 3). Cards are typed as Standard, **Chain** (prerequisite cards within the same skill), or **Combo** (requires another skill in your build). Cards marked **★ Special** have a purple background in-game.

---`);

// Skills
for (const skill of data.skills.filter((s) => s.cards.length > 0)) {
  sections.push(renderSkillSection(skill) + "\n---");
}

// Synergy Builds
sections.push(`# Synergy Builds

Curated skill combinations ranked by effectiveness.`);

for (const combo of data.combos) {
  sections.push(renderCombo(combo) + "\n---");
}

// Status Effects
sections.push("# Status Effects");

for (const effect of data.statusEffects) {
  sections.push(renderStatusEffect(effect) + "\n---");
}

// Enemies
if (data.enemies && data.enemies.length > 0) {
  sections.push(`# Enemies

All known enemies in Rogue Defense. Resistance values show damage modifiers: positive means the enemy takes MORE damage of that type, negative means LESS.`);

  for (const type of ["boss", "elite", "minion"]) {
    const group = data.enemies.filter((e) => e.type === type);
    if (group.length > 0) {
      sections.push(renderEnemyGroup(type, group) + "\n---");
    }
  }
}

// Chip Sockets
sections.push(`# Chip Sockets

Each socket holds up to 6 chips. Stats are obtained randomly with the listed drop rates.`);

for (const socket of data.chipSockets) {
  sections.push(renderChipSocket(socket) + "\n---");
}

const output = sections.join("\n\n") + "\n";
fs.writeFileSync(OUT_PATH, output, "utf-8");
console.log(`✓ Master Guide written to ${path.relative(process.cwd(), OUT_PATH)}`);
