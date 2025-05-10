/*!
 * ColorizeToolVe ContentEditable TableCellNode class.
 */

/**
 * ContentEditable table cell node.
 *
 * @class
 * @extends ve.ce.TableCellNode
 *
 * @constructor
 * @param {ct.dm.TableCellNode} model Model to observe
 * @param {Object} [config] Configuration options
 */
ct.ce.TableCellNode = function CtCeTableCellNode() {
    // Parent constructor
    ct.ce.TableCellNode.super.apply(this, arguments);
};

/* Inheritance */

OO.inheritClass(ct.ce.TableCellNode, ve.ce.TableCellNode);

/* Methods */

/**
 * Handle attribute changes to keep the live HTML element updated.
 *
 * @param {string} key Attribute name
 * @param {Mixed} from Old value
 * @param {Mixed} to Old value
 */
ct.ce.TableCellNode.prototype.onAttributeChange = function (key, from, to) {
    // ************
    // WARNING!!!!!! Background-color in attributes must be separate from style
    // otherwise we will get into an infinite loop.
    // See: ct.dm.TableCellNode.prototype.onAttributeChange()
    // ************
    let newBgColor = to;

    switch (key) {
        case 'style':
            // We should manually move bg color, because when style (data/header) of the cell is changing
            // method ve.ce.View.prototype.initialize() in ve.ce.BranchNode.prototype.updateTagName() is called
            // and the tag (th/td) is created based on the hash (if the hash exists)
            newBgColor = this.model.getElement()?.attributes?.background;

            ct.ce.TableCellNode.super.prototype.onAttributeChange.apply(this, arguments);

        case 'background':
            if (newBgColor) {
                this.$element.css('background-color', newBgColor);
            } else {
                this.$element.css('background-color', '');
            }
            break;

        default:
            ct.ce.TableCellNode.super.prototype.onAttributeChange.apply(this, arguments);
    }
};

/* Registration */

ve.ce.nodeFactory.register(ct.ce.TableCellNode);
