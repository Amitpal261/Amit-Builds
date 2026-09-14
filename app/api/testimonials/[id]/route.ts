import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const db = await connectDB();
    if (db) {
      const testimonial = await Testimonial.findById(params.id);
      if (testimonial) return NextResponse.json(testimonial);
    }
  } catch (err) {
    console.warn("[AI Studio] Testimonial GET id fallback to memoryStore:", err);
  }
  const mem = memoryStore.getTestimonialById(params.id);
  if (!mem) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(mem);
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  const body = await req.json();

  try {
    const db = await connectDB();
    if (db) {
      const testimonial = await Testimonial.findByIdAndUpdate(params.id, body, {
        new: true,
        runValidators: true
      });
      if (testimonial) return NextResponse.json(testimonial);
    }
  } catch (err) {
    console.warn("[AI Studio] Testimonial PUT id fallback to memoryStore:", err);
  }

  const updated = memoryStore.updateTestimonial(params.id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  try {
    const db = await connectDB();
    if (db) {
      const testimonial = await Testimonial.findByIdAndDelete(params.id);
      if (testimonial) return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.warn("[AI Studio] Testimonial DELETE fallback to memoryStore:", err);
  }

  const deleted = memoryStore.deleteTestimonial(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

