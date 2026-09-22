import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "ADMIN";
}

export async function GET() {
  const slides = await prisma.slide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(slides);
}

const schema = z.object({
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  subtitleEn: z.string().optional(),
  subtitleAr: z.string().optional(),
  image: z.string().min(1),
  link: z.string().optional(),
  order: z.number().default(0),
  active: z.boolean().default(true),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const slide = await prisma.slide.create({ data: parsed.data });
  return NextResponse.json(slide, { status: 201 });
}
