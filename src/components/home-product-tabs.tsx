"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import Carousel from "@/components/carousel";
import ProductCard, { type CardProduct } from "@/components/product-card";
import clsx from "clsx";

type Tab = { key: string; label: string; href: string; products: CardProduct[] };

export default function HomeProductTabs({
  title,
  tabs,
  viewAllLabel,
}: {
  title: string;
  tabs: Tab[];
  viewAllLabel: string;
}) {
  const available = tabs.filter((t) => t.products.length > 0);
  const [activeKey, setActiveKey] = useState(available[0]?.key);
  const active = available.find((t) => t.key === activeKey) ?? available[0];
  if (!active) return null;

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7 md:mb-9">
        <h2 className="font-display text-2xl md:text-3xl text-ink">{title}</h2>
        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto [scrollbar-width:none] -mx-4 px-4 md:mx-0 md:px-0" role="tablist">
          {available.map((tab) => {
            const isActive = tab.key === active.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveKey(tab.key)}
                className={clsx(
                  "relative shrink-0 pb-2 text-sm md:text-[15px] transition-colors duration-300",
                  isActive ? "text-ink font-medium" : "text-ink/45 hover:text-ink/80"
                )}
              >
                {tab.label}
                <span
                  className={clsx(
                    "absolute inset-x-0 bottom-0 h-[2px] bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ltr:origin-left rtl:origin-right",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            );
          })}
          <Link
            href={active.href}
            className="hidden md:inline shrink-0 pb-2 text-sm text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors ms-4"
          >
            {viewAllLabel}
          </Link>
        </div>
      </div>

      <div role="tabpanel" key={active.key}>
        <Carousel>
          {active.products.map((p, i) => (
            <div key={p.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 5) * 70}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="md:hidden mt-6 text-center">
        <Link href={active.href} className="btn-secondary">
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}
