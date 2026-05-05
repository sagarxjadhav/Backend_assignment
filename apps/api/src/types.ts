export interface AmountSpent {
  amount: number;
  currencyCode: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  numberOfOrders: number;
  amountSpent: AmountSpent;
  lastOrderDate: string | null;
  tags: string[];
  createdAt: string;
}

export interface FilterInput {
  minAmountSpent?: number | null;
  minNumberOfOrders?: number | null;
  lastOrderWithinDays?: number | null;
}

export enum TagAction {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export interface TagOperationInput {
  criteria: FilterInput;
  tag: string;
  action: TagAction;
  dryRun?: boolean | null;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  criteria: string;
  tag: string;
  action: TagAction;
  customerCount: number;
}
