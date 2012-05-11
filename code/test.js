#!/usr/bin/env node
// test the echo.js server

// http://nodejs.org/api/http.html
http = require('http')
spawn = require('child_process').spawn

function
main()
{
    var echo = spawn('./echo.js')
    echo.stdout.on('data', function(data) {
        process.stdout.write('from echo stdout: ' + data +
          '\n$$ echo stdout end\n')
    })
    echo.stderr.on('data', function(data) {
        process.stdout.write('FROM ECHO STDERR: ' + data +
          '\n$$ echo stderr end')
    })
    child = echo
    // Gives the child HTTP server a chance to start.
    setTimeout(testRequest, 150)
}

function
testRequest() {
    var req = http.request({ method: 'POST',
      host: 'localhost', port: '8000', path: '/' })
    req.on('error', function(e) {
        console.log('reqError: ' + e.message)
    })
    req.on('response', function(response) {
        // http://nodejs.org/api/http.html#http_event_end_1
        response.on('end', function() {
            exit()
        })
        response.on('close', function() {
            exit()
        })
    })
    req.write('Hello World!\r\n')
    req.end()
}

function
exit() {
    setTimeout(function() {
        child.kill()
        process.exit()
    }, 1000)
}

main()
