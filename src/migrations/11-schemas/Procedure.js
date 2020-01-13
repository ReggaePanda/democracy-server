import { Schema } from 'mongoose';

import procedureStates from '../../config/procedureStates';
import ProcedureDocument from '../3-schemas/Procedure/Document';

const ProcedureSchema = new Schema(
  {
    procedureId: { type: String, index: { unique: true } },
    type: { type: String, required: true },
    period: { type: Number, required: true },
    title: { type: String, required: true },
    currentStatus: String,
    currentStatusHistory: [String],
    abstract: String,
    tags: [String],
    voteDate: Date,
    voteEnd: Date,
    voteWeek: Number,
    voteYear: Number,
    sessionTOPHeading: String,
    submissionDate: Date, // Date of the first dip21 history element
    lastUpdateDate: Date, // Date of last dip21 history element for sorting in App
    bioUpdateAt: Date, // Date of last dip21 changes on bundestag.io
    subjectGroups: [String],
    importantDocuments: [ProcedureDocument],
    activities: { type: Number, default: 0 }, // cache from activity collection
    votes: { type: Number, default: 0 }, // cache from votes collection
    voteResults: {
      yes: { type: Number, required: true },
      no: { type: Number, required: true },
      abstination: { type: Number, required: true },
      notVoted: { type: Number },
      decisionText: String,
      namedVote: Boolean,
      partyVotes: [
        {
          _id: false,
          party: { type: String, required: true },
          main: { type: String, enum: ['YES', 'NO', 'ABSTINATION', 'NOTVOTED'], required: true },

          deviants: {
            yes: { type: Number, required: true },
            no: { type: Number, required: true },
            abstination: { type: Number, required: true },
            notVoted: { type: Number },
          },
        },
      ],
    },
  },
  { timestamps: true },
);

ProcedureSchema.methods = {
  isCompleted() {
    return this.voteDate || procedureStates.COMPLETED.some(s => s === this.currentStatus);
  },
};

ProcedureSchema.index(
  {
    procedureId: 'text',
    title: 'text',
    abstract: 'text',
    tags: 'text',
    subjectGroups: 'text',
  },
  {
    name: 'searchIndex',
    default_language: 'german',
    weights: {
      title: 10,
      abstract: 5,
    },
  },
);

ProcedureSchema.index({ voteDate: -1 }, { background: true });
ProcedureSchema.index({ period: -1 }, { background: true });

export default ProcedureSchema;
