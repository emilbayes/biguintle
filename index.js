var assert = require('nanoassert')
var ZERO = 0n
var EIGHT = 8n
var BYTE = 0xffn

function ilog256(bu) {
  for (var ilog = 0; bu > ZERO; ilog++) bu >>= EIGHT

  return ilog
}

exports.encodingLength = function encodingLength (bu) {
  assert(typeof bu === 'bigint', 'bu must be unsigned BigInt')
  assert(bu >= ZERO, 'bu must be unsigned')
  return ilog256(bu)
}


exports.encode = function encode (bu, buf, byteOffset) {
  assert(typeof bu === 'bigint')
  var len = exports.encodingLength(bu)
  if (!buf) buf = Buffer.alloc(len)
  if (!byteOffset) byteOffset = 0

  assert(typeof bu === 'bigint', 'bu must be unsigned BigInt')
  assert(bu >= 0n, 'bu must be unsigned')
  assert(buf.buffer, 'buf must be Buffer or TypedArray')
  assert(buf.byteLength - byteOffset >= len, 'buf must be large enough to contain bu (' + len + ' bytes)')

  var alias = new Uint8Array(buf.buffer, buf.byteOffset + byteOffset, buf.byteLength)
  for (var i = 0; bu > ZERO && i < alias.length; i++, bu >>= EIGHT) {
    alias[i] = Number(bu & BYTE)
  }

  exports.encode.bytes = i

  return buf
}

exports.encode.bytes = 0

exports.decode = function decode (buf, byteOffset, byteLength) {
  if (!byteOffset) byteOffset = 0
  if (!byteLength) byteLength = buf.byteLength

  assert(buf.buffer)
  // Defer valdidation of byteOffset and byteLength to constructor
  var alias = new Uint8Array(buf.buffer, buf.byteOffset + byteOffset, byteLength)

  for (var i = alias.length - 1, bu = 0n; i >= 0; i--) {
    bu = bu << EIGHT | BigInt(alias[i])
  }

  exports.decode.bytes = byteLength
  return bu
}

exports.decode.bytes = 0
