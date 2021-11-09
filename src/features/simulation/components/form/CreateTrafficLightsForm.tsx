import React, { useState } from 'react';
import {
  FastField, ErrorMessage, FieldArray, FieldProps, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import { CreatePhaseRequest } from '../../requests';

import {
  FormBox, ControlContainer, ControlButton, ScrollbarBox, AddedElementListBox, ElementBox, FormSelect, 
} from './common';

interface Props {
  allowedIntersectionIds: number[],
  intersectionLanes: Array<{ intersectionId: number, allowedLanesIds: number[] }>,
  values: InitialValues,
}

interface Phases {
  phases: CreatePhaseRequest[],
}

type InitialValues = Record<number, Phases>;

export function getTrafficLightsInitialValues(intersectionIds: number[]): InitialValues{
  return intersectionIds.reduce((reducer, next) => ({ ...reducer, [next]: {
    phases: [
      {
        laneId: '',
        state: '',
      },
    ],
  } }), {});
}


export function CreateTrafficLightsForm( { allowedIntersectionIds, intersectionLanes, values }: Props): JSX.Element {

  const [currentId, setCurrentId] = useState<number>(allowedIntersectionIds[0]);

  return (
    (allowedIntersectionIds.length > 0 && Object.keys(values).length > 0) ? (<div>
      <h1>Traffic Lights</h1>
        <>
          <FieldArray name={`trafficLights.${currentId}.phases`}>
            {({ remove, push }) => (
              <FormBox>
                <ControlContainer>
                <FormSelect
                    name={'gatewayId'}
                    type="number"
                    placeholder="Select Intersection ID"
                    value={currentId}
                    onChange={(e) => setCurrentId(parseInt(e.target.value as string))}
                >
                {allowedIntersectionIds
                  .map(intersectionId => 
                  <MenuItem key={intersectionId} value={intersectionId}>{intersectionId}</MenuItem>)}
                </FormSelect>
                <ControlButton
                  type="button"
                  variant="contained"
                  onClick={() => push(    {
                    laneId: '',
                    state: '',
                  })}
                >
                  Add new entry
                </ControlButton>
                </ControlContainer>
                <ScrollbarBox>
                <AddedElementListBox>
                {values[currentId].phases.length > 0 &&
                  values[currentId].phases.map((phase, index) => (
                      <>
                    <ElementBox key={index}>
                      <Box>
                        <InputLabel 
                        htmlFor={`trafficLights.${currentId}.phases.${index}.state`}>State</InputLabel>
                        <FastField
                          name={`trafficLights.${currentId}.phases.${index}.state`}
                          as={FormSelect}
                        >
                            <MenuItem value={'GREEN'}>Green</MenuItem>
                            <MenuItem value={'RED'}>Red</MenuItem>
                        </FastField>    
                        <ErrorMessage
                          name={`trafficLights.${currentId}.phases.${index}.state`}
                          component="div"
                        />
                      </Box>  
                      <Box>
                        <InputLabel 
                        htmlFor={`trafficLights.${currentId}.phases.${index}.laneId`}>Lane ID</InputLabel>
                        <FastField
                          name={`trafficLights.${currentId}.phases.${index}.laneId`}
                          type="number"
                          >
                             {({ field }: FieldProps) => (
                                <FormSelect {...field} label="Target Gateway ID">
                                {(intersectionLanes.find(x => x.intersectionId === currentId)?.allowedLanesIds ?? [])
                                  .map(laneId => <MenuItem key={laneId} value={laneId}>{laneId}</MenuItem>)}
                                </FormSelect>
                             )}
                        </FastField>    
                        <ErrorMessage
                          name={`trafficLights.${currentId}.phases.${index}.laneId`}
                          component="div"
                        />
                      </Box>
                        <ControlButton
                          variant="contained"
                          type="button"
                          color="error"
                          onClick={() => remove(index)}
                        >
                          Delete
                        </ControlButton>
                      </ElementBox>
                    </>
                  ))}
                  </AddedElementListBox>
                  </ScrollbarBox>
              </FormBox>
            )}
          </FieldArray>
        </>
    </div>) : <div><h1>Couldn't create traffic lights for this simulation</h1></div> 
  );

}