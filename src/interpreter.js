class Relationship {
	constructor(name){
		this.name=name;
		this.facts=new Set();
		this.rules=null;
	}
	addFact(fact){
		fact=fact.join(',');
		this.facts.add(fact);
	}
	setRules(rules){
		this.rules=rules;
	}
	areRelated(args, db){
		var fact=args.join(',');
		if(this.facts.has(fact))
			return true;
		return this.rules ? this.rules.map(function(r){r.areRelated(args, db)}).indexOf(false) : false;
	}

}

class Rule {
	constructor(relation, orderOfargs){
		this.relation=relation;
		this.orderOfargs=orderOfargs;
	}	
	areRelated(args, db){
		if(args.length>=this.orderOfargs.length){
			return false;
		}
		return db[relation] ? db[relation].areRelated(this.orderOfargs.map(function(pos){return args[pos]}), db) : false;
	}
}

var Parser=function(){
	var RULESYMBOL=/:=/;
	var NAME_ARGS=/\s*[A-Za-z]+\s*\(.*\)/;
	var END=/\.$/;
	var NAME=/^\s*([A-Za-z]+)\s*/;

	var getName=function(name_args){
		return name_args.match(NAME_ARGS) && name_args.match(NAME) ? name_args.match(NAME)[1] : null;
	};
	var getVars=function(name_args){
		if(!name_args.match(NAME_ARGS)){
			return null;
		}
		var args=name_args.replace(NAME, "");
		args=args.replace(/\(/, "");
		args=args.replace(/\)/,"");
		args=args.split(/,/).map(function(a){ return a.match(NAME) ? a.match(NAME)[1] : null});
		return args.indexOf(null)==-1 ? args : null;
	};
		


	this.parseRule=function(sentence){
			if(!sentence.match(END))
				return null;
				
			sentence=sentence.replace(END, "");
			sentence=sentence.split(RULESYMBOL);
			if(sentence.length!=2)
				return null;
			sentence[1]=sentence[1].split(/,/);
			sentence=sentence[0].concat(sentence[1]);
			name_args=sentence.map(function(a){return getName(a) && getVars(a) ? {name:getName(a), args:getVars(a)} : null});
			if(args.indexOf(null))
				return null;
			var name=name_args[0]["name"];
			var args=name_args[0]["args"];
			name_args=name_args.slince(1);
			var rules=name_args.map(function(x){ 
						var orderofargs=x.args.map(function(a){ return args.indexOf(a)!=-1 ? args.indexOf(a) : null});
						return orderofargs.indexOf(null)!=-1 ?  null : new Rule(x.name, orderofargs);});
			return rules.indexOf(null)!=-1 ? null : {name:name, rules:rules}};

	this.parseFact=function(sentence){
		if(!sentence.match(END))
			return null;
		sentence=sentence.replace(END, "");
		return getName(sentence) && getVars(sentence) ? {name:getName(sentence), fact:getVars(sentence)} : null;};
}
					


				


			



var interpreter = function () {
	var db=new Set();
	var parser=new Parser();

	this.parseDB = function (params, paramss, paramsss) {
		params.forEach(function(sentence) {
			var rule=parser.parseRule(sentence);
			if(rule){
				if(!db[rule.name])
					db[rule.name]=new Relationship(rule.name);
				db[rule.name].setRules(rule.rules);
				return;
			}
			var fact=parser.parseFact(sentence);
			if(fact){
				if(!db[fact.name])
					db[fact.name]=new Relationship(fact.name);
				db[fact.name].addFact(fact.fact);
				return;
			}
			throw Error("malos datos");
		});
	};



	this.checkQuery = function (params) {
		var query=parser.parseFact(params);
		throw Error("jj");
		if(query){
			return db[query.name].areRelated(query.fact);}
		return false;
	};

}

module.exports = interpreter;
