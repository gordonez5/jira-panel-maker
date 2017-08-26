Gdz.Scripts = {

	run: function () {

		Gdz.Global.consoleCheck();
		Gdz.Global.init();
		Gdz.Panel.init();
		Gdz.Modals.welcomeModal();
		Gdz.Tabs.init();

		$( '#js-run' ).on( 'click', function() {
			Gdz.Global.run();
		});

	}

};
