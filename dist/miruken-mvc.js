import {Base,Metadata,$isNothing,$isFunction,$isObject,$inferProperties,Protocol,StrictProtocol} from 'miruken-core';
import {$validateThat,Validator,Validating} from 'miruken-validate';
import {CallbackHandler} from 'miruken-callback';
import {$contextual} from 'miruken-context';

/**
 * Base class for modelling concepts using one or more 
 * {{#crossLink "miruken.$properties"}}{{/crossLink}}
 * <pre>
 *    const Child = Model.extend({
 *       $properties: {
 *           firstName: { validate: { presence: true } },
 *           lastNane:  { validate: { presence: true } },
 *           sibling:   { map: Child },
 *           age:       { validate {
 *                            numericality: {
 *                                onlyInteger:       true,
 *                                lessThanOrEqualTo: 12
 *                            }
 *                      }}
 *       }
 *    })
 * </pre>
 * @class Model
 * @constructor
 * @param  {Object}  [data]   -  json structured data
 * @param  {Object}  options  -  mapping options
 * @extends Base
 */
export const Model = Base.extend(
    $inferProperties, $validateThat, {
        constructor(data, options) {
            this.fromData(data, options);
        },
        /**
         * Maps json structured data into the model.
         * @method fromData
         * @param   {Object}  data     -  json structured data
         * @param   {Object}  options  -  mapping options
         */
        fromData(data, options) {
            if ($isNothing(data)) {
                return this;
            }
            const meta        = this[Metadata],
                  descriptors = meta && meta.getDescriptor(),
                  dynamic     = options && options.dynamic;
            if (descriptors) {
                for (let key in descriptors) {
                    const descriptor = descriptors[key];
                    if (descriptor && descriptor.root && descriptor.map) {
                        this[key] = descriptor.map(data); 
                    }
                }
            }
            for (let key in data) {
                let descriptor = descriptors && descriptors[key],
                    mapper     = descriptor  && descriptor.map;
                if ((mapper && descriptor.root) || (descriptor && descriptor.ignore)) {
                    continue;  // ignore or already rooted
                }
                const value = data[key];
                if (value === undefined) {
                    continue;
                }
                if (key in this) {
                    this[key] = Model.map(value, mapper, options);
                } else {
                    const lkey  = key.toLowerCase();
                    let   found = false;
                    for (let k in this) {
                        if (k.toLowerCase() === lkey) {
                            descriptor = descriptors && descriptors[k];
                            mapper     = descriptor  && descriptor.map;                            
                            this[k]    = Model.map(value, mapper, options);
                            found      = true;
                            break;
                        }
                    }
                    if (!found && dynamic) {
                        this[key] = value;
                    }
                }
            }
            return this;
        },
        /**
         * Maps the model into json structured data.
         * @method toData
         * @param   {Object}  spec    -  filters data to map
         * @param   {Object}  [data]  -  receives mapped data
         * @returns {Object} json structured data.
         */                        
        toData(spec, data) {
            data = data || {};
            const meta        = this[Metadata],
                  descriptors = meta && meta.getDescriptor();
            if (descriptors) {
                const all = !$isObject(spec);
                for (let key in descriptors) {
                    if (all || (key in spec)) {
                        let keyValue   = this[key];
                        if (keyValue === undefined) {
                            continue;
                        }
                        const descriptor = descriptors[key],
                              keySpec    = all ? spec : spec[key];
                        if (!(all || keySpec) || descriptor.ignore) {
                            continue;
                        }
                        if (descriptor.root) {
                            if (keyValue) {
                                if ($isFunction(keyValue.toData)) {
                                    keyValue.toData(keySpec, data);
                                } else if ($isFunction(keyValue.toJSON)) {
                                    const json = keyValue.toJSON();
                                    for(let k in json) data[k] = json[k];
                                }
                            }
                        } else if (Array.isArray(keyValue)) {
                            data[key] = keyValue.map(elem => {
                                if (elem) {
                                    if ($isFunction(elem.toData)) {
                                        return elem.toData(keySpec);
                                    } else if ($isFunction(elem.toJSON)) {
                                        return elem.toJSON();
                                    }
                                    return elem;
                                }
                            });
                        } else {
                            if (keyValue) {
                                if ($isFunction(keyValue.toData)) {
                                    keyValue = keyValue.toData(keySpec);
                                } else if ($isFunction(keyValue.toJSON)) {
                                    keyValue = keyValue.toJSON();
                                }
                            }
                            data[key] = keyValue
                        }
                    }
                }
            }            
            return data;
        },
        toJSON() { return this.toData(); },
        /**
         * Merges specified data into another model.
         * @method mergeInto
         * @param   {miruken.mvc.Model}  model  -  model to receive data
         * @returns {boolean} true if model could be merged into. 
         */            
        mergeInto(model) {
            if (!(model instanceof this.constructor)) {
                return false;
            }
            const meta        = this[Metadata],
                  descriptors = meta && meta.getDescriptor();
            for (let key in descriptors) {
                const keyValue = this[key];
                if (keyValue !== undefined && this.hasOwnProperty(key)) {
                    const modelValue = model[key];
                    if (modelValue === undefined || !model.hasOwnProperty(key)) {
                        model[key] = keyValue;
                    } else if ($isFunction(keyValue.mergeInto)) {
                        keyValue.mergeInto(modelValue);
                    }
                }
            }
            return true;
        }
    }, {
        /**
         * Maps the model value into json using a mapper function.
         * @method map
         * @static
         * @param   {Any}      value      -  model value
         * @param   {Fnction}  mapper     -  mapping function or class
         * @param   {Object}   [options]  -  mapping options
         * @returns {Object} json structured data.
         */                                
        map(value, mapper, options) {
            return Array.isArray(value)
                 ? value.map(elem => Model.map(elem, mapper, options))
                 : mapper ? mapper(value, options) : value;
        },
        coerce(...args) {
            return Reflect.construct(this, args);
        }
    }
);

/**
 * Base class for controllers.
 * @class Controller
 * @constructor
 * @extends miruken.callback.CallbackHandler
 * @uses miruken.context.$contextual
 * @uses miruken.validate.$validateThat
 * @uses miruken.validate.Validating
 */
export const Controller = CallbackHandler.extend(
    $contextual, $validateThat, Validating, {
        validate(target, scope) {
            return _validateController(this, target, 'validate', scope);
        },
        validateAsync(target, scope) {
            return _validateController(this, target, 'validateAsync', scope);
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
 * Protocol for managing master-detail relationships.
 * @class MasterDetail
 * @extends miruken.Protocol     
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
 * @extends miruken.Protocol     
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
            $handle: [
                PresentationPolicy, presenting => policy.mergeInto(presenting)
            ]
        }) : this;
    }
});

/**
 * Policy for describing modal presentation.
 * @class ModalPolicy
 * @extends miruken.mvc.PresentationPolicy
 */
export const ModalPolicy = PresentationPolicy.extend({
    $properties: {
        title:      '',
        style:      null,
        chrome:     true,
        header:     false,
        footer:     false,
        forceClose: false,
        buttons:    null
    }
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
     * @param   {Element}                  container  -  element modal bound to
     * @param   {Element}                  content    -  modal content element
     * @param   {miruken.mvc.ModalPolicy}  policy     -  modal policy options
     * @param   {miruken.context.Context}  context    -  modal context
     * @returns {Promise} promise representing the modal result.
     */
    showModal(container, content, policy, context) {}
});

CallbackHandler.implement({
    /**
     * Configures modal presentation options.
     * @method modal
     * @param {Object}  options  -  modal options
     * @returns {miruken.callback.CallbackHandler} modal handler.
     * @for miruken.callback.CallbackHandler
     */                                                                
    modal: function (options) {
        return this.presenting(new ModalPolicy(options));
    }
});
