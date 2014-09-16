"use strict";

// Dependencies
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var config = require('./config');
var FeedParser = require('feedparser');

var addZero = function(value){
    var result = value.toString();
    if(result.length == 1){
        result = "0" + result;
    }

    return result;
}

// get available file path
var openDataStream = function(){

    var filenames = fs.readdirSync(config.downloadFolder).sort();
    var filename = "";
    var pattern = /\d{4}(-\d{2}){5}\.csv/g;

    for (var i = filenames.length - 1; i >= 0; i--) {
        // console.log(filenames[i]);

        if(pattern.test(filenames[i])){
            // console.log(filenames[i]);
            filename = filenames[i];
            break;
        }
    };

    var flag = true;
    if(filename !== ""){
        filename = config.downloadFolder + filename;
        var fileSize = fs.statSync(filename)['size'] / 1000000.0; // get file size in mega bytes

        if(fileSize < config.maxFileSize){
            // create new file flag
            flag = false;
        }
    }

    if(flag){
        // create new file
        var now = new Date();
        filename = config.downloadFolder + addZero(now.getUTCFullYear()) + '-' + addZero(now.getUTCMonth()) + '-' 
                + addZero(now.getUTCDate()) + '-' + addZero(now.getUTCHours()) + '-' + addZero(now.getUTCMinutes()) 
                + '-' + addZero(now.getUTCSeconds()) + '.csv';
    }

    console.log(filename);

    return {filename: filename,
            isNew: flag};
}

// craw rss file from all stored links
var crawlRssFile = function(link, filename, isNew){
    var chunks = [];
    var feedparser = new FeedParser();
    var i = 0;
    var stream = fs.createWriteStream(filename, {flags: 'a', encoding:'utf-16'});
    console.log(isNew);
    if(isNew == true){
        // console.log('meta-title, meta-description, meta-pubDate, title, description, link, pubDate\r\n');
        stream.write('meta-title, meta-description, meta-pubDate, title, description, link, pubDate\r\n');
    }

    http.get(link, function(res){
        console.log("Got response: " + res.statusCode);
        if (res.statusCode == 200){
            res.pipe(feedparser);
        }
    }).on('error', function(e){
        console.log("Got httpget error: " + e.message);
    }).on('end', function(){
        console.log('FINISH http.get');
    });

    feedparser.on('error', function(e){
        console.log("Got feedparser error: " + e.message);
    }).on('readable', function(){
        // parse rss information from rss file
        i = i + 1;
        
        var meta = this.meta;// **NOTE** the "meta" is always available in the context of the feedparser instance
        var item = this.item;

        while (item = this.read()) {
            //console.log(item);
            // console.log('meta-tile:' + meta.title);
            // console.log('meta-description:' + meta.description);
            // console.log('meta-pubDate:' + meta.pubDate);
            // console.log('title:' + item.title);
            // console.log('description:' + item.description);
            // console.log('link:' + item.link);
            // console.log('pubDate:' + item.pubDate);
            stream.write(meta.title + ', ' + meta.description + ', ' + meta.pubDate + ', ' + item.title + ', ' 
                    + item.description + ', ' + item.link + ', ' + item.pubDate + '\r\n');
        }

        console.log(i);
    }).on('end', function(){
        stream.end();
        console.log('FINISH feedparser');
    });
};

var main = function(){
    var result = openDataStream();
    // test config data

    crawlRssFile(config.rssLinks[0], result.filename, result.isNew);
    for (var i = 1; i < config.rssLinks.length; i++){
        var link = config.rssLinks[i];
        console.log(link);
        crawlRssFile(config.rssLinks[0], result.filename, false);
    }
}

// execute main function
main();