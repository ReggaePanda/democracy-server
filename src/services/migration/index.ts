/*
  THIS FILE AND ALL IMPORTS ARE NOT ALLOWED TO INCLUDE ANY MONGOOSE MODELS
  See index.js for more info
*/
import { migrate } from '../../migrations/scripts';

export default async () => {
  await migrate().catch(err => {
    // global.Log the original error
    global.Log.error(err.stack);
    // throw own error
    throw new Error('Migration not successful - I die now!');
  });
};
