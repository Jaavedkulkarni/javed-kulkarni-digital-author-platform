import { APP_NAME, APP_VERSION, APP_BUILD_LABEL } from '../../lib/appMeta';

interface DashboardFooterProps {
  darkMode: boolean;
}

export function DashboardFooter({ darkMode }: DashboardFooterProps) {
  return (
    <footer
      className={`shrink-0 border-t px-4 py-4 text-center sm:px-6 ${
        darkMode ? 'border-navy-800 text-gray-500' : 'border-gray-200 text-gray-500'
      }`}
    >
      <p className="text-xs">
        {APP_NAME} v{APP_VERSION}
      </p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">{APP_BUILD_LABEL}</p>
    </footer>
  );
}

export default DashboardFooter;
