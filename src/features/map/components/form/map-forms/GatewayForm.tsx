import { Box, InputLabel } from '@mui/material';
import { FastField, ErrorMessage } from 'formik';
import React from 'react';

import { FormBox, ElementBox, FormInpiutField } from '../../../../common/form';
import { FocusedElement } from '../types';

interface Props {
  element: FocusedElement
}

export default function GatewayForm({ element }: Props): JSX.Element{
  return (<div>
            <h1>Gateway Basic Info</h1>
              <FormBox>
                <ElementBox>
                </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={`gateways.${element.id}.name`}>
                                Name
                            </InputLabel>
                            <FastField
                            name={`gateways.${element.id}.name`}
                            placeholder="Name"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={`gateways.${element.id}.name`}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={`gateways.${element.id}.position.x`}>
                                X coord
                            </InputLabel>
                            <FastField
                            name={`gateways.${element.id}.position.x`}
                            placeholder="Name"
                            type='number'
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={`gateways.${element.id}.position.x`}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={`gateways.${element.id}.position.y`}>
                                Y coord
                            </InputLabel>
                            <FastField
                            name={`gateways.${element.id}.position.y`}
                            placeholder="Name"
                            type='number'
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={`gateways.${element.id}.position.y`}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
              </FormBox>
            </div>
  );
}