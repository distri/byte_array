(function(pkg) {
  // Expose a require for our package so scripts can access our modules
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "mode": "100644",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "mode": "100644",
      "content": "byte_array\n==========\n\nStore bytes in an array. Serialize and restore from JSON\n",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "mode": "100644",
      "content": "Byte Array\n=========\n\nExperiment to store an array of 8-bit data and serialize back and forth from JSON.\n\n    module.exports = (sizeOrData) ->\n      if typeof sizeOrData is \"string\"\n        view = deserialize(sizeOrData)\n      else\n        buffer = new ArrayBuffer(sizeOrData)\n        view = new Uint8Array(buffer)\n\n      self =\n        get: (i) ->\n          return view[i]\n\n        set: (i, value) ->\n          view[i] = value\n\n          return self.get(i)\n\n        size: ->\n          view.length\n\n        toJSON: ->\n          serialize(view)\n\n    mimeType = \"application/octet-binary\"\n\n    deserialize = (dataURL) ->\n      dataString = dataURL.substring(dataURL.indexOf(';') + 1)\n\n      binaryString = atob(dataString)\n      length =  binaryString.length\n\n      buffer = new ArrayBuffer length\n\n      view = new Uint8Array(buffer)\n\n      i = 0\n      while i < length\n        view[i] = binaryString.charCodeAt(i)\n        i += 1\n\n      return view\n\n    serialize = (bytes) ->\n      binary = ''\n      length = bytes.byteLength\n\n      i = 0\n      while i < length\n        binary += String.fromCharCode(bytes[i])\n        i += 1\n\n      \"data:#{mimeType};#{btoa(binary)}\"\n",
      "type": "blob"
    },
    "test/byte_array.coffee": {
      "path": "test/byte_array.coffee",
      "mode": "100644",
      "content": "ByteArray = require \"../main\"\n\ntestPattern = (n) ->\n  byteArray = ByteArray(256)\n\n  [0...256].forEach (i) ->\n    byteArray.set(i, i % n is 0)\n\n  reloadedArray = ByteArray(byteArray.toJSON())\n\n  [0...256].forEach (i) ->\n    test = 0 | (i % n is 0)\n    assert.equal reloadedArray.get(i), test, \"Byte #{i} is #{test}\"\n\ndescribe \"ByteArray\", ->\n  it \"should be empty to start\", ->\n    byteArray = ByteArray(256)\n\n    [0...256].forEach (i) ->\n      assert.equal byteArray.get(i), 0\n\n  it \"should be able to set and get byts\", ->\n    byteArray = ByteArray(512)\n\n    [0...512].forEach (i) ->\n      byteArray.set(i, i)\n\n    [0...512].forEach (i) ->\n      assert.equal byteArray.get(i), i % 256\n\n  it \"should be serializable and deserializable\", ->\n    byteArray = ByteArray(512)\n\n    [0...512].forEach (i) ->\n      byteArray.set(i, i)\n\n    reloadedArray = ByteArray(byteArray.toJSON())\n\n    [0...512].forEach (i) ->\n      assert.equal reloadedArray.get(i), i % 256, \"Byte #{i} is #{i % 256}\"\n\n  it \"should be serializable and deserializable with various patterns\", ->\n    testPattern(1)\n    testPattern(2)\n    testPattern(3)\n    testPattern(4)\n    testPattern(5)\n    testPattern(7)\n    testPattern(11)\n    testPattern(32)\n    testPattern(63)\n    testPattern(64)\n    testPattern(77)\n    testPattern(128)\n\n  # Some may wish for this to throw an error, but normal JS arrays don't\n  # and by default neither do typed arrays so this is just 'going with the flow'\n  it \"should silently discard setting out of range values\", ->\n    byteArray = ByteArray(8)\n\n    assert.equal byteArray.set(9, 1), undefined\n    assert.equal byteArray.get(9), undefined\n\n  it \"should know its size\", ->\n    byteArray = ByteArray(128)\n\n    assert.equal byteArray.size(), 128\n\n  it \"shouldn't be too big when serializing as json\", ->\n    byteLength = 2048\n    byteArray = ByteArray(byteLength)\n\n    serializedLength = byteArray.toJSON().length\n\n    n = 0.70\n    assert serializedLength < byteLength / n, \"Serialized length < bit length divided by #{n} : #{serializedLength} < #{byteLength / n}\"\n",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "mode": "100644",
      "content": "version: \"0.1.1\"\n",
      "type": "blob"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var deserialize, mimeType, serialize;\n\n  module.exports = function(sizeOrData) {\n    var buffer, self, view;\n    if (typeof sizeOrData === \"string\") {\n      view = deserialize(sizeOrData);\n    } else {\n      buffer = new ArrayBuffer(sizeOrData);\n      view = new Uint8Array(buffer);\n    }\n    return self = {\n      get: function(i) {\n        return view[i];\n      },\n      set: function(i, value) {\n        view[i] = value;\n        return self.get(i);\n      },\n      size: function() {\n        return view.length;\n      },\n      toJSON: function() {\n        return serialize(view);\n      }\n    };\n  };\n\n  mimeType = \"application/octet-binary\";\n\n  deserialize = function(dataURL) {\n    var binaryString, buffer, dataString, i, length, view;\n    dataString = dataURL.substring(dataURL.indexOf(';') + 1);\n    binaryString = atob(dataString);\n    length = binaryString.length;\n    buffer = new ArrayBuffer(length);\n    view = new Uint8Array(buffer);\n    i = 0;\n    while (i < length) {\n      view[i] = binaryString.charCodeAt(i);\n      i += 1;\n    }\n    return view;\n  };\n\n  serialize = function(bytes) {\n    var binary, i, length;\n    binary = '';\n    length = bytes.byteLength;\n    i = 0;\n    while (i < length) {\n      binary += String.fromCharCode(bytes[i]);\n      i += 1;\n    }\n    return \"data:\" + mimeType + \";\" + (btoa(binary));\n  };\n\n}).call(this);\n\n//# sourceURL=main.coffee",
      "type": "blob"
    },
    "test/byte_array": {
      "path": "test/byte_array",
      "content": "(function() {\n  var ByteArray, testPattern;\n\n  ByteArray = require(\"../main\");\n\n  testPattern = function(n) {\n    var byteArray, reloadedArray, _i, _j, _results, _results1;\n    byteArray = ByteArray(256);\n    (function() {\n      _results = [];\n      for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n      return _results;\n    }).apply(this).forEach(function(i) {\n      return byteArray.set(i, i % n === 0);\n    });\n    reloadedArray = ByteArray(byteArray.toJSON());\n    return (function() {\n      _results1 = [];\n      for (_j = 0; _j < 256; _j++){ _results1.push(_j); }\n      return _results1;\n    }).apply(this).forEach(function(i) {\n      var test;\n      test = 0 | (i % n === 0);\n      return assert.equal(reloadedArray.get(i), test, \"Byte \" + i + \" is \" + test);\n    });\n  };\n\n  describe(\"ByteArray\", function() {\n    it(\"should be empty to start\", function() {\n      var byteArray, _i, _results;\n      byteArray = ByteArray(256);\n      return (function() {\n        _results = [];\n        for (_i = 0; _i < 256; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(byteArray.get(i), 0);\n      });\n    });\n    it(\"should be able to set and get byts\", function() {\n      var byteArray, _i, _j, _results, _results1;\n      byteArray = ByteArray(512);\n      (function() {\n        _results = [];\n        for (_i = 0; _i < 512; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return byteArray.set(i, i);\n      });\n      return (function() {\n        _results1 = [];\n        for (_j = 0; _j < 512; _j++){ _results1.push(_j); }\n        return _results1;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(byteArray.get(i), i % 256);\n      });\n    });\n    it(\"should be serializable and deserializable\", function() {\n      var byteArray, reloadedArray, _i, _j, _results, _results1;\n      byteArray = ByteArray(512);\n      (function() {\n        _results = [];\n        for (_i = 0; _i < 512; _i++){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(i) {\n        return byteArray.set(i, i);\n      });\n      reloadedArray = ByteArray(byteArray.toJSON());\n      return (function() {\n        _results1 = [];\n        for (_j = 0; _j < 512; _j++){ _results1.push(_j); }\n        return _results1;\n      }).apply(this).forEach(function(i) {\n        return assert.equal(reloadedArray.get(i), i % 256, \"Byte \" + i + \" is \" + (i % 256));\n      });\n    });\n    it(\"should be serializable and deserializable with various patterns\", function() {\n      testPattern(1);\n      testPattern(2);\n      testPattern(3);\n      testPattern(4);\n      testPattern(5);\n      testPattern(7);\n      testPattern(11);\n      testPattern(32);\n      testPattern(63);\n      testPattern(64);\n      testPattern(77);\n      return testPattern(128);\n    });\n    it(\"should silently discard setting out of range values\", function() {\n      var byteArray;\n      byteArray = ByteArray(8);\n      assert.equal(byteArray.set(9, 1), void 0);\n      return assert.equal(byteArray.get(9), void 0);\n    });\n    it(\"should know its size\", function() {\n      var byteArray;\n      byteArray = ByteArray(128);\n      return assert.equal(byteArray.size(), 128);\n    });\n    return it(\"shouldn't be too big when serializing as json\", function() {\n      var byteArray, byteLength, n, serializedLength;\n      byteLength = 2048;\n      byteArray = ByteArray(byteLength);\n      serializedLength = byteArray.toJSON().length;\n      n = 0.70;\n      return assert(serializedLength < byteLength / n, \"Serialized length < bit length divided by \" + n + \" : \" + serializedLength + \" < \" + (byteLength / n));\n    });\n  });\n\n}).call(this);\n\n//# sourceURL=test/byte_array.coffee",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.1\"};",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://strd6.github.io/editor/"
  },
  "version": "0.1.1",
  "entryPoint": "main",
  "repository": {
    "id": 14937369,
    "name": "byte_array",
    "full_name": "distri/byte_array",
    "owner": {
      "login": "distri",
      "id": 6005125,
      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
      "gravatar_id": null,
      "url": "https://api.github.com/users/distri",
      "html_url": "https://github.com/distri",
      "followers_url": "https://api.github.com/users/distri/followers",
      "following_url": "https://api.github.com/users/distri/following{/other_user}",
      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
      "organizations_url": "https://api.github.com/users/distri/orgs",
      "repos_url": "https://api.github.com/users/distri/repos",
      "events_url": "https://api.github.com/users/distri/events{/privacy}",
      "received_events_url": "https://api.github.com/users/distri/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/distri/byte_array",
    "description": "Store bytes in an array. Serialize and restore from JSON",
    "fork": false,
    "url": "https://api.github.com/repos/distri/byte_array",
    "forks_url": "https://api.github.com/repos/distri/byte_array/forks",
    "keys_url": "https://api.github.com/repos/distri/byte_array/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/distri/byte_array/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/distri/byte_array/teams",
    "hooks_url": "https://api.github.com/repos/distri/byte_array/hooks",
    "issue_events_url": "https://api.github.com/repos/distri/byte_array/issues/events{/number}",
    "events_url": "https://api.github.com/repos/distri/byte_array/events",
    "assignees_url": "https://api.github.com/repos/distri/byte_array/assignees{/user}",
    "branches_url": "https://api.github.com/repos/distri/byte_array/branches{/branch}",
    "tags_url": "https://api.github.com/repos/distri/byte_array/tags",
    "blobs_url": "https://api.github.com/repos/distri/byte_array/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/distri/byte_array/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/distri/byte_array/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/distri/byte_array/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/distri/byte_array/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/distri/byte_array/languages",
    "stargazers_url": "https://api.github.com/repos/distri/byte_array/stargazers",
    "contributors_url": "https://api.github.com/repos/distri/byte_array/contributors",
    "subscribers_url": "https://api.github.com/repos/distri/byte_array/subscribers",
    "subscription_url": "https://api.github.com/repos/distri/byte_array/subscription",
    "commits_url": "https://api.github.com/repos/distri/byte_array/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/distri/byte_array/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/distri/byte_array/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/distri/byte_array/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/distri/byte_array/contents/{+path}",
    "compare_url": "https://api.github.com/repos/distri/byte_array/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/distri/byte_array/merges",
    "archive_url": "https://api.github.com/repos/distri/byte_array/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/distri/byte_array/downloads",
    "issues_url": "https://api.github.com/repos/distri/byte_array/issues{/number}",
    "pulls_url": "https://api.github.com/repos/distri/byte_array/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/distri/byte_array/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/distri/byte_array/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/distri/byte_array/labels{/name}",
    "releases_url": "https://api.github.com/repos/distri/byte_array/releases{/id}",
    "created_at": "2013-12-04T22:10:23Z",
    "updated_at": "2013-12-04T22:11:11Z",
    "pushed_at": "2013-12-04T22:10:23Z",
    "git_url": "git://github.com/distri/byte_array.git",
    "ssh_url": "git@github.com:distri/byte_array.git",
    "clone_url": "https://github.com/distri/byte_array.git",
    "svn_url": "https://github.com/distri/byte_array",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "master_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "organization": {
      "login": "distri",
      "id": 6005125,
      "avatar_url": "https://identicons.github.com/f90c81ffc1498e260c820082f2e7ca5f.png",
      "gravatar_id": null,
      "url": "https://api.github.com/users/distri",
      "html_url": "https://github.com/distri",
      "followers_url": "https://api.github.com/users/distri/followers",
      "following_url": "https://api.github.com/users/distri/following{/other_user}",
      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
      "organizations_url": "https://api.github.com/users/distri/orgs",
      "repos_url": "https://api.github.com/users/distri/repos",
      "events_url": "https://api.github.com/users/distri/events{/privacy}",
      "received_events_url": "https://api.github.com/users/distri/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "network_count": 0,
    "subscribers_count": 1,
    "branch": "master",
    "defaultBranch": "master"
  },
  "dependencies": {}
});