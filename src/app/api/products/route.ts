import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
  descriptionEn: z.string().min(2),
  descriptionAr: z.string().min(2),
  price: z.number().positive(),
  discountPercent: z.number().min(0).max(100).default(0),
  discountActive: z.boolean().default(false),
  stock: z.number().int().min(0).default(0),
  images: z.array(z.string()).default([]),
  categoryId: z.string().optional().nullable(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]).default("UNISEX"),
  featured: z.boolean().default(false),
});

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") return false;
  return true;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const onSale = searchParams.get("onSale");
  const gender = searchParams.get("gender");
  const search = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { featured: true } : {}),
      ...(onSale ? { discountActive: true } : {}),
      ...(gender ? { gender: gender.toUpperCase() as "MEN" | "WOMEN" | "UNISEX" } : {}),
      ...(search
        ? {
            OR: [
              { nameEn: { contains: search, mode: "insensitive" } },
              { nameAr: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  let slug = slugify(data.nameEn);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const product = await prisma.product.create({
    data: { ...data, slug },
  });

  return NextResponse.json(product, { status: 201 });
}
