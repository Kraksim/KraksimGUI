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
import SvgIcon from '@mui/material/SvgIcon/SvgIcon';

import CompareSimulationDialog from '../home/dialogs/CompareSimulationsDialog';
import useWindowDimensions from '../../common/hooks';

const EXPANDED_WIDTH = '250px';
const COLLAPSED_WIDTH = '66px';
const MAX_XD = 1006;

const ItemText = styled(ListItemText)(() => ({
  whiteSpace: 'nowrap',
}));

export default function PageMenu(): JSX.Element {
  const [compareSimulationsDialogOpened, setCompareSimulationsDialogOpened] = useState(false);
  const { width:windowWidth } = useWindowDimensions();

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

  const isBigScreen = windowWidth >= MAX_XD;
  const drawerWidth = isBigScreen ? EXPANDED_WIDTH : COLLAPSED_WIDTH;
  const listPadding = {
    padding: '30px',

    '@media (max-width: 1006px)': {
      padding: '15px 5px 0 5px',
    },

  };
  const logoSx = {
    padding: '18px 0px 22px 30px',
    '@media (max-width: 1006px)': {
      padding: '0',
    },
  };
  return (
    <>
        <Drawer variant="permanent" sx={{ width: drawerWidth }}>
            <Box width={drawerWidth}>
                <Box sx={logoSx}>
                    <IconButton onClick={onLogoClick}>
                        <img alt="kraksim-logo"
                             style={{ width: '50px', height: '50px' }}
                             src={'/logo192.png'}
                        />
                    </IconButton>
                </Box>
                <Divider/>
                <List sx={listPadding}>
                    <PageListItem
                        text="Maps"
                        clicked={currentPath === '/maps/all'}
                        onClick={onViewMapsClicked}
                        Icon={MapIcon}
                        expanded={isBigScreen}/>
                    <PageListItem
                        text="Simulations"
                        clicked={currentPath === '/simulations/all'}
                        onClick={onViewSimulationsClicked}
                        Icon={UpdateIcon}
                        expanded={isBigScreen}/>
                    <PageListItem
                        text="Comparator"
                        clicked={currentPath === '/simulations/compare'}
                        onClick={() => setCompareSimulationsDialogOpened(true)}
                        Icon={QueryStatsIcon}
                        expanded={isBigScreen}/>
                    <PageListItem
                        text="Map creator"
                        clicked={currentPath === '/maps/create'}
                        onClick={onCreateMapClicked}
                        Icon={CreateIcon}
                        expanded={isBigScreen}/>
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

interface Props {
  text: string;
  clicked: boolean;
  onClick: () => void;
  Icon: typeof SvgIcon;
  expanded: boolean
}

export function PageListItem({
  text, clicked, onClick, Icon, expanded,
}: Props) : JSX.Element{

  const normalTabStyle = {
    marginBottom: '16px',
    color: '#A3AED0',
    borderRadius: '5px',
    '@media (max-width: 1006px)': {
      paddingLeft: '16px',
    },
  };
  const currentTabStyle = {
    ...normalTabStyle,
    backgroundColor: '#337180',
    color: '#FFFFFF',
    ':hover': {
      bgcolor: '#337180',
    },
  };


  const styledIcon = <Icon sx={{ color: clicked ? '#FFFFFF' : '#A3AED0' }}/>;
  return <ListItem
        sx={clicked ? currentTabStyle : normalTabStyle}
        button
        onClick={onClick}>
        {
            expanded
              ? <ListItemIcon>
                    {styledIcon}
                </ListItemIcon>
              : styledIcon
        }

        {expanded ? <ItemText primary={text}/> : null}
    </ListItem>;
}