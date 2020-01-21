import { unionBy } from 'lodash';

// GraphQL
import createClient from '../graphql/client';
import getNamedPollUpdates from '../graphql/queries/getNamedPollUpdates';
import DeputyModel from '../models/Deputy';
import { getCron, setCronStart, setCronSuccess, setCronError } from '../services/cronJobs/tools';

export const CRON_NAME = 'NamedPolls';

export default async () => {
  // New SuccessStartDate
  const startDate = new Date();
  const cron = await getCron({ name: CRON_NAME });
  if (cron.running) {
    Log.error(`[Cronjob][${CRON_NAME}] running still - skipping`);
    return;
  }
  await setCronStart({ name: CRON_NAME, startDate });
  // Last SuccessStartDate
  const since = new Date(cron.lastSuccessStartDate);

  // Query Bundestag.io
  try {
    const client = createClient();
    const limit = 50;
    let offset = 0;
    const associated = true;
    let done = false;
    while (!done) {
      // Data storage
      const updates = {};

      // fetch
      const {
        data: {
          namedPollUpdates: { namedPolls },
        },
      } =
        // eslint-disable-next-line no-await-in-loop
        await client.query({
          query: getNamedPollUpdates,
          variables: { since, limit, offset, associated },
        });

      // handle results
      namedPolls.map(data => {
        // procedureId is not necessarily present
        if (data.procedureId) {
          // parse every deputies vote
          data.votes.deputies.map(async voteData => {
            let decision;
            switch (voteData.vote) {
              case 'ja':
                decision = data.votes.inverseVoteDirection ? 'NO' : 'YES';
                break;
              case 'nein':
                decision = data.votes.inverseVoteDirection ? 'YES' : 'NO';
                break;
              case 'na':
                decision = 'NOTVOTED';
                break;
              case 'enthalten':
                decision = 'ABSTINATION';
                break;
              default:
                decision = null;
            }
            // Validate decision Data
            if (!decision) {
              Log.error(`NamedPoll import vote missmatch on deputy vote string: ${voteData.vote}`);
              return null;
            }
            // Prepare update
            if (voteData.webId) {
              updates[voteData.webId] = updates[voteData.webId]
                ? [...updates[voteData.webId], { procedureId: data.procedureId, decision }]
                : [{ procedureId: data.procedureId, decision }];
            }
            return null;
          });
        }
        return null;
      });

      // Insert Data
      Object.keys(updates).map(async deputyWebId => {
        // TODO try to update deputy without fetching. z.B. with aggregation setUnion
        const deputy = await DeputyModel.findOne({ webId: deputyWebId });
        if (deputy) {
          // remove duplicates
          const votes = unionBy(updates[deputyWebId], deputy.votes, 'procedureId');
          // Insert
          await DeputyModel.updateOne({ webId: deputyWebId }, { $set: { votes } });
        }
      });

      // continue?
      if (namedPolls.length < limit) {
        done = true;
      }
      offset += limit;
    }
    // Update Cron - Success
    await setCronSuccess({ name: CRON_NAME, successStartDate: startDate });
  } catch (error) {
    // If address is not reachable the query will throw
    await setCronError({ name: CRON_NAME, error: JSON.stringify(error) });
  }
};
