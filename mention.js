(function($) {
	$.fn.extend({
		mention : function(options) {
			this.opts = {
				users : [],
				delimiter : '@',
				sensitive : true,
				typeaheadOpts : {}
			};

			var settings = $.extend({}, this.opts, options),
				_checkDependencies = function() {
					if( typeof $ == 'undefined') {
						throw new Error("jQuery is Required");
					} else {
						if( typeof $.fn.typeahead == 'undefined') {
							throw new Error("Typeahead is Required");
						}
					}
					return true;
				},
				_extractCurrentQuery = function(query, caratPos) {
					for( i = caratPos; i >= 0; i--) {
						if(query[i] == settings.delimiter) {
							break;
						}
					}
					return query.substring(i, caratPos);
				},
				_matcher = function(item) {
					item = item.toLowerCase();
					var usernames = (this.query.toLowerCase()).match(new RegExp(settings.delimiter + '\\w+', "g")), i;
					if(!!usernames) {
						for( i = 0; i < usernames.length; i++) {
							var username = (usernames[i].substring(1)).toLowerCase(), matched = item.indexOf(username), re = new RegExp(settings.delimiter + item, "g"), used = ((this.query.toLowerCase()).match(re));
	
							if(item.indexOf(username) != -1 && used === null) {
								return true;
							}
						}
					}
				},
				_updater = function(item) {
					var data = this.query, caratPos = this.$element[0].selectionStart;
	
					for( i = caratPos; i >= 0; i--) {
						if(data[i] == settings.delimiter) {
							break;
						}
					}
	
					var replace = data.substring(i, caratPos);
					data = data.replace(replace, settings.delimiter + item);
	
					this.tempQuery = data;
	
					return data;
				},
				_sorter = function(items) {
					if(items.length && settings.sensitive) {
						var currentUser = _extractCurrentQuery(this.query, this.$element[0].selectionStart).substring(1), 
							i, 
							len = items.length, 
							priorities = {
								highest:[],
								high:[],
								med:[],
								low:[]
							},
							finals = [];
						if(currentUser.length == 1) {
							for( i = 0; i < len; i++) {
								if( (items[i][0] == currentUser) ) {
									priorities.highest.push(items[i]);
								} else if( (items[i][0].toLowerCase() == currentUser.toLowerCase()) ) {
									priorities.high.push(items[i]);
								} else if( items[i].indexOf(currentUser) != -1 ) {
									priorities.med.push(items[i]);
								} else {
									priorities.low.push(items[i]);
								}
							}
							for(i in priorities){
								for(var j in priorities[i]){
									finals.push(priorities[i][j]);
								}
							}
							return finals;
						}
					}
					return items;
				};
			return this.each(function() {
				var _this = $(this);
				if(_checkDependencies()) {
					_this.typeahead($.extend({
						source : settings.users,
						matcher : _matcher,
						updater : _updater,
						sorter : _sorter
					}, settings.typeaheadOpts));
				}
			});
		}
	});
})(jQuery);
