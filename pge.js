// download file using casper js
var casper = require('casper').create({
    verbose: true,
    //logLevel: 'debug',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22',
    pageSettings: {
      loadImages:  false,         // The WebPage instance used by Casper will
      loadPlugins: false         // use these settings
    }
});

// start date
var strt = casper.cli.get(0); // format yyyy-mm-dd

// end date
var enddt = casper.cli.get(1); // format yyyy-mm-dd

// place to download file
var fileLocation = casper.cli.get(2);

// username
var username =  casper.cli.get(3);

// password
var password =  casper.cli.get(4);

// print out all the messages in the headless browser context
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

// print out all the messages in the headless browser context
casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

var url = 'https://www.pge.com/myenergyweb/appmanager/pge/customer/contextual/myusage';

casper.start(url, function() {
    // search for 'casperjs' from google form
    this.fill('form[action="/eum/login"]', {
          USER: username,
          PASSWORD:  password
         }, true);
});

// wait for green button to appear
casper.waitForSelector("#widget-usage-export > div > div > div > div > div > button.green-button > span.button-icon > svg > use",
    function pass () {
      // start download of file
      var startDate = encodeURIComponent(strt);
      var endDate = encodeURIComponent(enddt);
      var loadParams = '?format=csv&startDate=' + startDate + '&endDate=' + endDate;
      this.open('https://pge.opower.com/ei/app/api/usage_export/download' + loadParams);

    },
    function fail () {
        console.log("didn't find green button")
        this.capture('fail.png');
    },
    20000 // timeout limit in milliseconds
);

// save file
casper.on('resource.received', function (resource) {
     "use strict";

     if ((resource.url.indexOf("/download") !== -1) ) {
        try {
            var fs = require('fs');
            //casper.download(resource.url, fs.workingDirectory+'/'+file);
            casper.download(resource.url, fileLocation);
        } catch (e) {
            this.echo(e);
        }
    }
 })

casper.run();
