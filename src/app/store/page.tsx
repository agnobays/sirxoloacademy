"use client";

import { useState } from "react";
import { ShoppingBag, CheckCircle2, Truck, Download, Star } from "lucide-react";
import { WORKBOOK_PRODUCTS } from "@/data/curriculumData";
import { ProductItem } from "@/types/curriculum";

export default function StorePage() {
  const [filter, setFilter] = useState<string>("all");
  const [cart, setCart] = useState<string[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredProducts = WORKBOOK_PRODUCTS.filter((item) => {
    if (filter === "all") return true;
    if (filter === "workbook") return item.type === "workbook";
    if (filter === "storybook") return item.type === "storybook";
    if (filter === "bundle") return item.type === "physical_kit";
    return true;
  });

  const addToCart = (productId: string) => {
    setCart((prev) => [...prev, productId]);
  };

  const cartTotal = cart.reduce((sum, id) => {
    const item = WORKBOOK_PRODUCTS.find((p) => p.id === id);
    return sum + (item ? item.priceZAR : 0);
  }, 0);

  const handleCheckout = () => {
    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => setOrderPlaced(false), 6000);
  };

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Standalone Resources & Books</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Workbooks & Storybooks Shop
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Purchase physical printed books or instant printable PDFs. No monthly subscription required!
          </p>
        </div>

        {/* Cart summary badge */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Items in Cart: {cart.length}</span>
            <span className="text-lg font-black text-slate-900">Total: R{cartTotal}</span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={handleCheckout}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-sm"
            >
              Checkout Now
            </button>
          )}
        </div>
      </div>

      {orderPlaced && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>
            Order placed successfully! Delivery tracking and printable PDF downloads have been sent to your email.
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: "all", label: "All Items" },
          { id: "workbook", label: "Workbooks" },
          { id: "storybook", label: "Storybooks" },
          { id: "bundle", label: "Complete Bundles" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-amber-100 to-indigo-100 flex items-center justify-center text-5xl mb-4 shadow-inner">
                {prod.type === "storybook" ? "📚" : prod.type === "physical_kit" ? "🎁" : "📝"}
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {prod.format}
                </span>
                {prod.isFeatured && (
                  <span className="text-[11px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Bestseller
                  </span>
                )}
              </div>

              <h2 className="text-lg font-black text-slate-900 leading-snug">
                {prod.title}
              </h2>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                {prod.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900">
                  R{prod.priceZAR}
                </span>
                <span className="text-[11px] text-slate-400 block">ZAR (Incl. VAT)</span>
              </div>

              <button
                onClick={() => addToCart(prod.id)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs transition-colors cursor-pointer shadow-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
