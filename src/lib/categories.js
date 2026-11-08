// src/lib/categories.js

// The label shown for each category key.
export const CATEGORY_LABELS = {
  groceries: 'Groceries',
  eating_out: 'Eating out',
  transport: 'Transport',
  bills: 'Bills',
  shopping: 'Shopping',
  health: 'Health',
  income: 'Income',
  other: 'Other',
};

// Each shop name and the category it belongs to, in the approved order.
const SHOPS = [
  ['Greenbarrow Fresh', 'groceries'],
  ['Pennywhistle Market', 'groceries'],
  ['Lowtide Grocers', 'groceries'],
  ['Harvest Lane Foods', 'groceries'],
  ['Pasta', 'eating_out'],
  ['Pizza & Co', 'eating_out'],
  ['Kestrel Coffee Bar', 'eating_out'],
  ['Saltbush Noodle House', 'eating_out'],
  ['Ember Grill', 'eating_out'],
  ['Waverly Fuel Stop', 'transport'],
  ['Tramline Fares', 'transport'],
  ['Lantern Rideshare', 'transport'],
  ['Northgate Parking', 'transport'],
  ['Brightfield Power', 'bills'],
  ['Clearwater Utilities', 'bills'],
  ['Skyline Broadband', 'bills'],
  ['Hollis Insurance', 'bills'],
  ['Marlowe Homewares', 'shopping'],
  ['Quillon Books', 'shopping'],
  ['Fernhill Outfitters', 'shopping'],
  ['Pixel Parade Tech', 'shopping'],
  ['Larkspur Pharmacy', 'health'],
  ['Elmgrove Physio', 'health'],
  ['Cobalt Dental', 'health'],
  ['Sunnyvale Optical', 'health'],
  ['Brightwave Payroll', 'income'],
  ['Tidepool Interest', 'income'],
  ['Oakridge Dividends', 'income'],
];

// A description belongs to a shop when it contains the shop name, ignoring case.
// The first shop in the list that matches decides; no match is 'other'.
export function categorize(description) {
  const text = String(description ?? '').toLowerCase();
  const match = SHOPS.find(([name]) => text.includes(name.toLowerCase()));
  return match ? match[1] : 'other';
}
