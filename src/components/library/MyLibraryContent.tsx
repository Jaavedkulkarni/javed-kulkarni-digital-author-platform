import { LibraryPageHeader } from './LibraryPageHeader';
import { LibraryToolbar } from './LibraryToolbar';
import { LibraryStatistics } from './LibraryStatistics';
import { LibraryGrid } from './LibraryGrid';

export function MyLibraryContent() {
  const books: never[] = [];

  return (
    <div className="space-y-6">
      <LibraryPageHeader />
      <LibraryToolbar />
      <LibraryStatistics />
      <LibraryGrid books={books} />
    </div>
  );
}

export default MyLibraryContent;
