import { Collapse } from '@blueprintjs/core';
import React, { useContext, useState } from 'react';
import LayersTreeItem from '.';
import Select from '../../../Forms/Controls/Select';
import context from '../LayersTreeProvider/context';

const mock_variables = [
  {
    id: 'fe241425-3e33-426a-b068-7bf81052b6e6',
    label: 'Zone géo',
  },
  {
    id: 'dbeae359-261a-43f7-8757-da9637ad48db',
    label: 'Année',
  },
];

const mock_layers = [
  {
    initialState: {
      active: false,
      opacity: 1,
    },
    widgets: {},
    id: 78,
    label: 'Toponymes',
    content: '',
    source_filter: '',
    layers: ['d5537b7e5fd1f0288e9d7e207ede5475'],
    legends: [],
    mainField: 'nom',
    variables: {
      'dbeae359-261a-43f7-8757-da9637ad48db': '2023',
      'fe241425-3e33-426a-b068-7bf81052b6e6': 'Département',
    },
    filters: {
      layer: 'geo_toponymes',
      layerId: 78,
      mainField: 'nom',
      fields: null,
      form: null,
      exportable: false,
    },
    source_credit: '',
  },
  {
    initialState: {
      active: false,
      opacity: 1,
    },
    widgets: {},
    variables: {
      'dbeae359-261a-43f7-8757-da9637ad48db': '2020',
      'fe241425-3e33-426a-b068-7bf81052b6e6': 'Région',
    },
    id: 76,
    label: 'Toponymes',
    content: '',
    source_filter: '',
    layers: ['f0c4d3276aa82b7d3c08c1029ace3f13'],
    legends: [],
    mainField: 'nom',
    filters: {
      layer: 'geo_toponymes',
      layerId: 76,
      mainField: 'nom',
      fields: null,
      form: null,
      exportable: false,
    },
    source_credit: '',
  },
  {
    initialState: {
      active: false,
      opacity: 1,
    },
    embed: [
      {
        src: 'http://perdu.com',
        title: 'dshfas',
        fullScreen: true,
      },
    ],
    variables: {
      'dbeae359-261a-43f7-8757-da9637ad48db': '2021',
      'fe241425-3e33-426a-b068-7bf81052b6e6': 'Département',
    },
    widgets: {},
    embed_enable: true,
    id: 61,
    label: 'Toponymes',
    content: '',
    source_filter: '',
    layers: ['dca13ca34c9756f511ac2ac49a4dfe89'],
    legends: [],
    mainField: 'nom',
    filters: {
      layer: 'geo_toponymes',
      layerId: 61,
      mainField: 'nom',
      fields: null,
      form: null,
      exportable: false,
    },
    source_credit: '',
  },
];

const getLayerVariables = layer =>
  layer.variables || (mock_layers.find(l => l.id === layer.id)?.variables ?? {});

const getSelectedLayer = (selectedVariables, layers) =>
  layers.find(layer =>
    Object.entries(selectedVariables).every(
      ([variable, value]) => getLayerVariables(layer)?.[variable] === value,
    ),
  );

const getValuesByVariable = (variables, layers) => {
  const values = {};
  variables.forEach(variable => {
    values[variable.id] = Array.from(
      new Set(layers.map(layer => getLayerVariables(layer)?.[variable.id])),
    ).sort();
  });
  return values;
};

const getPossibleValues = (variables, layers, selectedVariables) => {
  const possibleLayers = layers.filter(layer =>
    Object.entries(selectedVariables).every(
      ([variable, value]) => getLayerVariables(layer)?.[variable] === value,
    ),
  );
  return getValuesByVariable(variables, possibleLayers);
};

const LayersTreeVariableItem = ({ group, layers }) => {
  const variables = group.variables || mock_variables;

  const [selectedVariables, setSelectedVariables] = React.useState(
    getLayerVariables(layers[0]) || {},
  );

  const [layer, setLayer] = useState(getSelectedLayer(selectedVariables, layers));

  const { setLayerState, getLayerState, layersExtent, isDetailsVisible } = useContext(context);

  const valuesByVariable = getValuesByVariable(variables, layers);

  const handleChange = (variable, value) => {
    const newSelectedVariables = { ...selectedVariables, [variable]: value };
    const newLayer = getSelectedLayer(newSelectedVariables, layers);
    if (!newLayer) return;
    setLayerState({ layer, state: { active: false } });
    setLayerState({ layer: newLayer, state: { active: true } });
    setSelectedVariables(newSelectedVariables);
    setLayer(newLayer);

    // possible values for subset of selectedVariables
    console.log('possibleValues', getPossibleValues(variables, layers, { [variable]: value }));
  };

  const layerActive = getLayerState({ layer }).active;

  return (
    <>
      <div className="layerstree-group layerstree-group--active">
        {layer && (
          <LayersTreeItem
            key={layer.label}
            layer={layer}
            customLabel={
              layerActive
                ? `${layer.label} (${Object.values(selectedVariables).join(' - ')})`
                : null
            }
            extent={layersExtent?.[layer.label]}
            isDetailsVisible={isDetailsVisible}
          />
        )}
        <Collapse isOpen={layerActive}>
          <div style={{ padding: 5, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {variables.map(variable => (
              <Select
                fullWidth
                value={selectedVariables[variable.id]}
                onChange={value => handleChange(variable.id, value)}
                values={valuesByVariable[variable.id]}
              />
            ))}
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default LayersTreeVariableItem;
