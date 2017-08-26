// Here are the pubsub events

// Events emitted on load
// events.on( 'app/init', listModule.renderList );
// events.on( 'app/init', listModule.renderListHeader );

events.on( 'input/criterionHeader', listModule.cleanupList );
events.on( 'input/criterionHeader', listModule.renderListHeader );
events.on( 'input/subCriterion', listModule.renderList );

events.on( 'list/deleteSubCriterion', listModule.renderList );
events.on( 'list/render', listModule.clearButtonDisplay );
events.on( 'list/render', listModule.cleanupList );
events.on( 'list/reorder', listModule.cleanupList );

events.on( 'object/loaded', listModule.renderList );

// events.on( 'storage/loaded', listModule.printString );
// events.on( 'storage/saved', listModule.printString );
events.on( 'storage/loaded', listModule.renderList );
events.on( 'storage/loaded', listModule.renderListHeader );

events.on( 'switch/panel', inputModule.parseAsPanel );
events.on( 'switch/table', inputModule.parseAsTable );
events.on( 'switch/text', inputModule.addSubCriterion );

events.on( 'header/render', outputModule.renderCode );
events.on( 'header/render', outputModule.displayAsHtml );
events.on( 'list/render', outputModule.renderCode );
events.on( 'list/render', outputModule.displayAsHtml );
events.on( 'list/update', outputModule.renderCode );
events.on( 'list/update', outputModule.displayAsHtml );
events.on( 'demo/render', outputModule.demoButtonDisplay );

// Button clicks
$addCriterionHeadingButton.on( 'click', inputModule.editCriterionHeader );
$addSubCriteriabutton.on( 'click', inputModule.pastedContentSwitch );
$tabsContainer.on( 'click', '[data-trigger="open-demo"]', outputModule.openDemo );
