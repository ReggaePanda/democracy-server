import { Schema, Document, Types } from 'mongoose';
import { IProcedure } from '../11-schemas/Procedure';
import { Device } from '../12-schemas/Device';
import { Phone } from '../3-schemas/Phone';

export interface Vote extends Document {
  procedure: IProcedure | Types.ObjectId;
  state: 'VOTING' | 'COMPLETED';
  type: 'Phone' | 'Device';
  voters: { voter: Types.ObjectId | string | Phone | Device }[];
  votes: {
    general: {
      yes: number;
      no: number;
      abstain: number;
    };
    constituencies: [
      {
        constituency: { type: string; required: true };
        yes: number;
        no: number;
        abstain: number;
        _id: false;
      },
    ];
    cache: {
      yes: number;
      no: number;
      abstain: number;
    };
  };
}

const VoteSchema = new Schema<Vote>({
  procedure: {
    type: Schema.Types.ObjectId,
    ref: 'Procedure',
    required: true,
  },
  state: { type: String, enum: ['VOTING', 'COMPLETED'], required: true },
  type: { type: String, enum: ['Phone', 'Device'], required: true },
  voters: [{ voter: { type: Schema.Types.ObjectId, refPath: 'type' }, _id: false }],
  votes: {
    general: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      abstain: { type: Number, default: 0 },
    },
    constituencies: [
      {
        constituency: { type: String, required: true },
        yes: { type: Number, default: 0 },
        no: { type: Number, default: 0 },
        abstain: { type: Number, default: 0 },
        _id: false,
      },
    ],
    cache: {
      yes: { type: Number, default: 0 },
      no: { type: Number, default: 0 },
      abstain: { type: Number, default: 0 },
    },
  },
});

VoteSchema.index({ procedure: 1, state: 1, type: 1 }, { unique: true });
VoteSchema.index({ procedure: 1, type: 1, 'voters.voter': 1 }, { unique: true });
VoteSchema.index({ _id: 1, 'votes.constituencies.constituency': 1 }, { unique: true });

export default VoteSchema;