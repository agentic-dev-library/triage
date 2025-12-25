// examples/example.ts
import { assess } from '../src/index';

async function main() {
  // This is a placeholder for a real issue number
  const issueNumber = 123;
  console.log(`Assessing issue #${issueNumber}`);
  await assess(issueNumber, { dryRun: true });
  console.log('Assessment complete.');
}

main();
