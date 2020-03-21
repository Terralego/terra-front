# Terra-front [![npm version](https://badge.fury.io/js/@terralego%2Fcore.svg)](https://www.npmjs.com/package/@terralego/core)

## Install

```shell
$ npm ci
```

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

Publish package to npmjs.com *(current commit should be tagged)*

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
<terrafront/dir> $ npm build-local
<terrafront/dir> $ npm link # To link globally
<terrafront/dir> $ npm run watch:babel # To start autobuilding

# Switch to other project dir
<otherproject/dir> $ npm link <terrafront/dir>/dist
```
