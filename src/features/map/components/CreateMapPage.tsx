import { Box } from '@mui/material';
import { Formik } from 'formik';
import React from 'react';

import { useCreateMapMutation } from '../mapApi';


import CreateMapForm from './form/CreateMapForm';
import { initialValues, parseFormValuesToRequest } from './form/mapFormUtils';

export default function CreateMapPage(): JSX.Element {
  const [create, createResult] = useCreateMapMutation();
  return (
        <Box>
          <Formik initialValues={initialValues} onSubmit={(values) => {
            console.log(values); 
            create(parseFormValuesToRequest(values));
          }}>
            <CreateMapForm 
            isError={createResult.isError} 
            isSuccess={createResult.isSuccess} 
            error={createResult.error}/>
          </Formik>
        </Box>
  );
}
