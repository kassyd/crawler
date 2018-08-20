// 使用superagent发送请求
// const superagent = require('superagent');
// const cheerio = require('cheerio');

// const url = "http://www.jianshu.com";

// superagent.get(reptileUrl).end(function (err, res) {
//     // 抛错拦截
//     if(err){
//       console.log(err.status)
//       throw Error(err);
//     }
//     // 等待 code
// });


// 使用node的https模块发送请求
var http = require('https'); 
var qs = require('querystring'); 


var req = http.get('https://www.jianshu.com', function (res) { 
    console.log('STATUS: ' + res.statusCode); 
    console.log('HEADERS: ' + JSON.stringify(res.headers)); 
    res.setEncoding('utf8'); 
    res.on('data', function (chunk) { 
        console.log('BODY: ' + chunk); 
    }); 
}); 
   
req.on('error', function (e) { 
    console.log('problem with request: ' + e.message); 
}); 
   
req.end();