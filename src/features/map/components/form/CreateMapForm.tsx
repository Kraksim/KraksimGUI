import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Snackbar,
  styled,
  Switch,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Form, useFormikContext } from 'formik';

import {
  RoadNodeType,
} from '../../requests';
import MapVisualizer, {
  DISTANCE_MULTIPLIER,
  getNodeType,
} from '../../MapVisualizer';
import { EdgeCreationData, Position } from '../../types';
import { arraysIntersect, idGenerator } from '../../../common/utils';
import { GraphData, Node } from '../../VisGraph';
import TrafficToggle from '../TrafficToggle';

import { GatewayForm, IntersectionForm, RoadForm } from './map-forms';
import {
  FocusedElement, InitialMapFormValues, PartialGateway, PartialIntersection, PartialRoad, 
} from './types';
import { getRoadNodesFormikPrefix, mapFormValuesToBasicMap } from './mapFormUtils';
import MapInfoForm from './map-forms/MapInfoForm';

const ActionButton = styled(Button)(() => ({
  padding: '10px',
  margin: '10px',
}));


function getFormToRender(element: FocusedElement) {
  const returnMap = {
    'INTERSECTION': IntersectionForm,
    'ROAD': RoadForm,
    'GATEWAY': GatewayForm,
  };

  const Render = returnMap[element.type];
  return <Render element={element}/>;
}

interface Props {
  isError: boolean;
  isSuccess: boolean;
  error: any;
}

export default function CreateMapForm({ isError, isSuccess, error }: Props): JSX.Element {
  const [focusedItem, setFocusedItem] = useState<FocusedElement | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [edgeCreationMode, setEdgeCreationMode] = useState<EdgeCreationData>({
    modeOn: false,
    firstNodeId: undefined,
  });
  
  const formik = useFormikContext<InitialMapFormValues>();

  function findNodeInFormikValues(nodeId: number): PartialGateway | PartialIntersection {
    return (formik.values.gateways[nodeId] ??
       formik.values.intersections[nodeId]);
  }

  function findRoadInFormikValues(roadId: number): PartialRoad {
    return formik.values.roads[roadId];
  }

  function findStartAndEndOfRoad(road: PartialRoad): 
  [PartialGateway | PartialIntersection, PartialGateway | PartialIntersection] {
    const allNodes = [...Object.values(formik.values.gateways), ...Object.values(formik.values.intersections)];
    
    const start = allNodes
      .find(node => node.startingRoadsIds.some(roadId => roadId === road.id)); 
    const end = allNodes
      .find(node => node.endingRoadsIds.some(roadId => roadId === road.id)); 

    return [start as PartialGateway | PartialIntersection, end as PartialGateway | PartialIntersection];
  }

  const [roadNodeType, setRoadNodeType] = useState<RoadNodeType>('GATEWAY');



  useEffect(() => {
    if (isError || isSuccess) {
      setSnackbarOpen(true);
    }
  }, [isError, isSuccess]);

  function handleCreateEdgeExistAlready(node: PartialGateway | PartialIntersection) {
    setEdgeCreationMode({ modeOn: false, firstNodeId: node.id });
  }
  
  function calculateDistance(a: Position, b: Position): number{
    return Math.floor(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)));
  }

  function createEdge(
    clickedNode: Node,
  ) {
    if (!edgeCreationMode.firstNodeId) {
      setEdgeCreationMode({ modeOn: true, firstNodeId: clickedNode.id as number });
    } else if (edgeCreationMode.firstNodeId === clickedNode.id) {
      setEdgeCreationMode({ modeOn: true, firstNodeId: undefined });
    } else {
      const first = findNodeInFormikValues(edgeCreationMode.firstNodeId);
      const second = findNodeInFormikValues(clickedNode.id as number);
      if (first && second) {
        if (arraysIntersect(first.startingRoadsIds, second.endingRoadsIds)) {
          handleCreateEdgeExistAlready(second);
        } else {
          const roadName = `${first.name}->${second.name}`;
          const roadId = idGenerator.getId();
          const distance = calculateDistance(first.position, second.position);
          const newRoad: PartialRoad = {
            length: distance,
            name: roadName,
            lanes: [
              {
                startingPoint: 0,
                endingPoint: distance,
                indexFromLeft: 0,
                id: idGenerator.getId(),
              },
            ],
            id: roadId,
          };

          const firstNode = findNodeInFormikValues(first.id as number);
          formik.setFieldValue(`${getRoadNodesFormikPrefix(first.type)}.${first.id}`, {
            ...firstNode,
            startingRoadsIds: [...firstNode.startingRoadsIds, roadId],
          });

          const secondNode = findNodeInFormikValues(second.id as number);
          formik.setFieldValue(`${getRoadNodesFormikPrefix(second.type)}.${second.id}`, {
            ...secondNode,
            endingRoadsIds: [...secondNode.endingRoadsIds, roadId],
          });

          formik.setFieldValue(`roads.${roadId}`, newRoad);

          setEdgeCreationMode({ modeOn: true, firstNodeId: clickedNode.id as number });
        }
      }
    }
  }

  const createSelectHandler = (
    mapState: GraphData,
  ) => {
    return (event: any) => {
      if (event.nodes.length == 1) {
        const nodeId = event.nodes[0];
        const clickedNode = mapState.nodes.find((n) => n.id === nodeId);
        if (clickedNode && clickedNode.label) {
          const nodeType = getNodeType(clickedNode);
          setFocusedItem({
            type: nodeType,
            id: clickedNode.id as number,
          });
          if (edgeCreationMode.modeOn) {
            createEdge(clickedNode);
          } else {
            setEdgeCreationMode({
              modeOn: false,
              firstNodeId: clickedNode.id as number,
            });
          }
        }
      }
    };
  };

  const createEdgeDeselectedHandler = () => () => setFocusedItem(null);

  const createEdgeSelectHandler = (mapState: GraphData) => (event: any) => {
    console.log(event);
    if (event.edges.length === 1){
      const edgeId = event.edges[0];
      const clickedEdge = mapState.edges.find((n) => n.id === edgeId);
      if (clickedEdge){
        setFocusedItem({
          type: 'ROAD',
          id: clickedEdge.id as number,
        });    
      }
    }
  };

  const createNodeDeselectedHandler = () => {
    return () => {
      setFocusedItem(null);
      setEdgeCreationMode((old) => ({
        modeOn: old.modeOn,
        firstNodeId: undefined,
      }));
    };
  };

  const createDoubleClickHandler = () => {
    return (event: any) => {
      const newPosition = {
        x: Math.round(event.pointer.canvas.x / DISTANCE_MULTIPLIER),
        y: Math.round(event.pointer.canvas.y / DISTANCE_MULTIPLIER),
      };
      const newId = idGenerator.getId();
      const newNodeName = newId.toString();
      const newNodeBase = {
        type: roadNodeType,
        name: newNodeName,
        position: newPosition,
        endingRoadsIds: [],
        startingRoadsIds: [],
        id: newId,
      };
      
      let finalNode: PartialGateway | PartialIntersection;
      if (roadNodeType == 'INTERSECTION') {
        finalNode = { ...newNodeBase, overrideTurnDirectionsTurnEverywhere: true, turnDirections: [] };
      } else {
        finalNode = newNodeBase;
      }
      formik.setFieldValue(`${getRoadNodesFormikPrefix(finalNode.type)}.${newId}`, finalNode);
    };
  };

  const createNodeMovedHandler = () => {
    return (event: any) => {
      if (event.nodes.length === 1) {
        const nodeMovedId = event.nodes[0];
        const nodeMoved = findNodeInFormikValues(nodeMovedId);
        if (nodeMoved) {
          // using position of mouse pointer, so some drags can be little bit off,
          // but I couldn't find exact position where node had moved ;(
          const newX = Math.round(event.pointer.canvas.x / DISTANCE_MULTIPLIER);
          const newY = Math.round(event.pointer.canvas.y / DISTANCE_MULTIPLIER);
          const finalNode = {
            ...nodeMoved,
            position: { x: newX, y: newY },
          };
          formik.setFieldValue(`${getRoadNodesFormikPrefix(finalNode.type)}.${nodeMovedId}`, finalNode);
        }
      }
    };
  };

  const removeFocusedElement = () => {
    if (!focusedItem) return;
    
    const focusedItemCopy = focusedItem;
    setFocusedItem(null);

    if (focusedItemCopy.type === 'ROAD'){
      const road = findRoadInFormikValues(focusedItemCopy.id);
      const [first, second] = findStartAndEndOfRoad(road);

      formik.setFieldValue(`roads.${road.id}`, undefined);
      formik.setFieldValue(`${getRoadNodesFormikPrefix(first.type)}.${first.id}`, {
        ...first,
        startingRoadsIds: first.startingRoadsIds.filter(id => id !== road.id),
      });

      formik.setFieldValue(`${getRoadNodesFormikPrefix(second.type)}.${second.id}`, {
        ...second,
        endingRoadsIds: second.endingRoadsIds.filter(id => id !== road.id),
      });
    } else {
      const node = findNodeInFormikValues(focusedItemCopy.id);
      const roadIdsToRemove = [...node.startingRoadsIds, ...node.endingRoadsIds];
      formik.setFieldValue(`${getRoadNodesFormikPrefix(node.type)}.${node.id}`, undefined);
      roadIdsToRemove.forEach(roadId => {
        formik.setFieldValue(`roads.${roadId}`, undefined);
      });

      [...Object.entries(formik.values.intersections), ...Object.entries(formik.values.gateways)]
        .filter(([key]) => parseInt(key) !== node.id)
        .forEach(([key, value]) => {
          formik.setFieldValue(`${getRoadNodesFormikPrefix(value.type)}.${key}`, {
            ...value,
            startingRoadsIds: value.startingRoadsIds
              .filter(roadId => !roadIdsToRemove.some(idToRemove => roadId === idToRemove)),
            endingRoadsIds: value.endingRoadsIds
              .filter(roadId => !roadIdsToRemove.some(idToRemove => roadId === idToRemove)),
          });
        });
    }

  };

  const focusedElementForm = focusedItem ? getFormToRender(focusedItem) : <MapInfoForm values={formik.values} />
;
  
  return (
      <Box margin="0 10px" display="flex" justifyContent="stretch">
        <Box sx={{
          overflowY: 'scroll', 
          height: '90vh', 
          width:'50%', backgroundColor: 'white', borderRadius: '20px', padding: '16px', margin: '16px', 
        }}>
          <FormControlLabel
              control={
                <Switch
                    checked={edgeCreationMode.modeOn}
                    onChange={() => {
                      if (edgeCreationMode.modeOn) {
                        setEdgeCreationMode({
                          modeOn: false,
                          firstNodeId: edgeCreationMode.firstNodeId,
                        });
                      } else {
                        setEdgeCreationMode({
                          modeOn: true,
                          firstNodeId: edgeCreationMode.firstNodeId,
                        });
                      }
                    }}
                />
              }
              label="Edge creation mode"
          />
          <TrafficToggle value={roadNodeType} setValue={setRoadNodeType} />
          <Form>
          <ActionButton
              variant="contained"
              type='reset'
              color="warning"
          >
            Reset map
          </ActionButton>
          <ActionButton
              variant="contained"
              type='submit'
          >
            Create
          </ActionButton>
          <ActionButton variant="contained" type="reset" disabled={!focusedItem} onClick={removeFocusedElement}>
            Remove focused element
          </ActionButton>
          {focusedElementForm}
          </Form>
        </Box>
        <Box width="100%" height="100vh">
          {
              <MapVisualizer
                  map={mapFormValuesToBasicMap(formik.values)}
                  createSelectHandler={createSelectHandler}
                  createDoubleClickHandler={createDoubleClickHandler}
                  createNodeMovedHandler={createNodeMovedHandler}
                  createNodeDeselectedHandler={createNodeDeselectedHandler}
                  createEdgeDeselectedHandler={createEdgeDeselectedHandler}
                  createEdgeSelectHandler={createEdgeSelectHandler}
                  interactable
              />
          }
        </Box>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={isError ? 15000 : 3000}
            sx={{ marginBottom: 5 }}
            onClose={() => setSnackbarOpen(false)}
        >
          <Alert
              severity={isError ? 'error' : 'success'}
              sx={{ position: 'fixed', zIndex: '999' }}
          >
            {isError
              ? 'Error: ' + error?.data || 'Unknown error.'
              : 'Success'}
          </Alert>
        </Snackbar>
      </Box>
  );
}
