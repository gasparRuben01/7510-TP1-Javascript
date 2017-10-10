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

	addFact(args){
		this.facts[formFact(args)]=true;
	}

	hasFact(args){
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

		
var Interpreter = function () {
	var prepositions={};
	var preposition=null;
	var nombre=/^\s*([A-Za-z]*)/;
	var argumentos=/^\s*\)/;
	var argumento=/^\s*([A-Za-z]*)\s*([,)])/;
	var rule=/^s*:=/;
	var getPrepositonFromBuffer=function(buffer){
					var preposition=prepositions[buffer.name];
					if(!preposition){
						preposition=new Preposition(buffer.name);
						prepositions[preposition.name]=preposition;
					}
					preposition.addFact(buffer.args);
					buffer.rules.forEach(function(r, ind, array){
						var rule_name=r[0];
						var rule_order_variales=r[1];
						var rule=prepositons[rule_name]
						if(rule)
							throw Error();
						preposition.addRule(rule, rule_order_variables);
					})
					
				     };


	var parse_name_arguments=function(input){
		var buffer=null;
		if(!input.match(nombre))
			throw Error();
		else{
			buffer["name"]=input.match(nombre)[1];	
			input=input.replace(nombre)="";
		}
		if(!input.match(argumentos))
			throw Error();
		else
			input=input.replace(argumentos)="";

		var args=[];
		while(input.match(argumento)){
			args.push(input.match(argumento)[1]);
			var last=input.match(arguemnto)[2];
			input=input.replace(argumento, "");
			if(last==")")
				break;
		}
		buffer["args"]=args;
		return [buffer, input];
	};

	this.parseDB = function (params, paramss, paramsss) {
		var buffer_input=parse_name_arguments(params);
		var preposition=buffer_input[0];
		preposition["rules"]=[];	
		var input=buffer_input[1];
		var regex=rule;
		while (input.match(regex)){
			input.replace(regex, "");
			buffer_input=parse_name_argumentos(input);
			var rule=buffer_input[0];
			var order_of_variables=[];
			input=baffer_input[1];
			rule["args"].forEach(function(arg, indice, array){
				order_of_variables.push(preposition["args"].indexOf(arg));
			})
			preposition["rules"].push([rule["name"], order_of_variables]);
			regex=next_rule;
		}
		if(!input.match(fin)){
			throw Error();
		}
		getPrepositionFromBuffer(preposition);
	};


	this.checkQuery = function (params) {
		return true;
	};

}

module.exports = Interpreter;
