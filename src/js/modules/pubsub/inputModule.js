// This module deals with the events associated with the input areas of the app
var inputModule = (function( $ ){

	//cache DOM
	var textareaData = '';

	// bind events

	/*
		$addCriterionHeadingButton.magnificPopup({
			items: {
				src: '<div class="modal">Message</div>',
			},
			type: 'inline'
		});
	*/


	/*
	Method to edit the criterion header.

		- Updates either/both the criterion number and title and saves the value(s) to criterionPanelObject.
		- Emits input/criterionHeader; passing criterionPanelObject.
		- Alerts if no values are given.
		- Triggered by button click or API.
	*/
	function editCriterionHeader( num, val ) {

		var number = (typeof num === 'string' || typeof num === 'number') ? num : $criterionNumberInput.val();
		var title = (typeof val === 'string' || typeof val === 'number') ? val : $criterionTitleInput.val();
		var numberSubmitted = false;
		var titleSubmitted = false;

		// criterionPanelObject
		if ( number != '' && number !== null ) {

			$acNumberContainer.html( number );
			criterionPanelObject.header.acNumber = number;
			numberSubmitted = true;

		}

		if ( title != '' && title !== null ) {

			$acTitleContainer.html( title );
			criterionPanelObject.header.acTitle = title;
			titleSubmitted = true;

		}

		if ( numberSubmitted || titleSubmitted ) {
			events.emit( 'input/criterionHeader', criterionPanelObject );
		} else {
			alert( "You didn't enter anything!" );
		}

	}


	/*
	Method to add a sub criterion

		- Updates the subCriteria object array
		- Emits input/subCriterion; passing the value.
		- Alerts if no values are given.
		- Triggered by the pastedContentSwitch method (if deemed a single criterion).
	*/
	function addSubCriterion( value ) {

		// Set subCriterion variable to either a string (passed as an argument)
		// or the value of the textarea.
		var textareaData = $criteriaInputArea.val();
		var subCriterion = (typeof value === "string") ? value : textareaData;
		var subCriteriaArray = criterionPanelObject.subCriteria;

		// Add value to end of criteriaArray array
		subCriteriaArray.push( subCriterion );

		// Update criterionPanelObject with new array
		criterionPanelObject.subCriteria = subCriteriaArray;

		// Clear the textarea
		$criteriaInputArea.val('');

		// Emit event
		events.emit( 'input/subCriterion', value );

	}


	function getConfirmation( msg ) {

		var msg = msg + "\n";
		var retVal = confirm( msg + "Do you want to continue ?" );

		if ( retVal === true ) {

			return true;

		} else {

			return false;

		}

	}


	function parseAsPanel( content ) {

		// This is a panel, so let's parse the content and update the criteriaArray array.

		// If there is an existing Object array AND the user clicks 'cancel', return.
		if ( criterionPanelObject.subCriteria.length !== 0 && !getConfirmation( 'You already have a list. Clicking OK will overwrite this' ) ) {

			// User has clicked the 'cancel' button
			console.log('cancelled');
			return false;

		// If the Object array is empty OR the user clicks 'ok'...
		} else {

			// Count number of lines
			var numLines = content.length;

			// Get index of last line
			var lastIndex = numLines - 1;

			var panelInfo = content[0];
			var panelEnd = content[ lastIndex ];

			content.shift();
			content.pop();
			// console.log( 'tableContent: ', content );

			// Parse the first line with the _parsePanelInfo() method
			_parsePanelInfo( panelInfo );
			_parseTableRows( content );

			listModule.renderListHeader();
			listModule.renderList();

		}

	}


	function parseAsTable( content ) {

		_parseTableRows( content );
		listModule.renderListHeader();
		listModule.renderList();

	}


	/*
	Method to parse through the first line of pasted panel code

		- Updates the criterionPanelObject.header properties
		- Called directly by the parseAsPanel() method
	*/
	function _parsePanelInfo( content ) {

		// Cuts irrelevant data from string, leaving only pipe-separated information
		var content = content.slice(7, -1);
		content = content.split( '|' );

		var l = content.length;

		for (var i = 0; i < l; i++) {
			content[i] = content[i].split( '=' );
			var propName = content[i][0];
			var propVal = content[i][1];

			if ( propName == 'title' ) {

				var propValSplit = content[i][1].split( ': ' );
				criterionPanelObject.header.acNumber = propValSplit[0];
				criterionPanelObject.header.acTitle = propValSplit[1];

			} else if ( propName == 'borderColor' ) {

				criterionPanelObject.style.borderColor = propVal;

			} else if ( propName == 'titleBGColor' ) {

				criterionPanelObject.style.titleBGColor = propVal;

			} else {

				alert( 'Unknown property' );

			}

		}

	}


	function _parseTableRows( content ) {

		var l = content.length;
		var subCriteriaArray = [];

		for (var i = 0; i < l; i++) {

			var items = content[i].split( '|' );

			subCriteriaArray.push( items[4] );

		}

		criterionPanelObject.subCriteria = subCriteriaArray;

	}


	// Will decide what the type of content is:
	// Panel / Acceptance criteria / Neither (error check)
	function pastedContentSwitch( value ) {

		var textareaData = $criteriaInputArea.val();

		// save string entered through API or the value of the textarea
		var content = ( typeof value === "string" ) ? value : textareaData;

		// get rid of whitespace around the string
		content = content.trim();

		// Check if any content has been submitted
		if ( content.length < 1 ) {

			alert( 'no content' );

			// If a blank space had been submitted, the alert would still trigger,
			// so clear the input area to display the placeholder text again.
			$criteriaInputArea.val('');

			return false;
		}

		// Split the content into lines and save as 'data' array
		var data = content.split('\n');

		// save contents of first line
		var firstLine = data[0];

		// get first character of first line
		var firstCharacter = firstLine.substring(0,1);
		var firstSixCharacters = firstLine.substring(0,6);

		// get the index of the last line
		var length = data.length;
		var lastIndex = length - 1;

		// save contents of the last line
		var lastLine = data[lastIndex];

		var parsedContent = '';

		// assume this is a panel
		// if ( firstCharacter == '{') {
		if ( firstSixCharacters == '{panel') {


			// Validate that the panel is properly formatted by checking the last line
			if ( lastLine == '{panel}' ) {

				// console.log('Oh yeah, this looks like a valid panel to me!');

				events.emit( 'switch/panel', data );

			} else {

				console.log('Hmn, looks like a panel from the first line but the last line doesn\'t match. Check that the panel has been closed');

			}

		// assume this is a sub-criteria table
		} else if ( firstCharacter == '|') {

			// Run function to parse the content as a table
			events.emit( 'switch/table', data );

		// assume that the content is a sub criterion
		} else {

			// Run function to parse the content as plain text
			events.emit( 'switch/text', data );

		}

		// console.log( 'oneLine: ' + oneLine );

		for (var i = 0; i < length; i++) {
			parsedContent += data[i];
			parsedContent += '<br>';
		}

	}


	// Animated tick & feedback message
	function successMessage( content ) {

		var $success = $( '#success' ).addClass( 'active' );
		var headingText = '';
		var messageText = 'Added:';

		if ( typeof content == "object") {
			content = JSON.stringify( content, null, 4 );
			console.log( 'data passed was an object' );
			headingText = 'Object updated:'
		}

		messageText += '<h4 class="message__heading">' + headingText + '</h4>';
		messageText += '<div class="message__text">';
		messageText += '<pre>'+content+'</pre>';
		messageText += '</div>';

		var $message = $( '<div/>', {
							html: messageText,
							"class": 'message message--success active'
						});

		$messageOutputArea.html( $message ).parent().show();

		setTimeout(function() {

			$success.removeClass( 'active' );
			$message.removeClass( 'active' );

			setTimeout(function() {
				$messageOutputArea.parent().slideUp();
			}, 2000);

		}, 3000);

	}


	return {
		editCriterionHeader: editCriterionHeader,
		addSubCriterion: addSubCriterion,
		getConfirmation: getConfirmation,
		parseAsPanel: parseAsPanel,
		parseAsTable: parseAsTable,
		_parsePanelInfo: _parsePanelInfo,
		_parseTableRows: _parseTableRows,
		pastedContentSwitch: pastedContentSwitch,
		successMessage: successMessage
	}


})( jQuery );