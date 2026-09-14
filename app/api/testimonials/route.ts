import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const testimonialSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1),
  avatar: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  featured: z.boolean().default(false),
  order: z.number().default(0)
});

export async function GET() {
  try {
    const db = await connectDB();
    if (db) {
      const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
      if (testimonials.length > 0) {
        return NextResponse.json(testimonials);
      }
    }
  } catch (err) {
    console.warn("[AI Studio] Testimonials GET fallback to memoryStore:", err);
  }
  return NextResponse.json(memoryStore.getTestimonials());
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const body = await req.json();
  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const db = await connectDB();
    if (db) {
      const testimonial = await Testimonial.create(parsed.data);
      return NextResponse.json(testimonial, { status: 201 });
    }
  } catch (err) {
    console.warn("[AI Studio] Testimonial create fallback to memoryStore:", err);
  }

  const created = memoryStore.createTestimonial(parsed.data);
  return NextResponse.json(created, { status: 201 });
}

