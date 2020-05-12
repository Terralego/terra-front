
1.21.2 / 2020-05-12
===================

  * Set some propTypes as optionnals
  * Improve HeaderButton to also accept Keyword and Component as Icon
  * Improve MainMenu component
  * Upgrade eslint-config-makina from 2.1.0 to 3.0.0

1.21.1 / 2020-04-29
===================

  * Add toast when reporting is starting
  * Add timestamp id for report

1.21.0 / 2020-04-27
===================

  * Add report control component

1.20.2 / 2020-04-09
===================

  * New navbar component
  * New login button component
  * Fix multiselect when unmounting
  * Fix selector when unmounting
  * Add react-testing-library
  * Fix legend bug when hiding and enhance perf
  * Better circle and rect legend

1.20.1 / 2020-04-06
===================

  * Add line legend
  * Fix legend broken when missing label

1.20.0 / 2020-04-03
===================

  * Upgrade Mapbox-gl package to 1.9.1
  * Fix dependencies issues with npm audit
  * Upgrade eslint-config-makina
  * Upgrade eslint dependencies

1.19.4 / 2020-04-01
===================

  * Improve range behaviour
  * Less render when resizing viewport
  * Fix broken resetState
  * Deduplicate render with hash state
  * Fix multiselect race condition

1.19.3 / 2020-03-27
===================

  * Fix select displayed value

1.19.2 / 2020-03-23
===================

  * Fix multi select filter broken

1.19.1 / 2020-03-16
===================

  * Fix No values translation
  * Add heatmap as enabled type
  * Legend can now be translated
  * Fix selectors selection
  * Legend can have boundaries instead of label
  * Improve details layout

1.19.0 / 2020-03-10
===================

  * Fix filter content when multi-select is empty
  * Update story with knobs everywhere when possible
  * Add tests to multiselect
  * Fix multi select with complex values
  * Fix select with array of object as values
  * Allow draw layer to be on top of everything
  * Add ability to sort layer by weight

1.18.0 / 2020-03-04
===================

  * Add no value message when filter values empty
  * Use locale object from MapBox to define interface locales
  * Update mapbox-gl package to 1.7.0
  * Add logout translation

1.17.4 / 2020-02-18
===================

  * Add react state to withHashContext for better control
  * Fix missing default active layers when changing view
  * Fix popup logout confirmation display while reloading
  * Replace download icon by camera for CaptureControl

1.17.3 / 2020-01-23
===================

  * Repair condition for reseting sortedIndexMap value

1.17.2 / 2020-01-23
===================

  * Reset sortedIndexMap value if the columns and data changed
  * Retrieve objects from the updated key to add/remove customStyles
  * Expand click area on the whole button for certain map controls

1.17.1 / 2020-01-10
===================

  * Simplify doc, reorder reducer returns
  * Handle indexes in Search client

1.17.0 / 2020-01-09
===================

  * Use layer name as ES index to query

1.16.0 / 2020-01-08
===================

  * Allow Story(telling) to manage any layersTree structure
  * Add Storybook story for Story(telling) component

1.15.0 / 2020-01-06
===================

  * Bump handlebars from 4.1.2 to 4.5.3
  * Re-add missing url for package-lock resolved keys
  * Add custom control to the list of Map controls
  * Never get Draw layer id referer to insert custom layer
  * Get layer's type before the one requested if it does not exist
  * Move functions from Map Component to mapUtils file
  * Add and Update widget translations
  * Remove a warning on duplicate key
  * Fix total is not unset on filter removal
  * Add locales for drawControl buttons
  * Fix bug on layer selection with active filter

1.14.3 / 2019-12-09
===================

  * Update dataTable sorting only where there are the same columns

1.14.2 / 2019-12-05
===================

  * Limit mapbox-gl version range to patch updates

1.14.1 / 2019-12-05
===================

  * Add deep comparison to avoid bug and perf issues
  * Add knobs and total to storybook

1.14.0 / 2019-12-04
===================

  * Set and forward columnWidth props to BPTable
  * Forward properties inherited from parent to BluePrintTable

1.13.0 / 2019-11-29
===================

  * Allow to disable carousel
  * Details: remove carousel buttons when there is no carousel
  * Remove and add sources/layers to the map only if necessary
  * Install deep-object-diff package
  * Rename some methods of Map component
  * Fix Map deleteLayers method
  * Upgrade suitable nodejs version to 12.13

1.12.0 / 2019-11-25
===================

  * Put search above all other control
  * Support lightMode for Search control
  * Support lightMode for BackgroundStyles control
  * Add and use compose function
  * Move processing of zoom warning into a HOC
  * Improve LayersTreeItem performance
  * Simplify highlighting
  * Fast check before JSON comparison
  * Drop query state for Select
  * Fix translation extraction
  * Fix tests and coverage
  * Drop state in MultiSelect component
  * Fix multiselect menu height

1.11.1 / 2019-11-20
===================

  * Fix MultiSelect values update
  * Fix fetchPropertyRange method bad return condition

1.11.0 / 2019-11-19
===================

  * Add popup options to displayTooltip function (#137)
  * Fix print control tooltip gap

1.10.1 / 2019-11-19
===================

  * Avoid beeing identified when there's not auth token
  * Avoid infinite loop by planning refresh only if exp time exists
  * Drop token if invalid when getting it

1.10.0 / 2019-11-18
===================

  * Use new generic getTokenPayload in AuthProvider tests
  * Use new generic getTokenPayload in Auth tests
  * Use new generic checkTokenValidity function in Auth module service
  * Drop old parseToken & checkToken functions
  * Do not embed JWT Authorization header if token is invalid
  * Create helper for JWT validation & parsing
  * Revert "Drop invalid token on app load"

1.10.0-1 / 2019-11-15
=====================

  * Drop invalid token on app load

1.10.0-0 / 2019-11-15
=====================

  * Remove useless try/catch blocks
  * Add dependency to base64url
  * Rename Auth function invalidToken to clearToken
  * Invalidate expired or unparsable token when reading it
  * Support light theme for LayersTree

1.9.0 / 2019-11-06
==================

  * Fix default value for translate prop in Filters component
  * Use MapboxGL native hash option
  * Update elasticsearch logic (OR) in multiselect

1.8.2 / 2019-11-04
==================

  * Fix wording dependency
  * Fix navigation through the details

1.8.1 / 2019-10-28
==================

  * Revert to blueprint/table 3.7.0 version
  * Optimize svgs and delet comment lines
  * Quick fix: comment part of copy to clipboard test
  * Fix share control popover gap

1.8.0 / 2019-10-24
==================

  * Do not manage min/max limits in rangeNumeric
  * Filter all features when there is nothing to display
  * Add the ability to order a custom locales for sorting
  * Add the ability to order a custom sorting
  * Update @blueprintjs/table package to 3.8.1

1.7.2 / 2019-10-14
==================

  * Fix package version

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
