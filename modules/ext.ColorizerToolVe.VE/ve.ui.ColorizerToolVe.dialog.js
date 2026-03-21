( function () {
    'use strict';

    /* -----------------------------------------------------------------------
     * ve.ui.ColorSetDialog  –  abstract base for the Coloris color-picker dialogs
     * ----------------------------------------------------------------------- */

    /**
     * Abstract base for the text-color and background-color picker dialogs.
     * Concrete subclasses must implement getTitleMsg(), getSwatches() and applyColor().
     *
     * @class
     * @abstract
     * @extends OO.ui.ProcessDialog
     * @constructor
     * @param {Object} [config]
     */
    ve.ui.ColorSetDialog = function ColorSetDialog( config ) {
        ve.ui.ColorSetDialog.super.call( this, config );
    };

    OO.inheritClass( ve.ui.ColorSetDialog, OO.ui.ProcessDialog );

    ve.ui.ColorSetDialog.static.name = null; // Must be overridden by each concrete subclass.
    ve.ui.ColorSetDialog.static.title = '';  // Populated at open time via getTitleMsg().
    ve.ui.ColorSetDialog.static.actions = [
        { action: 'ok',     label: mw.message( 'colorizertoolve-dialog-ok' ).text(),     flags: [ 'primary', 'progressive' ] },
        { action: 'cancel', label: mw.message( 'colorizertoolve-dialog-cancel' ).text(), flags: [] }
    ];

    ve.ui.ColorSetDialog.prototype.initialize = function () {
        ve.ui.ColorSetDialog.super.prototype.initialize.call( this );

        this.mwConfig = mw.config.get( 'wgColorizerToolVE' );
        // Use dialog name as suffix to keep IDs unique when multiple dialogs coexist in the DOM.
        var suffix = this.constructor.static.name;
        this.idForColorisEl = 'colorisColorInput-' + suffix;
        this.idForColorisParent = 'colorisColorParent-' + suffix;

        this.$body.append(
            $( '<div>' )
                .attr( 'id', this.idForColorisParent )
                .addClass( 'full-thumbnail-coloris' )
                .append(
                    $( '<input>' ).attr( {
                        id: this.idForColorisEl,
                        type: 'text',
                        value: '#ffcc00'
                    } )
                )
        );

        // Attach Coloris to the DOM element immediately so it is ready on first open.
        // getReadyProcess will reinitialise it with the correct swatches and default color.
        this.openColoris( '#ffcc00', [] );
    };

    /**
     * (Re-)initialise Coloris. Always called on open to work around the
     * Coloris "NaNNaNNaN" bug that occurs when the picker is reused.
     *
     * @param {string}   defaultColor
     * @param {string[]} swatches
     */
    ve.ui.ColorSetDialog.prototype.openColoris = function ( defaultColor, swatches ) {
        var dialog = this;
        Coloris( {
            parent: '#' + dialog.idForColorisParent,
            defaultColor: defaultColor,
            wrap: false,
            inline: true,
            theme: 'pill',
            swatches: swatches,
            format: 'hex',
            clearButton: true,
            onChange: function ( color ) {
                dialog.getElementDocument()
                    .getElementById( dialog.idForColorisEl ).value = color;
            }
        } );
    };

    /**
     * Return the i18n message key for this dialog's title.
     * @abstract
     * @return {string}
     */
    ve.ui.ColorSetDialog.prototype.getTitleMsg = null;

    /**
     * Return the swatch list for this dialog's color picker.
     * @abstract
     * @return {string[]}
     */
    ve.ui.ColorSetDialog.prototype.getSwatches = null;

    /**
     * Apply the chosen color to the current selection.
     * @abstract
     * @param {string} hexColor  Empty string removes the color.
     */
    ve.ui.ColorSetDialog.prototype.applyColor = null;

    ve.ui.ColorSetDialog.prototype.getReadyProcess = function ( data ) {
        var dialog = this,
            swatches = dialog.getSwatches(),
            defaultColor = swatches[ 0 ];

        dialog.title.setLabel( mw.message( dialog.getTitleMsg() ).text() );
        dialog.getElementDocument()
            .getElementById( dialog.idForColorisEl ).value = defaultColor;

        return ve.ui.ColorSetDialog.super.prototype.getReadyProcess.call( dialog, data )
            .next( function () {
                // Close before reopening to avoid the Coloris "NaNNaNNaN" glitch.
                Coloris.close( true );
                dialog.openColoris( defaultColor, swatches );
                // Coloris injects its DOM asynchronously; give it one repaint cycle
                // before asking OOUI to remeasure and resize the dialog.
                setTimeout( function () {
                    dialog.updateSize();
                }, 0 );
            }, dialog );
    };

    ve.ui.ColorSetDialog.prototype.getActionProcess = function ( action ) {
        var dialog = this,
            dialogName = dialog.constructor.static.name;

        if ( action === 'ok' ) {
            return new OO.ui.Process( function () {
                var hexColor = dialog.getElementDocument()
                    .getElementById( dialog.idForColorisEl ).value.trim();
                dialog.applyColor( hexColor );
                ve.init.target.getSurface()
                    .execute( 'window', 'close', dialogName, null );
            } );
        }

        ve.init.target.getSurface()
            .execute( 'window', 'close', dialogName, null );
        return ve.ui.ColorSetDialog.super.prototype.getActionProcess.call( this, action );
    };


    /* -----------------------------------------------------------------------
     * ve.ui.BaseColorTool  –  abstract base for the color toolbar buttons
     * ----------------------------------------------------------------------- */

    /**
     * @class
     * @abstract
     * @extends OO.ui.Tool
     * @constructor
     */
    ve.ui.BaseColorTool = function BaseColorTool() {
        ve.ui.BaseColorTool.super.apply( this, arguments );
    };

    OO.inheritClass( ve.ui.BaseColorTool, OO.ui.Tool );

    ve.ui.BaseColorTool.static.group = 'textStyle';
    ve.ui.BaseColorTool.static.icon = 'highlight';
    /**
     * Name of the dialog that this tool opens.
     * @abstract
     * @static
     * @property {string}
     */
    ve.ui.BaseColorTool.static.dialogName = null;

    ve.ui.BaseColorTool.prototype.onSelect = function () {
        this.toolbar.getSurface().execute(
            'window', 'open', this.constructor.static.dialogName
        );
    };

    ve.ui.BaseColorTool.prototype.onUpdateState = function () {
        this.setActive( false );
    };

}() );
