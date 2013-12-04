Byte Array
=========

Experiment to store an array of 8-bit data and serialize back and forth from JSON.

    module.exports = (sizeOrData) ->
      if typeof sizeOrData is "string"
        view = deserialize(sizeOrData)
      else
        buffer = new ArrayBuffer(sizeOrData)
        view = new Uint8Array(buffer)

      self =
        get: (i) ->
          return view[i]

        set: (i, value) ->
          view[i] = value

          return self.get(i)

        size: ->
          view.length

        toJSON: ->
          serialize(view)

    mimeType = "application/octet-binary"

    deserialize = (dataURL) ->
      dataString = dataURL.substring(dataURL.indexOf(';') + 1)

      binaryString = atob(dataString)
      length =  binaryString.length

      buffer = new ArrayBuffer length

      view = new Uint8Array(buffer)

      i = 0
      while i < length
        view[i] = binaryString.charCodeAt(i)
        i += 1

      return view

    serialize = (bytes) ->
      binary = ''
      length = bytes.byteLength

      i = 0
      while i < length
        binary += String.fromCharCode(bytes[i])
        i += 1

      "data:#{mimeType};#{btoa(binary)}"
