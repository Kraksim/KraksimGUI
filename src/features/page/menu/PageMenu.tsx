import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, IconButton, 
} from '@mui/material';
import React, { useState } from 'react';
import MapIcon from '@mui/icons-material/Map';
import UpdateIcon from '@mui/icons-material/Update';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CreateIcon from '@mui/icons-material/Create';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';

import CompareSimulationDialog from '../home/dialogs/CompareSimulationsDialog';

const COLLAPSED_WIDTH = '66px'; 
const EXPANDED_WIDTH = '250px';

const ItemText = styled(ListItemText)(() => ({
  whiteSpace: 'nowrap',
}));

export default function PageMenu(): JSX.Element{
  const [compareSimulationsDialogOpened, setCompareSimulationsDialogOpened] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const history = useHistory();

  const onViewSimulationsClicked = () => {
    history.push('/simulations/all');
  };

  const onViewMapsClicked = () => {
    history.push('/maps/all');
  };

  const onCreateMapClicked = () => {
    history.push('/maps/create');
  };

  return (
    <>
    <Drawer variant="persistent" sx={{ width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH, 
      flexShrink: 0,
      transition: 'width 0.3s' }} open={true}>
        <Box width={expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH} role="presentation" sx={{ transition: 'width 0.3s' }}>
            <Box>
            <IconButton onClick={() => setExpanded(prevState => !prevState)}>
                <img alt="kraksim-logo" 
                style={{ width: '50px', height: '50px' }} 
                src={'/logo192.png'} 
                />
            </IconButton>
            </Box>
            <Divider />
            <List>
                <ListItem button onClick={onViewMapsClicked}>
                    <ListItemIcon>
                        <MapIcon/>
                    </ListItemIcon>
                    <ItemText primary="Maps"/>
                </ListItem>
                <ListItem button onClick={onViewSimulationsClicked}>
                    <ListItemIcon>
                        <UpdateIcon/>
                    </ListItemIcon>
                    <ItemText primary="Simulations"/>
                </ListItem>
                <ListItem button onClick={() => setCompareSimulationsDialogOpened(true)}>
                    <ListItemIcon>
                        <QueryStatsIcon/>
                    </ListItemIcon>
                    <ItemText sx={{ whiteSpace: 'nowrap' }} primary="Compare simulations"/>
                </ListItem>
                <ListItem button onClick={onCreateMapClicked}>
                    <ListItemIcon>
                        <CreateIcon/>
                    </ListItemIcon>
                    <ItemText primary="Map creator"/>
                </ListItem>
            </List>
            <Divider />
        </Box>
    </Drawer>
    <CompareSimulationDialog
        open={compareSimulationsDialogOpened}
        onClose={() => setCompareSimulationsDialogOpened(false)}
    />
    </>
  );
}