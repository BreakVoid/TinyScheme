var syntax = require("./syntax.js");
var util = require("./util.js");

var globalScope = syntax.identifiers;

function ProcExec(str, curScope) {
	var procParas = util.GetElements(str.slice(1, str.length - 1));

	if (curScope[procParas[0].content].type == "syntax") {
		var paraList = [];
		for (var i = 1; i < procParas.length; ++i) {
			if (procParas[i].type == "procedure") {
				paraList.push(ProcExec(procParas[i].content, curScope));
			} else {
				paraList.push(procParas[i]);
			}
		}
		return curScope[procParas[0].content]["exec"](paraList, curScope);
	} else {

	}
}

var fs = require("fs");

var data = fs.readFileSync("./src.scm", {encoding: 'utf8'});

var sents = util.GetSentences(data);


for (var i = 0; i < sents.length; ++i) {
	ProcExec(sents[i], globalScope);
}
