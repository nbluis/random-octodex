var express = require('express'),
    cat = require('octodex'),
    http = require('http'),
    urlParser = require('url'),
    app = express();

app.get('/random', function(req, res) {
  cat.img(function(err, url) {
    if (err) {
      res.end();
      return;
    }

    var requestOptions = urlParser.parse(url, true);
    console.log(requestOptions);

    var options = {
      hostname: requestOptions.hostname,
      port: 80,
      path: requestOptions.path,
      method: 'GET'
    };

    var imageRequest = http.request(options);
    imageRequest.on('data', function(chunk) {
        console.log('data');
        res.write(chunk);
    });
    imageRequest.on('end', function() {
        console.log('end');
        res.end();
      });
      imageRequest.on('error', function() {
        console.log('Error:', request, body, d);
        res.end();
      });

    imageRequest.end();

  });
}).listen(8009);