// This module deals with the rendering of the list and reordering of items
var listModule = (function( $ ){

	//cache DOM
	var criteriaListTemplate = $( '#criteria-template' ).html();
	var criteriaHeaderTemplate = $( '#criteria-header-template' ).html();

	// bind events
	$list.on( 'click', '[data-action="delete"]', deleteSubCriterion );
	$clearCriteriabutton.on( 'click', deleteList );
	$undoLink.on( 'click', undoDelete );


	// Add sortable functionality to the list
	function _addSortable() {

		var list = document.getElementById( 'acceptanceCriteriaList' );
		var sortable = Sortable.create( list, {
			handle: '.sub-criterion__handle',
			animation: 150,
			onSort: function ( evt ) {
				events.emit( 'list/reorder', evt );
			}
		});

	}


	// Called by:
	// - renderList()
	// - sortable.onSort()
	// Single method to run any cleanup functions.
	function cleanupList( evt ) {

		// console.log( '>> cleanupList()' );

		recreateArray();
		_addSortable();
		removeUndoLink();

	}


	// Show / Hide clear button dependng on whether there are subcriteria to clear.
	function clearButtonDisplay() {

		var len = $list.children( '.sub-criterion__row' ).length;

		$clearCriteriabutton.toggleClass( 'visible', len > 0 );

	}


	// Save array to localstorage, clear the array and re-render.
	function deleteList() {

		// Save the array to localStorage
		saveObject();

		// Clear the array
		criterionPanelObject.subCriteria = [];

		// Render the UI list
		renderList();

		// Reveal the undo link
		$undoLink.removeClass( 'hidden' );

	}

	// Function to delete a sub criterion from the 'criteria' array and render in the UI list
	function deleteSubCriterion( event ) {

		var i;
		var subCriteriaArray = criterionPanelObject.subCriteria;

		if ( typeof event === "number" ) {

			i = event;

		} else if ( typeof event === "string" && event == "all" ) {

			deleteList();
			return;

		} else {

			var $remove = $( event.target ).closest( '.sub-criterion__row' );
			i = $list.find( '.sub-criterion__row' ).index( $remove );

		}

		// Remove deleted item from criteriaArray array
		subCriteriaArray.splice(i, 1);
		criterionPanelObject.subCriteria = subCriteriaArray;

		events.emit( 'list/deleteSubCriterion', criterionPanelObject );

	}


	/*
	Method to recreate the sub criteria array from the UI list.

		- Cycles through the UI list and recreates the subCriteriaArray from the values.
		- Saves array to criterionPanelObject.subCriteria
		- Triggered by cleanupList().
	*/
	function recreateArray() {

		// console.log( '>> recreateArray()' );

		var txt;
		var $el;
		var $items = $list.find( '.sub-criterion__text' );

		// Clone the old criteria array
		var subCriteriaArray = criterionPanelObject.subCriteria;
		var number = criterionPanelObject.header.acNumber;

		// empty the subCriteriaArray array
		subCriteriaArray = [];

		// Loop through existing list items
		$items.each( function( index ) {

			var i = index + 1;

			var $this = $(this);
			txt = $this.html();
			$el = $this.prev( '.sub-criterion__number' );
			$el.html( number + '.' + i );

			subCriteriaArray.push( txt );
			criterionPanelObject.subCriteria = subCriteriaArray;

		});

		events.emit( 'list/update', criterionPanelObject );

	}


	// Called by:
	// - onload event
	// - addSubCriterion()
	// - deleteSubCriterion()
	// - deleteList()
	// - loadObject()
	// - _parseAsPanel()
	function renderList() {

		// console.log( '>> renderlist()' );

		$list.html( Mustache.render(
			criteriaListTemplate,
			{ criteria: criterionPanelObject.subCriteria }
		) );

		events.emit( 'list/render', criterionPanelObject );

	}


	function renderListHeader() {

		// console.log( '>> renderListHeader()' );

		$header.html( Mustache.render( criteriaHeaderTemplate, { criteriaHeader: criterionPanelObject } ) );
		$criterionNumberInput.val('');
		$criterionTitleInput.val('');

		events.emit( 'header/render', criterionPanelObject );

	}


	// Repopulate criteria list from localstorage - if available
	function loadObject() {

		var storageCount = localStorage.length;

		if ( storageCount ) {

			var str = localStorage.getItem( 'criterionPanelObject' );

			criterionPanelObject = JSON.parse( str );

			events.emit( 'storage/loaded', str );

		}

	}


	// Save the criterionPanelObject to localStorage
	function saveObject() {

		var objectString = JSON.stringify(criterionPanelObject);
		localStorage.setItem( 'criterionPanelObject', objectString );
		events.emit( 'storage/saved', objectString );

	}

	function printString( string ) {

		var str = string || localStorage.getItem( 'criterionPanelObject' );
		$stringArea.html( str );

	}


	// Called by:
	// click-event on 'undo delete' button
	// (which becomes visible when deleteList function is run)
	function undoDelete( e ) {

		e.preventDefault();

		loadObject();
		renderList();
		removeUndoLink();

	}


	function removeUndoLink() {
		$undoLink.addClass( 'hidden' );
	}


	return {
		cleanupList: cleanupList,
		clearButtonDisplay: clearButtonDisplay,
		deleteList: deleteList,
		deleteSubCriterion: deleteSubCriterion,
		recreateArray: recreateArray,
		renderListHeader: renderListHeader,
		renderList: renderList,
		loadObject: loadObject,
		saveObject: saveObject,
		undoDelete: undoDelete,
		printString: printString
	};

})( jQuery );