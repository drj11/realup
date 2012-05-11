#!/usr/bin/env node
// echo
// David Jones, 2012-05-11

// echo server.
// All data received as the body of an HTTP request (typically
// POST), is written as the response to all HTTP requests that
// are currently connected.  It's all chunky.

// http://nodejs.org/api/http.html
http = require('http')

// Global table of requests.  Indexed by request.echoid (which
// is an identifier randomly created when the request is received).
// Each value in the table is a {request:request, response:reponse}
// table.
Request = {}

function
main()
{
    server = http.createServer(onRequest)
    server.listen(8000)
}

// Handler for the 'request' event on the HTTP server.
// http://nodejs.org/api/http.html#http_event_request
function
onRequest(request, response)
{
    request.setEncoding('utf8')
    request.echoid = randid()
    Request[request.echoid] = {request:request, response:response}
    console.log('new request ' + request.echoid)
    request.on('data', onData)
    request.on('end', function() {
        delete Request[request.echoid]
        console.log('closing request ' + request.echoid)
        response.end()
    })
}

// Called when we get 'data' from a request.
function
onData(chunk)
{
    var response
    console.log('got data [[' + chunk + ']]')
    // Echo chunk to all current requests.
    for(id in Request) {
        response = Request[id].response
        console.log('writing to ' + id)
        response.write(chunk)
    }
}

// Generate Random Identifier
function
randid()
{
    var buf = require('crypto').randomBytes(8)
    var i
    var s = ''
    var h
    for(i=0; i<buf.length; ++i) {
        h = Number(buf[i]).toString(16)
        while(h.length < 2) {
            h = '0' + h
        }
        s += h
    }
    return s
}

main()
