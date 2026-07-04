import { WishlistPageHeader } from './WishlistPageHeader';
import { WishlistToolbar } from './WishlistToolbar';
import { WishlistStatistics } from './WishlistStatistics';
import { WishlistGrid } from './WishlistGrid';

export function MyWishlistContent() {
  const books: never[] = [];

  return (
    <div className="space-y-6">
      <WishlistPageHeader />
      <WishlistToolbar />
      <WishlistStatistics />
      <WishlistGrid books={books} />
    </div>
  );
}

export default MyWishlistContent;
