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

import {
  CreateMapRequest,
  CreateRoadNodeRequest,
  CreateRoadRequest,
  RoadNodeType,
} from '../requests';
import { useCreateMapMutation, useValidateMapMutation } from '../mapApi';
import MapVisualizer from '../MapVisualizer';
import { EdgeCreationData, ErrorState, Position } from '../types';
import { arraysIntersect } from '../../common/mathUtils';

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
    if (cursorPosition)
      editorObj.setPosition(cursorPosition);
    editorObj.focus();
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

  const [editorContentError, setEditorContentError] =
      useState<ErrorState>({ isPresent: false, data: undefined });
  const [editorContentValidated, setEditorContentValidated] = useState(false);
  const [map, setMap] = useState(initialSkeleton);
  const [snackbarOpen, setSnackbarOpen] = useState(true);
  const [edgeCreationMode, setEdgeCreationMode] =
      useState<EdgeCreationData>({ modeOn: false, firstNodeName: undefined });
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
      }, 2000), []);

  useEffect(() => {
    validate(initialSkeleton);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCreateEdge(clickedNodeName: string) {
    const firstNodeName = edgeCreationMode.firstNodeName;
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
          setEditorContentError({
            isPresent: true,
            data: 'Error, road between nodes already exists',
          });
          setEdgeCreationMode({ modeOn: false, firstNodeName: undefined });
          return;
        }
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

        const notChangedNodes = map.roadNodes.filter((node) =>
          node.name != firstNodeName && node.name != clickedNodeName,
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

        setMap(newMap);
        updateEditorContent(newMap, roadName);
        setEdgeCreationMode({ modeOn: true, firstNodeName: undefined });
      }
    }
  }

  function handleSelect(clickedNodeName: string) {
    if (edgeCreationMode.modeOn) {
      handleCreateEdge(clickedNodeName);
    } else {
      setCursorAtString(editorRef.current, `"${clickedNodeName}"`);
    }
  }

  function updateEditorContent(
    newMap: CreateMapRequest,
    cursorAt?: string,
  ) {
    const editorObject = editorRef.current;
    if (editorObject) {
      const mapString = format(newMap);
      editorObject.setValue(mapString);
      if (cursorAt) {
        setCursorAtString(editorObject, `"${cursorAt}"`);
      }
    }
  }

  function handleDoubleClick(
    x: number,
    y: number,
  ): { type: RoadNodeType; position: Position; name: string } {
    const newNodeName = 'New node ' + random(100, 9999);
    const newNode: CreateRoadNodeRequest = {
      type: roadNodeType,
      name: newNodeName,
      position: {
        x: x,
        y: y,
      },
      endingRoadsIds: [],
      startingRoadsIds: [],
    };
    if (roadNodeType == 'INTERSECTION') {
      newNode.overrideTurnDirectionsTurnEverywhere = true;
    }
    const newMap : CreateMapRequest = {
      ...map,
      roadNodes: [newNode, ...map.roadNodes],
    };
    updateEditorContent(newMap, newNodeName);
    setMap(newMap);
    return newNode;
  }

  function handleNodeMoved(x: number, y: number, nodeName: string) {
    const movedNodePosition = findNodeByName(map, nodeName)?.position;
    if (movedNodePosition) {
      movedNodePosition.x = x;
      movedNodePosition.y = y;
    }
    updateEditorContent(map, nodeName);
  }

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
                        setEdgeCreationMode({ modeOn: false, firstNodeName: undefined });
                      } else {
                        setEdgeCreationMode({ modeOn: true, firstNodeName: undefined });
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
                  select={handleSelect}
                  doubleClick={handleDoubleClick}
                  onNodeMoved={handleNodeMoved}
                  edgeCreation={{
                    value: edgeCreationMode,
                    setter: setEdgeCreationMode,
                  }}
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
