import { memo } from 'react';

interface ProfileAvatarProps {
  initials: string;
  name: string;
  size?: 'md' | 'lg';
}

const SIZE_CLASS = {
  md: 'h-16 w-16 text-xl',
  lg: 'h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl',
};

export const ProfileAvatar = memo(function ProfileAvatar({
  initials,
  name,
  size = 'lg',
}: ProfileAvatarProps) {
  return (
    <div
      role="img"
      aria-label={`${name} profile avatar`}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 font-semibold text-navy-900 shadow-md ring-4 ring-white dark:ring-navy-800 ${SIZE_CLASS[size]}`}
    >
      {initials}
    </div>
  );
});

export default ProfileAvatar;
