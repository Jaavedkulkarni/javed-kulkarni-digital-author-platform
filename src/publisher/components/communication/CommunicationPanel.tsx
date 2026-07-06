import type { JobComment, ProductionUpdate } from '../../types/communication.types';

interface CommunicationPanelProps {
  comments: JobComment[];
  updates: ProductionUpdate[];
  isLoading?: boolean;
}

export function CommunicationPanel({ comments, updates, isLoading }: CommunicationPanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading communication...</div>;

  const externalComments = comments.filter((c) => !c.isInternal);

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Communication with AuthorOS team only — no direct author messaging.</p>
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2">Job Comments</h4>
        {externalComments.length === 0 ? (
          <p className="text-xs text-gray-500">No comments yet.</p>
        ) : (
          externalComments.map((c) => (
            <div key={c.id} className="text-xs text-gray-300 mb-2">
              <span className="text-gray-500">{c.author}: </span>
              {c.content}
            </div>
          ))
        )}
      </div>
      <div>
        <h4 className="text-xs font-medium text-gray-400 mb-2">Production Updates</h4>
        {updates.length === 0 ? (
          <p className="text-xs text-gray-500">No updates yet.</p>
        ) : (
          updates.map((u) => (
            <div key={u.id} className="text-xs text-gray-300 mb-2">
              {u.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
