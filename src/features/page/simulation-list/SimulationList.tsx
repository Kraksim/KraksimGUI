import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  styled,
  Box,
  AlertProps, CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
import DoneIcon from '@mui/icons-material/Done';

import {
  useGetAllSimulationsQuery,
  useSimulateMutation,
} from '../../simulation/simulationApi';
import { SimulateRequest } from '../../simulation/requests';
import { labelMovementStrategy, labelSimulationType } from '../../common/labels';

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
  justifyContent: 'center',
}));

const SmallTextField = styled(TextField)(() => ({
  width: '9ch',
}));

export default function SimulationList(): JSX.Element {
  const { data } = useGetAllSimulationsQuery();
  const [simulate, result] = useSimulateMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    setOpenSnackbar(result.isError || result.isSuccess);
  }, [result]);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <TableContainer component={Paper}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={result.isSuccess ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {result.isSuccess
            ? 'Simulated successfully'
            : 'Something went wrong: ' + (result.error as any)?.data}
        </Alert>
      </Snackbar>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Map ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Movement type</TableCell>
            <TableCell>Turn</TableCell>
            <TableCell>State</TableCell>
            <TableCell />
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
              <TableCell>{labelSimulationType(row.type)}</TableCell>
              <TableCell>{labelMovementStrategy(row.movementSimulationStrategyType)}</TableCell>
              <TableCell>{row.turn}</TableCell>
              <TableCell>
                {row.isFinished ? <DoneIcon /> : <FastForwardOutlinedIcon />}
              </TableCell>
              <CenterTableCell align={'center'}>
                {
                  <SimulationActions
                    id={row.id}
                    finished={row.isFinished}
                    simulate={simulate}
                    loading={result.isLoading}
                  />
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
  id: number;
  finished: boolean;
  simulate: (request: SimulateRequest) => any;
  loading: boolean;
}

function SimulationActions({
  id,
  simulate,
  finished,
  loading,
}: SimulationActionsProps): JSX.Element {
  const history = useHistory();
  const [turns, setTurns] = useState('1');
  const [clicked, setClicked] = useState(false);

  const spinnerVisible = clicked && loading;

  useEffect(()=>{
    if (!loading && clicked) {
      setClicked(false);
    }
  }, [loading, clicked] );

  function sendSimulate() {
    setClicked(true);
    simulate({ id: id, times: parseInt(turns) });
  }

  return (
    <CenterHorizontal>
      <IconButton
        onClick={() => history.push('/statistics?simulationId=' + id)}
      >
        <QueryStatsIcon />
      </IconButton>
      <IconButton
        disabled={ finished || loading }
        onClick={ sendSimulate }
      >
        { !spinnerVisible ? <PlayCircleOutlineIcon /> : <CircularProgress /> }
      </IconButton>
      <SmallTextField
        disabled={finished}
        id="turns"
        label="Turns"
        type="number"
        variant="outlined"
        defaultValue="1"
        onChange={(e) => setTurns(e.target.value)}
      />
    </CenterHorizontal>
  );
}
