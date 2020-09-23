# Contributing

## Dev environment

### Get the right Node version

The `.nvmrc` contains the Node version we use in VNS. Usually, higher up versions will also work, but may introduce unexpected breaking changes.

We recommend to install Node using [NVM for Linux/Mac](https://github.com/nvm-sh/nvm) or [NVM for Windows](https://github.com/coreybutler/nvm-windows), especially if you need to maintain multiple projects.

### Linking Vulcan NPM from a local install

Follow Vulcan NPM contribute doc to setup Lerna

Run the link script:

```sh
./scripts/link-vulcan.sh
```

This will link the Lerna NPM package so they are used instead of NPM hosted packages, and will also prevent
duplications of some libraries, such as React.

## Branches

We follow the Git Flow model.

- `master`: is the current live version.
- `bugfix/*`: Bugfixes branches should start from master.
- `devel`: Devel is the next version.
- `feature/*`: features branches should start from master.
- `support/*x.x.x*`: is for bugfixes for a specific version.
- Tags allow to easily find the commit corresponding to a deployed versions.
