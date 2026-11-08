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
