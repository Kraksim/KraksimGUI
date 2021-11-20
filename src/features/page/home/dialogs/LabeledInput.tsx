import { FormControl, InputLabel, Select } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import styled from '@emotion/styled';

const FormControlBlock = styled(FormControl)(() => ({
  display: 'block',
  marginTop: 30,
}));

const SizedSelect = styled(Select)(() => ({
  minWidth: 200,
}));

interface Props {
  label: string;
  value: string;
  setValue: (value: ((prevState: string) => string) | string) => void;
  disabled?: boolean;
}

export default function LabeledInput({
  label,
  value,
  setValue,
  disabled,
  children,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <FormControlBlock>
      <InputLabel id="label1">{label}</InputLabel>
      <SizedSelect
        labelId="label1"
        label={label}
        value={value == '' ? null : value}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.value != null) setValue(e.target.value as string);
        }}
      >
        {children}
      </SizedSelect>
    </FormControlBlock>
  );
}
