

//ve.ui.HighlightAnnotationTool = function VeUiHighlightAnnotationTool(config) {
ve.ui.TableCellColorTool = function TableCellColorTool() {
    ve.ui.TableCellColorTool.super.apply( this, arguments );
};
OO.inheritClass( ve.ui.TableCellColorTool, ve.ui.AnnotationTool );


ve.ui.TableCellColorTool.static.name = 'highlight';
ve.ui.TableCellColorTool.static.group = 'textStyle';
ve.ui.TableCellColorTool.static.icon = 'highlight';
ve.ui.TableCellColorTool.static.title = "Highlight";
ve.ui.TableCellColorTool.static.annotation = { name: 'textStyle/textcolor' };
ve.ui.TableCellColorTool.static.commandName = 'TableCellCommand';
ve.ui.TableCellColorTool.static.styleAttr = 'color';


ve.ui.toolFactory.register( ve.ui.TableCellColorTool );


function TableCellCommand( name, options ) {
	TableCellCommand.parent.call( this, name, null, null, options );
}
OO.inheritClass( TableCellCommand, ve.ui.Command );

TableCellCommand.prototype.execute = function( surface, args ) {
	args = args || this.args;



    const hexColor = args[0]
    const surfaceModel = surface.getModel(),
        selection = surfaceModel.getSelection(),
        documentModel = surfaceModel.getDocument();

    if (!(selection instanceof ve.dm.TableSelection)) {
        return false;
    }

    const attributes = { background: hexColor };
    const txBuilders = [];
    const ranges = selection.getOuterRanges(documentModel);

    for (let i = ranges.length - 1; i >= 0; i--) {
        txBuilders.push(
            ve.dm.TransactionBuilder.static.newFromAttributeChanges.bind(
                null,
                documentModel,
                ranges[i].start,
                attributes
            )
        );
    }
    txBuilders.forEach(function (txBuilder) {
        surfaceModel.change(txBuilder());
    });

    ve.track('activity.table', { action: 'background' });

    debugger;
    return true;
};

ve.ui.commandRegistry.register(
	new TableCellCommand( 'TableCellCommand', {
		args: ['#FF0000'],
		supportedSelections: [ 'linear', 'table' ]
	} )
);


