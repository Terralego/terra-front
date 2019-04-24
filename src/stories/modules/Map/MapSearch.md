### Search in Map

Map component comes with a "in map" search control. It will helps you to insert a search input, display search results and, by default, center map on clicked result. These feature needs some props to be configured:

| Prop | Type | Description | Default |
| - | - | - |
| `displaySearchControl` | Boolean | Will display or remove the search button from map | false |
| `onSearch` | Function | This function is called every time the user type in the search input. It may return a Promise resolving an array of results (see below). | Do nothing |
| `renderSearchResults` | Function | Search results rendering. Takes a component which will take `results` in props. | Search results will be displayed with a bundled component. |
| `onSearchResultClick` | Function | Function triggered when user click on a search result item when renderSearchResult is the default component. The function take `result` as parameter. | The map will be centered to the `center` attribute included in the result. |

#### Results interface

`onSearch` prop function may return an array of object. Theses objects must contains a `group` name with a `results` list. These `results` array should contains any result object with `label` and `center`attributes. `center` are the latitude, longitude of the result item.

`[{
  group: 'group title',  
  results: [{  
    label: 'result item label',  
    center: [5.4859932, 43.3271871]  
  }]  
}]`
