import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, IconButton, 
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import MapIcon from '@mui/icons-material/Map';
import UpdateIcon from '@mui/icons-material/Update';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CreateIcon from '@mui/icons-material/Create';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';
import { isMobile } from 'react-device-detect';

import CompareSimulationDialog from '../home/dialogs/CompareSimulationsDialog';

const EXPANDED_WIDTH = '250px';
const COLLAPSED_WIDTH = '66px';

const ItemText = styled(ListItemText)(() => ({
  whiteSpace: 'nowrap',
}));

export default function PageMenu(): JSX.Element{ // todo make it look good on phones
  const [compareSimulationsDialogOpened, setCompareSimulationsDialogOpened] = useState(false);

  const history = useHistory();
  const [currentPath, setCurrentPath] = useState(history.location.pathname);


  useEffect(() => {
    return history.listen((location) => {
      setCurrentPath(location.pathname);
    });
  }, [history]);

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

  const normalTabStyle = { marginBottom:'16px', color:'#A3AED0', borderRadius: '5px' };
  const currentTabStyle = { ...normalTabStyle,
    backgroundColor: '#337180',
    color: '#FFFFFF',
    ':hover': {
      bgcolor: '#337180',
    } };

  return (
    <>
    <Drawer variant="permanent" sx={{ width: isMobile ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}>
        <Box width={ isMobile ? COLLAPSED_WIDTH : EXPANDED_WIDTH }>
            <Box sx={{ padding: '18px 0px 22px 30px' }}>
            <IconButton onClick={onLogoClick}>
                <img alt="kraksim-logo" 
                style={{ width: '50px', height: '50px' }} 
                src={'/logo192.png'} 
                />
            </IconButton>
            </Box>
            <Divider />
            <List  sx={{ padding: '30px' }}>
                <ListItem sx = { currentPath === '/maps/all' ? currentTabStyle : normalTabStyle }
                          button
                          onClick={onViewMapsClicked}>
                    <ListItemIcon>
                        <MapIcon sx ={{ color: currentPath === '/maps/all' ? '#FFFFFF' : '#A3AED0' }}/>
                    </ListItemIcon>
                    <ItemText primary="Maps"/>
                </ListItem>
                <ListItem sx = { currentPath === '/simulations/all' ? currentTabStyle : normalTabStyle }
                    button
                    onClick={onViewSimulationsClicked}>
                    <ListItemIcon>
                        <UpdateIcon sx = {{ color: currentPath ===  '/simulations/all' ? '#FFFFFF' : '#A3AED0' }}/>
                    </ListItemIcon>
                    <ItemText primary="Simulations"/>
                </ListItem>
                <ListItem sx = { currentPath.includes('/simulations/compare') ? currentTabStyle : normalTabStyle }
                    button
                    onClick={() => setCompareSimulationsDialogOpened(true)}>
                    <ListItemIcon>
                        <QueryStatsIcon
                            sx = {{ color: currentPath ===  '/simulations/compare' ? '#FFFFFF' : '#A3AED0' }}/>
                    </ListItemIcon>
                    <ItemText sx={{ whiteSpace: 'nowrap' }} primary="Comparator"/>
                </ListItem>
                <ListItem sx = { currentPath === '/maps/create' ? currentTabStyle : normalTabStyle }
                    button
                    onClick={onCreateMapClicked}>
                    <ListItemIcon>
                        <CreateIcon sx ={{ color: currentPath === '/maps/create' ? '#FFFFFF' : '#A3AED0' }}/>
                    </ListItemIcon>
                    <ItemText primary="Map creator"/>
                </ListItem>
            </List>
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