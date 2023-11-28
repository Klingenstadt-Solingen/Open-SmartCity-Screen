# Solingen Digital Signage

This is an electron app, running a digital signage react application.

It runs with

- `NodeJS v18.18`,
- `NextJS v12.3`,
- `yarn v1.22`

## Setup

### Install Dependencies

run `yarn install` to install third party dependencies

### Use it

```
# development mode
$ yarn dev

# production build
$ yarn build
```

To start this application alongside the [Stelen Configurator](https://git.app.nedeco.de/solingen/stelen-configurator) you can use `$ yarn dev --port <port>` to specify a different port

## Commit Convention:

[Conventional Commits](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

## Release Flow

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for Version management and Changelog generation.

There is no need to create tags or edit changelog manually.

To deploy the application, start the manual tast build:deploy-tag on masterbranch.
A new Application will be built and pushed into an S3 bucket via [electron-builder](https://www.electron.build/index.html)

## CI/CD

Every commit is checked for linting errors with eslint.

There is a manual build:latest pipeline available on all branches to build a Linux AppImage and a Windows nsis installer, which are available in the pipeline artifacts afterwards.
