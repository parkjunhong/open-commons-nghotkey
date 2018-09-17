/*
 * This file is generated under this project, "open-commons-nghotkey". 
 *
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @copyright: Park_Jun_Hong_(fafanmama_at_naver_com)
 * @license: MIT License
 * @url: https://github.com/parkjunhong/open-commons-nghotkey
 * @version: 0.2.1
 * @require: Angular JS 1.7 or higher
 * @dependency: ng-hotkey-arg-parser.js
 * @since: 2018. 9. 14. 오후 8:56:20
 */

var NG_HOTKEY_KEYBOARD_CHAR = {"bs" : 8,"tab" : 9,"enter" : 13,"shift" : 16,"ctrl" : 17,"alt" : 18,"pause" : 19,"break" : 19,"cap" : 20,"esc" : 27,"page-up" : 33,"page-down" : 34,"end" : 35,"home" : 36,"left" : 37,"up" : 38,"right" : 39,"down" : 40,"ins" : 45,"del" : 46,"0" : 48,"1" : 49,"2" : 50,"3" : 51,"4" : 52,"5" : 53,"6" : 54,"7" : 55,"8" : 56,"9" : 57,"a" : 65,"b" : 66,"c" : 67,"d" : 68,"e" : 69,"f" : 70,"g" : 71,"h" : 72,"i" : 73,"j" : 74,"k" : 75,"l" : 76,"m" : 77,"n" : 78,"o" : 79,"p" : 80,"q" : 81,"r" : 82,"s" : 83,"t" : 84,"u" : 85,"v" : 86,"w" : 87,"x" : 88,"y" : 89,"z" : 90,"left-win" : 91,"right-win" : 92,"select" : 93,"num-0" : 96,"num-1" : 97,"num-2" : 98,"num-3" : 99,"num-4" : 100,"num-5" : 101,"num-6" : 102,"num-7" : 103,"num-8" : 104,"num-9" : 105,"*" : 106,"+" : 107,"-" : 109,"%" : 110,"/" : 111,"f1" : 112,"f2" : 113,"f3" : 114,"f4" : 115,"f5" : 116,"f6" : 117,"f7" : 118,"f8" : 119,"f9" : 120,"f10" : 121,"f11" : 122,"f12" : 123,"num-lock" : 144,"scroll" : 145,";" : 186,"=" : 187,"," : 188,"-" : 189,"." : 190,"/" : 191,"`" : 192,"[" : 219,"\\" : 220,"]" : 221,"'" : 222};

/**
 * is Not a Value.
 * 
 * @param obj
 *            object
 * @returns
 * 
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @since 2018. 9. 14.
 */
function isNaV(obj) {
	return obj == undefined || obj == null;
}

/**
 * 
 * @param obj
 *            object
 * @param msg
 *            a message for an error.
 * @returns
 * 
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @since 2018. 9. 14.
 */
function assert(obj, msg) {
	if (isNaV(obj)) {
		throw Error(msg + " MUST NOT be undefined or null. value: " + obj);
	}
}

/**
 * find a keycode and return it.
 * 
 * @param hotkey
 *            key string.
 * @returns
 * 
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @since 2018. 9. 14.
 * 
 * @see NG_HOTKEY_KEYBOARD_CHAR
 */
function evalHotkey(hotkey) {
	try {
		let key = NG_HOTKEY_KEYBOARD_CHAR[hotkey.toLowerCase()];
		assert(key);

		return key;
	} catch (e) {
		throw Error("Unsupported hotkey. input: " + key);
	}
}

/**
 * Hotkey Declaration model
 * 
 * @param hotkey
 *            keyboard.
 * @param fn
 *            a function after key pressed
 * @param mask
 *            mask key info. [ ctrl | shift | all ]
 * @returns
 * 
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @since 2018. 9. 14.
 */
var NgHotkey = function(hotkey, fn, mask) {
	
	assert(hotkey, "A 'hotkey'");
	assert(fn, "A 'function to be executed'");

	this.which = evalHotkey(hotkey);
	this.key = hotkey;
	this.fn = fn;
	this.preventDefault = false;
	this.stopPropagation = false;

	if (isNaV(mask)) {
		this.ctrl = undefined;
		this.shift = undefined;
	} else {
		switch (mask) {
		case "ctrl":
			this.ctrl = true;
			break;
		case "shift":
			this.shift = true;
			break;
		case "all":
			this.ctrl = true;
			this.shift = true;
		default:
			this.ctrl = undefined;
			this.shift = undefined;
		}
	}
	
	this.argsDecl = null;
};

/**
 * Assign argument declarations.
 * 
 * @param args
 *            argument declarations of a function.
 * @returns
 * 
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @since 2018. 9. 15.
 * 
 * @see fn
 */
NgHotkey.prototype.setArgsDecl = function(argsDecl){
	this.argsDecl = argsDecl;
};

/**
 * Match NgHotkey Definition to KeyEvent .
 * 
 * @param which
 *            KeyEvent.which
 * @param ctrlKey
 *            KeyEvent.ctrlKey
 * @param shiftKey
 *            KeyEvent.shiftKey
 * @returns
 * 
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @since 2018. 9. 14.
 */
NgHotkey.prototype.eval = function(which, ctrlKey, shiftKey) {
	let eval = true;

	// #1. key 비고
	eval &= this.which == which;
	if (!eval) {
		return false;
	}

	// #2. ctrl, shift 비교
	function mask(self, other, eval) {
		return self //
		? eval &= self == other //
		: eval &= !other;
	}

	// #2-1. ctrl
	eval = mask(this.ctrl, ctrlKey, eval);
	if (!eval) {
		return false;
	}
	// #2-2. shift
	return mask(this.shift, shiftKey, eval);
};

/**
 * 
 * @param arg
 * @param scope Angularjs $scope
 * @returns
 *
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @version 0.2.1
 * @since 2018. 9. 17.
 */
var evalArg = function(arg, scope) {
	try {
		// eval from global scope
		if( arg.startsWith("global::")) {
			return eval(arg.replace("global::", ""));
		} else
		// eval from angularjs scope
		{
			return scope.$eval(arg);
		}
	}catch(e) {
		return undefined;
	}
}

var evalArguments = function(argsDecl, scope){
	
	let parameters = [];
	
	let argsArr = new NgHotkeyArgParser(argsDecl).parse();
	
	for( let arg of argsArr ) {
		
		switch ( arg.charAt(0) ) {
			case "[":
				if( arg.length == 2 ){
					parameters.push(eval("[]"));
				}else{
					parameters.push(evalArguments(arg.substr(1, arg.length - 2), scope));
				}
				break;
			case "\"":
			default:
				parameters.push(evalArg(arg, scope));
			break;
		}
	}
	
	return parameters;
};



// Angularjs directive.
NgHotkey.directive = function() {
	
	return function(scope, element, attrs) {
		
		// To focus to unfocusable elemets.
		if (attrs.tabindex == undefined || attrs.tabindex == null) {
			element.attr("tabindex", 999999); // <--- A number is as good as it big....
		}
		
		element.bind("keydown", function(event) {
			
			let hotkeys = [];
			let hotkey = null;
			let hkDomain = null;
			
			// Extract only ng-hk-def-???
			for ( let k in attrs) {
				
				if (!k.startsWith("ngHkDef")) {
					continue;
				}
					
				// #1. crete a Hotkey instance.
				hotkeys.push(hotkey = eval(attrs[k]));
				
				// Hotkey domain
				hkDomain = k.replace("ngHkDef", "");
				
				// #2. 'preventDefault'
				if( !isNaV(attrs["ngHkPrevent" + hkDomain])) {
					hotkey.preventDefault = true;
				}
				
				// #3. 'stopPropagation'
				if( !isNaV(attrs["ngHkStop" + hkDomain])) {
					hotkey.stopPropagation = true;
				}
				
				// #4. Function arguments.
				var argsStr = attrs["ngHkArgs" + hkDomain];
				if( !argsStr ) {
					continue;
				}
				
				hotkey.setArgsDecl(argsStr);
			}
			
			// check in loop...
			for (let index =0; index < hotkeys.length; index++) {
				
				hotkey = hotkeys[index];
				
				if (!hotkey.eval(event.which, event.ctrlKey, event.shiftKey)) {
					continue;
				}
					
				scope.$apply(function() {
					
					if( hotkey.fn == undefined || hotkey.fn == null){
						return ;
					}
					// eval 'function'
					var fn = null;
					if( hotkey.fn.startsWith("global::")) {
						fn = eval(hotkey.fn.replace("global::", ""));
					}else {
						fn = scope.$eval(hotkey.fn);
					}
					
					// eval 'arguments'
					let parameters = hotkey.argsDecl ? evalArguments(hotkey.argsDecl, scope) : [];
					
					// add 'angularjs scope', event
					parameters.push(scope, event);
					
					fn.apply(this, parameters);
					
					// since 0.2.1
					// 'close' function
					let closeFnDef = attrs["ngHkClose"];
					if( !closeFnDef) {
						return;
					}
					
					let closeFn = evalArg(closeFnDef, scope);
					if( !closeFn ) {
						throw new Error("Invalid function. closeFn=" + closeFn);
					}
					
					let closeArgDef = attrs["ngHkCloseArgs"];
					let closeArg = closeArgDef ? evalArguments(closeArgDef, scope) : [];
					closeArg.push(scope, event);
					
					closeFn.apply(this, closeArg);
				});

				// apply 'preventDefault'
				if( hotkey.preventDefault) {
					event.preventDefault();
				}
				
				// apply 'stopPropagation'
				if( hotkey.stopPropagation) {
					event.stopPropagation();
				}

				break;
			}
		});
	};
};

// Register a directive.
var ngHotkey = angular.module("ngHotkey", []);

(function(){
	ngHotkey.directive("ngHotkey", NgHotkey.directive);
})();