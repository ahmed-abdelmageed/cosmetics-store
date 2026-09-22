import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";
import DeleteProductButton from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> New Product
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Price</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-neutral-50">
                <td className="p-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-50">
                    {p.images[0] && <Image src={p.images[0]} alt={p.nameEn} fill className="object-cover" />}
                  </div>
                </td>
                <td className="p-3 font-medium">{p.nameEn}</td>
                <td className="p-3">{p.category?.nameEn || "-"}</td>
                <td className="p-3">{p.gender}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">
                  {p.discountActive && p.discountPercent > 0 ? `${p.discountPercent}%` : "-"}
                </td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-3">
                  <Link href={`/admin/products/${p.id}`} className="text-amber-600 font-medium">
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-6 text-center text-gray-500">No products yet.</p>
        )}
      </div>
    </div>
  );
}
