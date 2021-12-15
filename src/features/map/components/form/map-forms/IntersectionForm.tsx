import { Box, InputLabel, MenuItem, Switch } from '@mui/material';
import {
  FastField, ErrorMessage, FieldArray, useFormikContext, FieldProps, 
} from 'formik';
import React from 'react';

//import { idGenerator } from '../../../../common/utils';
import {
  FormBox, ElementBox, FormInpiutField, AddedElementListBox, ControlButton, DeleteButton, FormSelect, 
} from '../../../../common/form';
import { FocusedElement, InitialMapFormValues } from '../types';

interface Props {
  element: FocusedElement
}

export default function IntersectionForm({ element }: Props): JSX.Element{

  const formik = useFormikContext<InitialMapFormValues>();

  function getSourceLanes(): Array<{ id: number, label: string }>{
    const endingRoadsIds = formik.values.intersections[element.id].endingRoadsIds;

    return endingRoadsIds.flatMap((roadId) => {
      const road = formik.values.roads[roadId];
      return road.lanes.map(lane => ({ id: lane.id, label: road.name + ' ' + lane.indexFromLeft }));
    });
  }

  function getDestinationRoads(): Array<{ id: number, label: string }>{
    const startingRoadsIds =  formik.values.intersections[element.id].startingRoadsIds;

    return startingRoadsIds.map(roadId => ({ id: roadId, label: formik.values.roads[roadId].name }));
  }

  return (<div>
            <h1>Intersection Basic Info</h1>
              <FormBox>
                <ElementBox>
                </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={`intersections.${element.id}.name`}>
                                Name
                            </InputLabel>
                            <FastField
                            name={`intersections.${element.id}.name`}
                            placeholder="Name"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={`intersections.${element.id}.name`}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={`intersections.${element.id}.position.x`}>
                                X coord
                            </InputLabel>
                            <FastField
                            type="number"
                            name={`intersections.${element.id}.position.x`}
                            placeholder="Name"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={`intersections.${element.id}.position.x`}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={`intersections.${element.id}.position.y`}>
                                Y coord
                            </InputLabel>
                            <FastField
                            name={`intersections.${element.id}.position.y`}
                            placeholder="Name"
                            type="number"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={`intersections.${element.id}.position.y`}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={`intersections.${element.id}.overrideTurnDirectionsTurnEverywhere`}>
                                Override turn directions
                            </InputLabel>
                            <FastField
                            type='checkbox'
                            name={`intersections.${element.id}.overrideTurnDirectionsTurnEverywhere`}
                            as={Switch}
                            />
                            <ErrorMessage
                            name={`intersections.${element.id}.overrideTurnDirectionsTurnEverywhere`}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        {!formik.values.intersections[element.id].overrideTurnDirectionsTurnEverywhere && 
                        <FieldArray name={`intersections.${element.id}.turnDirections`}>
                        {({ remove, push }) => (
                            <Box>
                            <ControlButton
                              type="button"
                              variant="contained"
                              onClick={() => push({
                                sourceLaneId: '',
                                destinationRoadId: '',
                              })}
                            >
                              Add new entry
                            </ControlButton>
                            <AddedElementListBox>
                              {(formik.values.intersections[element.id].turnDirections ?? []
                              ).map((turnDirection, index) => (
                                <ElementBox key={index}>
                                  <Box>
                                    <InputLabel 
                                      htmlFor={`intersections.${element.id}.turnDirections.${index}.sourceLaneId`}>
                                        Source Lane
                                    </InputLabel>
                                    <FastField
                                      name={`intersections.${element.id}.turnDirections.${index}.sourceLaneId`}
                                      type="number"
                                    >
                                        {({ field }: FieldProps) => (
                                        <FormSelect {...field} label="Source Lane">
                                            {getSourceLanes().map(({ id, label }) =>
                                                <MenuItem value={id}>{label}</MenuItem>)}
                                        </FormSelect>
                                        )}
                                    </FastField> 
                                    <ErrorMessage
                                      name={`intersections.${element.id}.turnDirections.${index}.sourceLaneId`}
                                      component="div"
                                      className="field-error"
                                    />
                                  </Box>
                                  <Box>
                                    <InputLabel 
                                      htmlFor={`intersections.${element.id}.turnDirections.${index}.destinationRoadId`}>
                                        Destination Road
                                    </InputLabel>
                                    <FastField
                                      name={`intersections.${element.id}.turnDirections.${index}.destinationRoadId`}
                                      type="number"
                                    >
                                        {({ field }: FieldProps) => (
                                        <FormSelect {...field} label="Destination Road">
                                            {getDestinationRoads().map(({ id, label }) =>
                                                <MenuItem value={id}>{label}</MenuItem>)}
                                        </FormSelect>
                                        )}
                                    </FastField> 
                                    <ErrorMessage
                                      name={`intersections.${element.id}.turnDirections.${index}.destinationRoadId`}
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
                      </FieldArray>}
                    </ElementBox>
              </FormBox>
            </div>
  );
}