import { faker } from '@faker-js/faker';
import * as fs from 'fs';

const types = ['Bug', 'Question', 'Enhancement'];
const severities = ['Critical', 'Important', 'Normal', 'Minor', 'Wishlist'];
const priorities = ['High', 'Normal', 'Low'];

const issues = Array.from({ length: 20 }, () => ({
    subject: faker.hacker.verb() + ' ' + faker.hacker.noun(),  description: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(types),
    severity: faker.helpers.arrayElement(severities),
    priority: faker.helpers.arrayElement(priorities),
}));

fs.writeFileSync('./data/issues.json', JSON.stringify(issues, null, 2));
console.log('✅ 20 issues générées dans data/issues.json');