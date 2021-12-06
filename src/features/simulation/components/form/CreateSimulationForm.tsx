import {
  Alert, Snackbar, Box, StepContent, Button, Step, Stepper, StepLabel, StepperProps, SnackbarCloseReason,
} from '@mui/material';
import { Form, Formik } from 'formik';
import React, { PropsWithChildren, useEffect, useState } from 'react';

import MapVisualizer from '../../../map/MapVisualizer';
import { useGetBasicMapByIdQuery, useGetMapByIdQuery } from '../../../map/mapApi';
import { useCreateSimulationMutation } from '../../simulationApi';

import CreateExpectedVelocityMapForm, { expectedVelocityInitialValues } from './CreateExpectedVelocityMapForm';
import CreateGatewaysStatesForm, { getGatewaysStatesInitialValues } from './CreateGatewaysStatesForm';
import CreateLightPhaseStrategiesForm, { lightPhaseStrategiesInitialValues } from './CreateLightPhaseStrategiesForm';
import CreateMovementSimulationStrategyForm, { 
  movementSimulationStrategyInitialValues, 
} from './CreateMovementSimulationStrategyForm';
import CreateSimulationBasicInfoForm, { simulationBasicInfoInitialValues } from './CreateSimulationBasicInfoForm';
import { parseFormResultToRequest } from './util';
import { ControlButton } from './common';

export interface InitialValues<T> {
  values: T
}

interface Props {
  mapId: number
}

interface FormStepProps {
  handleNext: () => void,
  handleBack: () => void,
  isLast?: boolean,
  isFirst?: boolean,
  label: string,
}

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
                          handleNext();
                        }}
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

export default function CreateSimulationForm({ mapId }: Props): JSX.Element {
  const { data } = useGetMapByIdQuery(mapId);
  const { data: basicMap } = useGetBasicMapByIdQuery(mapId);
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

  const intersectionsSimplified = data?.roadNodes
    .filter(roadNode => roadNode.type === 'INTERSECTION')
    .map(({ name, id }) => ({ name, id })) ?? [];
  
  const gatewaysSimplified = data?.roadNodes
    .filter(roadNode => roadNode.type === 'GATEWAY')
    .map(({ name, id }) => ({ name, id })) ?? [];
  
  const roadsSimplified = data?.roads.map(({ name, id }) => ({ name, id })) ?? [];

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
  return (
    <Box margin='0 10px' display="flex" justifyContent="stretch">
      {data && basicMap && (
      <>
      <Box sx={{ overflowY: 'scroll', height: '99vh', width:'50%' }}>
      <Formik
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
              <FormStep isFirst handleBack={handleBack} handleNext={handleNext} label="Basic info">
                <CreateSimulationBasicInfoForm />
              </FormStep>
              <FormStep handleBack={handleBack} handleNext={handleNext} label="Movement simulation strategy">
                  <CreateMovementSimulationStrategyForm values={values.movementSimulationStrategy} 
                  compatibleStrategies={data.compatibleWith}/>              
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
            <ControlButton variant="contained"  onClick={handleReset}>Reset form</ControlButton>
          </Form>
        )}
      </Formik>
      </Box>
      <Box width="100%" height="100vh">
        <MapVisualizer map={basicMap} interactable/>
      </Box>
      </>)}
      <Snackbar open={snackbarOpen} autoHideDuration={result.isError ? 15000 : 3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleAlertClose} severity={result.isError ? 'error' : 'success'} sx={{ width: '100%' }}>
          {result.isError ? errorMessage : 'Simulation created successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
}