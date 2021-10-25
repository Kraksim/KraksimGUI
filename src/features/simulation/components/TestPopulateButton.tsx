import React from 'react';
import { Button } from '@mui/material';

import { usePopulateMutation } from '../simulationApi';

export default function TestPopulateButton(): JSX.Element {
  const [populate] = usePopulateMutation();
  return (
      <Button type="button" onClick={() => populate()}> Populate da simulations!!</Button>
  );
}