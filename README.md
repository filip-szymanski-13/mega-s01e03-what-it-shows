# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## Challenge deliverables

The signed incident page is `src/routes/kb/incidents/4471/+page.svx`.
Its rendered snapshot is `rendered/4471.html`, generated from the original Svelte
components, not a separately typed copy. The `rendered` folder also includes the
updated triage page, superseding decision 0002, and KB index. These are static
snapshots; the explorer controls are not hydrated in the saved HTML.

With Node 22.12 or newer, run `npm ci` and `npm run build` to regenerate the
snapshots. The build checks both cause counts and the incident's computed desk
reference. Rebuild whenever the export or KB source changes.

Decision 0001 remains unchanged as an accepted historical record. Decision 0002
replaces its subject-only merge rule, and the active triage page follows that rule.
