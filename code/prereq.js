#!/usr/bin/env node
// Installs required packages.
// It's a node.js program.  What did you expect?
// Doesn't seem to work.

// http://npmjs.org/doc/README.html#Using-npm-Programmatically
npm = require('npm')

npm.load({}, function(err) {
    if(err) {
        console.log('npm error: ' + npm)
        return
    }
    npm.commands.install(['socket.io'], function(err, data) {
    npm.on('log', function(message) {
        console.log('NPM LOG: ' + message)
    })
    if(err) {
        console.log('npm install error: ' + err)
        return
    }
    })
})

