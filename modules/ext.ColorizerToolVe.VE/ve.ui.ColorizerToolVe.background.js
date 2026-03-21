( function () {
    'use strict';

    /* -----------------------------------------------------------------------
     * ve.ui.BackgroundColorDialog
     * ----------------------------------------------------------------------- */

    /**
     * Color-picker dialog for inline text background and table-cell background.
     * Applies the color to both simultaneously when the selection overlaps both
     * a linear (text) and a table selection.
     *
     * @class
     * @extends ve.ui.ColorSetDialog
     * @constructor
     * @param {Object} [config]
     */
    ve.ui.BackgroundColorDialog = function BackgroundColorDialog( config ) {
        ve.ui.BackgroundColorDialog.super.call( this, config );
    };

    OO.inheritClass( ve.ui.BackgroundColorDialog, ve.ui.ColorSetDialog );

    ve.ui.BackgroundColorDialog.static.name = 'backgroundColorDialog';

    ve.ui.BackgroundColorDialog.prototype.getTitleMsg = function () {
        return 'colorizertoolve-background-color-picker-title';
    };

    ve.ui.BackgroundColorDialog.prototype.getSwatches = function () {
        return this.mwConfig.ColorPickerBackgroundColors;
    };

    /**
     * Apply the chosen color to the current selection:
     * – table cells  → sets the cell background attribute
     * – inline text  → sets the textStyle/bgcolor annotation
     *
     * @param {string} hexColor  Empty string removes the color.
     */
    ve.ui.BackgroundColorDialog.prototype.applyColor = function ( hexColor ) {
        this.applyTableCellBackground( hexColor );
        this.applyTextBackground( hexColor );
    };

    /**
     * Set or clear the background attribute on all selected table cell(s).
     *
     * @param {string} hexColor
     */
    ve.ui.BackgroundColorDialog.prototype.applyTableCellBackground = function ( hexColor ) {
        var surfaceModel = ve.init.target.getSurface().getModel(),
            selection = surfaceModel.getSelection(),
            documentModel = surfaceModel.getDocument();

        if ( !( selection instanceof ve.dm.TableSelection ) ) {
            return;
        }

        var attributes = { background: hexColor || undefined },
            ranges = selection.getOuterRanges( documentModel );

        // Iterate in reverse so earlier offsets are not shifted by later changes.
        for ( var i = ranges.length - 1; i >= 0; i-- ) {
            surfaceModel.change(
                ve.dm.TransactionBuilder.static.newFromAttributeChanges(
                    documentModel, ranges[ i ].start, attributes
                )
            );
        }

        ve.track( 'activity.table', { action: 'background' } );
    };

    /**
     * Annotate the current text selection with an inline background color.
     *
     * @param {string} hexColor  Empty string removes the annotation.
     */
    ve.ui.BackgroundColorDialog.prototype.applyTextBackground = function ( hexColor ) {
        var annotationName = 'textStyle/bgcolor',
            surfaceModel = ve.init.target.getSurface().getModel(),
            selection = surfaceModel.getSelection(),
            fragment = surfaceModel.getFragment( selection ).update();

        if ( !( selection instanceof ve.dm.LinearSelection ) ) {
            return;
        }

        fragment.annotateContent( 'clear', annotationName );
        if ( hexColor ) {
            fragment.annotateContent( 'set', annotationName, {
                type: annotationName,
                attributes: { code: hexColor }
            } );
        }
    };

    ve.ui.windowFactory.register( ve.ui.BackgroundColorDialog );


    /* -----------------------------------------------------------------------
     * ve.ui.BackgroundColorTool
     * ----------------------------------------------------------------------- */

    /**
     * Toolbar button that opens the background (text + table cell) color picker.
     *
     * @class
     * @extends ve.ui.BaseColorTool
     * @constructor
     */
    ve.ui.BackgroundColorTool = function BackgroundColorTool() {
        ve.ui.BackgroundColorTool.super.apply( this, arguments );
    };

    OO.inheritClass( ve.ui.BackgroundColorTool, ve.ui.BaseColorTool );

    ve.ui.BackgroundColorTool.static.name = 'colorizeBackground';
    ve.ui.BackgroundColorTool.static.dialogName = 'backgroundColorDialog';
    ve.ui.BackgroundColorTool.static.title = mw.message( 'colorizertoolve-background-button-label' ).text();

    ve.ui.toolFactory.register( ve.ui.BackgroundColorTool );

}() );
