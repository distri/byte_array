ByteArray = require "../main"

testPattern = (n) ->
  byteArray = ByteArray(256)

  [0...256].forEach (i) ->
    byteArray.set(i, i % n is 0)

  reloadedArray = ByteArray(byteArray.toJSON())

  [0...256].forEach (i) ->
    test = 0 | (i % n is 0)
    assert.equal reloadedArray.get(i), test, "Byte #{i} is #{test}"

describe "ByteArray", ->
  it "should be empty to start", ->
    byteArray = ByteArray(256)

    [0...256].forEach (i) ->
      assert.equal byteArray.get(i), 0

  it "should be able to set and get byts", ->
    byteArray = ByteArray(512)

    [0...512].forEach (i) ->
      byteArray.set(i, i)

    [0...512].forEach (i) ->
      assert.equal byteArray.get(i), i % 256

  it "should be serializable and deserializable", ->
    byteArray = ByteArray(512)

    [0...512].forEach (i) ->
      byteArray.set(i, i)

    reloadedArray = ByteArray(byteArray.toJSON())

    [0...512].forEach (i) ->
      assert.equal reloadedArray.get(i), i % 256, "Byte #{i} is #{i % 256}"

  it "should be serializable and deserializable with various patterns", ->
    testPattern(1)
    testPattern(2)
    testPattern(3)
    testPattern(4)
    testPattern(5)
    testPattern(7)
    testPattern(11)
    testPattern(32)
    testPattern(63)
    testPattern(64)
    testPattern(77)
    testPattern(128)

  # Some may wish for this to throw an error, but normal JS arrays don't
  # and by default neither do typed arrays so this is just 'going with the flow'
  it "should silently discard setting out of range values", ->
    byteArray = ByteArray(8)

    assert.equal byteArray.set(9, 1), undefined
    assert.equal byteArray.get(9), undefined

  it "should know its size", ->
    byteArray = ByteArray(128)

    assert.equal byteArray.size(), 128

  it "shouldn't be too big when serializing as json", ->
    byteLength = 2048
    byteArray = ByteArray(byteLength)

    serializedLength = byteArray.toJSON().length

    n = 0.70
    assert serializedLength < byteLength / n, "Serialized length < bit length divided by #{n} : #{serializedLength} < #{byteLength / n}"
