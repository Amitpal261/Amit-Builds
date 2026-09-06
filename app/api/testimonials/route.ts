import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

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
  await connectDB();
  const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  await connectDB();
  const body = await req.json();
  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const testimonial = await Testimonial.create(parsed.data);
  return NextResponse.json(testimonial, { status: 201 });
}
