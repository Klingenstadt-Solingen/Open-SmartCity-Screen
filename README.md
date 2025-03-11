<div style="display:flex;gap:1%;margin-bottom:10px">
  <h1 style="border:none">Open Smart City Screen Configurator</h1>
</div>

Complete Documentation: https://solingen.gitlabpages.app.nedeco.de/stele-docs/

This is an electron app, running a digital signage react application.

It runs with

- `NodeJS v20.15.1`,
- `NextJS v12.3`,
- `yarn v1.22`

## Setup

### Install Dependencies

run `yarn install` to install third party dependencies

### Setup Environment

Setup your environment variables by copying .env.example to .env and filling in the values.

### Use it

```
# development mode
$ yarn dev

# production build
$ yarn build
```

To start this application alongside the [Stelen Configurator](https://git.app.nedeco.de/solingen/stele-configurator) you can use `$ yarn dev --renderer-port <port>` to specify a different port

## Commit Convention:

[Conventional Commits](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

## Release Flow

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for Version management and Changelog generation.

There is no need to create tags or edit changelog manually.

To deploy the application, start the manual tast build:deploy-tag on masterbranch.
A new Application will be built and pushed into an S3 bucket via [electron-builder](https://www.electron.build/index.html). \
The running Application will auto-update itself if a new release is found in the S3 bucket. \
To verify if the new Version is applied, visit https://monitoring.opensmartcity.fans/zabbix.php?action=dashboard.view and check 'Digital Signage Version'.

Pipeline `build-publish:linux` and `build-publish:windows` only build executables for the corresponidng operating systems and upload them to MinIO.
Pipeline `build:latest` builds both executables and uploads them as gitlab artifact only.

`build-publish:windows` can be used for testing purposes, since no Windows Devices are used in Production.

## CI/CD

Every commit is checked for linting errors with eslint.

There is a manual build:latest pipeline available on all branches to build a Linux AppImage and a Windows nsis installer, which are available in the pipeline artifacts afterwards.

## License

Digital-Signage Configurator is licensed under the [Open Smart City License](LICENSE.md).
