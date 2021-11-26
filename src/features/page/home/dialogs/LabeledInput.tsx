import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import styled from '@emotion/styled';

const SizedSelect = styled(Select)(() => ({
  minWidth: 200,
}));

interface Props {
  label: string;
  value: string;
  setValue: (value: ((prevState: string) => string) | string) => void;
  disabled?: boolean;
  marginTop?: number;
  error?: boolean;
  helperText?: string;
  spaceUnder?: boolean;
}

export default function LabeledInput({
  label,
  value,
  setValue,
  disabled,
  marginTop = 0,
  error = false,
  helperText,
  spaceUnder = false,
  children,
}: PropsWithChildren<Props>): JSX.Element {

  const FormControlBlock = styled(FormControl)(() => ({
    display: 'block',
    marginTop: marginTop,
  }));

  return (
    <FormControlBlock error={error}>
      <InputLabel id="label1">{label}</InputLabel>
      <SizedSelect
        labelId="label1"
        label={label}
        value={value == '' ? null : value}
        disabled={disabled}
        error={error}
        onChange={(e) => {
          if (e.target.value != null) setValue(e.target.value as string);
        }}
      >
        {children}
      </SizedSelect>
        {error ? <FormHelperText>{helperText}</FormHelperText> :
          (spaceUnder || helperText) ? <FormHelperText>{' '}</FormHelperText> : null}
    </FormControlBlock>
  );
}
