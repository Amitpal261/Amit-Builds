import { Schema, models, model } from "mongoose";

export interface ITestimonial {
  _id?: string;
  name: string;
  role: string;
  company?: string;
  message: string;
  avatar?: string;
  rating: number;
  featured: boolean;
  order: number;
  createdAt?: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    message: { type: String, required: true },
    avatar: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
