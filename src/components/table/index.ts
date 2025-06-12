export type Order = 'asc' | 'desc';

export interface TableProps {
  order?: Order;
  orderBy?: string;
  onSort?: (id: string) => void;
  onSelectAllRows?: (checked: boolean) => void;
  selected?: string[];
  rowsPerPage?: number;
  page?: number;
  onChangePage?: (event: unknown, newPage: number) => void;
  onChangeRowsPerPage?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} 