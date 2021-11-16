import {
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, styled, Box, AlertProps,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import {
  useGetAllSimulationsQuery, useSimulateMutation,
} from '../../simulation/simulationApi';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const IconButton = styled(Button)(() => ({
  margin: '0 auto',
}));
const CenterHorizontal = styled(Box)(() => ({
  display: 'flex',
}));

const CenterTableCell = styled(TableCell)(() => ({
  display: 'flex',
}));

const SmallTextField = styled(TextField)(() => ({
  width: '7ch',
}));


export default function SimulationList() : JSX.Element {

  const { data } = useGetAllSimulationsQuery();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('Default message');
  const [snackIsSuccess, setSuccess] = useState(true);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <TableContainer component={Paper}>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackIsSuccess ? 'success' : 'error' } sx={{ width: '100%' }}>
                {snackBarMessage}
            </Alert>
        </Snackbar>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Map ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell/>
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
                <CenterTableCell>
                  { <SimulationActions
                      id={row.id}
                      setOpenSnackbar={setOpenSnackbar}
                      setSnackBarMessage={setSnackBarMessage}
                      setSuccess={setSuccess}/>
                  }
                </CenterTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

interface SimulationActionsProps {
  id: number,
  setOpenSnackbar: ((value: (((prevState: boolean) => boolean) | boolean)) => void),
  setSnackBarMessage: ((value: (((prevState: string) => string) | string)) => void),
  setSuccess:  ((value: (((prevState: boolean) => boolean) | boolean)) => void)
}

function SimulationActions({
  id, setOpenSnackbar, setSnackBarMessage, setSuccess, 
}: SimulationActionsProps) : JSX.Element {
  const history = useHistory();
  const [turns, setTurns] = useState('1');

  const [ simulate, result ] = useSimulateMutation();


  useEffect(() => {
    console.log(result);
    if (result.status != 'fulfilled') {
      return;
    }
    setOpenSnackbar(true);
    setSuccess(result.isSuccess);
    const message = result.isSuccess ? 'Simulated successfully' : 'Error!';
    setSnackBarMessage(message);
  }, [result]);


  return (
      <CenterHorizontal>
        <IconButton  onClick={() =>  history.push('/statistics?simulationId=' + id)}>
          <QueryStatsIcon/>
        </IconButton>
          <IconButton onClick={() => simulate({ id: id, times: parseInt(turns) })}>
          <PlayCircleOutlineIcon/>
        </IconButton>
        <SmallTextField id="turns" label="Turns" type="number" variant="outlined" defaultValue="1"
                   onChange={(e) => setTurns(e.target.value)}/>
      </CenterHorizontal>
  );
}