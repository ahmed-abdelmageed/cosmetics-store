import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "ADMIN";
}

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { nameEn: "asc" } });
  return NextResponse.json(categories);
}

const schema = z.object({ nameEn: z.string().min(2), nameAr: z.string().min(2) });

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  let slug = slugify(parsed.data.nameEn);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const category = await prisma.category.create({
    data: { nameEn: parsed.data.nameEn, nameAr: parsed.data.nameAr, slug },
  });
  return NextResponse.json(category, { status: 201 });
}
