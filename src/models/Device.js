import mongoose from 'mongoose';
import DeviceSchema from '../migrations/12-schemas/Device';

export default mongoose.model('Device', DeviceSchema);
