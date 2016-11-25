#!/bin/bash
export PATH=$PATH:<path to casperjs/bin folder>:<path to phantomjs/bin folder>:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
cd <path to folder with pge.js script>
casperjs $1 $2 $3 $4 $5 $6 &> ./log.txt 
