import {
  Alert,
  Box,
  Button,
  debounce,
  FormControlLabel,
  Snackbar,
  styled,
  Switch,
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { random } from 'lodash';
import { isDesktop } from 'react-device-detect';

import {
  CreateMapRequest,
  CreateRoadNodeRequest,
  CreateRoadRequest,
  RoadNodeType,
} from '../requests';
import { useCreateMapMutation, useValidateMapMutation } from '../mapApi';
import MapVisualizer, {
  createNode,
  DISTANCE_MULTIPLIER,
} from '../MapVisualizer';
import { EdgeCreationData, ErrorState, SetMapStateLambdaType } from '../types';
import { arraysIntersect } from '../../common/mathUtils';
import { GraphData, Node } from '../VisGraph';

import TrafficToggle from './TrafficToggle';

const ActionButton = styled(Button)(() => ({
  padding: '10px',
  margin: '10px',
}));

const PaddedEditor = styled(Editor)(() => ({
  margin: '20px',
}));

const initialSkeleton: CreateMapRequest = {
  name: 'Example name',
  description: 'Example description describing your awesome map',
  type: 'MAP',
  compatibleWith: ['NAGEL_SCHRECKENBERG', 'MULTI_LANE_NAGEL_SCHRECKENBERG'],
  roadNodes: [
    {
      type: 'GATEWAY',
      name: 'A',
      position: {
        x: 0,
        y: 0,
      },
      endingRoadsIds: [],
      startingRoadsIds: [1],
    },
    {
      type: 'INTERSECTION',
      name: 'B',
      position: {
        x: 60,
        y: 40,
      },
      endingRoadsIds: [1],
      startingRoadsIds: [2],
      overrideTurnDirectionsTurnEverywhere: true,
    },
    {
      type: 'GATEWAY',
      name: 'C',
      position: {
        x: 0,
        y: 80,
      },
      endingRoadsIds: [2],
      startingRoadsIds: [],
    },
  ],
  roads: [
    {
      length: 60,
      name: 'A->B',
      lanes: [
        {
          startingPoint: 0,
          endingPoint: 60,
          indexFromLeft: 0,
          id: 0,
        },
        {
          startingPoint: 0,
          endingPoint: 60,
          indexFromLeft: 1,
          id: 1,
        },
      ],
      id: 1,
    },
    {
      length: 60,
      name: 'B->C',
      lanes: [
        {
          startingPoint: 0,
          endingPoint: 60,
          indexFromLeft: 0,
          id: 2,
        },
        {
          startingPoint: 0,
          endingPoint: 60,
          indexFromLeft: 1,
          id: 3,
        },
      ],
      id: 2,
    },
  ],
};

const format = (text: CreateMapRequest) => JSON.stringify(text, null, 2);
const formattedInitialText = format(initialSkeleton);

function setCursorAtString(
  editorObj: editor.IStandaloneCodeEditor | undefined,
  input: string,
) {
  if (editorObj) {
    const cursorPosition = editorObj
      .getModel()
      ?.getPositionAt(editorObj.getValue().indexOf(input));
    if (cursorPosition) {
      editorObj.setPosition(cursorPosition);
      editorObj.revealLineInCenter(cursorPosition?.lineNumber);
    }
    if (isDesktop) {
      editorObj.focus();
    }
  }
}

function findNodeByName(map: CreateMapRequest, nodeName: string) {
  return map.roadNodes.find((n) => n.name == nodeName);
}

function findNodeIndexByName(map: CreateMapRequest, nodeName: string) {
  return map.roadNodes.findIndex((n) => n.name == nodeName);
}

export default function CreateMapForm(): JSX.Element {
  const [validate, validateResult] = useValidateMapMutation();
  const [create, createResult] = useCreateMapMutation();

  const [editorContentError, setEditorContentError] = useState<ErrorState>({
    isPresent: false,
    data: undefined,
  });
  const [editorContentValidated, setEditorContentValidated] = useState(false);
  const [map, setMap] = useState(initialSkeleton);
  const [snackbarOpen, setSnackbarOpen] = useState(true);
  const [edgeCreationMode, setEdgeCreationMode] = useState<EdgeCreationData>({
    modeOn: false,
    firstNodeName: undefined,
  });
  const [roadNodeType, setRoadNodeType] = useState<RoadNodeType>('GATEWAY');

  const editorRef = useRef<editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (createResult.isError || createResult.isSuccess) {
      setSnackbarOpen(true);
    }
  }, [createResult]);

  useEffect(() => {
    setEditorContentError({
      isPresent: validateResult.isError,
      data: (validateResult.error as any)?.data || 'Unknown error.',
    });
    setEditorContentValidated(!validateResult.isError);
  }, [validateResult]);

  const handleInputChange = useMemo(
    () =>
      debounce((content) => {
        try {
          const mapRequest: CreateMapRequest = JSON.parse(content);
          setMap(mapRequest);
          setEditorContentError({ isPresent: false, data: undefined });
        } catch (e) {
          setEditorContentError({ isPresent: true, data: 'Invalid json.' });
        }
        setEditorContentValidated(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, 2000),
    [],
  );

  useEffect(() => {
    validate(initialSkeleton);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateEditorContent(newMap: CreateMapRequest, cursorAt?: string) {
    const editorObject = editorRef.current;
    if (editorObject) {
      const mapString = format(newMap);
      editorObject.setValue(mapString);
      if (cursorAt) {
        setCursorAtString(editorObject, `"${cursorAt}"`);
      }
    }
  }

  function handleCreateEdgeExistAlready() {
    setEditorContentError({
      isPresent: true,
      data: 'Error, road between nodes already exists',
    });
    setEdgeCreationMode({ modeOn: false, firstNodeName: undefined });
  }

  function createEdge(
    clickedNode: Node,
    mapState: GraphData,
    setMapState: SetMapStateLambdaType,
  ) {
    const firstNodeName = edgeCreationMode.firstNodeName;
    const clickedNodeName = clickedNode.label ?? '';
    if (!firstNodeName) {
      setEdgeCreationMode({ modeOn: true, firstNodeName: clickedNodeName });
    } else if (edgeCreationMode.firstNodeName === clickedNodeName) {
      setEdgeCreationMode({ modeOn: true, firstNodeName: undefined });
    } else {
      const firstIndex = findNodeIndexByName(map, firstNodeName);
      const secondIndex = findNodeIndexByName(map, clickedNodeName);
      const first = map.roadNodes[firstIndex];
      const second = map.roadNodes[secondIndex];
      if (first && second) {
        if (arraysIntersect(first.startingRoadsIds, second.endingRoadsIds)) {
          handleCreateEdgeExistAlready();
        } else {
          const roadName = `${firstNodeName}->${clickedNodeName}`;
          const roadId = random(100, 99999999);
          const newRoad: CreateRoadRequest = {
            length: 60,
            name: roadName,
            lanes: [
              {
                startingPoint: 0,
                endingPoint: 60,
                indexFromLeft: 0,
                id: random(100, 99999999),
              },
            ],
            id: roadId,
          };
          const notChangedNodes = map.roadNodes.filter(
            (node) => node.name != firstNodeName && node.name != clickedNodeName,
          );

          const newMap = {
            ...map,
            roadNodes: [
              ...notChangedNodes,
              {
                ...first,
                startingRoadsIds: [...first.startingRoadsIds, roadId],
              },
              {
                ...second,
                endingRoadsIds: [...second.endingRoadsIds, roadId],
              },
            ],
            roads: [newRoad, ...map.roads],
          };

          const firstNode = mapState.nodes.find(
            (n) => n.label === edgeCreationMode.firstNodeName,
          );
          if (firstNode) {
            setMapState((graph: GraphData) => {
              return {
                nodes: graph.nodes,
                edges: [
                  { from: firstNode.id, to: clickedNode.id, value: 1 },
                  ...graph.edges,
                ],
              };
            });
          }

          setMap(newMap);
          updateEditorContent(newMap, roadName);
          setEdgeCreationMode({ modeOn: true, firstNodeName: clickedNodeName });
        }
      }
    }
  }

  const createSelectHandler = (
    mapState: GraphData,
    setMapState: SetMapStateLambdaType,
  ) => {
    return (event: any) => {
      if (event.nodes.length == 1) {
        const nodeId = event.nodes[0];
        const clickedNode = mapState.nodes.find((n) => n.id === nodeId);
        if (clickedNode && clickedNode.label) {
          if (edgeCreationMode.modeOn) {
            createEdge(clickedNode, mapState, setMapState);
          } else {
            setCursorAtString(editorRef.current, `"${clickedNode.label}"`);
            setEdgeCreationMode({
              modeOn: false,
              firstNodeName: clickedNode.label,
            });
          }
        }
      }
    };
  };

  const createNodeDeselectedHandler = () => {
    return () =>
      setEdgeCreationMode((old) => ({
        modeOn: old.modeOn,
        firstNodeName: undefined,
      }));
  };

  const createDoubleClickHandler = (setMapState: SetMapStateLambdaType) => {
    return (event: any) => {
      const newPosition = {
        x: Math.round(event.pointer.canvas.x / DISTANCE_MULTIPLIER),
        y: Math.round(event.pointer.canvas.y / DISTANCE_MULTIPLIER),
      };
      const newNodeName = 'New node ' + random(100, 9999);
      const newNode: CreateRoadNodeRequest = {
        type: roadNodeType,
        name: newNodeName,
        position: newPosition,
        endingRoadsIds: [],
        startingRoadsIds: [],
      };
      if (roadNodeType == 'INTERSECTION') {
        newNode.overrideTurnDirectionsTurnEverywhere = true;
      }
      const newMap: CreateMapRequest = {
        ...map,
        roadNodes: [newNode, ...map.roadNodes],
      };
      updateEditorContent(newMap, newNodeName);
      setMap(newMap);
      setMapState((graph: GraphData) => {
        return {
          nodes: [
            ...graph.nodes,
            createNode(
              random(100, 999999),
              newNodeName,
              roadNodeType,
              newPosition,
            ),
          ],
          edges: [...graph.edges],
        };
      });
    };
  };

  const createNodeMovedHandler = (mapState: GraphData) => {
    return (event: any) => {
      if (event.nodes.length === 1) {
        const nodeMovedId = event.nodes[0];
        const nodeMoved = mapState.nodes.find((n) => n.id === nodeMovedId);
        if (nodeMoved) {
          // using position of mouse pointer, so some drags can be little bit off,
          // but I couldn't find exact position where node had moved ;(
          const newX = Math.round(event.pointer.canvas.x / DISTANCE_MULTIPLIER);
          const newY = Math.round(event.pointer.canvas.y / DISTANCE_MULTIPLIER);

          nodeMoved.x = newX * DISTANCE_MULTIPLIER;
          nodeMoved.y = newY * DISTANCE_MULTIPLIER;
          const nodeName = nodeMoved.label ?? '';
          const movedNodePosition = findNodeByName(map, nodeName)?.position;
          if (movedNodePosition) {
            movedNodePosition.x = newX;
            movedNodePosition.y = newY;
          }
          updateEditorContent(map, nodeName);
        }
      }
    };
  };

  function clearNodes() {
    setMap((old) => {
      const newMap = {
        ...old,
        roadNodes: [],
        roads: [],
      };
      updateEditorContent(newMap);
      validate(newMap);
      return newMap;
    });
  }

  return (
      <Box margin="0 10px" display="flex" justifyContent="stretch">
        <Box sx={{ width: '45%' }}>
          <ActionButton
              variant="contained"
              onClick={() => create(map)}
              disabled={!editorContentValidated}
          >
            Create
          </ActionButton>
          <ActionButton
              variant="contained"
              onClick={() => validate(map)}
              disabled={editorContentError.data === 'Invalid json.'}
          >
            Validate and draw input
          </ActionButton>
          <FormControlLabel
              control={
                <Switch
                    checked={edgeCreationMode.modeOn}
                    onChange={() => {
                      if (edgeCreationMode.modeOn) {
                        setEdgeCreationMode({
                          modeOn: false,
                          firstNodeName: edgeCreationMode.firstNodeName,
                        });
                      } else {
                        setEdgeCreationMode({
                          modeOn: true,
                          firstNodeName: edgeCreationMode.firstNodeName,
                        });
                      }
                    }}
                />
              }
              label="Edge creation mode"
          />
          <TrafficToggle value={roadNodeType} setValue={setRoadNodeType} />
          <ActionButton
              variant="contained"
              onClick={() => clearNodes()}
              color="warning"
          >
            Clear nodes
          </ActionButton>
          <PaddedEditor
              onMount={(editorInstance) => (editorRef.current = editorInstance)}
              height="90vh"
              defaultLanguage="json"
              defaultValue={formattedInitialText}
              onChange={(value) => handleInputChange(value)}
          />
        </Box>
        <Box width="100%" height="100vh">
          {editorContentError.isPresent ? (
              <Alert severity="error" sx={{ position: 'fixed', zIndex: '999' }}>
                {editorContentError.data}
              </Alert>
          ) : null}
          {validateResult.isSuccess ? (
              <MapVisualizer
                  map={validateResult.data}
                  createSelectHandler={createSelectHandler}
                  createDoubleClickHandler={createDoubleClickHandler}
                  createNodeMovedHandler={createNodeMovedHandler}
                  createNodeDeselectedHandler={createNodeDeselectedHandler}
                  interactable
              />
          ) : null}
        </Box>
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={validateResult.isError ? 15000 : 3000}
            sx={{ marginBottom: 5 }}
            onClose={() => setSnackbarOpen(false)}
        >
          <Alert
              severity={createResult.isError ? 'error' : 'success'}
              sx={{ position: 'fixed', zIndex: '999' }}
          >
            {createResult.isError
              ? 'Error: ' + (createResult.error as any)?.data || 'Unknown error.'
              : 'Success'}
          </Alert>
        </Snackbar>
      </Box>
  );
}
