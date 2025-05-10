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


    idForColorisEl = 'colorisColorInput';
    idForColorisParent = 'colorisColorParent';

    this.colorInput = new OO.ui.InputWidget({
        id: idForColorisEl,
        value: "#ffcc00"
    });

    this.colorisWidget = new OO.ui.Widget({
        id: idForColorisParent,
    });

    // Add to the dialog content
    this.content = new OO.ui.PanelLayout({
        padded: true,
        expanded: false
    });

    this.content.$element.append(
        new OO.ui.FieldLayout( this.colorInput, {            
            align: 'top'
        }).$element
    );
    this.content.$element.append(
        new OO.ui.FieldLayout( this.colorisWidget, {
            align: 'top'
        }).$element
    );
    
    this.$body.append( this.content.$element );

    // patch the color input element
    //debugger
    this.getElementDocument().getElementById(idForColorisEl).firstChild.classList.add('full-thumbnail-coloris')


    Coloris({
        el: "#" + idForColorisEl + " > :first-child",
        parent: "#" + idForColorisEl,
   
        inline: true,
        theme: 'pill',
        swatches: [
            '#264653',
            '#2a9d8f',
            '#e9c46a',
            'rgb(244,162,97)',
            '#e76f51',
            '#d62828',
            'navy',
            '#07b',
            '#0096c7',
            '#00b4d880',
            'rgba(0,119,182,0.8)'
          ],
        onChange: (color, input) => {
            this.colorInput.setValue(color);
        }
    });
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
            debugger;
            if ( !/^#[0-9A-Fa-f]{6-8}$/.test( hexColor ) ) {
                // TODO: add a message
                // throw new OO.ui.Error( 'Incorrect color' );
            }

            colorizeTableCell(hexColor)
            // TODO: colorize text background

            Coloris.close(true);
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