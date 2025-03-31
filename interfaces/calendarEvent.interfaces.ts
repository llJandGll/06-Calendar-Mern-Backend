import { Schema } from 'mongoose';

export interface ICalendarEvent {
  _id?: string
  name : string
  lastName: string
  tratament: string
  start: Date
  end: Date
  description: string
  user: Schema.Types.ObjectId | string
  bgColor: string
  treatmentCost: number
  remainingBalance?: number
  advancePayment?: number
  totalPayment: number
  status: string
  paymentDate?: Date
  
}



export interface IUser {
  _id?: string
  name: string
  email: string
  password: string
  avatar: string
  role: string
  
}




