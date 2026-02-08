/**
 * Checks for export name collisions between main icons and category icons.
 * Run with: ts-node scripts/check_collisions.ts
 */
import * as mainIcons from '../src/generated/icons';
import * as catIcons from '../src/generated/category-icons';

const mainNames = new Set(Object.keys(mainIcons));
const catNames = new Set(Object.keys(catIcons));

const collisions: string[] = [];
for (const name of catNames) {
  if (mainNames.has(name)) {
    collisions.push(name);
  }
}

console.log(`Main icons: ${mainNames.size}`);
console.log(`Category icons: ${catNames.size}`);
console.log(`Collisions: ${collisions.length}`);

if (collisions.length > 0) {
  console.log('\nColliding names:');
  for (const name of collisions.sort()) {
    const mainVal = (mainIcons as Record<string, string>)[name];
    const catVal = (catIcons as Record<string, string>)[name];
    const identical = mainVal === catVal;
    console.log(`  ${name} — ${identical ? 'IDENTICAL' : 'DIFFERENT'}`);
  }

  const different = collisions.filter((name) => {
    const mainVal = (mainIcons as Record<string, string>)[name];
    const catVal = (catIcons as Record<string, string>)[name];
    return mainVal !== catVal;
  });

  console.log(`\nIdentical collisions: ${collisions.length - different.length}`);
  console.log(`Different collisions (need resolution): ${different.length}`);
} else {
  console.log('\nNo collisions found! Safe to use export * for both.');
}
