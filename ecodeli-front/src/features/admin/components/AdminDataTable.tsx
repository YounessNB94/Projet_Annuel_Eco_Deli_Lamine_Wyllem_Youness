import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { TableCellProps } from '@mui/material/TableCell';

export interface AdminTableColumn<T> {
  key: string;
  label: string;
  align?: TableCellProps['align'];
  width?: string | number;
  hideOnMobile?: boolean;
  render?: (row: T) => ReactNode;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  emptyLabel?: string;
}

export const AdminDataTable = <T,>({ columns, rows, getRowKey, emptyLabel = 'Aucune donnée disponible' }: AdminDataTableProps<T>) => (
  <TableContainer
    component={Paper}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
      overflow: 'hidden',
    }}
  >
    <Table size="medium">
      <TableHead>
        <TableRow sx={{ bgcolor: (theme) => theme.palette.grey[50] }}>
          {columns.map((column) => (
            <TableCell
              key={column.key}
              align={column.align}
              sx={{
                width: column.width,
                fontWeight: 600,
                fontSize: 13,
                textTransform: 'uppercase',
                color: 'text.secondary',
                letterSpacing: 0.5,
                display: column.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : undefined,
              }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                {emptyLabel}
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={getRowKey(row)} hover sx={{ '&:last-of-type td': { borderBottom: 'none' } }}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  sx={{
                    width: column.width,
                    display: column.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : undefined,
                    verticalAlign: 'middle',
                  }}
                >
                  {column.render ? column.render(row) : (row as Record<string, ReactNode>)[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);
