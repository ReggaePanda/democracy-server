import mongoose, { Schema } from 'mongoose';

import Document from './Schemas/Document';

const ProcedureSchema = new Schema(
  {
    procedureId: { type: String, index: { unique: true } },
    type: { type: String, required: true },
    period: { type: Number, required: true },
    title: { type: String, required: true },
    currentStatus: String,
    abstract: String,
    tags: [String],
    state: {
      type: String,
      required: true,
      enum: ['preparation', 'voting', 'past'],
    },
    voteDate: Date,
    submissionDate: Date,
    lastUpdateDate: Date,
    subjectGroups: [String],
    importantDocuments: [Document],
  },
  { timestamps: true },
);

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

export default mongoose.model('Procedure', ProcedureSchema);

mongoose.model('Procedure').ensureIndexes((err) => {
  if (!err) {
    console.log('SearchIndexs for Procedures created');
  } else {
    console.log({ err });
  }
});
