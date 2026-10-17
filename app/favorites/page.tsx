import { EntriesList } from "@/components/EntriesList";

export default function FavoritesPage() {
  return <div className="page"><header className="page-header"><span className="eyebrow">Worth returning to</span><h1>Favorites</h1><p>The pages you chose to keep close.</p></header><EntriesList favoritesOnly /></div>;
}
