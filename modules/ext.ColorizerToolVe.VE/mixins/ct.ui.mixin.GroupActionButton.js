/*!
 * ColorizerToolVe GroupActionButton mixin class.
 */

/**
 * Mixin for buttons.
 * Provides methods to activate the action when the button is clicked.
 *
 * @class
 * @abstract
 *
 * @constructor
 */
ct.ui.mixin.GroupActionButton = function CtUiMixinGroupActionButton() {
    // Little preparation before object will be created
    this.init();

    // Properties
    this.popup = null;
    this.arguments = [];

    // Events
    this.connect(this, {
        click: 'onClick',
    });

    // Set up styling flags to customize the look of a button if it is already active.
    this.changeActive();
};

/* Initialization */

OO.initClass(ct.ui.mixin.GroupActionButton);

/* Static Properties (must be set by child classes) */

/**
 * Name of the action to refer to in order to execute the command
 *
 * @static
 * @property {string}
 */
ct.ui.mixin.GroupActionButton.static.action = '';

/**
 * Name of the method which will be executed in after click.
 *
 * @static
 * @property {string}
 */
ct.ui.mixin.GroupActionButton.static.method = '';

/* Methods */

/**
 * Little preparation before object will be created.
 */
ct.ui.mixin.GroupActionButton.prototype.init = function () {
    // Check the mandatory properties
    const properties = [];
    if (!this.constructor.static.action.length) {
        properties.push(this.constructor.name + '.static.action');
    }
    if (!this.constructor.static.method.length) {
        properties.push(this.constructor.name + '.static.method');
    }

    if (properties.length) {
        throw new Error(
            'Propertie(s) [' + properties.join(', ') + '] should not be an empty string'
        );
    }
};

/**
 * Processes a button click (basic functionality).
 */
ct.ui.mixin.GroupActionButton.prototype.onClick = function () {
    this.execute();
};

/**
 * Execute the action/command immediately.
 */
ct.ui.mixin.GroupActionButton.prototype.execute = function () {
    this.surface.execute(this.getAction(), this.getMethod(), ...this.getArguments());
};

/**
 * @return {string} Static name of class.
 */
ct.ui.mixin.GroupActionButton.prototype.getName = function () {
    return this.constructor.static.name;
};

/**
 * @return {string} Action to be executed when the button is pressed.
 */
ct.ui.mixin.GroupActionButton.prototype.getAction = function () {
    return this.constructor.static.action;
};

/**
 * @return {string} Method to be executed when the button is pressed.
 */
ct.ui.mixin.GroupActionButton.prototype.getMethod = function () {
    return this.constructor.static.method;
};

/**
 * Sets the arguments to be passed to the action method.
 *
 * @param {Mixed} args Name of argument
 */
ct.ui.mixin.GroupActionButton.prototype.setArguments = function (args) {
    this.arguments.push(args);
};

/**
 * @returns {Array} Array of arguments to be passed to the action method
 */
ct.ui.mixin.GroupActionButton.prototype.getArguments = function () {
    return this.arguments;
};

/**
 * Reset all arguments, wich was added before.
 */
ct.ui.mixin.GroupActionButton.prototype.resetArguments = function () {
    this.arguments.length = 0;
};

/**
 * Used to set button styles depending on the current context.
 *
 * @abstract
 */
ct.ui.mixin.GroupActionButton.prototype.changeActive = function () {};

/**
 * Check if action button is active.
 *
 * @abstract
 * @returns {boolean}
 */
ct.ui.mixin.GroupActionButton.prototype.isActive = function () {};
