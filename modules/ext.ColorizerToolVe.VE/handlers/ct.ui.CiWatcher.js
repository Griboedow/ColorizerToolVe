/*!
 * ColorizeToolVe Color Input Watcher class.
 */

/**
 * Actually keeps track of the input type color element and helps handle various events.
 *
 * @class
 *
 * @constructor
 * @property {ve.ui.Surface} surface Is a top-level object which contains both a surface model and a surface view.
 * @property {jQuery} $input The element to be monitored.
 */
ct.ui.CiWatcher = function CtUiCiWatcher(surface, $input) {
    // Internal
    this.disabledColor = '#000000';

    // Properties
    this.surface ||= surface;
    this.$input = $input;
    this.isСlosedSilently = false;
    this.isPopupWindowOpened = false;
    this.inputValue = this.disabledColor;
    this.initialInputValue = null;

    OO.EventEmitter.call(this);

    /* Events */
    this.surface.getView().$element.on('click', this.onMousedown.bind(this));
    // ct.listeners.add(window, 'click', this.onMousedown.bind(this));
    // Track the 'esc'
    // We use the wrapper because we are accessing a global object ('window')
    // NOTE: also 'keyup' event from ve.ce.Surface doesn't work for ve.dm.TableSelection
    ct.listeners.add(window, 'keyup', this.onKeyup.bind(this));

    this.$input.on('input', this.onInput.bind(this));
    this.$input.on('change', this.onChange.bind(this));
};

/* Initialization */

OO.initClass(ct.ui.CiWatcher);

OO.mixinClass(ct.ui.CiWatcher, OO.EventEmitter);

/* Methods */

ct.ui.CiWatcher.prototype.onMousedown = function () {
    if (
        (this.inputValue === this.initialInputValue || !this.isInputValueSet()) &&
        this.isPopupWindowOpened
    ) {
        this.emit('closedSilently');
        this.teardown();
    }
};

ct.ui.CiWatcher.prototype.onInput = function (e) {
    this.inputValue = e.target.value;
    this.isPopupWindowOpened = true;
    this.emit('colorChange', e);
};

ct.ui.CiWatcher.prototype.onChange = function (e) {
    this.teardown();
};

ct.ui.CiWatcher.prototype.onKeyup = function (e) {
    if (e.code === 'Escape' && this.isPopupWindowOpened) {
        this.emit('keyupEscape');
        this.teardown();
    }
};

ct.ui.CiWatcher.prototype.isInputValueSet = function () {
    return this.inputValue === this.disabledColor ? false : true;
};

ct.ui.CiWatcher.prototype.setPopupWindowStatus = function (status) {
    this.isPopupWindowOpened = status;
    if (status) {
        this.initialInputValue = this.$input.val();
        this.inputValue = this.initialInputValue;
    }
};

ct.ui.CiWatcher.prototype.getSilentlyStatus = function () {
    return this.isСlosedSilently;
};

/**
 * Reset variable values to default state.
 * If 'soft' true, then skip some teardowns actions.
 *
 * @param {boolean} soft
 */
ct.ui.CiWatcher.prototype.teardown = function (soft = true) {
    this.isPopupWindowOpened = false;
    this.inputValue = this.disabledColor;
    this.isСlosedSilently = false;
    this.initialInputValue = null;
};
