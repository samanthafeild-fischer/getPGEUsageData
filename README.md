# getPGEUsageData
PGE has an API for downloading usage data. However that api doesn't support standalone downloads. 
Their API requires you to setup a website and do cert auth and webhooks implementation. That blocks out individual enthusiasts who want to download data programmatically for their own personal usage.

So I created this casperjs script which downloads  usage data from PGE's website in CSV format.

This script needs 5 command line arguments
 1 - starting date from which you want data in mm/dd/yyyy format
 2 - end date from which you want data in mm/dd/yyyy format
 3 - absolute path of folder where you want to download the file
 4 - username for pge.com
 5 - password for pge.com
 
 so it would look something like this
 casperjs pge.js 11/22/2016 11/23/2016 /tmp somePgeUser somePgePassword

