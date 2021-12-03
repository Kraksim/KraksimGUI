import TrafficIcon from '@mui/icons-material/Traffic';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';

import { RoadNodeType } from '../requests';

interface Props {
  value: RoadNodeType;
  setValue:(value: RoadNodeType ) => void;
}

const PaddedToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  padding: 20,
}));

export default function TrafficToggle({ value, setValue }: Props): JSX.Element {

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: RoadNodeType | null,
  ) => {
    if (newAlignment !== null) {
      setValue(newAlignment);
    }
  };
  return (
        <PaddedToggleButtonGroup
            value={value}
            exclusive
            onChange={handleAlignment}
            aria-label="Node type"
        >
            <ToggleButton value="GATEWAY" aria-label="left aligned">
                <EmojiFlagsIcon />
            </ToggleButton>
            <ToggleButton value="INTERSECTION" aria-label="right aligned">
                <TrafficIcon />
            </ToggleButton>
        </PaddedToggleButtonGroup>
  );
}