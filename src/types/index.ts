export interface ProviderContact {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  filters?: Record<string, string | string[] | undefined>;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
