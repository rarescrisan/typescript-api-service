# node-api

This is my monorepo boilerplate setup for typescript node services.





## Requirements

There's a few system dependencies used that you'll need to install in order to work with this monorepo effectively.

**mask** · [repo](https://github.com/jakedeichert/mask)

This is a cli task runner tool I created, similar to `make`. It looks for a [`maskfile.md`](./maskfile.md) file in the current directory and parses it for commands. For example, if you run `mask bootstrap` in this directory, all packages and services will be installed, built and ready to use. At this point in time, there's no precompiled binaries so you can only [install it with cargo](https://github.com/jakedeichert/mask#getting-started).

**watchexec** · [repo](https://github.com/watchexec/watchexec)

This is used for rebuilding projects whenever a file changes. You can download a [release from GitHub](https://github.com/watchexec/watchexec/releases) or install with cargo or homebrew.

**docker**

This is used to spin up a database and other background services.





## Directory overview

**/api**

This is a basic typescript api service example. Check out its [`README.md`](./api/README.md) for an overview of the structure and how it works.

**/packages**

This directory contains common modules shared between services. When running `mask install` in the repo root, these directories are hoisted into `node_modules/@/<package-name>` where they become available to all services due to node's module resolution algorithm. These modules never need to be published since projects in this monorepo can just reference them via the `@` namespace.

**/tools**

This directory contains global tools shared between all projects. Tools include eslint, prettier, typescript, jest and more. When you run `mask install`, these tools are hoisted to the root `node_modules` directory so they become available to all projects.





## Getting started

Give the root [`maskfile.md`](./maskfile.md) a read to get familiar with some of the monorepo's top level commands. The api service also has its own [`maskfile.md`](./api/maskfile.md) which contains commands specific to itself.

### Preparation

Run `mask bootstrap`. This will install and build all packages and services so that they are ready for use.

### Running the api service

To start the api service, `cd` into `./api` and run `mask start`.

This will spin up a docker postgres database container, compile the typescript source and then run the service.





## FAQ

### Why use the `@` namespace for packages?

The namespace `@` was purposefully chosen because npm disallows it. This guarantees we don't overwrite other installed modules by accident when we symlink the `packages` directory to `node_modules/@`. It's also nice and short to type when importing one of these packages.
