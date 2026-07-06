import { useReader } from '../../context/ReaderContext';

export function useReaderUserId(): string | null {
  const { user, isReaderAuthenticated } = useReader();
  if (!isReaderAuthenticated || !user) return null;
  return user.id;
}
