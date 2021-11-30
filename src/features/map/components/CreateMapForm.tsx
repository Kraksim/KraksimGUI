import {
  Alert, Box, Button, debounce, Snackbar, styled,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';

import { CreateMapRequest } from '../requests';
import { useCreateMapMutation, useValidateMapMutation } from '../mapApi';
import MapVisualizer from '../MapVisualizer';

const ActionButton = styled(Button)(() => ({
  padding: '10px',
  margin: '10px',
}));

const initialSkeleton: CreateMapRequest = {
  'name': 'Example name',
  'description': 'Example description describing your awesome map',
  'type': 'MAP',
  'compatibleWith': [
    'NAGEL_SCHRECKENBERG',
    'MULTI_LANE_NAGEL_SCHRECKENBERG',
  ],
  'roadNodes': [
    {
      'type': 'GATEWAY',
      'name': 'A',
      'position': {
        'x': 0,
        'y': 0,
      },
      'endingRoadsIds': [],
      'startingRoadsIds': [1],
    },
    {
      'type': 'INTERSECTION',
      'name': 'B',
      'position': {
        'x': 60,
        'y': 40,
      },
      'endingRoadsIds': [1],
      'startingRoadsIds': [2],
      'overrideTurnDirectionsTurnEverywhere': true,
    },
    {
      'type': 'GATEWAY',
      'name': 'C',
      'position': {

        'x': 0,
        'y': 80,
      },
      'endingRoadsIds': [2],
      'startingRoadsIds': [],
    },
  ],
  'roads': [
    {
      'length': 60,
      'name': 'A->B',
      'lanes': [
        {
          'startingPoint': 0,
          'endingPoint': 60,
          'indexFromLeft': 0,
          'id': 0,
        },
        {
          'startingPoint': 0,
          'endingPoint': 60,
          'indexFromLeft': 1,
          'id': 1,
        },
      ],
      'id': 1,
    },
    {
      'length': 60,
      'name': 'B->C',
      'lanes': [
        {
          'startingPoint': 0,
          'endingPoint': 60,
          'indexFromLeft': 0,
          'id': 2,
        },
        {
          'startingPoint': 0,
          'endingPoint': 60,
          'indexFromLeft': 1,
          'id': 3,
        },
      ],
      'id': 2,
    },
  ],
};

const formattedInitialText = JSON.stringify(initialSkeleton, null, 2);

const PaddedEditor = styled(Editor)(() => ({
  margin: '20px',
}));

interface Error {
  isPresent: boolean,
  data: string | undefined
}

export default function CreateMapForm(): JSX.Element {
  const [validate, result] = useValidateMapMutation();
  const [create, createResult] = useCreateMapMutation();
  const [error, setError] = useState<Error>({ isPresent: false, data: undefined });
  const [map, setMap] =  useState(initialSkeleton);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (createResult.isError || createResult.isSuccess){
      setSnackbarOpen(true);
    }
  }, [createResult]);

  useEffect(()=> {
    setError({ isPresent: result.isError, data: (result.error as any)?.data || 'Unknown error.' });
  }, [result]);

  const handleInputChange = useMemo(() => debounce((el) => {
    try {
      const obj: CreateMapRequest = JSON.parse(el);
      validate(obj);
      setMap(obj);
    } catch (e) {
      setError({ isPresent: true, data: 'Invalid json.' });
    }
  }, 2000), []);

  useMemo(() => validate(initialSkeleton), []);

  return (
    <Box margin='0 10px' display="flex" justifyContent="stretch">
      <Box sx={{  width:'45%' }}>
        <ActionButton
            variant="contained"
            onClick={ ()=> create(map) }
            disabled={error.isPresent}
        >
          Create
        </ActionButton>
          <PaddedEditor
              height="90vh"
              defaultLanguage="json"
              defaultValue={formattedInitialText}
              onChange={value => handleInputChange(value)}
          />
      </Box>
      <Box width="100%" height="100vh">
          {error.isPresent ?  <Alert severity='error' sx={{  position: 'fixed', zIndex: '999' }}>
              { error.data}
          </Alert> : null }

          {result.isSuccess ? <MapVisualizer map={result.data} interactable/> : null}
      </Box>
        <Snackbar open={snackbarOpen} autoHideDuration={result.isError ? 15000 : 3000} sx={{ marginBottom: 5 }}
                  onClose={handleSnackbarClose}>
          <Alert severity={createResult.isError ? 'error' : 'success'} sx={{  position: 'fixed', zIndex: '999' }}>
            { createResult.isError ? ('Error: ' + (createResult.error as any)?.data || 'Unknown error.') : 'Success'}
          </Alert>
        </Snackbar>
    </Box>);
}
