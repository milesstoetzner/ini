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

test('wrap in quotes to JSON-decode and preserve spaces with safe=false', function (t) {
  const input = '" xa  n          p " = "\"\r\nyoyoyo\r\r\n"\n'

  const expected = `
" xa  n          p "=

yoyoyo

`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('single quotes with safe=false', function (t) {
  const input = `
s = 'something'
`.trimStart()

  const expected = `
s=something
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('mixing quotes with safe=false', function (t) {
  const input = `
s1 = "something'
`.trimStart()

  const expected = `
s1="something'
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('double quotes with safe=false', function (t) {
  const input = `
s2 = "something else"
`.trimStart()

  const expected = `
s2=something else
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('blank value with safe=false', function (t) {
  const input = `
s3 =
`.trimStart()

  const expected = `
s3=
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('value with only spaces with safe=false', function (t) {
  const input = `
s4 =        
`.trimStart()

  const expected = `
s4=
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('quoted value with only spaces with safe=false', function (t) {
  const input = `
s5 = '   ' 
`.trimStart()

  const expected = `
s5=   
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('quoted value with leading and trailing spaces with safe=false', function (t) {
  const input = `
s6 = ' a '
`.trimStart()

  const expected = `
s6= a 
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('no equal sign with safe=false', function (t) {
  const input = `
s7
`.trimStart()

  const expected = `
s7=true
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('bool(true) with safe=false', function (t) {
  const input = `
true = true
`.trimStart()

  const expected = `
true=true
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('bool(false) with safe=false', function (t) {
  const input = `
false = false
`.trimStart()

  const expected = `
false=false
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('null with safe=false', function (t) {
  const input = `
null = null
`.trimStart()

  const expected = `
null=null
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('undefined with safe=false', function (t) {
  const input = `
undefined = undefined
`.trimStart()

  const expected = `
undefined=undefined
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

// TODO: this?!
test('arrays with safe=false', function (t) {
  const input = `
zr[] = deedee
ar[] = one
ar[] = three
; This should be included in the array
ar   = this is included
`.trimStart()

  const expected = `
zr[]=deedee
ar[]=one
ar[]=three
ar[]=this is included
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('resetting of a value (and not turn it into an array) with safe=false', function (t) {
  const input = `
br = cold
br = warm
`.trimStart()

  const expected = `
br=warm
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('quotes value with = with safe=false', function (t) {
  const input = `
eq = "eq=eq"
`.trimStart()

  const expected = `
eq=eq=eq
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('a section with safe=false', function (t) {
  const input = `
[a]
av = a val
e = { o: p, a: { av: a val, b: { c: { e: "this [value]" } } } }
j = "{ o: "p", a: { av: "a val", b: { c: { e: "this [value]" } } } }"
"[]" = a square?
`.trimStart()

  const expected = `
[a]
av=a val
e={ o: p, a: { av: a val, b: { c: { e: "this [value]" } } } }
j="{ o: "p", a: { av: "a val", b: { c: { e: "this [value]" } } } }"
"[]"=a square?
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('nested array with safe=false', function (t) {
  const input = `
cr[] = four
cr[] = eight
`.trimStart()

  const expected = `
cr[]=four
cr[]=eight
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})


test('b section with a space after its title with safe=false', function (t) {
  const input = `
[b] 
`.trimStart()

  const expected = ""

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})


test('dots in the section name should be literally interpreted with safe=false', function (t) {
  const input = `
[x\.y\.z]
x.y.z = xyz

[x\.y\.z.a\.b\.c]
a.b.c = abc
`.trimStart()

  const expected = `
[x\.y\.z]
x.y.z=xyz

[x\.y\.z.a\.b\.c]
a.b.c=abc
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('this next one is not a comment since its escaped with semicolon with safe=false', function (t) {
  const input = `
nocomment = this\; this is not a comment
`.trimStart()

  const expected = `
nocomment=this; this is not a comment
`.trimStart()

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})

test('this next one is not a comment since its escaped with number sign with safe=false', function (t) {
  const input = "nocomment = this\# this is not a comment\n"
  const expected = "nocomment=this# this is not a comment\n"

  t.same(ini.stringify(ini.parse(input), { safe: false }), expected)
  t.end()
})
