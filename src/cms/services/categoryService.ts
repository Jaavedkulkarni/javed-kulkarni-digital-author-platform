import type { TablesInsert, TablesUpdate } from '../../types/database';
import type { CmsCategoryRepository } from '../repositories/categoryRepository';
import type { CategoryListFilters, CmsCategory, CreateCategoryInput, UpdateCategoryInput } from '../types/category.types';
import { mapCategoryRow as mapCategory } from '../types/category.types';
import { validateCategoryHierarchy, validateCreateCategory, validateUpdateCategory } from '../validators/categoryValidator';
import { ensureUniqueSlug, slugifyText } from '../utils';

export class CategoryService {
  constructor(private readonly repo: CmsCategoryRepository) {}

  async getById(id: string): Promise<CmsCategory | null> {
    const row = await this.repo.findById(id);
    return row ? mapCategory(row) : null;
  }

  async list(filters: CategoryListFilters = {}) {
    return (await this.repo.findByFilters(filters)).map(mapCategory);
  }

  async getTree(): Promise<CmsCategory[]> {
    const roots = await this.repo.findByFilters({ rootOnly: true, isActive: true });
    return Promise.all(
      roots.map(async (root) => ({
        ...mapCategory(root),
        children: (await this.repo.findChildren(root.id)).map(mapCategory),
        depth: 0,
      }))
    );
  }

  async create(input: CreateCategoryInput): Promise<{ category?: CmsCategory; errors?: string[] }> {
    const validation = validateCreateCategory(input);
    if (!validation.valid) return { errors: validation.errors };

    const slugs = await this.repo.getAllSlugs();
    const slug = input.slug ? slugifyText(input.slug) : ensureUniqueSlug(input.name, slugs);

    const payload: TablesInsert<'categories'> = {
      name: input.name.trim(),
      slug,
      description: input.seo?.metaDescription ?? input.description ?? null,
      parent_id: input.parentId ?? null,
      icon: input.icon ?? null,
      color: input.color ?? null,
      sort_order: input.sortOrder ?? 0,
      is_active: input.isActive ?? true,
    };

    const row = await this.repo.insertCategory(payload);
    return { category: mapCategory(row) };
  }

  async update(id: string, input: UpdateCategoryInput): Promise<{ category?: CmsCategory; errors?: string[] }> {
    const hierarchy = validateCategoryHierarchy(input.parentId, id);
    const validation = validateUpdateCategory(input);
    if (!hierarchy.valid || !validation.valid) {
      return { errors: [...hierarchy.errors, ...validation.errors] };
    }

    const payload: TablesUpdate<'categories'> = {};
    if (input.name !== undefined) payload.name = input.name.trim();
    if (input.slug !== undefined) payload.slug = slugifyText(input.slug);
    if (input.description !== undefined) payload.description = input.description;
    if (input.parentId !== undefined) payload.parent_id = input.parentId;
    if (input.icon !== undefined) payload.icon = input.icon;
    if (input.color !== undefined) payload.color = input.color;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;
    if (input.isActive !== undefined) payload.is_active = input.isActive;
    if (input.seo?.metaDescription) payload.description = input.seo.metaDescription;

    const row = await this.repo.patchCategory(id, payload);
    return { category: mapCategory(row) };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

export function createCategoryService(repo: CmsCategoryRepository): CategoryService {
  return new CategoryService(repo);
}
