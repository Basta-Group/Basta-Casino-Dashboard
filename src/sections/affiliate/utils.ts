import type { AffiliateProps } from './view/AdminAffiliateView';

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  // Special handling for createdAt field
  if (orderBy === 'createdAt') {
    const dateA = new Date(a[orderBy] as string).getTime();
    const dateB = new Date(b[orderBy] as string).getTime();
    return dateB - dateA; // Newest dates will be at the top
  }

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
  inputData: AffiliateProps[];
  filterName: string;
  filterStatus: string;
  filterMarketingOptIn?: string;
  filterPromotionMethod?: string;
  comparator: (a: any, b: any) => number;
};

export function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterMarketingOptIn,
  filterPromotionMethod
}: ApplyFilterProps) {
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
        user.firstname?.toLowerCase().includes(searchTerm) ||
        user.lastname?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.phonenumber?.toLowerCase().includes(searchTerm) ||
        user.referralCode?.toLowerCase().includes(searchTerm)
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status?.toString() === filterStatus);
  }



  if (filterMarketingOptIn && filterMarketingOptIn !== 'all') {
    inputData = inputData.filter(
      (user) => user.marketingEmailsOptIn.toString() === filterMarketingOptIn
    );
  }

  if (filterPromotionMethod && filterPromotionMethod !== 'all') {
    inputData = inputData.filter((user) => 
      user.promotionMethod.includes(filterPromotionMethod)
    );
  }

  return inputData;
}
