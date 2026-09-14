import { connectDB } from "@/lib/mongodb";
import Project, { IProject } from "@/models/Project";
import Service, { IService } from "@/models/Service";
import Testimonial, { ITestimonial } from "@/models/Testimonial";
import { memoryStore } from "@/lib/store";

/** Converts Mongoose lean() docs into plain, JSON-serializable objects for RSC. */
function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export async function getProjects(opts: { featuredOnly?: boolean } = {}): Promise<IProject[]> {
  try {
    const db = await connectDB();
    if (db) {
      const query = opts.featuredOnly ? { featured: true } : {};
      const docs = await Project.find(query).sort({ order: 1, createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return serialize(docs);
      }
    }
  } catch (err) {
    console.warn("[AI Studio] getProjects falling back to in-memory data:", err);
  }
  return memoryStore.getProjects(opts);
}

export async function getProjectBySlug(slug: string): Promise<IProject | null> {
  try {
    const db = await connectDB();
    if (db) {
      const doc = await Project.findOne({ slug }).lean();
      if (doc) return serialize(doc);
    }
  } catch (err) {
    console.warn("[AI Studio] getProjectBySlug falling back to in-memory data:", err);
  }
  return memoryStore.getProjectBySlug(slug);
}

export async function getServices(): Promise<IService[]> {
  try {
    const db = await connectDB();
    if (db) {
      const docs = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return serialize(docs);
      }
    }
  } catch (err) {
    console.warn("[AI Studio] getServices falling back to in-memory data:", err);
  }
  return memoryStore.getServices();
}

export async function getTestimonials(opts: { featuredOnly?: boolean } = {}): Promise<ITestimonial[]> {
  try {
    const db = await connectDB();
    if (db) {
      const query = opts.featuredOnly ? { featured: true } : {};
      const docs = await Testimonial.find(query).sort({ order: 1, createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return serialize(docs);
      }
    }
  } catch (err) {
    console.warn("[AI Studio] getTestimonials falling back to in-memory data:", err);
  }
  return memoryStore.getTestimonials(opts);
}

