"use strict";

// Dependencies
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var config = require('./config');
var FeedParser = require('feedparser');


// get available file path
var getAvailableStoredPath = function(){

    var filenames = fs.readdirSync(config.downloadFolder);
    console.log(filenames);

    // var filename = config.downloadFolder + Date.now().toJSON();
    
    // if (fs.existsSync(filename)) {
    //     // file filesize is larger than config.maxFileSize then create another file
    //     var fileSize = fs.statSync(filename)['size'] / 1000000.0; // get file size in mega bytes

    //     if (fileSize > config.maxFileSize){
    //         // replace with another file
    //     }

    // }

    // return filename;
}

console.log(getAvailableStoredPath());

// craw rss file from all stored links
var crawRssFile = function(link){
    var chunks = [];
    var feedparser = new FeedParser();
    var i = 0;
    http.get(link, function(res){
        console.log("Got response: " + res.statusCode);
        if (res.statusCode == 200){
            res.pipe(feedparser);
        }
    }).on('error', function(err){
        console.log("Got error: " + e.message);
    }).on('end', function(){
        console.log('FINISH http.get');
    });

    feedparser.on('error', function(err){
        console.log("Got error: " + e.message);
    }).on('readable', function(){
        // parse rss information from rss file
        i = i + 1;
        var stream = this
            , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
            , item;

        while (item = stream.read()) {
            //console.log(item);
            console.log('meta-tile:' + meta.title);
            console.log('meta-description:' + meta.description);
            console.log('meta-pubData:' + meta.pubDate);
            console.log('title:' + item.title);
            console.log('description:' + item.description);
            console.log('link:' + item.link);
            console.log('pubDate:' + item.pubDate);

        }

        console.log(i);
    }).on('end', function(){
        console.log('FINISH feedparser');
    });
};

// test config data
console.log(config.rssLinks.length);
//crawRssFile(config.rssLinks[0]);

for (var i = 0; i < config.rssLinks.length; i++){
    var link = config.rssLinks[i];
    console.log(link);

    //crawRssFile(link);
}