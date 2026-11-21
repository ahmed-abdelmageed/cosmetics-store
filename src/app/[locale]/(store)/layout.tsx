import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
