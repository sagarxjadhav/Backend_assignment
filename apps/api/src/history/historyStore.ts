import { randomUUID } from 'crypto';
import { HistoryEntry } from '../types';

const store: HistoryEntry[] = [];

export function addHistoryEntry(
  entry: Omit<HistoryEntry, 'id' | 'timestamp'>
): HistoryEntry {
  const record: HistoryEntry = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  store.push(record);
  return record;
}

export function getHistory(): HistoryEntry[] {
  return [...store].reverse();
}
