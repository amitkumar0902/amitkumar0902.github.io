#!/usr/bin/env node
// Wayfinder frontier view: tickets by lane — frontier (open+unblocked+unclaimed),
// claimed, blocked, closed. Reads frontmatter from tickets/*.md.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'tickets');
const tickets = readdirSync(dir).filter(f => f.endsWith('.md')).sort().map(f => {
  const src = readFileSync(join(dir, f), 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---/);
  const get = k => (fm?.[1].match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1] ?? '').trim();
  return {
    file: f,
    id: get('id'),
    title: get('title'),
    labels: get('labels').replace(/[[\]]/g, ''),
    status: get('status'),
    assignee: get('assignee'),
    blockedBy: get('blocked-by').match(/T\d+/g) ?? [],
  };
});

const byId = Object.fromEntries(tickets.map(t => [t.id, t]));
const isClosed = t => t.status === 'closed';
const isUnblocked = t => t.blockedBy.every(id => byId[id] && isClosed(byId[id]));
const lane = t =>
  isClosed(t) ? 'closed'
  : !isUnblocked(t) ? 'blocked'
  : (t.assignee && t.assignee !== 'none') ? 'claimed'
  : 'frontier';

for (const l of ['frontier', 'claimed', 'blocked', 'closed']) {
  const rows = tickets.filter(t => lane(t) === l);
  if (!rows.length) continue;
  console.log(`\n${l.toUpperCase()}`);
  for (const t of rows) {
    const extra =
      l === 'blocked' ? `  ⇐ waiting on ${t.blockedBy.filter(id => !isClosed(byId[id])).join(', ')}` :
      l === 'claimed' ? `  (${t.assignee})` : '';
    console.log(`  ${t.id}  ${t.title}  [${t.labels}]${extra}`);
  }
}
console.log();
