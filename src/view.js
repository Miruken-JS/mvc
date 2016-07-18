import {
    Base, Protocol, StrictProtocol
} from 'miruken-core';

import { CallbackHandler } from 'miruken-callback';
import { Model } from './model';

/**
 * Protocol for rendering a view on the screen.
 * @class ViewRegion
 * @extends StrictProtocol
 */
export const ViewRegion = StrictProtocol.extend({
    /**
     * Gets the regions name.
     * @property {string} name
     */
    get name() {},
    /**
     * Gets the regions context.
     * @property {miruken.context.Context} context
     */
    get context() {},        
    /**
     * Gets the regions container element.
     * @property {DOMElement} container
     */
    get container() {},        
    /**
     * Gets the regions controller.
     * @property {miruken.mvc.Controller} controller
     */            
    get controller() {},
    /**
     * Gets the regions controller context.
     * @property {miruken.context.Context} controllerContext
     */            
    get controllerContext() {},        
    /**
     * Renders new presentation in the region.
     * @method present
     * @param    {Any}      presentation  -  presentation options
     * @returns  {Promise}  promise for the rendering.
     */                                        
    present(presentation) {}
});

/**
 * Protocol for communicating
 * {{#crossLink "miruken.callback.CallbackHandler"}}{{/crossLink}} lifecycle.
 * @class ViewRegionAware
 * @extends Protocol
 */
export const ViewRegionAware = Protocol.extend({
    viewRegionCreated(viewRegion) {}
});

/**
 * Base class for presentation policies.
 * @class PresentationPolicy
 * @extends miruken.mvc.Model
 */
export const PresentationPolicy = Model.extend();

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
        this.extend({
            /**
             * Gets the clicked button.
             * @property {Any} button
             */                                
            get button() { return button; },
            /**
             * Gets the clicked button index.
             * @property {number} button index
             */                                
            get buttonIndex() { return buttonIndex; }
        });
    }
});

CallbackHandler.implement({
    /**
     * Applies the presentation policy to the handler.
     * @method presenting
     * @returns {miruken.callback.CallbackHandler} presenting handler.
     * @for miruken.callback.CallbackHandler
     */
    presenting(policy) {
        return policy ? this.decorate({
            $handle: [ PresentationPolicy, presenting => policy.mergeInto(presenting) ]
        }) : this;
    }
});
