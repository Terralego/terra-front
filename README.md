# Terra-front

## Install

    $ npm i

## Usage

    $ npm start

## Debug

You can see many logs in your console by activating debug. Just type in your browser console :

```js
localStorage.debug = 'terralego:*';
```

and reload your app. You can focus on any TerraFront module by replacing `*` by any module name like `terralego:Visualizer`.

## Storybook

    $ npm run storybook

## Tests

    $ npm test

## Build

    $ npm run build

## Publish

    $ ./scripts/publish.sh


## Modules

### Api

An API service to fetch data from backend

### Auth

A user provider with a login form. Wrap your app with AuthProvider to get access to all auth data and actions. Then, you will be able to get connected user and call login and signout action. 

### Visualizer

A fully configurable visualizer displaying a layers tree, a map and able to make user interactions on it.

## Customization

Every component should be configurable by passing replacement props from TerraFrontProvider.
