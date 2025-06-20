import type { UserProps } from './types';

export const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
} as const;

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (
  a: {
    [key in Key]: number | string;
  },
  b: {
    [key in Key]: number | string;
  }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

type ApplyFilterProps = {
  inputData: UserProps[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterCurrency?: string;
  filter2FA?: string;
  filterSumsubStatus: string;
  adminStatus: string;
};

export function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterCurrency,
  filter2FA,
  filterSumsubStatus,
  adminStatus,
}: ApplyFilterProps) {
  // Sort by created_at in descending order first
  inputData = [...inputData].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    const searchTerm = filterName.toLowerCase();
    inputData = inputData.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchTerm) ||
        user.fullname?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.phone_number?.toLowerCase().includes(searchTerm) ||
        user.referredByName?.toLowerCase().includes(searchTerm)
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status.toString() === filterStatus);
  }

  if (filterCurrency && filterCurrency !== 'all') {
    inputData = inputData.filter((user) => user.currency.toString() === filterCurrency);
  }

  if (filter2FA && filter2FA !== 'all') {
    inputData = inputData.filter((user) => user.is_2fa.toString() === filter2FA);
  }

  if (filterSumsubStatus !== 'all') {
    inputData = inputData.filter((user) => user.sumsub_status === filterSumsubStatus);
  }

  if (adminStatus !== 'all') {
    inputData = inputData.filter((user) => user.admin_status === adminStatus);
  }

  return inputData;
}
