( function () {
    'use strict';

    /* -----------------------------------------------------------------------
     * ve.ui.TextColorDialog
     * ----------------------------------------------------------------------- */

    /**
     * Color-picker dialog for text foreground color.
     *
     * @class
     * @extends ve.ui.ColorSetDialog
     * @constructor
     * @param {Object} [config]
     */
    ve.ui.TextColorDialog = function TextColorDialog( config ) {
        ve.ui.TextColorDialog.super.call( this, config );
    };

    OO.inheritClass( ve.ui.TextColorDialog, ve.ui.ColorSetDialog );

    ve.ui.TextColorDialog.static.name = 'textColorDialog';

    ve.ui.TextColorDialog.prototype.getTitleMsg = function () {
        return 'colorizertoolve-text-color-picker-title';
    };

    ve.ui.TextColorDialog.prototype.getSwatches = function () {
        return this.mwConfig.ColorPickerTextColors;
    };

    /**
     * Annotate the current text selection with a foreground color.
     *
     * @param {string} hexColor  Empty string removes the annotation.
     */
    ve.ui.TextColorDialog.prototype.applyColor = function ( hexColor ) {
        var annotationName = 'textStyle/textcolor',
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

    ve.ui.windowFactory.register( ve.ui.TextColorDialog );


    /* -----------------------------------------------------------------------
     * ve.ui.TextColorTool
     * ----------------------------------------------------------------------- */

    /**
     * Toolbar button that opens the text foreground color picker.
     *
     * @class
     * @extends ve.ui.BaseColorTool
     * @constructor
     */
    ve.ui.TextColorTool = function TextColorTool() {
        ve.ui.TextColorTool.super.apply( this, arguments );
    };

    OO.inheritClass( ve.ui.TextColorTool, ve.ui.BaseColorTool );

    ve.ui.TextColorTool.static.name = 'colorizeText';
    ve.ui.TextColorTool.static.dialogName = 'textColorDialog';
    ve.ui.TextColorTool.static.title = mw.message( 'colorizertoolve-text-button-label' ).text();

    ve.ui.toolFactory.register( ve.ui.TextColorTool );

}() );
