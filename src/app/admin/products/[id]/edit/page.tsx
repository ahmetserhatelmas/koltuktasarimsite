import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "../../../_components/ProductForm"

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (!product) notFound()

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
        <h1 className="text-2xl font-bold text-zinc-900 line-clamp-1">
          {product.name}
        </h1>
      </div>
      <ProductForm mode="edit" initial={product} />
    </div>
  )
}
