//representa relaciones entre entidades
class Relationship {
	constructor(name){
		this.name=name;
		//una relacion es cierta si es por hecho, o si esta dada por una conjuncion de reglas
		this.facts=new Set();
		this.rules=null;
	}
	addFact(fact){
		fact=fact.join(',');
		this.facts.add(fact);
	}
	setRules(rules){
		//solo puede haber una conjuncion de reglas a la vez y se reciben dentro de un array
		this.rules=rules;
	}
	areRelated(args, db){
		var fact=args.join(',');
		if(this.facts.has(fact))
			return true;
		//no es un hecho asi que evaluamos las reglas en el array y vemos si alguna es falsa
		return this.rules ? this.rules.map(function(r) {return r.areRelated(args, db)}).indexOf(false)==-1 : false;
	}

}

class Rule {
	//relation es el nombre de una relationship, orderOfargas es el orden en que se pasaran los parametros a relation cuando se invoque areRelated
	constructor(relation, orderOfargs){
		this.relation=relation;
		this.orderOfargs=orderOfargs;
	}	
	//db es la base de datos donde se buscara a relation
	areRelated(args, db){
		if(args.length<this.orderOfargs.length){
			return false;
		}
		return db[this.relation] ? db[this.relation].areRelated(this.orderOfargs.map(function(pos) {return args[pos]}), db) : false;
	}
}

var Parser=function(){
	//simbolo que nunca se va a usar en la syntaxis
	var FORBIDDENSYMBOL="@";
	var RULESYMBOL=/:-/;
	//matchea una nombre con un argumentos Nombre(cosas, cosas), no asegura que la composicion de los argumentos dentro del parentesis sea correcta
	var NAME_ARGS=/\s*[A-Za-z]+\s*\(.*\)/;
	var END=/\.$/;
	//obtiene el primer grupo de letras del string
	var NAME=/^\s*([A-Za-z]+)\s*/;

	//name_args representa un par nombre arguemntos Nombre(argumento, argumento, ..., arguemnto)
	//retrona el nombre de ese para o nulo si encuentra un error en la composicion del nombre del arguemtno. no chequea la parte de argumentos!!
	var getName=function(name_args){
		return name_args.match(NAME_ARGS) && name_args.match(NAME) ? name_args.match(NAME)[1] : null;
	};
	//retorn la parte de arguemntos del para nombre argumetnos Nombre(arguemnto, ..., arguemtno)
	//checquea que los aguemntos esten bien escritos, no verifca nada sobre la parte del nombre del para name_args.
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
			//solo debe tener un simbolo de asiganacion de reglas
			if(sentence.length!=2)
				return null;

			//remplazo comas que separan reglas por simbolo prohibiod para luego hacer split de simbolo proghibido. De esta
			//forma soluciono el problema de distinguir comas entre parentesis de las que estan afuera de los parentesis
			sentence[1]=sentence[1].replace(/(\(.*\)[^(]*),/, "$1"+FORBIDDENSYMBOL);
			//al hacer split, los pares nombre_arguemtnos Nombre(arg, arg, .., arg) han quedados separdos
			sentence[1]=sentence[1].split(new RegExp(FORBIDDENSYMBOL));
			//agrego el par nombre_argumentos que me quedo en el lado derecho de la asignacion
			sentence[1].push(sentence[0]);
			sentence=sentence[1];
			//obejtos pares nombre_argumentos
			name_args=sentence.map(function(a) {return getName(a) && getVars(a) ? {name:getName(a), args:getVars(a)} : null});
			if(name_args.indexOf(null)!=-1)
				return null;
			//el ultimo para corresponde con el que estaba en lado izquierdo de la asignacion
			var name=name_args[name_args.length-1]["name"];
			var args=name_args[name_args.length-1]["args"];
			name_args=name_args.slice(0, name_args.length-1);
			//mapeo los pares nombre argumentos del lado derecho de la asignacion
			var rules=name_args.map(function(x) { 
						var orderofargs=x.args.map(function(a){ return args.indexOf(a)!=-1 ? args.indexOf(a) : null});
						return orderofargs.indexOf(null)!=-1 ?  null : new Rule(x.name, orderofargs);});
			return rules.indexOf(null)!=-1 ? null : {name:name, rules:rules}};

	this.parseFact=function(sentence){
		if(!sentence.match(END))
			return null;
		sentence=sentence.replace(END, "");
		return getName(sentence) && getVars(sentence) ? {name:getName(sentence), fact:getVars(sentence)} : null;};

	this.parseQuery=function(sentence){
		var query=this.parseFact(sentence+".");
		query.query=query.fact;
		delete query.fact;
		return query;
	}
}
					


				


			



var interpreter = function () {
	var db={};
	var parser=new Parser();

	this.parseDB = function (params, paramss, paramsss) {
		for(var i=0; i<params.length; i++){
			var sentence=params[i];
			var rule=parser.parseRule(sentence);
			if(rule){
				if(!db[rule.name])
					db[rule.name]=new Relationship(rule.name);
				db[rule.name].setRules(rule.rules);
			}else{
				var fact=parser.parseFact(sentence);
				if(fact){
					if(!db[fact.name])
						db[fact.name]=new Relationship(fact.name);
					db[fact.name].addFact(fact.fact);
				}else{
					throw Error("malos datos");
				}
			}
		}
	};




	this.checkQuery = function (params) {
		var query=parser.parseQuery(params);
		if(query && db[query.name]){
			return db[query.name].areRelated(query.query, db);}
		return false;
	};

}

module.exports = interpreter;
