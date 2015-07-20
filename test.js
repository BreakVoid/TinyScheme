var util = require("./util.js");
var fs = require("fs");

var data = fs.readFileSync("./src.scm", {encoding: 'utf8'});

var sents = util.GetSentences(data);

for (var i = 0; i < sents.length; ++i) {
	console.log(i + "th sentence is " + sents[i]);
	var elements = util.GetElements(sents[i].substring(1, sents[i].length - 1));
	for (var j = 0; j < elements.length; ++j) {
		console.log(j + "th element is " + elements[j].content + ' [type is ' + elements[j].type + "]");
	}
}

