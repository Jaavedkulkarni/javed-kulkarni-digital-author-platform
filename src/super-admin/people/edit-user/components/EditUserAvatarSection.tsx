import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { validateAvatarFile, versionedAvatarUrl } from '../../../../enterprise/avatars/avatar.types';
import {
  EDIT_USER_ERROR_CLASS,
  EDIT_USER_LABEL_CLASS,
} from '../edit-user.constants';

interface EditUserAvatarSectionProps {
  userId: string;
  avatarUrl: string | null;
  avatarVersion: number | null;
  avatarFile: File | null;
  removeAvatar: boolean;
  disabled?: boolean;
  onAvatarFileChange: (file: File | null) => void;
  onRemoveAvatar: (remove: boolean) => void;
  error?: string;
}

export const EditUserAvatarSection = memo(function EditUserAvatarSection({
  userId,
  avatarUrl,
  avatarVersion,
  avatarFile,
  removeAvatar,
  disabled = false,
  onAvatarFileChange,
  onRemoveAvatar,
  error,
}: EditUserAvatarSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | undefined>();
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!avatarFile) {
      setObjectUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(avatarFile);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const previewUrl = (() => {
    if (removeAvatar) return null;
    if (objectUrl) return objectUrl;
    if (avatarUrl) {
      const version = avatarVersion ?? 0;
      if (version > 0) return versionedAvatarUrl(avatarUrl, version);
      return avatarUrl;
    }
    return null;
  })();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      setLocalError(undefined);
      if (!file) {
        onAvatarFileChange(null);
        return;
      }
      try {
        validateAvatarFile(file);
        onAvatarFileChange(file);
        onRemoveAvatar(false);
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : 'Invalid avatar file');
        onAvatarFileChange(null);
      }
      event.target.value = '';
    },
    [onAvatarFileChange, onRemoveAvatar],
  );

  const handleDelete = useCallback(() => {
    onAvatarFileChange(null);
    onRemoveAvatar(true);
    setLocalError(undefined);
  }, [onAvatarFileChange, onRemoveAvatar]);

  const displayError = error ?? localError;

  return (
    <div className="space-y-3">
      <span className={EDIT_USER_LABEL_CLASS}>Avatar</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-navy-600 bg-navy-900/60">
          {previewUrl ? (
            <img src={previewUrl} alt="User avatar preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-8 w-8 text-gray-500" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={disabled}
            onChange={handleFileChange}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-navy-600 bg-navy-900/60 px-3 text-xs font-medium text-gray-200 transition-colors hover:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {avatarUrl || avatarFile ? 'Replace' : 'Upload'}
            </button>
            {(avatarUrl || avatarFile) && !removeAvatar ? (
              <button
                type="button"
                disabled={disabled}
                onClick={handleDelete}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/30 px-3 text-xs font-medium text-red-300 transition-colors hover:bg-red-950/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            ) : null}
          </div>
          <p className="text-xs text-gray-500">JPG, PNG, or WEBP up to 5 MB.</p>
          {removeAvatar ? (
            <p className="text-xs text-amber-400">Avatar will be removed when you save.</p>
          ) : null}
        </div>
      </div>
      {displayError ? <p className={EDIT_USER_ERROR_CLASS}>{displayError}</p> : null}
      <span className="sr-only">User id for avatar: {userId}</span>
    </div>
  );
});

export default EditUserAvatarSection;
