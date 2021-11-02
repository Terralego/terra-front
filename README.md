# Terra-front [![npm version](https://badge.fury.io/js/@terralego%2Fcore.svg)](https://www.npmjs.com/package/@terralego/core)

## Install

```shell
$ npm ci
```

## Configuration

For development purpose, you should create the following file:

    $ touch .env

and edit it to set the `REACT_APP_MAPBOX_TOKEN` variable.

## Usage

```shell
$ npm start
```

## Debug

You can see many logs in your console by activating debug. Just type in your browser console :

```js
localStorage.debug = 'terralego:*';
```

and reload your app. You can focus on any TerraFront module by replacing `*` by any module name like `terralego:Visualizer`.

## Storybook

```shell
npm run storybook
```

## Tests

```shell
npm test
```

## Build

```shell
npm run build
```

## Publish

The package publication is automatic for all tagged version. To proceed, execute
the following commands on master:

```sh
npm version [patch|minor|major] # Select the type according to the evolution criticity
# ... the previous command proposes you to edit the CHANGELOG
git push && git push --tags
# Then the gitlab pipeline starts and should publish the package.
```

To publish manually (not recomanded) the package to npmjs.com *(current commit should be tagged)*

```shell
npm run publish
```

## Modules

### Api

An API service to fetch data from backend

### Auth

A user provider with a login form. Wrap your app with AuthProvider to get access to all auth data and actions. Then, you will be able to get connected user and call login and signout action.

### Visualizer

A fully configurable visualizer displaying a layers tree, a map and able to make user interactions on it.

## Customization

Every component should be configurable by passing replacement props from TerraFrontProvider.

## How to develop using package

```sh
<terrafront/dir> $ npm ci
<terrafront/dir> $ npm run build-local
<terrafront/dir> $ npm link # To link globally

# Switch to other project dir
<otherproject/dir> $ npm link <terrafront/dir>/dist

# Come back to terrafront/dir inside dist
<terrafront/dir> $ npm link <otherproject/dir>/node_modules/react
<terrafront/dir> $ npm link <otherproject/dir>/node_modules/react-router
<terrafront/dir> $ npm run build-local
<terrafront/dir> $ npm run watch:babel # To start autobuilding

# THEN you can start the other package dev server
<otherproject/dir> $ npm run start

```

## Common errors

When developing in another environement with TF linked you can see this error.

> Invalid hook call. Hooks can only be called inside of the body of a function component.

In this case stop all running server or watcher and execute :

```sh
<terrafront/dir> $ cd dist
<terrafront/dir> $ npm link ../../<otherproject/dir>/node_modules/react/
```
