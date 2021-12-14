import {
  Alert, 
  Snackbar, 
  Box, 
  StepContent, 
  Button, 
  Step, 
  Stepper, 
  StepLabel, 
  StepperProps, 
  SnackbarCloseReason, 
  CircularProgress,
} from '@mui/material';
import { Form, Formik } from 'formik';
import React, { PropsWithChildren, useEffect, useState } from 'react';

import MapVisualizer from '../../../map/MapVisualizer';
import { useGetBasicMapByIdQuery, useGetMapByIdQuery } from '../../../map/mapApi';
import { useCreateSimulationMutation } from '../../simulationApi';
import ErrorPage from '../../../common/components/ErrorPage';

import CreateExpectedVelocityMapForm, { expectedVelocityInitialValues } from './CreateExpectedVelocityMapForm';
import CreateGatewaysStatesForm, { getGatewaysStatesInitialValues } from './CreateGatewaysStatesForm';
import CreateLightPhaseStrategiesForm, { lightPhaseStrategiesInitialValues } from './CreateLightPhaseStrategiesForm';
import CreateMovementSimulationStrategyForm, { 
  movementSimulationStrategyInitialValues, 
} from './CreateMovementSimulationStrategyForm';
import CreateSimulationBasicInfoForm, { simulationBasicInfoInitialValues } from './CreateSimulationBasicInfoForm';
import { parseFormResultToRequest } from './util';
import { ControlButton, FormSkeleton } from './common';

export interface InitialValues<T> {
  values: T
}

interface Props {
  mapId: number
}

interface FormStepProps {
  handleNext?: () => void,
  handleBack?: () => void,
  isLast?: boolean,
  isFirst?: boolean,
  label: string,
}

const formLoader = (
<Box>
  <FormSkeleton height="60px" width="250px" variant='rectangular' />
  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
    <Box>
      <FormSkeleton width="100px" variant="text" />
      <FormSkeleton height="60px" variant='rectangular' />
    </Box>
    <Box>
      <FormSkeleton width="100px" variant="text" />
      <FormSkeleton height="60px" variant='rectangular' />
    </Box>
  </Box>
</Box>);

const mapLoader = (
  <Box height="100%" width="100%" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <CircularProgress size="100px"/>
  </Box>
);

function FormStep({
  handleNext, handleBack, isLast = false, isFirst = false, children, label, ...rest
}: PropsWithChildren<FormStepProps & StepperProps>): JSX.Element {
  return (
            <Step {...rest}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <>
                  {children}
                  </>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (isLast) return;
                          handleNext?.();
                        }}
                        disabled={handleNext === undefined}
                        type={isLast ? 'submit' : 'button'}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {isLast ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={isFirst}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
            </StepContent>
            </Step>
  );
}

const labels = [
  'Basic info',
  'Movement simulation strategy',
  'Expected velocities',
  'Gateways states',
  'Light phase strategies',
];

const stepperPlaceholder = (
          <Stepper activeStep={0} orientation="vertical">
            {labels.map((label, index) => 
            <FormStep 
            isFirst={index === 0} 
            isLast={index === labels.length - 1}
            key={label}
            label={label}
            >
              {formLoader}
            </FormStep>,
            )}
        </Stepper>
);

export default function CreateSimulationForm({ mapId }: Props): JSX.Element {
  const { data: map, isLoading: isMapLoading, error: mapError } = useGetMapByIdQuery(mapId);
  const { data: basicMap, isLoading: isBasicMapLoading, error: basicMapError } = useGetBasicMapByIdQuery(mapId);
  const [ createSimulation, result ] = useCreateSimulationMutation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
    
  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSnackbarClose = (_: any, reason: SnackbarCloseReason) => {
    if (reason !== 'clickaway'){
      setSnackbarOpen(false);
    }
  };

  const handleAlertClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (result.isError || result.isSuccess){
      setSnackbarOpen(true);
    }
  }, [result]);

  useEffect(() => {
    if (result.isError){
      setActiveStep(4);
    } else if (result.isSuccess){
      setActiveStep(5);
    }
  }, [result]);

  const intersectionsSimplified = map?.roadNodes
    .filter(roadNode => roadNode.type === 'INTERSECTION')
    .map(({ name, id }) => ({ name, id })) ?? [];
  
  const gatewaysSimplified = map?.roadNodes
    .filter(roadNode => roadNode.type === 'GATEWAY')
    .map(({ name, id }) => ({ name, id })) ?? [];
  
  const roadsSimplified = map?.roads.map(({ name, id }) => ({ name, id })) ?? [];

  const initialValues = {
    simulationBasicInfo: simulationBasicInfoInitialValues,
    movementSimulationStrategy: movementSimulationStrategyInitialValues,
    expectedVelocity: expectedVelocityInitialValues,
    lightPhaseStrategies: lightPhaseStrategiesInitialValues,
    gatewaysStates: getGatewaysStatesInitialValues(gatewaysSimplified.map(({ id }) => id)),
  };

  const errorData = (result.error as any)?.data;
  const errorMessage = errorData ? 'Something went wrong: ' + errorData :
    'Something went wrong, please check your connection.';

  if (mapError || basicMapError){
    return <ErrorPage/>;
  }

  return (
    <Box margin='0 10px' display="flex" justifyContent="stretch">
      {(
      <>
      <Box sx={{
        overflowY: 'scroll', 
        height: '90vh', 
        width:'50%', backgroundColor: 'white', borderRadius: '20px', padding: '16px', margin: '16px', 
      }}>
      {map && !isMapLoading ? <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log(values);
          const request = parseFormResultToRequest(values, mapId);
          console.log(request);
          createSimulation(request);
        }}
        >
        {({ values }) => (
          <Form>
            <Stepper activeStep={activeStep} orientation="vertical">
              <FormStep
              isFirst 
              handleBack={handleBack} 
              handleNext={handleNext} 
              label="Basic info">
                <CreateSimulationBasicInfoForm />
              </FormStep>
              <FormStep handleBack={handleBack} handleNext={handleNext} label="Movement simulation strategy">
                  <CreateMovementSimulationStrategyForm values={values.movementSimulationStrategy} 
                  compatibleStrategies={map?.compatibleWith ?? []}/>              
              </FormStep>
              <FormStep handleBack={handleBack} handleNext={handleNext} label="Expected velocities">
                <CreateExpectedVelocityMapForm values={values.expectedVelocity} allowedRoads={roadsSimplified} />
              </FormStep>
              <FormStep handleBack={handleBack} handleNext={handleNext} label="Gateways states">  
                <CreateGatewaysStatesForm values={values.gatewaysStates} allowedGateways={gatewaysSimplified} />
              </FormStep>
              <FormStep isLast handleBack={handleBack} handleNext={handleNext} label="Light phase strategies">
                <CreateLightPhaseStrategiesForm values={values.lightPhaseStrategies} 
                allowedIntersections={intersectionsSimplified} 
                />
              </FormStep>
            </Stepper>
            <ControlButton variant="contained" type="reset" onClick={handleReset}>Reset form</ControlButton>
          </Form>
        )}
      </Formik> : stepperPlaceholder}
      </Box>
      </>)}
      <Box width="100%" height="100vh">
        {(isBasicMapLoading || !basicMap) ? mapLoader :  
        <MapVisualizer map={basicMap} interactable/>
        }
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={result.isError ? 15000 : 3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleAlertClose} severity={result.isError ? 'error' : 'success'} sx={{ width: '100%' }}>
          {result.isError ? errorMessage : 'Simulation created successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}