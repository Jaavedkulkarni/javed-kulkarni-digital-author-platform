import { useMemo } from 'react';
import { useCmsServices } from './useCmsServices';

export function useBookService() {
  const services = useCmsServices();
  return useMemo(() => services.books, [services]);
}

export function useAuthorService() {
  const services = useCmsServices();
  return useMemo(() => services.authors, [services]);
}

export function usePublisherService() {
  const services = useCmsServices();
  return useMemo(() => services.publishers, [services]);
}

export function useCategoryService() {
  const services = useCmsServices();
  return useMemo(() => services.categories, [services]);
}

export function useSeriesService() {
  const services = useCmsServices();
  return useMemo(() => services.series, [services]);
}

export function useChapterService() {
  const services = useCmsServices();
  return useMemo(() => services.chapters, [services]);
}
