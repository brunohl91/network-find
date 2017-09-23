
var scanner = require('./app');
var eth = require('get-eth');

/**
 * Estou tendo problemas com mascaras grandes
 */

var eths = eth.get();



// var p = [];
// for (var i in eths) {
//   console.log("Pushing Promise: " + eths[i].ini + "/" + eths[i].n)
//   p.push( scanner.start({
//     "range": eths[i].ini + "/" + eths[i].n,
//     "port": process.argv[2],
//     "headers": {
//       "content-type": "application/json; charset=utf-8",
//     },
//     "concurrency": 100,
//   }))
// }

// Promise.all( p )
//   .then(function (res) {
//     console.log(res);
//   })
//   .catch(function (err) {
//     console.log("Ocorreram erros", err)
//   })