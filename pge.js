// Casperjs script to download your PGE usage data from PGE's website
// this script needs 5 command line arguments
// 1 - starting date from which you want data in mm/dd/yyyy format
// 2 - end date from which you want data in mm/dd/yyyy format
// 3 - absolute path of folder where you want to download the file
// 4 - username for pge.com
// 5 - password for pge.com
// so it would look something like this
// casperjs pge.js 11/22/2016 11/23/2016 /tmp somePgeUser somePgePassword

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
var strt = casper.cli.get(0); // format mm/dd/yyyy

// end date
var enddt = casper.cli.get(1); // format mm/dd/yyyy

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

// login page
var url = 'https://www.pge.com/myenergyweb/appmanager/pge/customer/contextual/myusage';

// fill login form
casper.start(url, function() {
    // fill the login form
    this.fill('form[action="/eum/login"]', {
          USER: username,
          PASSWORD:  password
         }, true);
});

// wait for page to load with green button
casper.waitForSelector("#content > div:nth-child(4) > div.space-top > div.span-4.last.align-right > div > a",
    function pass () {

      var greenbuttons = this.getElementsInfo("#content > div:nth-child(4) > div.space-top > div.span-4.last.align-right > div > a");
      var greenButtonLink = greenbuttons[0];
      // find link which has customer id which use used later when downloading data
      var match = /customer\/(\d+)\/bill_periods/.exec(greenButtonLink.attributes.href)
      var customerNumber = match[1];

      // prep up url parameters 
      var billDate = new Date().getFullYear() + '-' +new Date().getMonth();
      var startDate = encodeURIComponent(strt);
      var endDate = encodeURIComponent(enddt);
      
      // create string to append to download URL
      var loadParams = 'bill='+ billDate + '&exportFormat=CSV_AMI&csvFrom=' + startDate + '&csvTo='+ endDate + '&xmlFrom='+ startDate + '&xmlTo=' + endDate;
  
      // finally send request to download the usage data in CSV format
      this.open('https://pge.opower.com/ei/app/modules/customer/' + customerNumber + '/energy/download?' + loadParams);

    },
    function fail () {
        console.log("didn't find")
        this.capture('fail.png');
    },
    20000 // timeout limit in milliseconds
);

// intercept download links
casper.on('resource.received', function (resource) {
     "use strict";

     // if the link is for downloading the file
     if ((resource.url.indexOf("/energy/download") !== -1) ) {
        var url, file;
        url = resource.url;
        try {
            var fs = require('fs');
            // download the file in 'fileLocation' folder
            casper.download(resource.url, fileLocation);
        } catch (e) {
            this.echo(e);
        }
    }
 })

// finally run the script
casper.run();
