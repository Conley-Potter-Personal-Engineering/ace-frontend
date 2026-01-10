const { TextDecoder, TextEncoder } = require('util')
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web')
const { BroadcastChannel, MessageChannel, MessagePort } = require('node:worker_threads')

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, writable: true, configurable: true },
  TextEncoder: { value: TextEncoder, writable: true, configurable: true },
  ReadableStream: { value: ReadableStream, writable: true, configurable: true },
  TransformStream: { value: TransformStream, writable: true, configurable: true },
  WritableStream: { value: WritableStream, writable: true, configurable: true },
  BroadcastChannel: { value: BroadcastChannel, writable: true, configurable: true },
  MessageChannel: { value: MessageChannel, writable: true, configurable: true },
  MessagePort: { value: MessagePort, writable: true, configurable: true },
})

require('whatwg-fetch')
