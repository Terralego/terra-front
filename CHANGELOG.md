
1.7.1 / 2019-10-14
==================

  * Remove ' : ' on details styles

1.7.0 / 2019-10-10
==================

  * Increase device pixel ratio for printing
  * Fix scss on hover and focus in mapbox-crtl
  * Fix warning about initialContent and intialprops in Filter
  * Improve filters fetching performance and UX
  * Add missing translation

1.6.10 / 2019-09-24
===================

  * Update formatType in table

1.6.9 / 2019-09-17
==================

  * Improve responsive styles
  * Remove map tooltips display on mobile device

1.6.8 / 2019-09-17
==================

  * Fix the legend size for stacked circles
  * Allow typing minus in range numeric
  * Fix connect HOC on FilterPanelContent

1.6.7 / 2019-09-12
==================

  * Update translation
  * Move TooManyResults
  * Move PrivateLayers
  * Convert Text to functional component
  * Convert Filters to functional component
  * Convert Checkbox to functional component
  * Move MapNavigation

1.6.6 / 2019-09-11
==================

  * Move Details from project
  * Fix tests
  * Change button tooltip behavior with touch device
  * Remove hook-based component
  * Keep radius to maintain compatibility
  * Rename the legend radius to diameter

1.6.5 / 2019-09-09
==================

  * Resolve eslint-utils vulnerability issue through npm audit
  * Fix package-lock inconsistency

1.6.4 / 2019-09-09
==================

  * Revamp Range filter
  * Split Range component and use hooks
  * Dissociate every filter in Stories
  * Extract search from project

1.6.3 / 2019-09-06
==================

  * Do not displayTooltip if pointer is not over Map anymore
  * Consider being over controls as beeing outside of the map for mouseover behavior
  * Ensure translation works in stories

1.6.2 / 2019-09-05
==================

  * Add missing tests
  * Hide layers groups

1.6.1 / 2019-09-05
==================

  * Add cancel button in print control
  * Fix iterator key issue in LayersTree
  * Fix light theme controls
  * Add knobs on controls story, rename and fix css class on share ctrl
  * Replace link by share icon n share control
  * Remove autofocus on twitter share control button
  * Refactor all Filters translations
  * Translate placeholder of select filter
  * Add automatic translations extraction
  * Add translations

1.6.0 / 2019-09-03
==================

  * Implement stackedCircles props in Legend
  * Add onToggle prop on Print Control
  * Pass props to BackgroundStyle control
  * Update Proptypes + Add key in tooltip
  * Translate share label
  * Ensure HOC display name

1.5.3 / 2019-09-02
==================

  * Fix print control

1.5.2 / 2019-09-02
==================

  * Add test on legend source
  * Fix warning zoom for groups

1.5.1 / 2019-09-02
==================

  * Fix all circle legend positioning
  * Add responsive style for permalink

1.5.0 / 2019-08-30
==================

  * Fix css cursor on home control
  * Add translation in navigation control
  * Add social networks in share control

1.4.0 / 2019-08-30
==================

  * Add stories for Legend component and source property
  * Add source property for Legend component

1.3.0 / 2019-08-30
==================

  * Setup ESlint to also check Storybook config
  * Cleanup ThemeSwitcher Storybook addon
  * Cleanup Storybook stories
  * Fix warning zoom check

1.2.5 / 2019-08-29
==================

  * Revert "Replace babel preset with react"

v1.2.4 / 2019-08-29
===================

  * Upgrade mapbox
  * Replace babel preset with react
  * Allow text content in Legend component items
  * Better consistency across project

1.2.3 / 2019-08-28
==================

  * Use onRelease for RangeSlider
  * Standardize translations keys
  * Connect translate function
  * Add tooltip to print and url map control button
  * Fix truncated select list

1.2.2 / 2019-08-23
==================

  * Hide mousemove tooltips when mouse leaves the map

1.2.1 / 2019-08-22
==================

  * Add layers ordered by type
  * Avoid displaying "0" in search results
  * Ability to set a disabled map control

1.2.0 / 2019-08-20
==================

  * Some enhancements
  * Utils to get custom layers ordered as layers tree
  * Optimize layers check
  * Home control get fitbounds coordinates and params

1.1.3 / 2019-08-14
==================

  * [Map] Allow interactive map to have children
  * [Map] Move permalink control to inserted component
  * [Map] Make permalink control map-state aware
  * [Map] Fix print rendering issues in Chrome/Edge

1.1.2 / 2019-08-13
==================

  * [Core] Upgrade Node to latest v12
  * [Map] Add StateProvider and hash context handling
  * [Map] Fix print rendering issues

1.1.1 / 2019-08-09
==================

  * [Core] Add LICENSE file
  * [Map] Add documentation
  * [Map] Avoid errors when highlighting shape of unknown type

1.1.0 / 2019-08-07
==================

  * [Core] Upgrade a lot of dependency
  * [Core] Fix security issues
  * [Core] Add watch npm script for build-local automation
  * [Map] Use native delegated events
  * [Map] Allow a configurable hash
  * [Map] Improve mousemove by setting event on layers
  * [Map] Add missing control propTypes to the map

1.0.35 / 2019-07-26
===================

  * [Auth] Clean token in Api when refreshing token fail

1.0.34 / 2019-07-25
===================

  * [Map] Home control

1.0.33 / 2019-07-25
===================

  * Simplify release & tag process
  * Secure NetlifyCLI deployment

v1.0.32 / 2019-07-25
====================

  * [Map] FitZoom can take a padding
  * [Core] CI improvements
  * [Visualizer] Display filters for exclusives groups layers
  * [Map] Makes legends columns scroll
  * [Map] Remove duplicates features in clusters
  * [Map] Give map instance to onStyleChange prop
  * [Map] Fix backgroundStyle map control

v1.0.31 / 2019-07-24
====================

  * [Visualizer] Ability to set default layer in an exclusive group
  * [Table] Add onSort prop to be informed when user change sort

v1.0.30 / 2019-07-22
====================

  * [Map] Legends with superposed circles
  * [Dev] Enhance build process
  * [Map] Fix print control

v1.0.29 / 2019-07-19
====================

  * [utils] withDevice hoc helps to know which device type is running
  * [Map] Fix print control button behavior

v1.0.28 / 2019-07-17
====================

  * [Visualizer] Some fixes

v1.0.27 / 2019-07-16
====================

  * [Forms] Fix select component active item

v1.0.26 / 2019-07-16
====================

  * [Visualizer] Layers group selector

v1.0.25 / 2019-07-15
====================

  * [Visualizer] Many fixes on layers groups
  * [Map] onInit prop helps to access Map component methods

v1.0.24 / 2019-07-12
====================

  * Fixes

v1.0.22 / 2019-07-12
====================

  * [Visualizer] Style fixes
  * [Map] Ability to set options on bundled map controls
  * [Forms] Fix filters initial value
  * [Visualizer] Fix layers tree groups setting options

v1.0.21 / 2019-07-11
====================

  * [Visualizer] LayersTree translations
  * [Forms] Fix values display
  * [Visualizer] Fix layer proptypes

v1.0.19 / 2019-07-10
====================

  * [Auth] Fix token expiration
  * [Map] Allow to fit zoom on multiples features
  * [Visualizer] Responsive layers tree
  * [Auth] Display feedback messages on login and signup
  * [Map] Print button enhancement
  * [Visualizer] Warning on layers which does not display on current zoom
  * [Visualizer] Exclusives groups and nested groups

v1.0.18 / 2019-07-01
====================

  * [Table] RenderCell prop
  * [Map] Fix capture map control in Chrome

v1.0.17 / 2019-06-25
====================

  * [Visualizer] Performances
  * [Table] Initial sort
  * [Template] formatNumber filter

v1.0.16 / 2019-06-20
====================

  * [Visualizer] Remove limit of fetch values length in filters

v1.0.15 / 2019-06-19
====================

  * [Visualizer] Fix fields type

v1.0.14 / 2019-06-18
====================

  * [Forms] Fix select popover to the bottom
  * [Template] Template can implement custom components
  * [Map] Legends can be specified with html template

v1.0.13 / 2019-06-17
====================

  * [Map] Add print control prop type

v1.0.12 / 2019-06-17
====================

  * [Map] Optimizations Map Controls
  * [Map] Fix on cluster custom layers
  * [Map] Optimizations on interactions

v1.0.11 / 2019-06-13
====================

  * [Visualizer] Graphic fixes on layers tree

v1.0.10 / 2019-06-12
====================

  * [Visualizer] LayersTree style fixes
  * [Visualizer] Ability to set initialState on layersTree groups

v1.0.8 / 2019-06-06
===================

  * [Visualizer] Enhance layers tree buttons style
  * [InteractiveMap] Optimizations

v1.0.7 / 2019-06-05
===================

  * [Map] Draw control
  * [Visualizer] Sublayers as radio or select
  * [Visualizer] Enhance layers tree items ux
  * [Map] Print control
  * [Visualizer] BoundingBoxObserver component
  * [Map] Optimisation

v1.0.6 / 2019-05-28
===================

  * [Map] Move fitzoom in helper module
  * [Visualizer] Manage hidden state for layers in LayersTree
  * [Map] New map control : Screen Capture
  * [Auth] Localized auth forms

v1.0.5 / 2019-05-14
===================

  * [Map/Map] Init Map with hash if set

v1.0.4 / 2019-05-13
===================

  * [Map/Map] Fitbounds options
  * [Visualizer/LayersTree] Move from client project
  * [Map/InteractiveMap] Fix check constraints on interactions

v1.0.3, v0.10.3 / 2019-05-07
============================

  * Search in Map control
  * Map controls refacto
  * Fix select form control
  * Fix date range form control

v0.10.2 / 2019-04-24
====================

  * Upgrade dependencies
  * [Auth] Fix auth token refresh
  * [Map] Fix moveend listener
  * [Storybook] Display components source in storybook

v0.10.1 / 2019-04-19
====================

  * DataTable can format column as integer
  * Unclustered layer can take any type property and custom layout
  * Deduplicate legends

v0.10.0 / 2019-04-18
====================

  * Fix concurrent clusters
  * Custom paint for unclustered layers
  * Hash option on Map
  * Improve zoom performance with legends
  * Fix changing background
  * Improve API handler
  * Clusters with multi radius

v0.9.18 / 2019-04-11
====================

  * Date control localisation
  * Fix custom layer update on Interactive Map
  * Upgrade StoryBook to 5.x

v0.9.17 / 2019-03-29
====================

  * Map udpates caused by interactions fire `updateMap` custom event
  * Multiselect control { type: TYPE_MULTI, display: 'multi' }
  * DateRange control { type: TYPE_RANGE, format: 'date' }

v0.9.16 / 2019-03-28
====================

  * Fix range initial value

v0.9.15 / 2019-03-28
====================

  * Fix range in Firefox
  * Remove hooks while it cannot be npm linked
  * Fix nunjucks usage

v0.9.14 / 2019-03-27
====================

  * Format number in table
  * Toggle all checkboxes in columns selector

v0.9.13 / 2019-03-27
====================

  * Fix range manual max and min values

v0.9.12 / 2019-03-26
====================

  * Mapbox instance accessible for e2e tests
  * Editable range input

v0.9.11 / 2019-03-25
====================

  * Printable legends
  * Fix "Fly to" interaction
  * Template filter "slug"
  * Spread cluster layers properties

v0.9.10 / 2019-03-22
====================

  * Zoom interaction
  * Highlight interaction

v0.9.9 / 2019-03-20
===================

  * Fix interaction check cluster

v0.9.8 / 2019-03-19
===================

  * Specific map event to refresh clusters

v0.9.7 / 2019-03-19
===================

  * onClusterUpdate prop on Map component

v0.9.6 / 2019-03-18
===================

  * Clusters with border

v0.9.5 / 2019-03-18
===================

  * Legends shape size
  * onMapUpdate prop on Map component

v0.9.4 / 2019-03-15
===================

  * Ability to render a custom element in a map tooltip

v0.9.3 / 2019-03-13
===================

  * Check interactions constraints at event level to be able to set many interactions on same event/layer

v0.9.2 / 2019-03-13
===================

  * Fix tooltips

v0.9.1 / 2019-03-13
===================

  * Fix cluster

v0.9.0 / 2019-03-13
===================

  * Layers as cluster
  * Interactions with complex constraints

v0.8.0 / 2019-03-06
===================

  * Search in Select componant
  * Fix Filters update callback

v0.7.11 / 2019-03-04
===================

  * Fix empty value label in Select

v0.7.10 / 2019-03-04
===================

  * onSelection prop on Table component
  * Empty value on Select control
  * ColumnSelector takes a label prop
  * Set controls defaults values
  * Better handling of legends update

v0.7.9 / 2019-03-01
===================

  * Reload properties
  * Fix conditionnal legends
  * Switch control

v0.7.8 / 2019-03-01
===================

  * Put a max-Height + overflow scroll to columns props filters
  * Conditionnal legends
  * Range control

v0.7.7 / 2019-02-26
===================

  * ColumnsSelector for Table component
  * Loading state on Table component

v0.7.6 / 2019-02-22
===================

  * Prop onStyleChange on Map component
  * Forms/Filters component

v0.7.5 / 2019-02-21
===================

  * Table component

v0.7.4 / 2019-02-18
===================

  * Add constraints option to interactions
  * Fix display fixed tootips
  * Async fetch properties before displaying tooltip

v0.7.3 / 2019-02-18
===================

  * Add constraints option to interactions
  * Fix display fixed tootips
  * Async fetch properties before displaying tooltip

v0.7.2 / 2019-02-15
===================

  * Fix hiding fixed tooltips

v0.7.1 / 2019-02-14
===================

  * Zoom interaction
  * Fixed tooltip
  * Debug mode

v0.7.0 / 2019-02-11
===================

  * Move connect to npm
  * Remove Visualizer concepts from InteractiveMap

v0.6.1 / 2019-01-23
===================

  * Api service manage FormData

v0.6.0 / 2019-01-21
===================

  * Sync map moves

v0.5.5 / 2019-01-21
===================

  * Multi level legends in Interactive Map

v0.5.4 / 2019-01-21
===================

  * Fix details panel transition
  * Add custom layers ordered by type

v0.5.3 / 2019-01-17
===================

  * Fit bound on Map init

v0.5.2 / 2019-01-16
===================

  * fix removing popup on map

v0.5.1 / 2019-01-09
===================

  * Bugfix : popup content refreshing

v0.5.0 / 2019-01-08
===================

  * rearrange modules and exports

v0.4.3 / 2018-12-21
===================

  * Improve layers tree design
  * aria controls on layers tree
  * Ability to use react-router history.push in displayTooltip

v0.4.2 / 2018-12-19
===================

  * delete popup on close event

v0.4.1 / 2018-12-19
===================

  * Fix reset layers tree when changing background

v0.4.0 / 2018-12-18
===================

  * improve feature style
  * Fix api host
  * Refacto interactions API

v0.3.11 / 2018-12-14
====================

  * Custom legend shapes

v0.3.10 / 2018-12-14
====================

  * change background style selector icon
  * Fix async set state in WidgetState

v0.3.9 / 2018-12-13
===================

  * bugfixes on WidgetMap layout

v0.3.8 / 2018-12-13
===================

  * Ability to override MapNavigation from TerraFrontProvider

v0.3.7 / 2018-12-13
===================

  * Ability to override LayersTree renderer

v0.3.6 / 2018-12-12
===================

  * Layers Tree accept sublayers
  * Layers Tree refacto

v0.3.5 / 2018-12-11
===================

  * background styles selector

v0.3.4 / 2018-12-10
===================

  * Legends components
  * Fix widget map layout
