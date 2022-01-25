import { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL } from '../../Forms/Filters/index';

export const storyLayersTreeConfig = [
  {
    group: 'Story',
    exclusive: false,
    selectors: null,
    layers: [
      {
        initialState: {
          active: false,
          opacity: 1,
        },
        widgets: [
          {
            items: [
              {
                name: 'nbEAE',
                type: 'value_count',
                field: '_id',
                label: 'Nombre d\'espaces d\'activités',
                template: '{{value | int | formatNumber }}',
              },
              {
                name: 'nbEtab',
                type: 'sum',
                field: 'nb_etablissement',
                label: 'Nombre d\'établissements',
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'nbEmplois',
                type: 'sum',
                field: 'nb_emplois',
                label: 'Nombre d\'emplois',
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'vocDom',
                type: 'terms',
                field: 'voc_dom.keyword',
                label: 'Nombre d\'EAE en vocation industrielle',
                value: [
                  'Industrie',
                ],
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'totalSurface',
                type: 'sum',
                field: 'surf_total',
                label: 'Surface totale',
                template: '{{ value | int | formatNumber }}&nbsp;ha',
              },
            ],
            component: 'synthesis',
          },
        ],
        label: 'Dignissimos consequatur at fuga et animi voluptas.',
        content: '<p>Nihil eius sunt non perferendis qui odit. Ut quia non. Quisquam et aut itaque et et assumenda quia quia expedita.</p> <p>Ut eveniet quas fuga. Et provident veritatis. Architecto consectetur omnis. Ea qui harum doloremque aspernatur cupiditate enim molestias porro. Illo omnis sed vel laudantium minus beatae.</p> <p>Quaerat sed perferendis impedit dicta ut voluptatibus adipisci ut sequi. Excepturi aspernatur aliquam aut assumenda molestiae suscipit quia unde. Eos quae suscipit cupiditate est. Aut sit eos nisi. Autem ratione omnis. Possimus modi maiores voluptatem eius assumenda eligendi.</p> <p>Earum est laudantium quam molestiae placeat aut sed. Veritatis architecto voluptatem explicabo fugiat iusto odio enim iusto fugit. Maiores non optio quisquam in adipisci quidem consequuntur distinctio dolorem. A harum veniam exercitationem officia ut molestias. Expedita quo dolor et sunt quae numquam totam est et. Ex perferendis assumenda qui est voluptatem.</p>',
        layers: [
          '141309d862c693f72b64d93f27b9d274',
        ],
        legends: [],
        mainField: null,
        filters: {
          layer: 'zae',
          mainField: null,
          fields: null,
          form: null,
          exportable: false,
        },
      },
      {
        initialState: {
          active: false,
          opacity: 1,
        },
        widgets: [
          {
            items: [
              {
                name: 'nbEAE',
                type: 'value_count',
                field: '_id',
                label: 'Nombre d\'espaces d\'activités',
                template: '{{value | int | formatNumber }}',
              },
              {
                name: 'nbEtab',
                type: 'sum',
                field: 'nb_etablissement',
                label: 'Nombre d\'établissements',
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'nbEmplois',
                type: 'sum',
                field: 'nb_emplois',
                label: 'Nombre d\'emplois',
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'vocDom',
                type: 'terms',
                field: 'voc_dom.keyword',
                label: 'Nombre d\'EAE en vocation industrielle',
                value: [
                  'Industrie',
                ],
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'totalSurface',
                type: 'sum',
                field: 'surf_total',
                label: 'Surface totale',
                template: '{{ value | int | formatNumber }}&nbsp;ha',
              },
            ],
            component: 'synthesis',
          },
        ],
        label: 'Numquam qui nam id assumenda distinctio laborum.',
        content: '<p>Sunt quas placeat et quo ut maxime quia. Non consequuntur odit. Aliquam earum aut corrupti. Harum nihil porro eius consequatur a ducimus.</p>',
        layers: [
          'e951ab0e23e786a98ad1a4039c9897b9',
          'c18f114b3bc233961c8b90295dab69b7',
        ],
        legends: [],
        mainField: null,
        filters: {
          layer: 'zae',
          mainField: null,
          fields: null,
          form: null,
          exportable: false,
        },
      },
      {
        initialState: {
          active: false,
          opacity: 1,
        },
        widgets: [
          {
            items: [
              {
                name: 'nbEAE',
                type: 'value_count',
                field: '_id',
                label: 'Nombre d\'espaces d\'activités',
                template: '{{value | int | formatNumber }}',
              },
              {
                name: 'nbEtab',
                type: 'sum',
                field: 'nb_etablissement',
                label: 'Nombre d\'établissements',
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'nbEmplois',
                type: 'sum',
                field: 'nb_emplois',
                label: 'Nombre d\'emplois',
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'vocDom',
                type: 'terms',
                field: 'voc_dom.keyword',
                label: 'Nombre d\'EAE en vocation industrielle',
                value: [
                  'Industrie',
                ],
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'totalSurface',
                type: 'sum',
                field: 'surf_total',
                label: 'Surface totale',
                template: '{{ value | int | formatNumber }}&nbsp;ha',
              },
            ],
            component: 'synthesis',
          },
        ],
        label: 'Alias quae aspernatur.',
        content: '<p>Ducimus qui veritatis recusandae id ea ut et et doloremque. Enim magnam consequatur eum dolore a nesciunt voluptates aut quis. Soluta repudiandae voluptatibus at nulla sit qui quia iure. Consequuntur unde impedit et autem aut rem quis quo voluptatibus. At minima distinctio ut. Sunt sit quos ab.</p> <p>Consequatur optio eaque culpa magni non dolores. Mollitia beatae voluptas. Pariatur nesciunt molestias dolorem soluta voluptates sit dolorum. Sit a est est accusantium accusamus. Asperiores expedita porro optio consequatur.</p>',
        layers: [
          '07ea05471c38bb847afd6a245063de82',
        ],
        legends: [
          {
            items: [
              {
                color: '#ff8c00',
                label: 'Activités supports',
              },
              {
                color: '#965096',
                label: 'Commerce de détail',
              },
              {
                color: '#ff78a0',
                label: 'Commerce de gros',
              },
              {
                color: '#003c82',
                label: 'Construction',
              },
              {
                color: '#f5000a',
                label: 'Industrie',
              },
              {
                color: '#c8be00',
                label: 'Logistique',
              },
              {
                color: '#90ff77',
                label: 'Services aux particuliers',
              },
              {
                color: '#007dff',
                label: 'Services tertiaire supérieur',
              },
              {
                color: '#1e6414',
                label: 'Autres',
              },
            ],
            title: 'Vocation regroupée',
          },
        ],
        mainField: null,
        filters: {
          layer: 'zae',
          mainField: null,
          fields: null,
          form: null,
          exportable: false,
        },
      },
      {
        initialState: {
          active: false,
          opacity: 1,
        },
        widgets: [
          {
            items: [
              {
                name: 'nbEAE',
                type: 'value_count',
                field: '_id',
                label: 'Nombre d\'espaces d\'activités',
                template: '{{value | int | formatNumber }}',
              },
              {
                name: 'nbEtab',
                type: 'sum',
                field: 'nb_etablissement',
                label: 'Nombre d\'établissements',
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'nbEmplois',
                type: 'sum',
                field: 'nb_emplois',
                label: 'Nombre d\'emplois',
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'vocDom',
                type: 'terms',
                field: 'voc_dom.keyword',
                label: 'Nombre d\'EAE en vocation industrielle',
                value: [
                  'Industrie',
                ],
                template: '{{ value | int | formatNumber }}',
              },
              {
                name: 'totalSurface',
                type: 'sum',
                field: 'surf_total',
                label: 'Surface totale',
                template: '{{ value | int | formatNumber }}&nbsp;ha',
              },
            ],
            component: 'synthesis',
          },
        ],
        label: 'Tempore iste sit molestias culpa eum illum minima.',
        content: '<p>Distinctio animi aliquid consequatur molestiae ut. Tempore et non. Ratione minima minus quaerat laborum in. Rem maiores molestiae. Temporibus aspernatur autem.</p> <p>Ea doloremque temporibus beatae. Nulla ut dolor voluptatem hic doloribus. Quia saepe aut iusto in dolores vel expedita. Fugiat officia molestiae laborum dolorem aut ullam cum autem unde. Magni voluptatum accusantium iure mollitia ut exercitationem necessitatibus fugit.</p> <p>Et sunt odit molestiae blanditiis. Assumenda quibusdam harum quia sequi quibusdam quia sunt minus quo. Facere sint eum dolorem porro quas id nulla.</p>',
        layers: [
          'e29dfe0542fda106836a014b0a3a72c3',
        ],
        legends: [
          {
            items: [
              {
                color: '#b91a1c',
                label: 'Mixte',
                shape: 'square',
              },
              {
                color: '#b3de69',
                label: 'Tertiaire supérieur',
                shape: 'square',
              },
              {
                color: '#1f78b4',
                label: 'Industrie',
                shape: 'square',
              },
              {
                color: '#a6a5ae',
                label: 'Construction',
                shape: 'square',
              },
              {
                color: '#ec7c30',
                label: 'Commerce de détail',
                shape: 'square',
              },
              {
                color: '#fedb2a',
                label: 'Commerce de gros/Logistique',
                shape: 'square',
              },
              {
                color: '#8fa9db',
                label: 'Activités supports',
                shape: 'square',
              },
              {
                color: '#9e480d',
                label: 'Services aux particuliers',
                shape: 'square',
              },
              {
                color: '#1e6414',
                label: 'Autres',
                shape: 'square',
              },
            ],
            title: 'Vocation dominante calculée',
          },
        ],
        mainField: null,
        filters: {
          layer: 'zae',
          mainField: null,
          fields: null,
          form: null,
          exportable: false,
        },
      },
      {
        initialState: {
          active: false,
          opacity: 1,
        },
        widgets: null,
        label: 'Sit nesciunt velit.',
        content: '<p>Excepturi dolorum doloremque aperiam dolorem nihil architecto eum nostrum quis. Rerum molestiae magnam accusantium rerum. Autem sunt excepturi error molestiae consequatur dolorem omnis.</p> <p>Saepe ea in distinctio culpa nemo nam quis consequatur. Porro eligendi impedit cum maxime mollitia. Ipsa tenetur facilis. Itaque et consequuntur alias et ratione consequatur neque et tempore. Commodi exercitationem voluptatibus pariatur. Autem occaecati quisquam aut mollitia amet debitis occaecati.</p> <p>Sunt sit esse. Ut est praesentium necessitatibus exercitationem assumenda velit eum rerum dolore. Voluptatem sit ipsam rerum omnis explicabo et.</p> <p>Laboriosam nesciunt atque tempora. Optio nulla consequuntur dignissimos. Vero nobis nesciunt nihil omnis qui et non quia. Velit quod consequatur quas accusamus repellendus velit ipsum molestiae molestias. In dignissimos ad sed eos eum. Reiciendis similique eum et labore voluptatibus in deserunt deleniti placeat.</p> <p>Cupiditate adipisci laudantium ex mollitia et occaecati. Omnis dolor ullam dolorum aspernatur. Possimus cumque officia necessitatibus distinctio non labore officia et. Eligendi enim sequi magnam assumenda illo provident ut. Omnis autem optio quis sunt ea quaerat.</p>',
        layers: [
          '23f06262170d6b9a8594cab0fe01fc78',
        ],
        legends: [
          {
            items: [
              {
                color: '#fcbba1',
                label: 'Moins de 300',
                shape: 'circle',
                radius: 5,
              },
              {
                color: '#fc9272',
                label: 'De 300 à 1 000',
                shape: 'circle',
                radius: 10,
              },
              {
                color: '#fb6a4a',
                label: 'De 1 000 à 5 000',
                shape: 'circle',
                radius: 15,
              },
              {
                color: '#ef3b2c',
                label: 'De 5 000 à 15 000',
                shape: 'circle',
                radius: 20,
              },
              {
                color: '#cb181d',
                label: 'De 15 000 à 25 000',
                shape: 'circle',
                radius: 25,
              },
              {
                color: '#99000d',
                label: 'Plus de 25 000',
                shape: 'circle',
                radius: 30,
              },
            ],
            title: 'Nombre d’emplois',
          },
        ],
        mainField: null,
        filters: {
          layer: 'zae-centroid',
          mainField: null,
          fields: null,
          form: null,
          exportable: false,
        },
      },
      {
        initialState: {
          active: false,
          opacity: 1,
        },
        label: 'Et consequatur odio.',
        content: '<p>Cumque atque modi delectus non tempora porro. Illum quod eaque eos eum. Est quas earum. Quo impedit mollitia eveniet dolor eveniet dicta. Natus numquam eos illum exercitationem atque autem vel omnis.</p> <p>Inventore et consequatur occaecati et rerum hic voluptas iste. Illo earum eaque sit sunt. Omnis voluptatem id omnis expedita nisi sed velit consequatur distinctio.</p> <p>Et voluptate optio ducimus in praesentium nostrum est nisi. Aspernatur asperiores consequatur sapiente placeat sunt soluta. Facilis at et. Et ea modi iure est nam aut ducimus. Et ullam aut numquam voluptatum consequatur a qui. Fugiat et quis modi in sequi explicabo.</p>',
        layers: [
          'dd6adb26ec6d068aa327c6d00d54da1d',
          '762a31f9e6866a38d6e52ba826df2978',
          '5dd1bdd2d3fb3db2001f1425a9149ac3',
          'f668fca2a59cffecab506b812d81d6a2',
          'f37a280e3375efbddf2a02654286163b',
          '32e31d88df52291cb6279517673ba0dc',
          'ee94c74d1ae1061fade660d49451c63f',
          '9a4a9cda3834d6f357f192214ed69d24',
          '972c9939f53927df9f0db21bae132c02',
          'c1bc8bf07d1e607e00ad881eb9de80ca',
          '0d011c4c521b06ae6580cbcc4587a7d5',
        ],
        legends: [
          {
            items: [
              {
                color: '#ffb3a8',
                label: 'Moins de 20',
                shape: 'circle',
                radius: 10,
              },
              {
                color: '#d7887b',
                label: 'De 20 à 300 ',
                shape: 'circle',
                radius: 15,
              },
              {
                color: '#af5f51',
                label: 'De 300 à 800',
                shape: 'circle',
                radius: 20,
              },
              {
                color: '#883729',
                label: 'De 800 à 1200',
                shape: 'circle',
                radius: 22,
              },
              {
                color: '#600c00',
                label: 'Plus de 1200',
                shape: 'circle',
                radius: 25,
              },
            ],
            title: 'Nombre d\'établissements',
          },
          {
            items: [
              {
                color: '#ff8c00',
                label: 'Activités supports',
                shape: 'circle',
              },
              {
                color: '#1e6414',
                label: 'Agriculture',
                shape: 'circle',
              },
              {
                color: '#965096',
                label: 'Commerce de détail',
                shape: 'circle',
              },
              {
                color: '#ff78a0',
                label: 'Commerce de gros',
                shape: 'circle',
              },
              {
                color: '#003c82',
                label: 'Construction',
                shape: 'circle',
              },
              {
                color: '#f5000a',
                label: 'Industrie',
                shape: 'circle',
              },
              {
                color: '#c8be00',
                label: 'Logistique',
                shape: 'circle',
              },
              {
                color: '#90ff77',
                label: 'Services aux particuliers',
                shape: 'circle',
              },
              {
                color: '#007dff',
                label: 'Services tertiaire supérieur',
                shape: 'circle',
              },
            ],
            title: 'Activité',
          },
        ],
        mainField: null,
        filters: {
          layer: 'etablissements',
          mainField: null,
          fields: null,
          form: null,
          exportable: false,
        },
      },
    ],
  },
];

export default [{
  label: 'Très long nom de couche',
  initialState: {
    active: true,
    total: 42,
  },
  filters: {
    fields: [{
      label: 'foo',
      property: 'foo',
    }],
    form: [{
      label: 'Single value',
      property: 'single',
      type: TYPE_SINGLE,
    }, {
      label: 'Single value from an enum list',
      property: 'single-enum',
      type: TYPE_SINGLE,
      values: Array.from(new Array(12), (v, k) => `${k}`),
    }, {
      label: 'Many values from a short list',
      property: 'short-many-enum',
      type: TYPE_MANY,
      values: ['foo', 'bar', 'kit', 'kat'],
    }, {
      label: 'Many values from a short list displayed as a select',
      property: 'short-many-enum-as-select',
      type: TYPE_MANY,
      values: ['foo', 'bar', 'kit', 'kat'],
      display: 'select',
    }, {
      label: 'Many values from a long list',
      property: 'long-many-enum',
      type: TYPE_MANY,
      values: Array.from(new Array(42), (v, k) => `${k}`),
    }, {
      label: 'Single value from a fetched list',
      property: 'fetched-single-enum',
      type: TYPE_SINGLE,
      fetchValues: true,
    }, {
      label: 'Range numbers value',
      property: 'range-number',
      type: TYPE_RANGE,
      min: 0,
      max: 100,
    }, {
      label: 'Range numbers value with fetched max/min',
      property: 'range-number-fetched',
      type: TYPE_RANGE,
      fetchValues: true,
    }, {
      label: 'Range dates value',
      property: 'range-dates',
      type: TYPE_RANGE,
      format: 'date',
    }, {
      label: 'Boolean value',
      property: 'boolean',
      type: TYPE_BOOL,
    }],
    layer: 'layer1',
  },
  widgets: [{
    component: 'synthesis',
  }],
}, {
  label: 'un extrèmement long long nom de couche',
  initialState: {
    active: true,
    opacity: 0.2,
  },
}, {
  group: 'Groupées inclusives',
  initialState: {
    active: false,
  },
  layers: [{
    label: 'Couche 1',
  }, {
    label: 'Couche 2',
  }, {
    label: 'Couche 3',
  }],
}, {
  group: 'Grouped exclusive with radio',
  exclusive: true,
  layers: [{
    label: 'Couche 4',
  }, {
    label: 'Couche 5',
    filters: {
      fields: [{
        label: 'foo',
        property: 'foo',
      }],
      form: [{
        label: 'foo',
        property: 'foo',
        type: TYPE_SINGLE,
      }],
      layer: 'layer1',
    },
    widgets: [{
      component: 'synthesis',
    }],
    default: true,
  }, {
    label: 'Couche 6',
  }],
}, {
  group: 'Grouped exclusive with select',
  exclusive: true,
  filters: {
    fields: [{
      label: 'foo',
      property: 'foo',
    }],
    form: [{
      label: 'foo',
      property: 'foo',
      type: TYPE_SINGLE,
    }],
    layer: 'layer1',
  },
  widgets: [{
    component: 'synthesis',
  }],
  layers: [{
    label: 'Couche 7',
  }, {
    label: 'Couche 8',
  }, {
    label: 'Couche 9',
  }, {
    label: 'Couche 10',
  }, {
    label: 'Couche 11',
  }, {
    label: 'Couche 12',
  }],
}, {
  group: 'Grouped exclusive with radio and groups wich should not be displayed',
  exclusive: true,
  layers: [{
    label: 'Couche 4',
  }, {
    label: 'Couche 5',
  }, {
    group: 'Group',
    layers: [{
      label: 'Couche 7',
    }, {
      label: 'Couche 8',
    }],
  }, {
    label: 'Couche 6',
  }],
}, {
  group: 'Grouped exclusive with variable choice',
  exclusive: true,
  selectors: [{
    label: 'Year',
    name: 'year',
    values: [{
      label: '2019',
      value: '2019',
    }, {
      label: '2018',
      value: '2018',
    }, {
      label: '2017',
      value: '2017',
    }, {
      label: '2016',
      value: '2016',
    }],
  }, {
    label: 'Type',
    name: 'type',
    values: [{
      label: 'Foo',
      value: 'foo',
    }, {
      label: 'Bar',
      value: 'bar',
    }],
  }],
  layers: [{
    label: 'Couche 13',
    selectorKey: {
      year: '2017',
      type: 'foo',
    },
  }, {
    label: 'Couche 14',
    selectorKey: {
      year: '2019',
      type: 'foo',
    },
  }],
}, {
  group: 'Nested',
  layers: [{
    group: 'Very nested',
    layers: [{
      label: 'Couche 14',
    }, {
      group: 'Very very nested',
      layers: [{
        group: 'We need to go deeper',
        layers: [{
          label: '=_=',
        }, {
          label: 'Couche 15',
        }, {
          group: 'with exclusive group',
          exclusive: true,
          layers: [{
            label: 'Couche 16',
          }, {
            label: 'Couche 17',
          }],
        }],
      }],
    }],
  }, {
    label: 'Couche 13',
  }],
}];
