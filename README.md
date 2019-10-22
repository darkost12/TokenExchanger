# TokenExchanger
Custom token exchanger
## Installation
```bash
npm run build
yarn build
```
## Compile only
```bash
npm run compile
yarn compile
```
## Important!
Don't forget to use 'approve' function from ERC20 standard to the address of this exchanger as spender. Otherwise, I wouldn't be able to trade your tokens!
## Tests are available
```bash
npm run test
npm run coverage
```
or
```bash
yarn test
yarn coverage
```

## Linter
```bash
npm run lint
yarn lint
```
* Only .sol
```bash
npm run lint:sol
yarn sol
```
* Only .js
```bash
npm run lint:js
npm run lint:js:fix
yarn lint:js
yarn lint:js:fix
```
