import { Schema, model, Document } from "mongoose";
import { ICalendarEvent } from "../interfaces/calendarEvent.interfaces.js";

// Interface for Mongoose Document with ICalendarEvent properties
interface IEventDocument extends Omit<ICalendarEvent, '_id'>, Document {}

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  tratament: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bgColor: {
    type: String,
    required: true
  },
  treatmentCost: {
    type: Number,
    required: true
  },
  remainingBalance: {
    type: Number
  },
  advancePayment: {
    type: Number
  },
  totalPayment: {
    type: Number
  },
  status: {
    type: String,
    required: true
  },
  paymentDate: {
    type: Date
  }
});

EventSchema.methods.toJSON = function() {
  const { __v, _id, ...event } = this.toObject();
  event.id = _id;
  event.user.uid = event.user._id;
  delete event.user._id;
  return event;
}

export default model<IEventDocument>('Event', EventSchema);
