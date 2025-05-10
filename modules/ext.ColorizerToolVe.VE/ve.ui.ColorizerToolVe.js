function colorSetDialog( config ) {
    colorSetDialog.super.call( this, config );
}
OO.inheritClass( colorSetDialog, OO.ui.ProcessDialog );

colorSetDialog.static.name = 'colorSetDialog';
colorSetDialog.static.title = 'Choose color';
colorSetDialog.static.actions = [
    { action: 'ok',   label: 'ОК',   flags: ['primary'] },
    { action: 'cancel', label: 'Cancel', flags: [] }
];

colorSetDialog.prototype.initialize = function () {
    colorSetDialog.super.prototype.initialize.call( this );
    // TODO: add a color picker
    this.colorInput = new OO.ui.TextInputWidget({
        placeholder: '#RRGGBB',
        value: '#FFFF00'
    });
    this.content = new OO.ui.PanelLayout({
        padded: true,
        expanded: false
    });
    this.content.$element.append(
        new OO.ui.FieldLayout( this.colorInput, {
            label: 'Color code',
            align: 'top'
        }).$element
    );
    this.$body.append( this.content.$element );
};

function colorizeTableCell(hexColor){
    const surfaceModel = ve.init.target.getSurface().getModel(),
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

    return true;
}

colorSetDialog.prototype.getActionProcess = function ( action ) {
    var dialog = this;
    if ( action === 'ok' ) {
        return new OO.ui.Process( function () {
            // color validation
            var hexColor = dialog.colorInput.getValue().trim();
            if ( !/^#[0-9A-Fa-f]{6}$/.test( hexColor ) ) {
                // TODO: add a message
                // throw new OO.ui.Error( 'Incorrect color' );
            }

            colorizeTableCell(hexColor)
            // TODO: colorize text background

            ve.init.target.getSurface().execute( 'window', 'close', 'colorSetDialog', null );
        } );
    }
    return colorSetDialog.super.prototype.getActionProcess.call( this, action );
};

// Register dialog
ve.ui.windowFactory.register( colorSetDialog );





//ve.ui.HighlightAnnotationTool = function VeUiHighlightAnnotationTool(config) {
ve.ui.BackgroundColorTool = function BackgroundColorTool() {
    ve.ui.BackgroundColorTool.super.apply( this, arguments );
};
//OO.inheritClass( ve.ui.BackgroundColorTool, ve.ui.AnnotationTool );
OO.inheritClass( ve.ui.BackgroundColorTool, OO.ui.Tool );


ve.ui.BackgroundColorTool.static.name = 'colorize';
ve.ui.BackgroundColorTool.static.group = 'textStyle';
ve.ui.BackgroundColorTool.static.icon = 'highlight';
ve.ui.BackgroundColorTool.static.title = "Background color...";

ve.ui.toolFactory.register( ve.ui.BackgroundColorTool );

function TableCellCommand( name, options ) {
	TableCellCommand.parent.call( this, name, null, null, options );
}
OO.inheritClass( TableCellCommand, ve.ui.Command )


ve.ui.BackgroundColorTool.prototype.onSelect = function () {
    this.toolbar.getSurface().execute( 'window', 'open', 'colorSetDialog', null );
};
 
ve.ui.BackgroundColorTool.prototype.onUpdateState = function () {
	this.setActive( false );
};