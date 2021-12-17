import {
  Box, Checkbox, Chip, InputLabel, ListItemText, MenuItem, 
} from '@mui/material';
import { FastField, ErrorMessage } from 'formik';
import React from 'react';

import { labelMovementStrategy } from '../../../../common/labels';
import { MovementSimulationStrategyType } from '../../../../simulation/types';
import { FormBox, ElementBox, FormInpiutField, FormSelect } from '../../../../common/form';
import { InitialMapFormValues } from '../types';

interface Props {
  values: InitialMapFormValues,
}
export default function MapForm({ values }: Props): JSX.Element{
  const compatibleWithValues: MovementSimulationStrategyType[] = ['MULTI_LANE_NAGEL_SCHRECKENBERG',
    'BRAKE_LIGHT', 'NAGEL_SCHRECKENBERG']; 

  return (<div>
            <h1>Map Basic Info</h1>
              <FormBox>
                <ElementBox>
                </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={'name'}>
                                Map name
                            </InputLabel>
                            <FastField
                            name={'name'}
                            placeholder="Name"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={'name'}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={'description'}>
                                Map description
                            </InputLabel>
                            <FastField
                            multiline
                            name={'description'}
                            placeholder="Map description"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={'description'}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                        <InputLabel 
                        htmlFor="compatible-select"
                        id="compatible-select-label"
                        >
                            Compatible
                        </InputLabel>
                              <FormSelect
                                sx={{ width: '300px' }}
                                labelId="compatible-select-label"
                                id="compatible-select"
                                label="Compatible"
                                renderValue={(selected: MovementSimulationStrategyType[]) => {
                                  return (selected && selected.length > 0) ? (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip 
                                      key={value} 
                                      label={labelMovementStrategy(value)} />
                                    ))}
                                  </Box>
                                  ) : <em>Choose intersections</em>;
                                }}
                                multiple
                                value={values.compatibleWith}>
                                    {compatibleWithValues.map((value) => (
                                    <MenuItem key={value} value={value}>
                                      <FastField type="checkbox" 
                                      name={'compatibleWith'}
                                      value={value} 
                                      as={Checkbox}
                                      checked={
                                          values.compatibleWith.indexOf(value) > -1
                                        }
                                     >{labelMovementStrategy(value)}</FastField>
                                      <ListItemText primary={labelMovementStrategy(value)} />
                                    </MenuItem>
                                    ))}
                              </FormSelect>
                      </Box>
                    </ElementBox>
              </FormBox>
            </div>
  );
}