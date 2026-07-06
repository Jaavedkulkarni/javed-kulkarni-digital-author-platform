import type { ReaderLocation } from '../types/common';

export interface TextSelection {
  text: string;
  location: ReaderLocation;
  startOffset: number;
  endOffset: number;
}

export class TextSelectionEngine {
  createSelection(
    text: string,
    location: ReaderLocation,
    startOffset: number,
    endOffset: number
  ): TextSelection {
    return {
      text: text.trim(),
      location,
      startOffset,
      endOffset,
    };
  }

  isValidSelection(selection: TextSelection): boolean {
    return selection.text.length > 0 && selection.endOffset > selection.startOffset;
  }

  toHighlightInput(selection: TextSelection, userId: string, bookId: string) {
    return {
      userId,
      bookId,
      selectedText: selection.text,
      location: selection.location,
    };
  }
}

export function createTextSelectionEngine(): TextSelectionEngine {
  return new TextSelectionEngine();
}
