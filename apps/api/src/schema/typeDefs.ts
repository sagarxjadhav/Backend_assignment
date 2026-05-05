import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type AmountSpent {
    amount: Float!
    currencyCode: String!
  }

  type Customer {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    numberOfOrders: Int!
    amountSpent: AmountSpent!
    lastOrderDate: String
    tags: [String!]!
    createdAt: String!
  }

  input FilterInput {
    minAmountSpent: Float
    minNumberOfOrders: Int
    lastOrderWithinDays: Int
  }

  enum TagAction {
    ADD
    REMOVE
  }

  input TagOperationInput {
    criteria: FilterInput!
    tag: String!
    action: TagAction!
    dryRun: Boolean
  }

  type TagOperationResult {
    affectedCustomers: [Customer!]!
    count: Int!
    dryRun: Boolean!
    tag: String!
    action: TagAction!
  }

  type HistoryEntry {
    id: ID!
    timestamp: String!
    criteria: String!
    tag: String!
    action: TagAction!
    customerCount: Int!
  }

  type Query {
    filterCustomers(criteria: FilterInput!): [Customer!]!
    getTagHistory: [HistoryEntry!]!
  }

  type Mutation {
    applyCustomerTag(input: TagOperationInput!): TagOperationResult!
  }
`;

export default typeDefs;
