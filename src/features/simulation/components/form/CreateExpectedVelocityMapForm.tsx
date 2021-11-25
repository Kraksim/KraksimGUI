import React from 'react';
import {
  FastField as Field, ErrorMessage, FieldArray, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, Checkbox, ListItemText, Chip, Divider,
} from '@mui/material';

import {
  FormBox, ControlContainer, ControlButton, DeleteButton, AddedElementListBox, ElementBox, FormSelect, FormInpiutField,
} from './common';
import { NameId } from './util';

interface Props {
  allowedRoads: NameId[],
  values: InitialValues,
}

type InitialValues = {
  roadsVelocityPairs: Array<{ velocity: string, roadIds: string[] }>;
};

export const expectedVelocityInitialValues: InitialValues = {
  roadsVelocityPairs: [
    {
      velocity: '',
      roadIds: [],
    },
  ],
};

function CreateExpectedVelocityMapForm( { allowedRoads, values }: Props): JSX.Element {

  return (
    <div>
      <h1>Expected Velocities map</h1>
        <>
          <FieldArray name="expectedVelocity.roadsVelocityPairs">
            {({ remove, push }) => (
              <FormBox>
                <ControlContainer>
                <ControlButton
                  type="button"
                  variant="contained"
                  onClick={() => push({
                    roadIds: [],
                    velocity: '',
                  })}
                >
                  Add new entry
                </ControlButton>
                </ControlContainer>
                <AddedElementListBox>
                {values.roadsVelocityPairs.length > 0 &&
                  values.roadsVelocityPairs.map((roadsVelocityPair, index) => (
                    <>
                    <Box key={index} margin="10px 0">
                    <ElementBox>
                      <Box>
                        <InputLabel 
                        htmlFor={`expectedVelocity.roadsVelocityPairs.${index}.roadIds`}>Roads</InputLabel>
                              <FormSelect 
                              renderValue={(selected: string[]) => {
                                return (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip 
                                      key={value} 
                                      label={allowedRoads.find(x => x.id === parseInt(value))?.name} />
                                    ))}
                                  </Box>
                                );
                              }}
                                multiple 
                                value={values.roadsVelocityPairs[index].roadIds}>
                                    {allowedRoads.map(({ id, name }) => (
                                    <MenuItem key={id} value={id}>
                                      <Field type="checkbox" 
                                      name={`expectedVelocity.roadsVelocityPairs.${index}.roadIds`}
                                      value={id} 
                                      as={Checkbox} 
                                      checked={
                                          values.roadsVelocityPairs[index].roadIds.indexOf(id.toString()) > -1
                                        }>{name}</Field>
                                      <ListItemText primary={name} />
                                    </MenuItem>
                                    ))}
                              </FormSelect>    
                        <ErrorMessage
                          name={`expectedVelocity.roadsVelocityPairs.${index}.roadId`}
                          component="div"
                        />
                      </Box>
                      <Box>
                        <InputLabel 
                        htmlFor={`expectedVelocity.roadsVelocityPairs.${index}.velocity`}>
                          Velocity
                        </InputLabel>
                        <Field
                          name={`expectedVelocity.roadsVelocityPairs.${index}.velocity`}
                          type="number"
                          placeholder="Velocity"
                          as={FormInpiutField}
                        />
                        <ErrorMessage
                          name={`expectedVelocity.roadsVelocityPairs.${index}.velocity`}
                          component="div"
                        />
                      </Box>
                        <DeleteButton
                          variant="contained"
                          type="button"
                          color="error"
                          onClick={() => remove(index)}
                        >
                          Delete
                        </DeleteButton>
                    </ElementBox>
                    </Box>
                    <Divider/>
                    </>
                  ))}
                  </AddedElementListBox>
              </FormBox>
            )}
          </FieldArray>
        </>
    </div>  
  );

}

export default React.memo(CreateExpectedVelocityMapForm);