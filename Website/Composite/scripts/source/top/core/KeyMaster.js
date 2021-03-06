/**
 * Building unique keys.
 */
function _KeyMaster () {}

_KeyMaster.prototype = {
	
	_uniqueKeys : {},
		
	/**
	 * Build a unique key string for whoever may be interrested.
	 * @return {string}
	 */
	getUniqueKey : function () {
		var key = new String ( "key" + Math.random ().toString ().split ( "." )[ 1 ]);
		if ( this._uniqueKeys [ key ] != null ) {
			return this.getUniqueKey ();
		}
		this._uniqueKeys [ key ] = true;
		return key;
	},
	
	/**
	 * Is string generated by KeyMaster?
	 * @param {string} key
	 * @return {boolean}
	 */
	hasKey : function ( key ) {
		
		var result = false;
		if ( this._uniqueKeys [ key ]) {
			result = true;
		}
		return result;
	}
}

/**
 * The instance that does it.
 */
var KeyMaster = new _KeyMaster ();