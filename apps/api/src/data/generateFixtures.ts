import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

const TAGS_POOL = ['vip', 'loyal', 'new', 'wholesale', 'returning', 'at-risk'];

function randomTags(): string[] {
  const count = faker.number.int({ min: 0, max: 3 });
  return faker.helpers.arrayElements(TAGS_POOL, count);
}

function generateCustomer(index: number) {
  // Some customers have no orders to cover edge cases
  const hasOrders = index % 8 !== 0;
  const numberOfOrders = hasOrders ? faker.number.int({ min: 1, max: 40 }) : 0;

  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    numberOfOrders,
    amountSpent: {
      amount: hasOrders
        ? parseFloat(faker.commerce.price({ min: 10, max: 5000 }))
        : 0,
      currencyCode: 'USD',
    },
    // null for customers with no orders
    lastOrderDate: hasOrders
      ? faker.date.recent({ days: 180 }).toISOString()
      : null,
    tags: randomTags(),
    createdAt: faker.date.past({ years: 3 }).toISOString(),
  };
}

const customers = Array.from({ length: 55 }, (_, i) => generateCustomer(i));

const outputPath = path.resolve(__dirname, '../../../../fixtures/customers.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(customers, null, 2));

console.log(`Generated ${customers.length} customers → ${outputPath}`);
