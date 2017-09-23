
var evilscan = require('evilscan');
var request = require('request');

var Scanner = function ( options ) {

  var self = this;

  self.config = {
    'range': '',
    'port': '',
    'headers': [], // OPT
    'concurrency': 100,
  };
  self.possibilities = [];
  self.probabilities = [];

  /**
   * TODO:
   * - Pode passar args ou utiliza outro módulo
   */

   /**
    * Method to set config
    * @param {[type]} config [description]
    */
   self.setConfig = function ( config ) {
    config = config || {};
    self.config.range = config.range || '';
    self.config.port = config.port || '';
    self.config.headers = config.headers || {};
    self.config.concurrency = config.concurrency || 100;
    if (self.config.range == '' || self.config.port == '') {
      return false;
    }
    return true;
   }

  /**
   * Method to return evilscan options
   * @return {[type]} [description]
   */
  self.getOptions = function () {
    var o = {
      target:       self.config.range,
      port:         self.config.port,
      // status:       'TROU', // Timeout, Refused, Open, Unreachable
      status:       'O', // Timeout, Refused, Open, Unreachable
      banner:       true,
      concurrency:  self.config.concurrency,
    };
    return o;
  }

  /**
   * Method to start the scan
   * @return {[type]} [description]
   */
  self.start = function ( config ) {

    return new Promise (function (resolve, reject) {
      
      if (self.setConfig(config)) {
        
        var scan = new evilscan ( self.getOptions() );

        scan.on( 'result', function(data) {
          if (data.status == 'open') {
            self.possibilities.push( data.ip );
          }
        });

        scan.on('error',function(err) {
          console.warn(data.toString());
        });

        scan.on('done',function() {
          console.log("Acabou scan. Possibilidades:", self.possibilities);
          var promises = [];
          for (var i in self.possibilities) {
            promises.push( self.get( 'http://' + self.possibilities[i] + ':' + self.config.port, self.possibilities[i] ) );
          }
          Promise.all(promises)
            .then(function (res) {
              console.log("Resolveu promise ", config);
              resolve( self.probabilities );
            })
            .catch(function (err) {
              reject( err );
            });
        });

        scan.run();

      }
      else {
        reject ( "Range ou porta inválidos" );
      }
    })

  }

  /**
   * Method to do HTTP req to server and find out if has
   * headers
   * @param  {string} addr [description]
   * @param  {int} pos  Position in array
   */
  self.get = function ( addr, pos ) {
    return new Promise (function (resolve, reject) {
      request ( addr , function (error, response, body) {
        if (!error) {
          if (response) {
            if (response.statusCode && response.statusCode < 400) {
              var errors = 0;
              for (var h in self.config.headers) {
                if (!response.headers[h] || response.headers[h] != self.config.headers[h]) {
                  errors++;
                }
              }
              if (errors == 0) {
                self.probabilities.push( pos );
              }
            }
          }
        }
        resolve();
      });
    });
  }

  return self;

}

module.exports = Scanner ();