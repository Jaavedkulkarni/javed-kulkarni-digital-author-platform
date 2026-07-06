export const PUBLISHER_SCOPE = 'publisher';
export const QUOTE_EDIT_BUFFER_HOURS = 24;
export const DEFAULT_LEAD_TIME_DAYS = 14;

export const PRODUCTION_STATUS_LABELS: Record<string, string> = {
  waiting_files: 'Waiting Files',
  files_received: 'Files Received',
  prepress: 'Prepress',
  proof_ready: 'Proof Ready',
  printing: 'Printing',
  binding: 'Binding',
  packing: 'Packing',
  ready_for_dispatch: 'Ready For Dispatch',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  submitted: 'Submitted',
  won: 'Won',
  lost: 'Lost',
  expired: 'Expired',
};
