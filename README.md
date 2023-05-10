# Backend Nest Boilerplate

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v13.x-9cf)]()
[![Node](https://img.shields.io/badge/Node-v16.13.x-success)]()
[![Yarn](https://img.shields.io/badge/Yarn-v1.22.x-blue)]()

> A Microservice Application, Build using [Nest JS](https://nestjs.com) and [Typescript](https://www.typescriptlang.org).

### Configuration

Environment Option :
> copy & paste file `.env.default` into `.env` and adjust your configuration

Activate Husky Hook :
> run `npm run prepare` to activate Husky Hook (one time)

### Running the Application

Listen Port `3000`

```bash
# development
$ npm run dev

# production
$ npm run build
$ npm run start
```

health check : `/boilerplate/v1/health`

### Development

- Generate Modules

```bash
# generate a modules
$ npm run generate:modules
>
$ ? What name would you like to use for the module? ./modules/<NAME>
$ ? What name would you like to use for the controller? ./modules/<NAME>
$ ? What name would you like to use for the service? ./modules/<NAME>
```

- Generate Entity

```bash
# create a entity model
$ npm run entity:create <NAME>.entity
```

### Migrations

- Create Migration

```bash
$ npm run migration:create <NAME>
```

- Run Migration

```bash
$ npm run migration:run
```

### Seeders

- Create Seeder

```bash
$ npm run seeder:create seed-<NAME>
```

- Run Seeder

```bash
$ npm run seeder:run
```

### Contributing

Contributing to this repository, based on story / task on Jira.

##### Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Format Commit should follow [commitlint-config-jira](https://github.com/Gherciu/commitlint-jira)
4. Ensure create unit test before push to repository
