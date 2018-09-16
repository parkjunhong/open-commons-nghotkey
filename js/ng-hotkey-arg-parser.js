/*
 * This file is generated under this project, "open-commons-nghotkey". 
 *
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @copyright: Park_Jun_Hong_(fafanmama_at_naver_com)
 * @license: MIT 2.0
 * @url: https://github.com/parkjunhong/open-commons-nghotkey/blob/master/js/ng-hotkey-arg-parser.js
 * @version: 0.1.0
 * @require: ES6 or higher
 * @since: 2018. 9. 15. 오후 10:10:05
 */

/**
 * String Iterator provide a character and its index.
 * 
 * <b>value model</b>
 * 
 * <pre>
 * 	{
 * 		char: {charactor}
 * 		index: {index}
 * 	}
 * </pre>
 * 
 * @param {string}
 *            str string.
 * 
 * @returns String Iterator provide a character and its index.
 * 
 * @author Park_Jun_Hong_(fafanmama_at_naver_com)
 * @since 2018. 9. 15.
 */
function* strItrGenerator(str){
	let len = str.length;	
	for(var i = 0; i < len; i++){
		yield {
			c: str[i],
			i: i,
			s: str
		}
	}
}


Array.prototype.contains = function(value){
	for(let v of this ) {
		if( v == value ) {
			return true;
		}
	}
	
	return false;
}

//
// /////////////
//

/**
 * Parsing State
 */
var NgHotkeyArgParserState = function(str){
	this.str = str;
	this.buf = [];	 // read tokens
	
	this.dq = false; // detect double quote
	this.sq = false; // detect single quote
	this.brk = false // detect open bracket
	this.brkReady = false; // detect bracket has elem.
	this.cbrk = false // detect close bracket
	this.esc = false // detect escape
};

/**
 * Push a character.
 */
NgHotkeyArgParserState.prototype.push = function(c) {
	this.buf.push(c);
}

/**
 * Whether has data or not.
 */
NgHotkeyArgParserState.prototype.has = function() {
	return this.buf.length > 0;
};

/**
 * Set or get status. If {s} exists set, if not get.
 * 
 * @param {string}
 *            n name
 * @param {boolean}
 *            s status
 */
NgHotkeyArgParserState.prototype.status = function(n, s) {
	if( s == undefined ) {
		return this[n];
	}else {
		this[n] = s;
	}
};

/**
 * Return a data and initialize self.
 */
NgHotkeyArgParserState.prototype.flush = function() {
	
	let data = this.buf.join(""); 
	
	this.buf = [];
	this.dq = false;
	this.sq = false;
	this.brk = false;
	this.brkReady = false;
	this.cbrk = false;
	this.esc = false;
	
	return data;
};

/**
 * Return validation of this.
 */
NgHotkeyArgParserState.prototype.validate = function(){
	return !this.dq && !this.sq && !this.brk && !this.brkReady && !this.esc; 
};


/**
 * splite by comma(,), but escape comma(,) in quote(",').
 * splite by quote(", ')
 * detect array expr.
 */
var NgHotkeyArgParser = function(str){
	
	this.itr = strItrGenerator(str);
	
	this.$parse = function(itr, nested) {
		
		let data = [];
		
		let state = new NgHotkeyArgParserState();
		
		let token = null;
		let beforeToken = null;
		let c = null;
		let idx = null;
		
		let whitespaceOwners = [",", "[", "]"];
		let escapeOwners = ["b", "f", "n", "r", "t"];
		
		while( !(token = itr.next()).done ){
			
			c = token.value.c;
			idx = token.value.i;
			
			if( state.status("esc") ) {
				state.push(c);
				state.status("esc", false); // close 'escape'
				
				beforeToken = token;
				continue;
			}
			
			switch ( c ) {
				case ",":
					if( !state.has() ) {
						console.error("state", state);
						throw Error("Illegal character sequence. state='ready character'. token=" + c + ", index=" + idx + ", string=" + token.value.s);
					}
					
					if( state.status("dq")	//
							|| state.status("sq") //
							|| (state.status("brk") && state.status("brkReady")) ) {
						state.push(c);
					}else if( state.status("brk") && !state.status("brkReady")) {
						console.error("state", state);
						throw Error("Illegal character sequence. state='open bracket'. token=" + c + ", index=" + idx + ", string=" + token.value.s);
					} else {
						data.push(state.flush());	// clear 'token's buf'
					}
					
					break;
				case "\"":
					if ( state.status("dq") ){
						state.status("dq", false); // close 'double quote'
					} else if( !state.status("sq") ){
						state.status("dq", true); // open 'double quote'
					}
					
					if( state.status("brk") ) {
						state.status("brkReady", true);
					}
					
					state.push(c);				
					break;
				case "'":
					if ( state.status("sq") ){
						state.status("sq", false);	// close 'single quote'
					} else if( !state.status("dq") ){
						state.status("sq", true);	// open 'single quote'
					}
					
					if( state.status("brk") ) {
						state.status("brkReady", true);
					}
					
					state.push(c);
					break;
				// begin array
				case "[":
					if( state.status("brk") ){
						state.push(c);
						c = this.$parse(itr, true); // open 'nested bracket'
					}else if ( !state.status("sq") && !state.status("dq") ){
						state.status("brk", true); // open 'bracet'
					}
				
					state.push(c);			
					break;
				// end array
				case "]":
					if( state.status("brk") ){
						state.status("brk", false); // close 'bracket'
						state.status("brkReady", false);
						state.status("cbrk", true);
						// puch c
					} else if ( !state.status("sq") && !state.status("dq") ){
						if( nested ) {
							state.push(c); // close 'nested bracket'
							data.push(state.flush());
							return data;
						}else{
							console.error("state", state);
							throw Error("Invalid Array Declaration Error. token=" + c + ", index=" + idx + ", string=" + token.value.s);
						}
					}
				
					state.push(c);
					
					break;
				case "\\":
					state.push(c);
					state.status("esc", true); 	// open 'escape'
					break;
				default:
					
					if( state.status("sq") || state.status("dq")) {
						state.push(c);
						continue;
					}
					
					// if token is a whitespace.
					if( /\s/.test(c) ) {
						if( !beforeToken ) {
							continue;
						}else if( whitespaceOwners.contains(beforeToken.value.c) ) {
							continue;
						}else if( !/\s/.test(beforeToken.value.c) ) {
							beforeToken = token;
							continue;
						}else if( /\s/.test(beforeToken.value.c) ) {
							continue;
						}
					}else {
						if( beforeToken) {
							if( /\s/.test(beforeToken.value.c) ) {
								console.error("state", state);
								throw Error("Invalid character sequence. state='wait not-whitespace'. token=" + c + ", index=" + idx + ", string=" + token.value.s);
							}
							
							if( state.status("esc") && !escapeOwners.contains(c)){
								console.error("state", state);
								throw Error("Invalid character sequence. state='open escase'. token=" + c + ", index=" + idx + ", string=" + token.value.s);
							}
							
							if ( state.status("cbrk") ) {
								console.error("state", state);
								throw Error("Invalid character sequence. state='close bracket'. token=" + c + ", index=" + idx + ", string=" + token.value.s);						
							}
							
							if( state.status("brk") ) {
								state.status("brkReady", true);
							}
						} 
					}
				
					state.push(c);					
					break;
			}
			
			beforeToken = token;
		}
		
		if( !state.validate()) {
			console.error("state", state);
			throw Error("Invalid parse state after parsing. state='close parsing'. state=" + JSON.stringify(state));
		}
		
		data.push(state.flush()); // flush...
		
		return data;
	};
};

NgHotkeyArgParser.prototype.parse = function(){
	
	let data = this.$parse(this.itr, false);
	
	return data;
}

