# Cassiopeia Mining Example

Cassiopeia is the worlds first POW mineable ERC404 token.

https://github.com/sonicsmith/cassiopeia

This code acts as an example for how to mine it.
There is no optimization to the hashing algorithm so it runs very slow.

The next iteration of this project will create a GPU and CPU accelerated hash cycle.

### Setup

```shell
$ npm i
```

Fill in needed environment variables:

```shell
$ cp .env.example .env
```

### Requirements

An account on Base with enough gas to cover the mint.

### Run

```shell
$ npm start
```
