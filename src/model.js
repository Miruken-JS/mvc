import {
    Base, Metadata, $isNothing, $isFunction,
    $isObject, $inferProperties
} from 'miruken-core';

import { $validateThat } from 'miruken-validate';

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
