import { connectDB } from "@/lib/mongodb";
import Project, { IProject } from "@/models/Project";
import Service, { IService } from "@/models/Service";
import Testimonial, { ITestimonial } from "@/models/Testimonial";

/** Converts Mongoose lean() docs into plain, JSON-serializable objects for RSC. */
function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export async function getProjects(opts: { featuredOnly?: boolean } = {}): Promise<IProject[]> {
  try {
    await connectDB();
    const query = opts.featuredOnly ? { featured: true } : {};
    const docs = await Project.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<IProject | null> {
  try {
    await connectDB();
    const doc = await Project.findOne({ slug }).lean();
    return doc ? serialize(doc) : null;
  } catch {
    return null;
  }
}

export async function getServices(): Promise<IService[]> {
  try {
    await connectDB();
    const docs = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getTestimonials(opts: { featuredOnly?: boolean } = {}): Promise<ITestimonial[]> {
  try {
    await connectDB();
    const query = opts.featuredOnly ? { featured: true } : {};
    const docs = await Testimonial.find(query).sort({ order: 1, createdAt: -1 }).lean();
    return serialize(docs);
  } catch {
    return [];
  }
}
