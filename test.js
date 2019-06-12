var unif = require('secure-random-uniform/bigint')
var sodium = require('sodium-native')
var test = require('tape')
var codec = require('.')

test('Simple tests', function (assert) {
  assert.same(0n, codec.decode(Buffer.alloc(0)))
  assert.same(codec.decode.bytes, 0)
  assert.same(0n, codec.decode(Buffer.alloc(7)))
  assert.same(codec.decode.bytes, 7)
  assert.same(0xffffffffn, codec.decode(Buffer.alloc(4, 0xff)))
  assert.same(codec.decode.bytes, 4)
  assert.same(0xffffffffn, codec.decode(Buffer.from('ffffffff', 'hex')))
  assert.same(codec.decode.bytes, 4)

  var buf = Buffer.alloc(5)
  assert.same(buf, codec.encode(0xffffffffn, buf))
  assert.same(codec.encode.bytes, 4)
  assert.same(0x00, buf[4])
  assert.same(buf, codec.encode(0xffffffffn, Buffer.from('0000000000', 'hex')))
  assert.same(codec.encode.bytes, 4)
  assert.same(0xffffffffn, codec.decode(buf, null, 4))
  assert.same(codec.decode.bytes, 4)
  assert.same(0xffffffffn, codec.decode(buf))
  assert.same(codec.decode.bytes, 5)
  buf[4] = 0xff
  assert.same(0xffffffffn, codec.decode(buf, null, 4))
  assert.same(codec.decode.bytes, 4)
  assert.same(0xffffffffffn, codec.decode(buf))
  assert.same(codec.decode.bytes, 5)
  assert.end()
})

test('Fuzzzzz', function (assert) {
  var i = 100
  while (i--) {
    var n = unif(2n ** 32n)

    var buf = codec.encode(n)
    assert.ok(buf.byteLength <= 4, 'buffer length')
    assert.same(buf.byteLength, codec.encodingLength(n), 'set byteLength to encodingLength')
    assert.same(buf.byteLength, codec.encode.bytes, 'set codec.encode.bytes')

    var o = codec.decode(buf)
    assert.ok(o >= 0, 'unsigned decoded')
    assert.same(buf.byteLength, codec.decode.bytes, 'decoded all bytes')
    assert.same(n, o, 'identity')
  }

  assert.end()
})
