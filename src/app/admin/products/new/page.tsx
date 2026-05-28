import Link from "next/link"
import { ProductForm } from "../../_components/ProductForm"

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Ürünler
        </Link>
        <span className="text-zinc-300">/</span>
        <h1 className="text-2xl font-bold text-zinc-900">Yeni Ürün</h1>
      </div>
      <ProductForm mode="new" />
    </div>
  )
}
