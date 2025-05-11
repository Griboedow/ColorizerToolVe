function colorSetDialog( config ) {
    colorSetDialog.super.call( this, config );
}
OO.inheritClass( colorSetDialog, OO.ui.ProcessDialog );

colorSetDialog.static.name = 'colorSetDialog';
colorSetDialog.static.title = 'Choose color';
colorSetDialog.static.actions = [
    { action: 'ok',   label: 'ОК',   flags: ['primary', 'progressive'] },
    { action: 'cancel', label: 'Cancel', flags: [] }
];

colorSetDialog.prototype.initialize = function () {
    // Perform base initialization
    colorSetDialog.super.prototype.initialize.call( this );
    this.content = new OO.ui.Layout({
    });
    
    this.config = mw.config.get('wgColorizerToolVE');

    // Cannot properly use OOUI for COloris, so failover to stupid HTML
    this.idForColorisEl = 'colorisColorInput';
    this.idForColorisParent = 'colorisColorParent';

    $input = $('<input>', {
        id: this.idForColorisEl,
        type: 'text',
        value: "#ffcc00"
      });
 

    $colorisBlock = $('<div>', {
        id: this.idForColorisParent ,
        class: 'full-thumbnail-coloris',    
      });
    $colorisBlock.append($input)
    //this.content.$element.append($colorisBlock);

    this.$body.append( $colorisBlock );

    Coloris({
        el: `#${this.idForColorisEl}`,
        parent: `#${this.idForColorisParent}`,

        defaultColor: '#ffcc00',
        wrap: false,
        inline: true,
        theme: 'pill',
        swatches: this.config.ColorPickerBackgroundColors,
        format: 'hex',
        clearButton: true,
        onChange: (color) => {
            this.getElementDocument().getElementById(dialog.idForColorisEl).value = color;
        }
    });  
};

colorSetDialog.prototype.getReadyProcess = function ( data ) {
    dialog = this;
    
    return colorSetDialog.super.prototype.getReadyProcess.call( this, data )
        .next( function () {
            Coloris.close(true);

            //reopen to fix the coloris
            Coloris({
                el: `#${dialog.idForColorisEl}`,
                parent: `#${dialog.idForColorisParent}`,
        
                defaultColor: '#ffcc00',
                wrap: false,
                inline: true,
                theme: 'pill',
                swatches: dialog.config.ColorPickerBackgroundColors,
                format: 'hex',
                clearButton: true,
                onChange: (color) => {
                    dialog.getElementDocument().getElementById(dialog.idForColorisEl).value = color;
                }
            });  
        }, this );
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
            var hexColor = dialog.getElementDocument().getElementById(dialog.idForColorisEl).value.trim();
            
            colorizeTableCell(hexColor)
            // TODO: colorize text background

                    
            Coloris.close(true);
            ve.init.target.getSurface().execute( 'window', 'close', 'colorSetDialog', null );
        } );
    }

    Coloris.close(true);
    ve.init.target.getSurface().execute( 'window', 'close', 'colorSetDialog', null );
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