import {Base,Protocol,StrictProtocol,Policy,Metadata,$isFunction,$isPlainObject,isDescriptor,Variance,decorate,$flatten,$equals,typeOf,$isNothing,$classOf,design,instanceOf,$isSymbol,getPropertyDescriptors,emptyArray} from 'miruken-core';
import {Handler,handle,$define,addDefinition,$handle,$composer,$unhandled} from 'miruken-callback';
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

const mappingMetadataKey = Symbol();

/**
 * Maintains mapping information for a class or property
 * @method mapping
 * @param  {Object}  mapping  -  member mapping
 */  
export const mapping = Metadata.decorator(mappingMetadataKey,
    (target, key, descriptor, mapping) => {
        if (!$isPlainObjet(mapping)) {
            throw new TypeError("@mapping must be a simple object");
        }
        if (!isDescriptor(descriptor)) {
            mapping = key;
            key     = null;
        }
        Metadata.define(mappingMetadataKey, mapping, target, key);
    });

/**
 * Marks the property to be mapped from the root.
 * @method root
 */
export function root(target, key, descriptor) {
    _getOrCreateMapping(target, key).root = true;    
}

/**
 * Marks the property to be ignored by the mapping.
 * @method ignore
 */
export function ignore(target, key, descriptor) {
    _getOrCreateMapping(target, key).ignore = true;
}

function _getOrCreateMapping(target, key) {
    return Metadata.getOrCreateOwn(mappingMetadataKey, target, key, () => ({}));
}

export default mapping;

const formatMetadataKey = Symbol();

/**
 * Definition for mapping a value to a format.
 * @property {Function} $mapFrom
 */
export const $mapFrom = $define(Variance.Contravariant);

/**
 * Definition for mapping from a formatted value.
 * @property {Function} $mapTo
 */
export const $mapTo = $define(Variance.Covariant);

/**
 * Decorator for mapping a value to a format.
 * @method mapFrom
 * @param {Array}  ...types  -  types to map from
 */
export function mapFrom(...args) {
    return decorate(addDefinition("mapFrom", $mapFrom, false, _filterFormat), args);
}

/**
 * Decorator for mapping from a formatted value.
 * @method mapTo
 * @param {Array}  ...types  -  types to map
 */
export function mapTo(...args) {
    return decorate(addDefinition("mapTo", $mapTo, false, _filterFormat), args);
}

/**
 * Mapping formats.
 * @method format
 * @param {Array}  ...formats  -  mapping formats 
 */
export const format = Metadata.decorator(formatMetadataKey,
    (target, key, descriptor, formats) => {
        const property = isDescriptor(descriptor);
        formats = $flatten(property ? formats : key);
        if (formats.length === 0) { return; }
        const metadata = property
            ? Metadata.getOrCreateOwn(formatMetadataKey, target, key, () => new Set())
            : Metadata.getOrCreateOwn(formatMetadataKey, target.prototype, () => new Set());
        formats.forEach(format => metadata.add(format));
    });

function _filterFormat(key, mapCallback) {
    const prototype = Object.getPrototypeOf(this);
    let formats = format.get(prototype, key);
    if (!formats || formats.size === 0) {
        formats = format.get(prototype);        
    }
    return !formats || formats.size === 0 ||
        [...formats].some(f => $equals(mapCallback.format, f));
}

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

/**
 * Protocol for mapping objects.
 * @class Mapping
 * @extends Protocol
 */        
export const Mapping = Protocol.extend({
    /**
     * Maps the `object` to a value in `format`.
     * @method mapFrom
     * @param   {Object}  object   -  object to map
     * @param   {Any}     format   -  format specifier
     * @param   {Object}  options  -  mapping options
     * @returns {Any}  mapped value.
     */
    mapFrom(object, format, options) {},
    /**
     * Maps the formatted `value` in `format` to `classOrInstance`.
     * @method mapTo 
     * @param   {Any}  value       -  formatted value
     * @param   {Any}  format      -  format specifier
     * @param   {Function|Object}  -  instance or class to unmap
     * @param   {Object}  options  -  mapping options
     * @return  {Object}  unmapped instance. 
     */    
    mapTo(value, format, classOrInstance, options) {}
});

/**
 * Protocol for mapping objects strictly.
 * @class Mapper
 * @extends StrictProtocol
 * @uses Mapping
 */        
export const Mapper = StrictProtocol.extend(Mapping);

/**
 * Base callback for mapping.
 * @class MapCallback
 * @constructor
 * @param   {Any}     format   -  format specifier
 * @param   {Object}  options  -  mapping options
 * @extends Base
 */
const MapCallback = Base.extend({
    constructor(format, options) {
        this.extend({
            /**
             * Gets the format to map.
             * @property {Any} format
             * @readOnly
             */                                                
            get format() { return format; },
            /**
             * Gets the mapping options.
             * @property {Object} options
             * @readOnly
             */                                                
            get options() { return options; }            
        });
    }
});

/**
 * Callback to map an `object` to `format`.
 * @class MapTo
 * @constructor
 * @param   {Object}  object     -  object to map
 * @param   {Any}     format     -  format specifier
 * @param   {Object}  [options]  -  mapping options
 * @extends MapCallback
 */
export const MapFrom = MapCallback.extend({
    constructor(object, format, options) {
        this.base(format, options);
        this.extend({
            /**
             * Gets the target object to map.
             * @property {Object} object
             * @readOnly
             */                                
            get object() { return object; }
        });
    }
});

/**
 * Callback to map a formatted `value` into an object.
 * @class MapFrom
 * @constructor
 * @param   {Any}              value            -  formatted value
 * @param   {Any}              format           -  format specifier
 * @param   {Function|Object}  classOrInstance  -  instance or class to unmap
 * @param   {Object}           [options]        -  mapping options
 * @extends MapCallback
 */
export const MapTo = MapCallback.extend({
    constructor(value, format, classOrInstance, options) {
        this.base(format, options);
        if ($isNothing(classOrInstance)) {
            classOrInstance = $classOf(value);
        }
        this.extend({
            /**
             * Gets the formatted value.
             * @property {Any} value
             * @readOnly
             */                                
            get value() { return value; },
            /**
             * Gets the class or instance to unmap into.
             * @property {Function|Object} classOrInstance
             * @readOnly
             */                                                
            get classOrInstance() { return classOrInstance; }
        });
    }
});

/**
 * Handler for performing object mappings.
 * @class MappingHandler
 * @extends Handler
 */        
export const MappingHandler = Handler.extend(Mapper, {
    mapFrom(object, format, options) {
        if ($isNothing(object)) {
            throw new TypeError("Missing object to map");
        }
        const mapFrom = new MapFrom(object, format, options);
        if ($composer.handle(mapFrom)) {
            return mapFrom.mapping;
        }
    },
    mapTo(value, format, classOrInstance, options) {
        if ($isNothing(value)) {
            throw new TypeError("Missing value to map from");
        }
        if (Array.isArray(classOrInstance)) {
            const type = classOrInstance[0];
            if (type && !$isFunction(type) && !Array.isArray(type)) {
                throw new TypeError("Cannot infer array type");
            }
        } else if (Array.isArray(value) && $isFunction(classOrInstance)) {
            classOrInstance = [classOrInstance];
        }
        const mapTo = new MapTo(value, format, classOrInstance, options);
        if ($composer.handle(mapTo)) {
            return mapTo.mapping;
        }
    }    
});

/**
 * Abstract mapping.
 * @class Abstract mapping
 * @extends Handler
 */        
export const AbstractMapping = Handler.extend({
    @mapFrom
    mapFrom(mapFrom, composer) {
        return $unhandled;
    },

    @mapTo
    mapTo(mapTo, composer) {
    },

    canSetProperty(descriptor) {
        return !$isFunction(descriptor.value);        
    },
    isPrimitiveValue(value) {
        switch (typeOf(value)) {
            case "null":
            case "number":
            case "string":
            case "boolean":        
            return true;
        }
        return false;        
    }
});

$handle(Handler.prototype, MapFrom, function (mapFrom, composer) {
    const target = mapFrom.object,
          source = $classOf(target);
    if ($isNothing(source)) { return false; }
    return $mapFrom.dispatch(this, mapFrom, source, composer, false, m => mapFrom.mapping = m);
});

$handle(Handler.prototype, MapTo, function (mapTo, composer) {
    const classOrInstance = mapTo.classOrInstance,
          source          = $isFunction(classOrInstance)
                          ? classOrInstance
                          : $classOf(classOrInstance);
    if ($isNothing(source)) { return false; }
    return $mapTo.dispatch(this, mapTo, source, composer, false, m => mapTo.mapping = m);
});

/**
 * Javascript Object Notation
 * @property {Any} JsonFormat
 */
export const JsonFormat      = Symbol(),
             JsonContentType = "application/json";

/**
 * Handler for performing mapping to javascript object.
 * @class JsonMapping
 * @extends Handler
 * @uses Mapper
 */
export const JsonMapping = AbstractMapping.extend(
    format(JsonFormat, JsonContentType), {
    @mapFrom(Date)
    mapFromDate(mapFrom) {
        return mapFrom.object.toJSON();
    },
    @mapFrom(RegExp)
    mapFromRegExp(mapFrom) {
        return mapFrom.object.toString();
    },
    @mapFrom(Array)
    mapFromArray(mapFrom, composer) {
        const array   = mapFrom.object,
              format  = mapFrom.format,
              options = mapFrom.options,
              mapper  = Mapper(composer);
        return array.map(elem => mapper.mapFrom(elem, format, options)); 
    },
    mapFrom(mapFrom, composer) {
        const object = mapFrom.object;
        if (!_canMapJson(object)) { return; }
        if (this.isPrimitiveValue(object)) {
            return object && object.valueOf();
        }
        const format  = mapFrom.format,
              options = mapFrom.options,
              spec    = options && options.spec,
              raw     = $isPlainObject(object),
              all     = !$isPlainObject(spec);              
        if (raw || $isFunction(object.toJSON)) {
            const json = raw ? object : object.toJSON();
            if (!all) {
                const j = {};
                for (let k in spec) j[k] = json[k];
                return j;
            }
            return json;
        }
        const descriptors = getPropertyDescriptors(object),
              mapper      = Mapper(composer),
              json        = {};
        Reflect.ownKeys(descriptors).forEach(key => {
            if (all || (key in spec)) {
                let keyValue = object[key];
                if (keyValue === undefined) { return; }
                const map     = mapping.get(object, key),
                      keySpec = all ? spec : spec[key];
                if (!(all || keySpec) || (map && map.ignore)) {
                    return;
                }
                const keyOptions = keySpec ? Object.create(options, {
                    spec: { value: keySpec }
                }) : options;
                if (!_canMapJson(keyValue)) { return; }
                if (this.isPrimitiveValue(keyValue)) {
                    json[key] = keyValue && keyValue.valueOf();
                    return;
                }
                const keyJson = mapper.mapFrom(keyValue, format, keyOptions);
                if (map && map.root) {
                    Object.assign(json, keyJson);
                } else {                 
                    json[key] = keyJson;
                }
            }
        });
        return json;
    },
   
    @mapTo(Date)
    mapToDate(mapTo) {
        const date = mapTo.value;
        return instanceOf(date, Date) ? date : Date.parse(date);
    },
    @mapTo(RegExp)
    mapToRegExp(mapTo) {
        const pattern   = mapTo.value,
              fragments = pattern.match(/\/(.*?)\/([gimy])?$/);              
        return new RegExp(fragments[1], fragments[2] || "")
    },
    @mapTo(Array)
    mapToArray(mapTo, composer) {
        const array   = mapTo.value,
              format  = mapTo.format,
              options = mapTo.options,
              mapper  = Mapper(composer);
        let type = mapTo.classOrInstance;
        type = Array.isArray(type) ? type[0] : undefined;
        return array.map(elem => mapper.mapTo(elem, format, type, options)); 
    },        
    mapTo(mapTo, composer) {
        const value = mapTo.value;
        if (!_canMapJson(value)) { return; }
        if (this.isPrimitiveValue(value)) { return value; }
        const classOrInstance = mapTo.classOrInstance;
        if ($isNothing(classOrInstance)) { return; }
        const format  = mapTo.format,
              options = mapTo.options,
              object  = $isFunction(classOrInstance)
                      ? Reflect.construct(classOrInstance, emptyArray)
                      : classOrInstance;
        const dynamic     = options && options.dynamic,
              ignoreCase  = options && options.ignoreCase,
              mapper      = Mapper(composer),
              descriptors = getPropertyDescriptors(object);
        Reflect.ownKeys(descriptors).forEach(key => {
            const descriptor = descriptors[key];
            if (this.canSetProperty(descriptor)) {
                const map = mapping.get(object, key);
                if (map && map.root) {
                    object[key] = _mapFromJson(object, key, value, mapper, format, options);
                }
            }
        });
        for (let key in value) {
            const descriptor = descriptors[key];
            let   map        = mapping.get(object, key);
            if (map && (map.root || map.ignore)) {
                continue;  // ignore or already rooted
            }
            const keyValue = value[key];
            if (keyValue === undefined) { continue; }
            if (descriptor) {
                if (this.canSetProperty(descriptor)) {
                    object[key] = _mapFromJson(object, key, keyValue, mapper, format, options);
                }
            } else {
                const lkey  = key.toLowerCase();
                let   found = false;
                for (let k in descriptors) {
                    if (k.toLowerCase() === lkey) {
                        if (this.canSetProperty(descriptors[k])) {                        
                            object[k] = _mapFromJson(object, k, keyValue, mapper, format, options);
                        }
                        found = true;
                        break;
                    }
                }
                if (!found && dynamic) {
                    object[key] = keyValue;
                }
            }
        }
        return object;
    }
});

function _canMapJson(value) {
    return value !== undefined && !$isFunction(value) && !$isSymbol(value);
}

function _mapFromJson(target, key, value, mapper, format, options) {
    const type = design.get(target, key);
    return mapper.mapTo(value, format, type, options);
}
