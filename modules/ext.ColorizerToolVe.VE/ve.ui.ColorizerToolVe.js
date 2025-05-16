/*
* For sure requires refactoring, but for now it works.
*/

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
    this.content = new OO.ui.Layout({});
    
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
    
    this.$body.append( $colorisBlock );

    // initiate here, but reopen later to fix color picker NaNNaNNan issue
    Coloris({
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
    dialog.mode = data.mode;
    dialog.title.setLabel('Set color for ' + dialog.mode);
    modeSwatches = dialog.mode === 'background' ? dialog.config.ColorPickerBackgroundColors : dialog.config.ColorPickerTextColors;
    
    return colorSetDialog.super.prototype.getReadyProcess.call( this, data )
        .next( function () {
            Coloris.close(true);

            //reopen to fix the coloris
            Coloris({
                parent: `#${dialog.idForColorisParent}`,
        
                defaultColor: '#ffcc00',
                wrap: false,
                inline: true,
                theme: 'pill',
                swatches: modeSwatches,
                format: 'hex',
                clearButton: true,
                onChange: (color) => {
                    dialog.getElementDocument().getElementById(dialog.idForColorisEl).value = color;
                }
            });  
        }, this );
};

function colorizeTableCell(hexColor){
    hexColor = hexColor ? hexColor : undefined; // passing 'undefined' to remove attribute

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

function colorizeText(hexColor, mode){
    hexColor = hexColor ? hexColor : undefined; // passing 'undefined' to remove attribute

    switch (mode) {
        case 'text':
            annotationName = 'textStyle/textcolor';
            break;
        case 'background':
            annotationName = 'textStyle/bgcolor';
            break;
        default:
            return false;
    }

    
    element = {
        type: annotationName,
        attributes: { 
            code: hexColor
        }
    }
    
    var surface = ve.init.target.getSurface(),
        surfaceModel = ve.init.target.getSurface().getModel(),
        documentModel = surfaceModel.getDocument(),
        selection = surfaceModel.getSelection(),
        range = selection.getCoveringRange(),
        fragment = surfaceModel.getFragment(selection).update(),
        annotations = fragment.getAnnotations(true);

    if (!(selection instanceof ve.dm.LinearSelection)) {
        return false;
    }

    //debugger
    fragment.annotateContent('clear', annotationName)
    fragment.annotateContent('set', annotationName, element)
    
    
    //debugger

    return true;
}


colorSetDialog.prototype.getActionProcess = function ( action ) {
    var dialog = this;

    if ( action === 'ok' ) {
        return new OO.ui.Process( function () {
            // color validation
            var hexColor = dialog.getElementDocument().getElementById(dialog.idForColorisEl).value.trim();
            
            if (dialog.mode === 'background') {
                colorizeTableCell(hexColor)
                colorizeText(hexColor, 'background');
            }

            if (dialog.mode === 'text') {
                colorizeText(hexColor, 'text');
            }
                    
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


/* Background color tool */
ve.ui.BackgroundColorTool = function BackgroundColorTool() {
    ve.ui.BackgroundColorTool.super.apply( this, arguments );
};
OO.inheritClass( ve.ui.BackgroundColorTool, OO.ui.Tool );


ve.ui.BackgroundColorTool.static.name = 'colorizeBackground';
ve.ui.BackgroundColorTool.static.group = 'textStyle';
ve.ui.BackgroundColorTool.static.icon = 'highlight';
ve.ui.BackgroundColorTool.static.title = "Background color...";

ve.ui.toolFactory.register( ve.ui.BackgroundColorTool );

ve.ui.BackgroundColorTool.prototype.onSelect = function () {
    this.toolbar.getSurface().execute( 'window', 'open', 'colorSetDialog', { mode: 'background' } );
};
 
ve.ui.BackgroundColorTool.prototype.onUpdateState = function () {
	this.setActive( false );
};

/* Text color tool */
ve.ui.TextColorTool = function TextColorTool() {
    ve.ui.TextColorTool.super.apply( this, arguments );
};
OO.inheritClass( ve.ui.TextColorTool, OO.ui.Tool );


ve.ui.TextColorTool.static.name = 'colorizeText';
ve.ui.TextColorTool.static.group = 'textStyle';
ve.ui.TextColorTool.static.icon = 'highlight';
ve.ui.TextColorTool.static.title = "Text color...";

ve.ui.toolFactory.register( ve.ui.TextColorTool );

ve.ui.TextColorTool.prototype.onSelect = function () {
    this.toolbar.getSurface().execute( 'window', 'open', 'colorSetDialog', { mode: 'text' } );
};
 
ve.ui.TextColorTool.prototype.onUpdateState = function () {
	this.setActive( false );
};
