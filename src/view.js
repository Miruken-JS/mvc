import {
    Base, Protocol, StrictProtocol, Policy
} from "miruken-core";

import { Handler, handle } from "miruken-callback";

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
     * Gets the regions 
     * @property {Context} context
     */
    get context() {},        
    /**
     * Gets the regions container element.
     * @property {DOMElement} container
     */
    get container() {},        
    /**
     * Gets the regions controller.
     * @property {Controller} controller
     */            
    get controller() {},
    /**
     * Gets the regions controller 
     * @property {Context} controllerContext
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
 * {{#crossLink "Handler"}}{{/crossLink}} lifecycle.
 * @class ViewRegionAware
 * @extends Protocol
 */
export const ViewRegionAware = Protocol.extend({
    viewRegionCreated(viewRegion) {}
});

/**
 * Base class for presentation policies.
 * @class PresentationPolicy
 * @extends Policy
 */
export const PresentationPolicy = Policy.extend();

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

Handler.registerPolicy(PresentationPolicy, "presenting");
