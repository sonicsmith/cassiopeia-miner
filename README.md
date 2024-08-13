# Cassiopeia Mining Example

Cassiopeia is the worlds first POW mineable ERC404 token.

https://github.com/sonicsmith/cassiopeia

This code acts as an example for how to mine it.
There is no optimization to the hashing algorithm so it runs very slow.

The next iteration of this project will create a GPU and CPU accelerated hash cycle.

### Requirements

An account on Base with enough ETH to cover the gas for minting.

### Setup

Fill in needed environment variables:

```shell
$ cp .env.example .env
```

```shell
$ npm i
```

### Run

```shell
$ npm start
```
