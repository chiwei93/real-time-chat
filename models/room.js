import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  roomName: {
    type: String,
    required: [true, 'Must provide a room name.'],
  },
  createdAt: {
    type: Date,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
