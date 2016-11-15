import {Base,Protocol,StrictProtocol,Policy} from 'miruken-core';
import {Handler,handle} from 'miruken-callback';
import {Validator,Validating} from 'miruken-validate';
import {contextual} from 'miruken-context';

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

/**
 * Protocol for managing master-detail relationships.
 * @class MasterDetail
 * @extends Protocol     
 */    
export const MasterDetail = Protocol.extend({
    /**
     * Gets the selected detail.
     * @method getSelectedDetail
     * @param   {Function} detailClass  -  type of detail
     * @returns {Object} selected detail.  Could be a Promise.
     */
    getSelectedDetail(detailClass) {},
    /**
     * Gets the selected details.
     * @method getSelectedDetails
     * @param   {Function} detailClass  -  type of detail
     * @returns {Object}  selected details.  Could be a Promise.
     */
    getSelectedDetails(detailClass) {},
    /**
     * Selects the detail
     * @method selectDetail
     * @param   {Object} detail  -  selected detail
     */
    selectDetail(detail) {},
    /**
     * Unselects the detail
     * @method deselectDetail
     * @param   {Object} detail  -  unselected detail
     */
    deselectDetail(detail) {},
    /**
     * Determines if a previous detail exists.
     * @method hasPreviousDetail
     * @param   {Function} detailClass  -  type of detail
     * @returns {boolean} true if a previous detail exists.
     */
    hasPreviousDetail(detailClass) {},
    /**
     * Determines if a next detail exists.
     * @method hasNextDetail.
     * @param   {Function} detailClass  -  type of detail
     * @returns {boolean} true if a next detail exists.
     */
    hasNextDetail(detailClass) {},
    /**
     * Gets the previous detail.
     * @method getPreviousDetail
     * @param   {Function} detailClass  -  type of detail
     * @returns {Object}  previous detail or undefined..
     */
    getPreviousDetail(detailClass) {},
    /**
     * Gets the next detail.
     * @method getNextDetail
     * @param   {Function} detailClass  -  type of detail
     * @returns {Object}  next detail or undefined.
     */
    getNextDetail(detailClass) {},
    /**
     * Adds the detail to the master.
     * @method addDetail
     * @param   {Object} detail  -  added detail
     */
    addDetail(detail) {},
    /**
     * Updates the detail in the master.
     * @method updateDetail
     * @param   {Object} detail  -  updated detail
     */
    updateDetail(detail) {},
    /**
     * Removes the detail from the master.
     * @method removeDetail
     * @param   {Object}  detail   -  removed detail
     * @param   {boolean} deleteIt -  true to delete it
     */
    removeDetail(detail, deleteIt) {}
});

/**
 * Protocol for receiving master-detail notifications.
 * @class MasterDetailAware
 * @extends Protocol     
 */    
export const MasterDetailAware = Protocol.extend({
    /**
     * Informs the master has changed.
     * @method masterChanged
     * @param  {Object}  master  -  master
     */
    masterChanged(master) {},
    /**
     * Informs a detail was selected.
     * @method detailSelected
     * @param  {Object}  detail  -  selected detail
     * @param  {Object}  master  -  master
     */
    detailSelected(detail, master) {},
    /**
     * Informs a detail was unselected.
     * @method detailUnselected
     * @param  {Object} detail  -  unselected detail
     * @param  {Object} master  -  master
     */
    detailUnselected(detail, master) {},
    /**
     * Informs a detail was added to the master.
     * @method detailAdded
     * @param  {Object} detail  -  added detail
     * @param  {Object} master  -  master
     */
    detailAdded(detail, master) {},
    /**
     * Informs a detail was updated in the master.
     * @method detailUpdated
     * @param  {Object} detail  -  updated detail
     * @param  {Object} master  -  master
     */
    detailUpdated(detail, master) {},
    /**
     * Informs a detail was removed from the master.
     * @method detailRemoved
     * @param  {Object} detail  -  removed detail
     * @param  {Object} master  -  master
     */
    detailRemoved(detail, master) {}
});

/**
 * Base class for controllers.
 * @class Controller
 * @constructor
 * @extends Handler
 * @uses contextual
 * @uses Validating
 */
export const Controller = Handler.extend(contextual, Validating, {
    validate(target, scope) {
        return _validateController(this, target, "validate", scope);
    },
    validateAsync(target, scope) {
        return _validateController(this, target, "validateAsync", scope);
    }
});

function _validateController(controller, target, method, scope) {
    const context = controller.context;
    if (!context) {
        throw new Error("Validation requires a context to be available.");
    }
    const validator = Validator(context);
    return validator[method].call(validator, target || controller, scope);
}

/**
 * Policy for describing modal presentation.
 * @class ModalPolicy
 * @extends PresentationPolicy
 */
export const ModalPolicy = PresentationPolicy.extend({
    title:      "",
    style:      null,
    chrome:     true,
    header:     false,
    footer:     false,
    forceClose: false,
    buttons:    null
});

/**
 * Protocol for interacting with a modal provider.
 * @class ModalProviding
 * @extends StrictProtocol
 */
export const ModalProviding = StrictProtocol.extend({
    /**
     * Presents the content in a modal dialog.
     * @method showModal
     * @param   {Element}      container  -  element modal bound to
     * @param   {Element}      content    -  modal content element
     * @param   {ModalPolicy}  policy     -  modal policy options
     * @param   {Context}      context    -  modal context
     * @returns {Promise} promise representing the modal result.
     */
    showModal(container, content, policy, context) {}
});

Handler.implement({
    /**
     * Configures modal presentation options.
     * @method modal
     * @param {Object}  options  -  modal options
     * @returns {Handler} modal handler.
     * @for Handler
     */                                                                
    modal(options) {
        return this.presenting(new ModalPolicy(options));
    }
});
