import { useState, useCallback } from 'react';
import { Order } from 'src/components/table';

interface UseTableProps {
  defaultOrderBy?: string;
  defaultOrder?: Order;
  defaultRowsPerPage?: number;
}

export function useTable(props?: UseTableProps) {
  const {
    defaultOrderBy = 'name',
    defaultOrder = 'asc',
    defaultRowsPerPage = 10,
  } = props || {};

  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selected, setSelected] = useState<string[]>([]);

  const onSort = useCallback((id: string) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id === '') {
      setOrder('asc');
      setOrderBy('name');
    } else {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  }, [order, orderBy]);

  const onSelectRow = useCallback((id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }, [selected]);

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const onChangeDense = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onResetSelected = useCallback(() => {
    setSelected([]);
  }, []);

  return {
    dense,
    order,
    page,
    orderBy,
    rowsPerPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
    onChangeDense,
    onResetPage,
    onResetSelected,
  };
} 