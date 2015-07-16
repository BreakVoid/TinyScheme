var util = require("./util.js");
var fs = require("fs");

var data = fs.readFileSync("./src.scm", {encoding: 'utf8'});

var sents = util.GetSentences(data);

for (var i = 0; i < sents.length; ++i) {
	console.log(i + "th sentences is " + sents[i]);
}

