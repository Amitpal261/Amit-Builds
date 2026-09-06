import mongoose, { Schema, models, model } from "mongoose";

export interface IProject {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  gallery: string[];
  description: string;
  problem?: string;
  solution?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true },
    gallery: { type: [String], default: [] },
    description: { type: String, required: true },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default models.Project || model<IProject>("Project", ProjectSchema);
