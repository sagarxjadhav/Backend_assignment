import fs from 'fs';
import path from 'path';
import { Customer } from '../types';

const FIXTURE_PATH = path.resolve(__dirname, '../../../../fixtures/customers.json');

export function loadCustomers(): Customer[] {
  const raw = fs.readFileSync(FIXTURE_PATH, 'utf-8');
  return JSON.parse(raw) as Customer[];
}
