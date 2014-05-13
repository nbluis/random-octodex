var express = require('express'),
    cat = require('octodex'),
    app = express();

app.get('/random', function(req, res) {
  cat.img(function(err, url) {
    if (err) {
      res.end();
      return;
    }

    var requestUrl = url.replace('http://', 'https://') + (url.indexOf('?') > 0 ? '&' : '?') + Math.random();

    res.writeHead(302, {
      'Cache-Control' : 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Location' : requestUrl
    });

    res.end();

  }, true);
}).listen(Number(process.env.PORT || 5000));