import {
    Base, Protocol, StrictProtocol,typeOf,
    $isNothing, $isFunction, $classOf
} from "miruken-core";

import {
    Handler, $handle, $composer, $unhandled
} from "miruken-callback";

import {
    mapFrom, mapTo, $mapFrom, $mapTo
} from "./decorators";

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
