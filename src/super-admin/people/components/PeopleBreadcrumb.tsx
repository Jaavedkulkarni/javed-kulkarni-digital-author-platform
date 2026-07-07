import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { PEOPLE_BREADCRUMB } from '../constants/people.constants';

export const PeopleBreadcrumb = memo(function PeopleBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li className="text-gray-500">{PEOPLE_BREADCRUMB.root}</li>
        <li aria-hidden="true">
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </li>
        <li className="font-medium text-white" aria-current="page">
          {PEOPLE_BREADCRUMB.current}
        </li>
      </ol>
    </nav>
  );
});

export default PeopleBreadcrumb;
