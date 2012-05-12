#!/usr/bin/env node
// client.js
// A console based client for the echo server.

// http://nodejs.org/api/http.html
http = require('http')
// http://nodejs.org/api/url.html
url = require('url')

function
main()
{
    var u = 'http://localhost:8000/'
    var o = url.parse(u)
    var req
    var name // Filled in by prompt.
    o.method = 'POST'
    // Recommended by http://nodejs.org/api/http.html#http_request_write_chunk_encoding
    o.headers = ['Transfer-Encoding', 'chunked']
    console.log('Connecting to ' + u)
    req = http.request(o, function(response) {
        console.log('Connected')
        response.on('data', function(chunk) {
            process.stdout.write(chunk)
        })
        process.stdin.on('data', function(chunk) {
            req.write(name + ': ' + chunk)
        })
        process.stdin.on('end', function() {
            req.write('LEAVING: ' + name + '\n')
            req.end()
            process.exit()
        })
    })

    // Read name from stdin.
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    console.log('Type your name followed by [Enter]')
    process.stdin.once('data', function (chunk) {
        name = chunk.replace(/\s/g, '')
        // Writing to the request will cause it to be sent to
        // the server, and we will get a response back (handled
        // in the reponse handler, above).
        req.write(name + '\n')
    })
}


main()
