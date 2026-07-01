import { ProductEditor } from './ProductEditor';
import type { Book } from '../../types/book';
import type { Product } from '../../types/productEntity';

interface BookEditorProps {
  book: Book | null;
  onCancel: () => void;
  onSaved: () => void;
}

export function BookEditor({ book, onCancel, onSaved }: BookEditorProps) {
  return (
    <ProductEditor
      product={book as unknown as Product | null}
      onCancel={onCancel}
      onSaved={onSaved}
      defaultProductTypeSlug="book"
      returnLabel="पुस्तकांकडे परत जा"
      titleNew="नवीन पुस्तक"
      titleEdit="पुस्तक संपादित करा"
    />
  );
}

export default BookEditor;
