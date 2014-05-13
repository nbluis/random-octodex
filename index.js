var express = require('express'),
    cat = require('octodex'),
    app = express();

app.get('/random', function(req, res) {
  cat.img(function(err, url) {
    if (err) {
      res.end();
      return;
    }
    res.writeHead(302, {'Location' : url});
    res.end();

  }, true);
}).listen(Number(process.env.PORT || 5000));