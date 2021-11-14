import {
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, 
} from '@mui/material';
import React from 'react';

import { useGetAllSimulationsQuery } from '../../simulation/simulationApi';

export default function SimulationList() : JSX.Element {

  const { data } = useGetAllSimulationsQuery();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Map ID</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.mapId}</TableCell>
              <TableCell>{row.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}