# My Next App

Builder and library for full-stack React apps

See `template-basic` folder for example usage.

For @mna v1.x, all built modules assume `@babel/runtime-corejs3` is installed in the consumer project.

## Develop

#### Build all modules

`node run build`

#### Build some modules

`node run build [module1,module2,..]`

#### Build and watch

`node run build -w`

#### Bump version

`node run build -v=x.x.x`

## Test

Install dependencies for tests

`node run pkg`

Run tests for all modules

`node run test`

Run tests for some modules

`node run test [module1,module2,..]`

## Publish

`node run publish all`

`node run publish [module1,module2,..]`
