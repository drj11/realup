#!/usr/bin/env node
// echo
// David Jones, 2012-05-11

// echoes, on stdout, everything received via HTTP connection.

// http://nodejs.org/api/http.html
http = require('http')

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
    process.stdout.write('new request')
    response.end()
}

main()
