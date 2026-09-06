import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startingPrice: z.string().min(1),
  deliveryTime: z.string().min(1),
  features: z.array(z.string()).default([]),
  icon: z.string().default("✦"),
  featured: z.boolean().default(false),
  order: z.number().default(0)
});

export async function GET() {
  await connectDB();
  const services = await Service.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  await connectDB();
  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const service = await Service.create(parsed.data);
  return NextResponse.json(service, { status: 201 });
}
