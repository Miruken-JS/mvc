import {
    Base, Protocol, StrictProtocol, Variance,
    $isNothing, $isFunction, $classOf
} from "miruken-core";

import {
    Handler, $define, $handle, $composer
} from "miruken-callback";

/**
 * Map to definition group.
 * @property {Function} $mapTo
 */
export const $mapTo = $define(Variance.Contravariant);

/**
 * Map from definition group.
 * @property {Function} $mapFrom
 */
export const $mapFrom = $define(Variance.Covariant);

/**
 * Protocol for mapping objects.
 * @class Mapping
 * @extends Protocol
 */        
export const Mapping = Protocol.extend({
    /**
     * Maps the `object` to a value in `format`.
     * @method mapTo 
     * @param   {Object}  object   -  object to map
     * @param   {Any}     format   -  format specifier
     * @param   {Object}  options  -  mapping options
     * @returns {Any}  mapped value.
     */
    mapTo(object, format, options) {},
    /**
     * Maps the formatted `value` in `format` to `classOrInstance`.
     * @method mapTo 
     * @param   {Any}  value       -  formatted value
     * @param   {Any}  format      -  format specifier
     * @param   {Function|Object}  -  instance or class to unmap
     * @param   {Object}  options  -  mapping options
     * @return  {Object}  unmapped instance. 
     */    
    mapFrom(value, format, classOrInstance, options) {}
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
export const MapTo = MapCallback.extend({
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
export const MapFrom = MapCallback.extend({
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
    mapTo(object, format, options) {
        if ($isNothing(object)) {
            throw new TypeError("Missing object to map.");
        }
        const mapTo = new MapTo(object, format, options);
        if ($composer.handle(mapTo)) {
            return mapTo.mapping;
        }
    },
    mapFrom(value, format, classOrInstance, options) {
        if ($isNothing(value)) {
            throw new TypeError("Missing value to map from.");
        }
        const mapFrom = new MapFrom(value, format, classOrInstance, options);
        if ($composer.handle(mapFrom)) {
            return mapFrom.mapping;
        }
    }    
});

$handle(Handler.prototype, MapTo, function (mapTo, composer) {
    const target = mapTo.object,
          source = $classOf(target);
    if ($isNothing(source)) { return false; }
    return $mapTo.dispatch(this, mapTo, source, composer, false, m => mapTo.mapping = m);
});

$handle(Handler.prototype, MapFrom, function (mapFrom, composer) {
    const classOrInstance = mapFrom.classOrInstance,
          source          = $isFunction(classOrInstance)
                          ? classOrInstance
                          : $classOf(classOrInstance);
    if ($isNothing(source)) { return false; }
    return $mapFrom.dispatch(this, mapFrom, source, composer, false, m => mapFrom.mapping = m);
});
