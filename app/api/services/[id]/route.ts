import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { requireAdmin } from "@/lib/auth";
import { memoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const db = await connectDB();
    if (db) {
      const service = await Service.findById(params.id);
      if (service) return NextResponse.json(service);
    }
  } catch (err) {
    console.warn("[AI Studio] Service GET id fallback to memoryStore:", err);
  }
  const mem = memoryStore.getServiceById(params.id);
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
      const service = await Service.findByIdAndUpdate(params.id, body, {
        new: true,
        runValidators: true
      });
      if (service) return NextResponse.json(service);
    }
  } catch (err) {
    console.warn("[AI Studio] Service PUT id fallback to memoryStore:", err);
  }

  const updated = memoryStore.updateService(params.id, body);
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
      const service = await Service.findByIdAndDelete(params.id);
      if (service) return NextResponse.json({ success: true });
    }
  } catch (err) {
    console.warn("[AI Studio] Service DELETE fallback to memoryStore:", err);
  }

  const deleted = memoryStore.deleteService(params.id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

