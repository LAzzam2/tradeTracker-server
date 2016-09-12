// Use the OAuth module
var oauth = require('oauth');

// Setup key/secret for authentication and API endpoint URL
var configuration = {
  api_url: "https://api.tradeking.com/v1",
  consumer_key: "aQtQbm1nx5DhB41PMgufq7l49xs34alq5tVaoANGR1s8",
  consumer_secret: "QNV88vMjQaG5TiR0DhVXjOI3LGEqSCodvD784kazCMc3",
  access_token: "Wliut3u7975JtGNJ3u4N7GJRnoZmLoUD8bjbhY5Urug1",
  access_secret: "sOfeIwluAJhF4KfBqOlKVe76t90TqiKo6PlYahwI95Q7"
}

// Setup the OAuth Consumer
var tradeking_consumer = new oauth.OAuth(
  "https://developers.tradeking.com/oauth/request_token",
  "https://developers.tradeking.com/oauth/access_token",
  configuration.consumer_key,
  configuration.consumer_secret,
  "1.0",
  "http://mywebsite.com/tradeking/callback",
  "HMAC-SHA1");

// Make a request to the API endpoint
// Manually update the access token/secret as parameters.  Typically this would be done through an OAuth callback when 
// authenticating other users.

function quoteStream(){
  console.log('quoteStream');
  tradeking_consumer.get(configuration.api_url+'/market/ext/quotes.json?symbols=aapl,gpro', configuration.access_token, configuration.access_secret,
    function(error, data, response) {
      // Parse the JSON data
      var quotes = JSON.parse(data);
      quotes = quotes.response.quotes.quote;
      for (var i = 0; i < quotes.length; i++) {  
        console.log(quotes[i].symbol, quotes[i].last);
      }
    }
  );
}

setInterval(function(){ quoteStream() }, 1000);
quoteStream();