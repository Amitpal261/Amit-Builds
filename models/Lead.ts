import { Schema, models, model } from "mongoose";

export interface ILead {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt?: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    budget: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" }
  },
  { timestamps: true }
);

export default models.Lead || model<ILead>("Lead", LeadSchema);
