import { Box, InputLabel } from '@mui/material';
import { FastField, ErrorMessage, useFormikContext, FieldArray } from 'formik';
import React from 'react';

import { idGenerator } from '../../../../common/utils';
import {
  FormBox, ElementBox, FormInpiutField, AddedElementListBox, DeleteButton, ControlButton, 
} from '../../../../common/form';
import { FocusedElement, InitialMapFormValues } from '../types';

interface Props {
  element: FocusedElement
}

export default function GatewayForm({ element }: Props): JSX.Element{
  const formik = useFormikContext<InitialMapFormValues>();
  
  return (<div>
            <h1>Road Basic Info</h1>
              <FormBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={`roads.${element.id}.name`}>
                                Name
                            </InputLabel>
                            <FastField
                            name={`roads.${element.id}.name`}
                            placeholder="Name"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={`roads.${element.id}.name`}
                            component="div"
                            className="field-error"
                            />
                        </Box>
                        <Box>
                            <InputLabel 
                            htmlFor={`roads.${element.id}.id`}>
                                ID
                            </InputLabel>
                            <FastField
                            name={`roads.${element.id}.id`}
                            placeholder="Name"
                            disabled
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={`roads.${element.id}.id`}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                      <FieldArray name={`roads.${element.id}.lanes`}>
                        {({ remove, push }) => (
                            <Box>
                            <ControlButton
                              type="button"
                              variant="contained"
                              onClick={() => push(    {
                                startingPoint: 0,
                                endingPoint: formik.values.roads[element.id].length,
                                indexFromLeft: '',
                                id: idGenerator.getId(),
                              })}
                            >
                              Add new entry
                            </ControlButton>
                            <AddedElementListBox>
                              {formik.values.roads[element.id].lanes.map((lane, index) => (
                                <ElementBox key={index}>
                                  <Box>
                                    <InputLabel 
                                      htmlFor={`roads.${element.id}.lanes.${index}.id`}>
                                        ID
                                    </InputLabel>
                                    <FastField
                                      name={`roads.${element.id}.lanes.${index}.id`}
                                      placeholder="Name"
                                      disabled
                                      as={FormInpiutField}
                                    />
                                    <ErrorMessage
                                      name={`roads.${element.id}.lanes.${index}.id`}
                                      component="div"
                                      className="field-error"
                                    />
                                  </Box>  
                                  <Box>
                                    <InputLabel 
                                      htmlFor={`roads.${element.id}.lanes.${index}.startingPoint`}>
                                        Starting Point
                                    </InputLabel>
                                    <FastField
                                      name={`roads.${element.id}.lanes.${index}.startingPoint`}
                                      placeholder="Starting Point"
                                      type="number"
                                      as={FormInpiutField}
                                    />
                                    <ErrorMessage
                                      name={`roads.${element.id}.lanes.${index}.startingPoint`}
                                      component="div"
                                      className="field-error"
                                    />
                                  </Box>
                                  <Box>
                                    <InputLabel 
                                      htmlFor={`roads.${element.id}.lanes.${index}.endingPoint`}>
                                        Ending Point
                                    </InputLabel>
                                    <FastField
                                      name={`roads.${element.id}.lanes.${index}.endingPoint`}
                                      placeholder="Ending Point"
                                      type="number"
                                      as={FormInpiutField}
                                    />
                                    <ErrorMessage
                                      name={`roads.${element.id}.lanes.${index}.endingPoint`}
                                      component="div"
                                      className="field-error"
                                    />
                                  </Box>
                                  <Box>
                                  <InputLabel 
                                      htmlFor={`roads.${element.id}.lanes.${index}.indexFromLeft`}>
                                        Index from left
                                    </InputLabel>
                                    <FastField
                                      name={`roads.${element.id}.lanes.${index}.indexFromLeft`}
                                      placeholder="Index from left"
                                      type="number"
                                      as={FormInpiutField}
                                    />
                                    <ErrorMessage
                                      name={`roads.${element.id}.lanes.${index}.indexFromLeft`}
                                      component="div"
                                      className="field-error"
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
                              ))}
                            </AddedElementListBox>
                            </Box>
                        )}
                      </FieldArray>
                    </ElementBox>
              </FormBox>
            </div>
  );
}