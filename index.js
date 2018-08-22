// 使用superagent发送请求
// const superagent = require('superagent');
// const cheerio = require('cheerio');

// const url = "http://www.jianshu.com";

// superagent.get(url).end(function (err, res) {
//     // 抛错拦截
//     if(err){
//       console.log(err.status)
//       throw Error(err);
//     }
//     // 等待 code
// });


// var request = require('superagent');
 
// // extend with Request#proxy() 
// require('superagent-proxy')(request);
 
// // HTTP, HTTPS, or SOCKS proxy to use
// // fiddler的端口默认是8888，所以这里是http://127.0.0.1:8888  http://168.63.43.102:3128
// var proxy = process.env.http_proxy || 'http://127.0.0.1:8888';
 
// request
//   .get(process.argv[2] || 'https://www.baidu.com/')
//   .proxy(proxy)
//   .end(onresponse);
 
// function onresponse (err, res) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(res.status, res.headers);
//     console.log(res.body);
//   }
// }


// 使用node的https模块发送请求
// var http = require('https'); 
// var qs = require('querystring'); 


// var req = http.get('https://www.baidu.com', function (res) { 
//     console.log('STATUS: ' + res.statusCode); 
//     console.log('HEADERS: ' + JSON.stringify(res.headers)); 
//     res.setEncoding('utf8'); 
//     res.on('data', function (chunk) { 
//         console.log('BODY: ' + chunk); 
//     }); 
// }); 
   
// req.on('error', function (e) { 
//     console.log('problem with request: ' + e.message); 
// }); 
   
// req.end();


// var request = require('superagent');
 
// // extend with Request#proxy() 
// require('superagent-proxy')(request);
 
// // HTTP, HTTPS, or SOCKS proxy to use
// // fiddler的端口默认是8888，所以这里是http://127.0.0.1:8888
// var proxy = process.env.http_proxy || 'https://127.0.0.1:8888';
 
// request
//   .get(process.argv[2] || 'https://www.baidu.com')
//   .proxy(proxy)
//   .end(onresponse);
 
// function onresponse (err, res) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(res.status, res.headers);
//     console.log(res.body);
//   }
// }


var request = require('request');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Ignore 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' authorization error

// Issue the request
request(
{
    method: "GET",
    uri: "https://www.jianshu.com/",
    proxy: "http://127.0.0.1:8888" // Note the fully-qualified path to Fiddler proxy. No "https" is required, even for https connections to outside.
},
function(err, response, body) {
    console.log("done");
    console.log(err);
    console.log(response);
    console.log(body);
});


http.get(url, function(sres) {
  var chunks = [];
  sres.on('data', function(chunk) {
    chunks.push(chunk);
  });
  // chunks里面存储着网页的 html 内容，将它zhuan ma传给 cheerio.load 之后  
  // 就可以得到一个实现了 jQuery 接口的变量，将它命名为 `$`  
  // 剩下就都是 jQuery 的内容了  
  sres.on('end', function() {
    var titles = [];
    //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
    //依据：“<meta http-equiv="Content-Type" content="text/html; charset=gb2312">”
    var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
    var $ = cheerio.load(html, {decodeEntities: false});
    $('.co_content8 .ulink').each(function (idx, element) {
      var $element = $(element);
      titles.push({
        title: $element.text()
      })
    })
    console.log(titles);
  });
});
// 运行node index

// 结果如下
// node-repfile-title.png

// 成功获取电影title，那如果我想获取多个页面的title呢，总不可能一个一个url去改吧。这当然有办法，请往下看！

// 获取多页电影标题
// 我们只要将之前的代码封装成一个函数并递归执行就完成了

// 核心代码 index.js

var index = 1; //页面数控制
var url = 'http://www.ygdy8.net/html/gndy/dyzz/list_23_';
var titles = []; //用于保存title
function getTitle(url, i) {
  console.log("正在获取第" + i + "页的内容");
  http.get(url + i + '.html', function(sres) {
    var chunks = [];
    sres.on('data', function(chunk) {
      chunks.push(chunk);
    });
    sres.on('end', function() {
      var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
      var $ = cheerio.load(html, {decodeEntities: false});
      $('.co_content8 .ulink').each(function (idx, element) {
        var $element = $(element);
        titles.push({
          title: $element.text()
        })
      })
      if(i < 2) { //为了方便只爬了两页
        getTitle(url, ++index); //递归执行，页数+1
      } else {
        console.log(titles);
        console.log("Title获取完毕！");
      }
    });
  });
}
function main() {
  console.log("开始爬取");
  getTitle(url, index);
}
main(); //运行主函数
// 结果如下
// node-reptitle-many-title.png

// 获取电影下载连接
// 如果是人工操作，我们需要一次操作，通过点击进入电影详情页才能找到下载地址
// 那我们通过node如何来实现呢

// 常规先来分析页面布局
// ygdy-des.png

// 我们如果想要准确定位到下载链接，需要先找到id为Zoom的div，下载链接就在这个div下的tr下的a标签内。

// 那我们就再定义一个函数，用于获取下载链接

getBtLink()

function getBtLink(urls, n) { 
  //urls里面包含着所有详情页的地址  console.log("正在获取第" + n + "个url的内容");  
  http.get('http://www.ygdy8.net' + urls[n].title, function(sres) {
    var chunks = [];
    sres.on('data', function(chunk) {
      chunks.push(chunk);
    });
    sres.on('end', function() {
      var html = iconv.decode(Buffer.concat(chunks), 'gb2312'); //进行转码
      var $ = cheerio.load(html, {decodeEntities: false});
      $('#Zoom td').children('a').each(function (idx, element) {
        var $element = $(element);
        btLink.push({
          bt: $element.attr('href')        
        })
      })
      if(n < urls.length - 1) {
        getBtLink(urls, ++count); //递归
      } else {
        console.log("btlink获取完毕！");
        console.log(btLink);
      }
    });
  });
}
// 再次运行 node index
// WX20170318-190537@2x.png
// WX20170318-190549@2x.png

// 就这样我们将3个页面内所有电影的下载链接获取完毕，是不是很简单？

// 保存数据
// 我们讲这些数据爬取出来当然是要进行保存的啊，在这里我选用了MongoDB来对其进行保存处理

// 数据保存函数 
save()

function save() {
  var MongoClient = require('mongodb').MongoClient; //导入依赖
  MongoClient.connect(mongo_url, function (err, db) {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log("成功连接数据库");
      var collection = db.collection('node-reptitle');
      collection.insertMany(btLink, function (err,result) { //插入数据
        if (err) {
          console.error(err);
        } else {
          console.log("保存数据成功");
        }
      })
      db.close();
    }
  });
}
// 这里的操作很简单，就没必要上mongoose啦
// 再次运行 node index
// mongodb-node-reptitle.png

// 这个Node.js实现的爬虫就是这样了，祝大家能爬到自己想要的数据；）

// 最后附上源码地址：github.com/HuangXiZhou…
