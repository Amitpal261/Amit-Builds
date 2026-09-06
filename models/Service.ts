import { Schema, models, model } from "mongoose";

export interface IService {
  _id?: string;
  title: string;
  description: string;
  startingPrice: string;
  deliveryTime: string;
  features: string[];
  icon: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startingPrice: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    features: { type: [String], default: [] },
    icon: { type: String, default: "✦" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default models.Service || model<IService>("Service", ServiceSchema);
