export interface PrintSpecifications {
  trimSize: string;
  pageCount: number;
  paperType: string;
  paperGsm: number;
  bindingType: string;
  lamination: string;
  coverType: string;
  printColor: string;
}

export interface RfqRequest {
  id: string;
  rfqNumber: string;
  publisherId: string;
  bookTitle: string;
  referenceAuthorName: string;
  specifications: PrintSpecifications;
  quantity: number;
  shippingLocation: string;
  dueDate: string;
  specialInstructions: string | null;
  receivedAt: string;
  quoteDeadline: string;
}
