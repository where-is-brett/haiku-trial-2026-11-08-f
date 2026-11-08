# Transaction categories by shop name Implementation Plan

**Goal:** Sort a transaction description into one of eight categories by the shop name it contains.

**Architecture:** One pure module, `src/lib/categories.js`, holding a shop table and one lookup function. Matching lower-cases both sides and checks whether the description contains the shop name, so no regular expressions are involved and characters such as `&` need no escaping.

**Tech Stack:** Node 22, ES modules, `node:test` with `node:assert/strict` (the existing `tests/smoke.test.js` style).

**Spec:** `.wheelhouse/feature/approved.md`

## Global Constraints

- Node engine is `>=22.13`; ES module syntax (`import`/`export`), as in `src/lib/money.js`.
- Category keys are exactly: `groceries`, `eating_out`, `transport`, `bills`, `shopping`, `health`, `income`, `other`.
- Category labels are exactly: Groceries, Eating out, Transport, Bills, Shopping, Health, Income, Other.
- Matching ignores case and uses "contains the shop name". No other matching rule.
- Shops are exactly the list in the spec; do not add, rename or re-categorise any.

## Review Focus

- Description with the shop name in the middle of a longer statement line, such as `POS PURCHASE GREENBARROW FRESH #204`: expected `groceries`.
- Shop name containing `&` (`Pizza & Co`): expected `eating_out`, with no regex error.
- Empty string: expected `other`.
- `null` or `undefined` description: expected `other`, not a thrown error.
- Shop name in upper case (`PASTA`): expected `eating_out`.

---

### Task 1: Categorise a description by shop name

**Files:**
- Create: `src/lib/categories.js`
- Test: `tests/categories.test.js`

**Interfaces:**
- Consumes: nothing from earlier tasks (first task).
- Produces:
  - `export const CATEGORY_LABELS` — object mapping each of the eight keys to its label string.
  - `export function categorize(description: string | null | undefined) -> string` — returns one of the eight keys; returns `'other'` when no shop matches.

- [ ] **Step 1: Write the failing tests**

Create `tests/categories.test.js`:

```js
// tests/categories.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categorize, CATEGORY_LABELS } from '../src/lib/categories.js';

test('one shop from each category is sorted to that category', () => {
  assert.equal(categorize('Greenbarrow Fresh'), 'groceries');
  assert.equal(categorize('Kestrel Coffee Bar'), 'eating_out');
  assert.equal(categorize('Pizza & Co'), 'eating_out');
  assert.equal(categorize('Waverly Fuel Stop'), 'transport');
  assert.equal(categorize('Brightfield Power'), 'bills');
  assert.equal(categorize('Marlowe Homewares'), 'shopping');
  assert.equal(categorize('Larkspur Pharmacy'), 'health');
  assert.equal(categorize('Brightwave Payroll'), 'income');
});

test('matching ignores case', () => {
  assert.equal(categorize('pasta, pizza & co'), 'eating_out');
  assert.equal(categorize('PIXEL PARADE TECH'), 'shopping');
});

test('a description with no matching shop is other', () => {
  assert.equal(categorize('Unknown Trader 88'), 'other');
});

test('a shop name inside a longer description still matches', () => {
  assert.equal(categorize('POS PURCHASE GREENBARROW FRESH #204'), 'groceries');
});

test('an empty or missing description is other', () => {
  assert.equal(categorize(''), 'other');
  assert.equal(categorize(null), 'other');
  assert.equal(categorize(undefined), 'other');
});

test('every category has its label', () => {
  assert.deepEqual(CATEGORY_LABELS, {
    groceries: 'Groceries',
    eating_out: 'Eating out',
    transport: 'Transport',
    bills: 'Bills',
    shopping: 'Shopping',
    health: 'Health',
    income: 'Income',
    other: 'Other',
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/categories.test.js`
Expected: FAIL with "Cannot find module" for `src/lib/categories.js`.

- [ ] **Step 3: Implement `src/lib/categories.js`**

Export `CATEGORY_LABELS` as a plain object with the eight keys and labels from Global Constraints. Define a private table of `[shopName, categoryKey]` pairs using the spec's shops, in the spec's order. `categorize` converts the input with `String(description ?? '').toLowerCase()`, then returns the category of the first shop whose lower-cased name the text includes, else `'other'`. Use `String.prototype.includes`, not a regular expression. Add a short comment above `categorize` stating the rule, in the style of `src/lib/money.js`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tests/categories.test.js`
Expected: PASS, 6 tests, 0 failures.

- [ ] **Step 5: Run the existing tests**

Run: `node --test`
Expected: PASS, with the smoke tests still passing and 0 failures.

- [ ] **Step 6: Commit**

```bash
git add src/lib/categories.js tests/categories.test.js docs/superpowers/plans/2026-11-09-transaction-categories.md
git commit -m "feat: sort transactions into categories by shop name"
```

---

## Self-Review

1. **Spec coverage:** Keys and labels (Task 1 Produces, Global Constraints); case-insensitive contains-match (Step 3, lower-case test); unmatched → `other` (unmatched test); one shop per category, lower-case description and unmatched description tests (first, second and third tests). Shop table copied from the spec in Step 3. No gaps.
2. **Step scan:** Every step names one action with a checkable result. Table values are pinned by the spec.
3. **Type consistency:** `categorize` and `CATEGORY_LABELS` names are the same in the Interfaces block, tests and implementation.
4. **Review Focus:** Each of the five lines is covered by a test in Step 1 (mid-string match, empty, null/undefined, lower and upper case). The `&` case is checked alone (`Pizza & Co`) in the first test, and in combination in the case test.
5. **Proportion:** One task; the plan is short and carries no implementation body beyond the tests.
