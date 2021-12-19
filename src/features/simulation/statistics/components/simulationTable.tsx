import {
  Skeleton, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
import React from 'react';
import styled from '@emotion/styled';

import { labelMovementStrategy, labelSimulationType } from '../../../common/labels';
import { SimplifiedSimulation } from '../../types';

export const PaddedTableCell = styled(TableCell)(() => ({
  paddingLeft: '40px',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgba(135, 193, 207, 0.31)',
    paddingTop: '32px',

  },
}));

export const GreyPaddedTableCell = styled(PaddedTableCell)(() => ({
  color: 'rgba(25, 55, 62, 0.7)',
}));


function wrapTableCell(inside: any, isElementLoading: boolean){
  return  <PaddedTableCell> {isElementLoading ? <Skeleton  width={135} variant='text' /> : inside}   </PaddedTableCell>;
}

interface Props {
  data: SimplifiedSimulation[] | undefined;
  loading: boolean;
}

export function SimulationTable({ data, loading }: Props) : JSX.Element{
  return ( data ?
            <Table sx={{
              flexGrow: 1, minHeight: 0, overflow: 'scroll', minWidth: 550,
            }}
                   aria-label="simple table">
                <TableHead>
                    <TableRow >
                        <PaddedTableCell >ID</PaddedTableCell>
                        {wrapTableCell(data[0].id, loading)}
                        {data.length > 1 && wrapTableCell(data[1].id, loading)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <GreyPaddedTableCell>Name</GreyPaddedTableCell>
                        {wrapTableCell(data[0].name, loading)}
                        {data.length > 1 && wrapTableCell(data[1].name, loading)}
                    </TableRow>
                    <TableRow>
                        <GreyPaddedTableCell>Map ID</GreyPaddedTableCell>
                        {wrapTableCell(data[0].mapId, loading)}
                        {data.length > 1 && wrapTableCell(data[1].mapId, loading)}
                    </TableRow>
                    <TableRow>
                        <GreyPaddedTableCell>Type</GreyPaddedTableCell>
                        {wrapTableCell(labelSimulationType(data[0].type), loading)}
                        {data.length > 1 && wrapTableCell(labelSimulationType(data[1].type), loading)}
                    </TableRow>
                    <TableRow>
                        <GreyPaddedTableCell>Movement type</GreyPaddedTableCell>
                        {wrapTableCell(
                          labelMovementStrategy(data[0].movementSimulationStrategyType,
                          ), loading)}
                        {data.length > 1 && wrapTableCell(
                          labelMovementStrategy(data[1].movementSimulationStrategyType,
                          ), loading)}

                    </TableRow>
                    <TableRow>
                        <GreyPaddedTableCell>Turn</GreyPaddedTableCell>
                        {wrapTableCell(data[0].turn, loading)}
                        {data.length > 1 && wrapTableCell(data[1].turn, loading)}
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <GreyPaddedTableCell>State</GreyPaddedTableCell>
                        {wrapTableCell(data[0].isFinished ?
                            <DoneIcon /> : <FastForwardOutlinedIcon />, loading)}
                        {data.length > 1 && (wrapTableCell(data[1].isFinished ?
                            <DoneIcon /> : <FastForwardOutlinedIcon />, loading))}
                    </TableRow>
                </TableBody>

            </Table> : <></>);
}

export const CardTableContainer = styled(TableContainer)(({ width }: { width?: string }) => ({
  display: 'flex',
  flexDirection: 'column',
    
  // padding: '32px',
  // paddingTop: '10px',

  marginTop: '23px',
  background: '#FFFFFF',
  borderRadius: '20px',
  width: width,
  boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.06)',
}));