import {
    design, instanceOf, $isNothing,
    $isFunction, $isSymbol, $isPlainObject,
    getPropertyDescriptors, emptyArray
} from "miruken-core";

import { mapping } from "./mapping";
import { Mapper, AbstractMapping } from "./mapper";
import { mapFrom, mapTo, format } from "./decorators";

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
