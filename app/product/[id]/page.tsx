import ProductDetail from "@/app/component/product/ProductDetail";
import TopBar from "@/app/component/dashboard/TopBar";
import Footer from "@/app/component/dashboard/Footer";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1">
        <ProductDetail productId={id} />
      </main>
      <Footer />
    </div>
  );
}
