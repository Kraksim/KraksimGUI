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
import { NameId } from './util';

interface Props {
  allowedIntersections: NameId[],
  intersectionLanes: Array<{ intersectionId: number, allowedLanes: NameId[] }>,
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


export function CreateTrafficLightsForm({ allowedIntersections, intersectionLanes, values }: Props): JSX.Element {

  const [currentId, setCurrentId] = useState<number>(allowedIntersections[0].id);

  return (
    (allowedIntersections.length > 0 && Object.keys(values).length > 0) ? (<div>
      <h1>Traffic Lights</h1>
        <>
          <FieldArray name={`trafficLights.${currentId}.phases`}>
            {({ remove, push }) => (
              <FormBox>
                <ControlContainer>
                <FormSelect
                    name={'gatewayId'}
                    type="number"
                    placeholder="Select Intersection"
                    value={currentId}
                    onChange={(e) => setCurrentId(parseInt(e.target.value as string))}
                >
                {allowedIntersections
                  .map(({ id, name }) => 
                  <MenuItem key={id} value={id}>{name}</MenuItem>)}
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
                        htmlFor={`trafficLights.${currentId}.phases.${index}.laneId`}>Lane</InputLabel>
                        <FastField
                          name={`trafficLights.${currentId}.phases.${index}.laneId`}
                          type="number"
                          >
                             {({ field }: FieldProps) => (
                                <FormSelect {...field} label="Target Gateway">
                                {(intersectionLanes.find(x => x.intersectionId === currentId)?.allowedLanes ?? [])
                                  .map(({ name, id }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
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