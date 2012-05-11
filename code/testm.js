#!/usr/bin/env node
// testm.js
// test the echo.js server, using multiple clients.

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
    setTimeout(testRequests, 150)
}

function
testRequests()
{
    var req = []
    var i
    for(i=0; i<10; ++i) {
        req[i] = mkRequest(''+i)
    }
    i = 0
    var msg = function() {
        req[i].write('Message ' + i + '\n')
        i += 1
        if(i < req.length) {
            setTimeout(msg, 200)
        } else {
            for(i=0; i<req.length; ++i) {
                req[i].end()
            }
        }
    }
    setTimeout(msg, 200)
}


function
mkRequest(prefix)
{
    prefix = prefix || '' + Math.floor(Math.random()*Math.pow(2,32))
    var req = http.request({ agent:false,
      method: 'POST',
      host: 'localhost', port: '8000', path: '/' })
    req.on('error', function(e) {
        console.log('reqError: ' + e.message)
    })
    req.on('response', function(response) {
        response.on('data', function(chunk) {
            process.stdout.write(prefix + ' ' + chunk)
        })
        // http://nodejs.org/api/http.html#http_event_end_1
        response.on('end', function() {
            exit()
        })
        response.on('close', function() {
            exit()
        })
    })
    return req
}

function
exit() {
    setTimeout(function() {
        child.kill()
        process.exit()
    }, 1000)
}

main()
