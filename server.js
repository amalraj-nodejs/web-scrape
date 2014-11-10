var express = require('express');
var app = express();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

app.get('/', function(req, res){
	res.send('This is Home Page of Web Scrap')
})

app.get('/scrape/:movie_id', function(req, res){
	id = req.params.movie_id;
	url = "http://www.imdb.com/title/" + id;

	request(url, function(error, response, html){
		if(error)
			throw error;
		var $ = cheerio.load(html);

		var title, release, rating;

		var json = { title: "", release: "", rating: ""};

		$(".header").filter(function(){
			var data = $(this);

			title = data.children().first().text();

			json.title = title;

			release = data.children().last().children().text();

			json.release = release;

		})

		$('.star-box-giga-star').filter(function(){
			var data = $(this);
			rating = data.text();

			json.rating = rating;
		})

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
			console.log('File successfully written in project directory');
		})

		res.send(JSON.stringify(json, null, 4));
	})
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})


exports = module.exports = app;