// This module deals with the events associated with the output areas of the app
var outputModule = (function( $ ){

	//cache DOM
	var $jiraView = $( '#jiraView' );
	var jiraViewTemplate = $( '#jira-view-template' ).html();


	// Add 'copy to clipboard' functionality to code output
	var clipboard = new Clipboard( '[data-action="copyCode"]' );

	clipboard.on( 'success', function(e) {
		console.info( 'Action:', e.action );
		console.info( 'Text:', e.text );
		console.info( 'Trigger:', e.trigger );

		// e.clearSelection();
	});

	clipboard.on( 'error', function(e) {
		console.error( 'Action:', e.action );
		console.error( 'Trigger:', e.trigger );
	});


	// Show / Hide clear button dependng on whether there are subcriteria to clear.
	function demoButtonDisplay() {

		var len = $('#jiraView').children( '.panel' ).length;

		$viewDemobutton.toggleClass( 'visible', len > 0 );

	}


	function openDemo() {

		$( '[data-trigger="open-demo"]' ).magnificPopup({
			items: {
				type: 'inline',
				src: '#panelDemo',
				preloader: false,
				callbacks: {
					close: function() {
						console.log('modal closed');
					}
				}
			}
		}).magnificPopup('open');

	}


	// Takes the panel object and renders the output code
	function renderCode( obj ) {

		/*
			{panel:borderColor=#ccc|titleBGColor=#dcf0ff|title=AC2: Panel Header}
			|(off)||2.1|Total price is displayed|
			|(off)||2.2|Per person price|
			|(off)||2.3|'Continue' CTA is displayed|
			|(off)||2.4|'Show/hide' CTA is displayed and show or hide complete panel|
			{panel}
		*/

		var obj = obj || criterionPanelObject;

		var code = '';

		code += '{panel:borderColor=';
		code += obj.style.borderColor;
		code += '|titleBGColor=';
		code += obj.style.titleBGColor;
		code += '|title=';
		code += obj.header.acNumber;
		code += ': ';
		code += obj.header.acTitle;
		code += '}\n';

		Object.keys( obj.subCriteria ).forEach( function( key, index ) {
			code += '|(off)||' + obj.header.acNumber + '.' + (index + 1) + '|' + obj.subCriteria[key] + '|\n';
			// key: the name of the object key
			// index: the ordinal position of the key within the object
		});

		code += '{panel}';

		$codeOutputArea.val( code );

	}


	function displayAsHtml() {

		// Clone the criterionPanelObject
		var num;
		var jiraObj = JSON.parse(JSON.stringify( criterionPanelObject ));
		var arr = jiraObj.subCriteria;
		var objArr = [];

		// Change array into object
		for ( idx in arr ) {
			num = ( parseInt(idx) + 1 );
			objArr.push ({'num': num, 'str': arr[idx]});
		}

		jiraObj.subCriteria = objArr;

		$jiraView.html(Mustache.render(jiraViewTemplate, {jiraView: jiraObj}));

		events.emit( 'demo/render', 'yes' );

	}


	return {
		displayAsHtml: displayAsHtml,
		demoButtonDisplay: demoButtonDisplay,
		openDemo: openDemo,
		renderCode: renderCode
	}

})( jQuery );