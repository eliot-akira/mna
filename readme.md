# My Next App

Builder and library for full-stack React apps

See `template-basic` folder for example usage.

## Develop

#### Build all modules

`node run build`

#### Build some modules

`node run build [module1,module2,..]`

#### Build and watch

`node run build -w`

#### Bump version

This updates all modules including this root repository.

`node run build -v=x.x.x`

## Test

Run the tests after `build` or `build -w`. The latter watch mode is useful when actively developing: keep the build process running and open another terminal window to run the tests in another process.

Install dependencies for tests

`node run pkg`

Run tests for all modules

`node run test`

Run tests for some modules

`node run test [module1,module2,..]`

## Publish

`node run publish all`

`node run publish [module1,module2,..]`
