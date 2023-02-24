const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()
const { compile } = require('svelte/compiler')

server.get('/vue', (req, res) => {
  let data = JSON.parse(req.query.data)
  const app = new Vue({
    data: data,
    template: `<div>${req.query.html}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end(err)
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})
server.get('/svelte', (req, res) => {
  let data = {}
  data = req.query.data && JSON.parse(req.query.data)
  const compiled = compile(req.query.html, {
    filename: 'App.svelte',
    format: 'cjs',
    hydratable: true,
    generate: 'ssr'
  })
  let { js } = compiled
  let component = eval(js.code)
  let result = component.render(data)
  let { html } = result
  // const app = new Vue({
  //   data: data,
  //   template: `<div>${req.query.html}</div>`
  // })
  res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
})

server.listen(8080)
