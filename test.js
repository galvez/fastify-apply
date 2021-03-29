async function main() {
  const fastify = require('fastify')()
  await fastify.register(require('./index'))

  fastify.apply({
    after ({ get}) {
      get('/*', (req, reply) => {
        reply.send('/* route properly registered')
      })
    },
    decorate: {
      someHelper() {
        return 'something'
      },
    },
    decorateRequest: {
      foobar: 'something else',
      dynamic: null,
    },
    async onRequest (req, reply) {
      req.dynamic = this.someHelper()
      reply.send(`Hello from hooks: ${req.foobar} - ${req.dynamic}`)
    },
    preHandler: [
      async (req, reply) => {
        reply.send('Hello from the first preHandler')
      },
      async (req, reply) => {
        reply.send('Hello from the second preHandler')
      },
    ],
    before ({ get}) {
      get('/before', (req, reply) => {
        reply.send('/before route properly registered')
      })
    },
  })

  return fastify
}

// TODO turn into an actual test
main().then(fastify => fastify.listen(3000, (_, addr) => {
  console.log('Listening at localhost:3000')
}))
