# fastify-apply

Experimental shorthand syntax for Fastify.

## Define hooks as functions or arrays of functions

```js
export default {
  async onRequest (req, reply) {
    reply.send(`Hello from onRequest`)
  },
  preHandler: [
    async (req, reply) => {
      reply.send('Hello from the first preHandler')
    },
    async (req, reply) => {
      reply.send('Hello from the second preHandler')
    },
  ],
}
```

Supported hooks:

- `onRequest`
- `preParsing`
- `preValidation`
- `preHandler`
- `preSerialization`
- `onError`
- `onSend`
- `onResponse`
- `onTimeout`
- `onReady`
- `onClose`
- `onRoute`
- `onRegister`

## Define method(key, value) calls

```js
export default {
  decorate: {
    helper () {
      console.log('Helper function')
    }
  },
}
```

Supported methods:

- `addSchema`
- `addHook`
- `decorate`
- `decorateRequest`
- `decorateReply`

## Run a function before() or after() everything else in the plugin

```js
export default {
  after({ get }) {
    get('/*', (req, reply) => {})
  },
  before({ get }) {
    get('/route', (req, reply) => {})
  },
}
```

The first argument to `before()` and `after()` is a `Proxy` instance
that will return **Fastify methods implictly bound to the current plugin
context** (the _contextual_ `fastify` instance, that is).

Full list of methods that come with this implicit binding: 

- `addSchema`
- `addHook`
- `decorateRequest`
- `decorateReply`
- `register`
- `get`
- `head`
- `post`
- `put`
- `delete`
- `options`
- `patch`
- `all`

## Encapsulation

Unless you set `encapsulate` to `true`, the plugin will be wrapped with [`fastify-plugin`](https://github.com/fastify/fastify-plugin) so it stays in the global context. To ensure the applied plugin object is encapsulated:

```js
export default {
  encapsulate: true,
}
```

Hat off to [Matteo Collina](https://twitter.com/matteocollina) for suggesting this option's name.
