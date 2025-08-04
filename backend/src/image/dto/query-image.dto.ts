export class QueryImageDto {
  page?: number;
  limit?: number;
  filter?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}
