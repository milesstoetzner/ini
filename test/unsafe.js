var ini = require('../')
var test = require('tap').test

// See https://github.com/npm/ini/issues/57
const data = { key: 'UPIvqf0AAABA5i+p/QAAAA==' }

test('safe stringify quotes value', function (t) {
  t.same(ini.stringify(data), `key="UPIvqf0AAABA5i+p/QAAAA=="\n`)
  t.end()
})

test('unsafe stringify does not quote value', function (t) {
  t.same(ini.stringify(data, { safe: false }), `key=UPIvqf0AAABA5i+p/QAAAA==\n`)
  t.end()
})
