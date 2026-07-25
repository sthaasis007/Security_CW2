import FavoritesList from "@/app/component/favorite/FavoritesList";
import TopBar from "@/app/component/dashboard/TopBar";
import Footer from "@/app/component/dashboard/Footer";

export default function FavoritesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1">
        <FavoritesList />
      </main>
      <Footer />
    </div>
  );
}
