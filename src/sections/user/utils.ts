import { UserProps } from './types';

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
  filterCurrency: string;
  filter2FA: string;
  filterVerificationStatus: string;
};

export function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterCurrency,
  filter2FA,
  filterVerificationStatus,
}: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status.toString() === filterStatus);
  }

  if (filterCurrency !== 'all') {
    inputData = inputData.filter((user) => user.currency.toString() === filterCurrency);
  }

  if (filter2FA !== 'all') {
    inputData = inputData.filter((user) => user.is_2fa.toString() === filter2FA);
  }

  if (filterVerificationStatus !== 'all') {
    inputData = inputData.filter((user) => user.verification_status === filterVerificationStatus);
  }

  return inputData;
}
