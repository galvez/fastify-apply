'use strict'

const fp = require('fastify-plugin')

function fastifyApply (fastify, options, done) {
  const hooks = [
    'onRequest',
    'preParsing',
    'preValidation',
    'preHandler',
    'preSerialization',
    'onError',
    'onSend',
    'onResponse',
    'onTimeout',
    'onReady',
    'onClose',
    'onRoute',
    'onRegister'
  ]

  hooks.handle = (fastify, prop, value) => {
    if (Array.isArray(value)) {
      for (const item of value) {
        hooks.handle(fastify, prop, item)
      }
      return
    }
    fastify.addHook(prop, value)
  }

  const methods = [
    'addSchema',
    'addHook',
    'decorate',
    'decorateRequest',
    'decorateReply'
  ]

  methods.handle = (fastify, prop, value) => {
    for (const [k, v] of Object.entries(value)) {
      fastify[prop](k, v)
    }
  }

  const bind = [
    'addSchema',
    'addHook',
    'decorateRequest',
    'decorateReply',
    'register',
    'get',
    'head',
    'post',
    'put',
    'delete',
    'options',
    'patch',
    'all'
  ]

  const skip = ['before', 'after', 'encapsulate']

  async function apply (obj) {
    const wrapper = async function (fastify) {
      const proxy = new Proxy(fastify, {
        get (_, prop) {
          if (bind.includes(prop)) {
            return fastify[prop].bind(fastify)
          } else {
            return fastify[prop]
          }
        }
      })
      if (obj.before) {
        await obj.before(proxy)
      }
      for (const [k, v] of Object.entries(obj)) {
        if (skip.includes(k)) {
          continue
        }
        if (hooks.includes(k)) {
          hooks.handle(fastify, k, v)
        }
        if (methods.includes(k)) {
          methods.handle(fastify, k, v)
        }
      }
      if (obj.after) {
        await obj.after(proxy)
      }
    }
    if (obj.encapsulate) {
      await fastify.register(wrapper)
    } else {
      await fastify.register(fp(wrapper))
    }
  }

  fastify.decorate('apply', apply)
  done()
}

module.exports = fp(fastifyApply)
