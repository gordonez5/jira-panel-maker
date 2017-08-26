Gdz.Modals = {

	welcomeModal: function() {

		'use strict';

		var cookieExists = Gdz.Cookies.checkCookie('welcomeMessage');

		if (cookieExists === true) {

			return true;

		} else {

/*			// $.magnificPopup.open({
			$( '[data-trigger="open-modal"]' ).magnificPopup({
				type: 'inline',
				preloader: false,
				callbacks: {
					close: function() {
						Gdz.Cookies.setCookie( 'feedbackWelcome', 'Welcome message read', 14);
					}
				}
			}).magnificPopup('open');
*/
			$.magnificPopup.open( {
				items: {
					src: '#welcome-modal'
				},
				type: 'inline',
				callbacks: {
					close: function() {
						Gdz.Cookies.setCookie( 'welcomeMessage', 'Welcome message read', 14);
					}
				}
			}, 0 );

			return true;

		}

	}

};
