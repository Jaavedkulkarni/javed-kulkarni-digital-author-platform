import type { Category } from '../../types/database';
import type { CmsSeoMetadata } from './common';

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string | null;
  parentId?: string | null;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  seo?: CmsSeoMetadata;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface CategoryListFilters {
  parentId?: string | null;
  isActive?: boolean;
  search?: string;
  rootOnly?: boolean;
}

export interface CmsCategory extends Category {
  children?: CmsCategory[];
  depth?: number;
}

export function mapCategoryRow(row: Category): CmsCategory {
  return row;
}
