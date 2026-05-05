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
`;

export default typeDefs;
