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

const EXPANDED_WIDTH = '250px';

const ItemText = styled(ListItemText)(() => ({
  whiteSpace: 'nowrap',
}));

export default function PageMenu(): JSX.Element{
  const [compareSimulationsDialogOpened, setCompareSimulationsDialogOpened] = useState(false);

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

  const onLogoClick = () => {
    history.push('/');
  };

  return (
    <>
    <Drawer variant="permanent" sx={{ width: EXPANDED_WIDTH }}>
        <Box width={EXPANDED_WIDTH}>
            <Box>
            <IconButton onClick={onLogoClick}>
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
        afterConfirm={() => setCompareSimulationsDialogOpened(false)}
        open={compareSimulationsDialogOpened}
        onClose={() => setCompareSimulationsDialogOpened(false)}
    />
    </>
  );
}