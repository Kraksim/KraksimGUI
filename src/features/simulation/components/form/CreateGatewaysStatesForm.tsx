import React, { useState } from 'react';
import {
  FastField, ErrorMessage, FieldArray, FieldProps, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import { CreateGeneratorsRequest } from '../../requests';

import {
  FormBox, ControlContainer, ControlButton, ScrollbarBox, AddedElementListBox, ElementBox, FormSelect, FormInpiutField, 
} from './common';
import { NameId } from './util';

interface Props {
  allowedGateways: NameId[],
  values: InitialValues,
}

interface Generators {
  generators: CreateGeneratorsRequest[],
}

type InitialValues = Record<number, Generators>;

export function getGatewaysStatesInitialValues(gatewayIds: number[]): InitialValues{
  return gatewayIds.reduce((reducer, next) => ({ ...reducer, [next]: {
    generators: [
      {
        releaseDelay: '',
        carsToRelease: '',
        targetGatewayId: '',
        gpsType: '',
      },
    ],
  } }), {});
}


export function CreateGatewaysStatesForm( { allowedGateways, values }: Props): JSX.Element {

  const [currentId, setCurrentId] = useState<number>(allowedGateways[0].id);

  return (
    <div>
      <h1>Gateways States</h1>
        <>
          <FieldArray name={`gatewaysStates.${currentId}.generators`}>
            {({ remove, push }) => (
              <FormBox>
                <ControlContainer>
                <FormSelect
                    name={'gatewayId'}
                    type="number"
                    placeholder="Select Gateway"
                    value={currentId}
                    onChange={(e) => setCurrentId(parseInt(e.target.value as string))}
                >
                {allowedGateways
                  .map(({ name, id }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
                </FormSelect>
                <ControlButton
                  type="button"
                  variant="contained"
                  onClick={() => push(    {
                    releaseDelay: '',
                    carsToRelease: '',
                    targetGatewayId: '',
                    gpsType: '',
                  })}
                >
                  Add new entry
                </ControlButton>
                </ControlContainer>
                <ScrollbarBox>
                <AddedElementListBox>
                {values[currentId].generators.length > 0 &&
                  values[currentId].generators.map((generator, index) => (
                    <>
                    <ElementBox key={index}>
                      <Box>
                        <InputLabel 
                        htmlFor={`gatewaysStates.${currentId}.generators.${index}.carsToRelease`}>
                            Cars to Release
                        </InputLabel>
                        <FastField
                          name={`gatewaysStates.${currentId}.generators.${index}.carsToRelease`}
                          type="number"
                          placeholder="Cars To Release"
                          as={FormInpiutField}
                        />
                        <ErrorMessage
                          name={`gatewaysStates.${currentId}.generators.${index}.carsToRealese`}
                          component="div"
                          className="field-error"
                        />
                      </Box>  
                      <Box>
                        <InputLabel 
                        htmlFor={`gatewaysStates.${currentId}.generators.${index}.targetGatewayId`}>
                          Target Gateway
                        </InputLabel>
                        <FastField
                          name={`gatewaysStates.${currentId}.generators.${index}.targetGatewayId`}
                          type="number"
                          >
                             {({ field }: FieldProps) => (
                                <FormSelect {...field} label="Target Gateway">
                                {allowedGateways
                                  .map(({ name, id }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
                                </FormSelect>
                             )}
                        </FastField>    
                        <ErrorMessage
                          name={`gatewaysStates.${currentId}.generators.${index}.targetGatewayId`}
                          component="div"
                        />
                      </Box>
                      </ElementBox>
                      <ElementBox key={index + 'second'}>
                        <Box>
                          <InputLabel 
                          htmlFor={`gatewaysStates.${currentId}.generators.${index}.releaseDelay`}>
                            Realese delay
                          </InputLabel>
                          <FastField
                            name={`gatewaysStates.${currentId}.generators.${index}.releaseDelay`}
                            type="number"
                            placeholder="Realese Delay"
                            as={FormInpiutField}
                          />
                          <ErrorMessage
                            name={`gatewaysStates.${currentId}.generators.${index}.releaseDelay`}
                            component="div"
                            className="field-error"
                          />
                        </Box>
                        <Box>
                          <InputLabel 
                          htmlFor={`gatewaysStates.${currentId}.generators.${index}.gpsType`}>GPS type</InputLabel>
                          <FastField
                            name={`gatewaysStates.${currentId}.generators.${index}.gpsType`}
                            as={FormSelect}
                          >
                              <MenuItem value={'DIJKSTRA_ROAD_LENGTH'}>Dijkstra road length</MenuItem>
                          </FastField>    
                          <ErrorMessage
                            name={`gatewaysStates.${currentId}.generators.${index}.gpsType`}
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
      </div>  
  );
}