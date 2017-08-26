// Taken from a Jeffrey Way tutorial on YouTube
// https://www.youtube.com/watch?v=eIovclygbwM
(function( $ ) {

	var o = $( {} );

	$.each({

		trigger: 'publish',
		on: 'subscribe',
		off: 'unsubscribe'

	}, function( key, val ) {

		jQuery[val] = function() {

			o[key].apply( o, arguments );

		};

	});

})( jQuery );