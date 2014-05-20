var express = require('express'),
    cat = require('octodex'),
    url = require('url'),
    https = require('https'),
    newrelic = require('newrelic'),
    app = express();

var setCacheExpiration = function(res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

var RequestHandler = function (req, res, callback) {
  cat.img(function(err, imageUrl) {
    if (err) {
      res.end();
      return;
    }
    setCacheExpiration(res);
    callback(imageUrl);
  }, true);
};

var LocationRedirectHandler = function(req, res) {
  new RequestHandler(req, res, function(imageUrl) {
    var requestUrl = imageUrl.replace('http://', 'https://') + (imageUrl.indexOf('?') > 0 ? '&' : '?') + Math.random();
    res.writeHead(302, {'Location' : requestUrl});
    res.end();
  });
};

var ImageProxyHandler = function(req, res) {
  new RequestHandler(req, res, function(imageUrl) {
    var parsedUrl = url.parse(imageUrl);
    parsedUrl.protocol = 'https:';

    var imageRequest = https.get(parsedUrl, function(imageResponse) {

      res.setHeader('Content-Length', imageResponse.headers['content-length']);
      res.setHeader('Content-Type', imageResponse.headers['content-type']);

      imageResponse.on('data', function (chunk) {
        res.write(chunk);
      });

      imageResponse.on('end', function () {
        res.end();
      });

    });

    imageRequest.end();
  });
};

app.get('/random', ImageProxyHandler);
app.get('/randomLocation', LocationRedirectHandler);
app.listen(Number(process.env.PORT || 5000));