var express = require('express');
var app = express();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

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

app.listen(8081);
console.log('app listening in 8081');

exports = module.exports = app;