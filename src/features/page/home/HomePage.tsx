import { Typography, Box, styled } from '@mui/material';
import React from 'react';

const MainContainerWrapper = styled(Box)(() => ({
  ':before': {
    content: '" "',
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    opacity: '0.2',
    backgroundImage: 'url("./map-bg.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '50% 0',
  },
  position: 'relative',
  width: '100%',
  height: '100%',
}));

const MainContainer = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  position: 'relative',
}));

const SectionBox = styled(Box)(() => ({
  margin: '10px',
}));

const TextBox = styled(Box)(() => ({
  textAlign: 'left',
  margin: '20px 60px',
}));

export default function HomePage(): JSX.Element {
  return (
    <MainContainerWrapper>
      <MainContainer>
        <SectionBox>
          <Typography variant="h1">Kraksim</Typography>
          <Typography variant="h4">Traffic Simulator</Typography>
        </SectionBox>
        <SectionBox>
          <TextBox>
            <Typography variant="h5" gutterBottom component="div">
              What is Kraksim?
            </Typography>
            <Typography variant="body1" gutterBottom>
              Kraksim is an environment for modeling and optimisation of road
              traffic. It gives you possibility to create maps and simulations
              and to collect the data about road traffic. You can also view and
              compare results of different simulations which take place on the
              same map.
            </Typography>
          </TextBox>
          <TextBox>
            <Typography variant="h5" gutterBottom component="div">
              How do I use Kraksim?
            </Typography>
            <Typography variant="body1" gutterBottom>
              Start with creating a map which you want to simulate traffic on
              (Map Creator will be helpful!). Next select created map in "Maps"
              list, and select "Create Simulation". Fill the form with data
              about your simulation, submit it, go to the "Simulations" tab and
              progress it by selected number of turns. After the simulation is
              completed, view the statistics by pressing "Show statistics"
              button. If you create another simulation on the same map (for
              example with different algorithm for changing traffic lights or
              different setup of generators), you can compare it to the previous
              one by filling the form in the "Comparator" modal.
            </Typography>
          </TextBox>
        </SectionBox>
      </MainContainer>
    </MainContainerWrapper>
  );
}
