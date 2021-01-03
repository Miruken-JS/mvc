import {
    Base, Protocol, Options, Handler,
    Disposing, handlesOptions, createKeyChain
} from "@miruken/core";

const _ = createKeyChain();

/**
 * Protocol for representing a layer in a 
 * See {{#crossLink "miruken.mvc.ViewRegion"}}{{/crossLink}.
 * @class ViewLayer
 * @extends Protocol
 */
export const ViewLayer = Protocol.extend(Disposing, {
    /**
     * Gets the index of the layer in the region.
     * @property {int} index
     */
    get index() {}
});

/**
 * Protocol for rendering a view on the screen.
 * @class ViewRegion
 * @extends Protocol
 */
export const ViewRegion = Protocol.extend({
    /**
     * Renders `view` in the region.
     * @method show
     * @param    {Any}      view  -  view
     * @returns  {Promise}  promise for the layer.
     */
    show(view) {}
});

/**
 * Protocol for communicating
 * {{#crossLink "Handler"}}{{/crossLink}} lifecycle.
 * @class ViewRegionAware
 * @extends Protocol
 */
export const ViewRegionAware = Protocol.extend({
    viewRegionCreated(viewRegion) {}
});

/**
 * Base class for presentation options.
 * @class PresentationOptions
 * @extends Options
 */
@handlesOptions("presenting")
export class PresentationOptions extends Options {
}

/**
 * Options for describing modal presentation.
 * @class ModalOptions
 * @extends PresentationOptions
 */
export const ModalOptions = PresentationOptions.extend({
    title:      "",
    style:      null,
    chrome:     true,
    header:     false,
    footer:     false,
    forceClose: false,
    buttons:    null
});

/**
 * Options for controlling regions.
 * @class RegionOptions
 * @extends PresentationOptions
 */
export const RegionOptions = PresentationOptions.extend({
    tag:   undefined,
    push:  false,
    modal: undefined
});

/**
 * Represents the clicking of a button.
 * @class ButtonClicked
 * @constructor
 * @param  {Any}     button       -  clicked button
 * @param  {number}  buttonIndex  -  index of clicked button 
 * @extends Base
 */
export const ButtonClicked = Base.extend({
    constructor(button, buttonIndex) {
        _(this).button      = button;
        _(this).buttonIndex = buttonIndex;
    },

    /**
     * Gets the clicked button.
     * @property {Any} button
     */                                
    get button() { return _(this).button; },
    /**
     * Gets the clicked button index.
     * @property {number} button index
     */                                
    get buttonIndex() { return _(this).buttonIndex; }
});

/**
 * Protocol for interacting with a modal provider.
 * @class ModalProviding
 * @extends Protocol
 */
export const ModalProviding = Protocol.extend({
    /**
     * Presents the content in a modal dialog.
     * @method showModal
     * @param   {Element}      container  -  element modal bound to
     * @param   {Element}      content    -  modal content element
     * @param   {ModalOptions} options    -  modal options
     * @param   {Context}      context    -  modal context
     * @returns {Promise} promise representing the modal result.
     */
    showModal(container, content, options, context) {}
});

Handler.implement({
    /**
     * Targets the tagged region with `tag`.
     * @method region
     * @param  {Any}  tag  -  region tag
     * @returns {miruken.callback.CallbackHandler} tag handler.
     * @for miruken.callback.CallbackHandler
     */                                                                
    region(tag) {
        return this.presenting(new RegionOptions({tag: tag}));
    },
    /**
     * Presents the next view in a new layer. 
     * @method pushLayer
     * @returns {miruken.callback.CallbackHandler} push handler.
     * @for miruken.callback.CallbackHandler
     */                                                                
    pushLayer() {
        return this.presenting(new RegionOptions({push: true}));
    },
    /**
     * Configures modal presentation options.
     * @method modal
     * @param {Object}  options  -  modal options
     * @returns {miruken.callback.CallbackHandler} modal handler.
     * @for miruken.callback.CallbackHandler
     */
    modal(modal) {
        return this.presenting(new RegionOptions({
            modal: new ModalOptions(modal)
        }));
    }
});
