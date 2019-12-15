export default `

  enum VoteSelection {
    YES
    NO
    ABSTINATION
    NOTVOTED
  }

  type CommunityConstituencyVotes {
    constituency: String!
    yes: Int!
    no: Int!
    abstination: Int!
    total: Int
  }

  type CommunityVotes {
    yes: Int
    no: Int
    abstination: Int
    total: Int
    constituencies: [CommunityConstituencyVotes]
  }

  type DeputyVote {
    deputy: Deputy!
    decision: VoteSelection
  }

  type VoteResult {
    yes: Int
    no: Int
    abstination: Int
    notVoted: Int
    notVote: Int @deprecated
    governmentDecision: VoteSelection
    decisionText: String
    namedVote: Boolean
    partyVotes: [PartyVote!]!
    deputyVotes(constituencies: [String!], directCandidate: Boolean): [DeputyVote!]!
  }

  type PartyVote {
    party: String!
    main: VoteSelection
    deviants: Deviants!
  }

  type Deviants {
    yes: Int
    abstination: Int
    no: Int
    notVoted: Int
  }

  type Vote {
    _id: ID!
    voted: Boolean
    voteResults: CommunityVotes
  }

  type VoteStatistic {
    proceduresCount: Int
    votedProcedures: Int
  }
  
  type Mutation {
    vote(procedure: ID!, selection: VoteSelection!, constituency: String): Vote
  }
  

  type Query {
    votes(procedure: ID!, constituencies: [String!]): Vote
    communityVotes(procedure: ID!, constituencies: [String!]): CommunityVotes
    voteStatistic: VoteStatistic
  }
  `;
/*
export default `

  enum VoteSelection {
    YES
    NO
    ABSTINATION
    NOTVOTED
  }

  type CummunityVoteCounts {
    yes: Int
    abstain: Int
    no: Int
  }

  type VoteCounts {
    yes: Int!
    abstain: Int!
    no: Int!
    notVoted: Int!
  }

  type DeputyVote {
    deputy: Deputy
    decision: VoteSelection
  }

  type PartyVote {
    party: String!
    decision: VoteSelection
    votes: VoteCounts
  }

  type GovernmentVote {
    namedVote: Boolean
    voteDate: Date
    decision: VoteSelection
    votes: VoteCounts
  }

  type CommunityConstituencyVotes {
    constituency: String!
    votes: CummunityVoteCounts
  }

  type CommunityVote {
    votes: CummunityVoteCounts
    constituencies: [CommunityConstituencyVote]
  }

  type VoteResult {
    procedureId: String
    userVoted: Boolean
    communityVote: VommunityVote
    governmentVote: GovernmentVote
    partyVotes: [PartyVote!]!
    deputyVotes(directCandidate: Boolean): [DeputyVote!]!
    decisionText: String
  }

  type VoteStatistic {
    proceduresCount: Int
    votedProcedures: Int
  }
  
  type Mutation {
    vote(procedure: ID!, selection: VoteSelection!, constituency: String): VoteResult
  }

  type Query {
    voteResult(procedure: String!, constituencies: [String!]): VoteResult
    voteStatistic: VoteStatistic
  }
  `;
*/
