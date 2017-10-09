//una preposition tiene tanto rules como facts
class Preposition{
	constructor(name){
		this.name=name;
		this.facts={};
		this.rules=[];
		this.separator='_';
		this.formFact=function(args){
			return Array.prototype.slice.call(args, 0).join(separator);}
	}

	addFacts(args){
		this.facts[formFact(args)]=true;
	}

	hasFacts(args){
		return this.facts[formFact(args)];
	}
	addRule(rule, orderofvariables){
		this.rules.push([rule, orderofvariables])
	}
	evaluate(args){
		if(hasFacts(formFact(args))){
			return true;
		}
		var retorno=true;
		this.rules.forEach(function(rule_order, indice, array){
			var ruleArgs=[];
			rule_order[1].forEach(function(pos, indice, array){
				ruleArgs.push(args[pos])});
				
			if(rule_order[0].evaluate(ruleArgs)){
				retorno=false;
			}
		})
		return retorno;
	}
}

class Parser {
	constructor(){
		this.commands={};
	}
	parse(input){
		input.forEach(function(sentencia, indice, array){
			while(sentencia){
				for(var command in this.commands){
					if(this.commands[command].match(sentencia)){
						sentencia=this.commands[command].run(sentencia);
						break;}
				}
			}
		}
	}
}

		
var Interpreter = function () {
	var prepositions={};
	var preposition={};
	var parser=new Parser();
	var parseName={ parser: parser,
			regex: /^\s*([^,():=]*)/
			match: function(sentencia){
				var match=sentencia.match(this.regex);
				if(match){

	this.parseDB = function (params, paramss, paramsss) {
	}

	this.checkQuery = function (params) {
		return true;
	}

}

module.exports = Interpreter;
