import {
    design, typeOf, instanceOf, $isNothing,
    $isFunction, $isSymbol, $isPlainObject,
    getPropertyDescriptors, emptyArray
} from "miruken-core";

import { Handler } from "miruken-callback";
import { mapping } from "./mapping";
import { Mapper } from "./mapper";
import { mapTo, mapFrom, format } from "./decorators";

/**
 * Javascript Object Notation
 * @property {Any} JsonFormat
 */
export const JsonFormat      = "json",
             JsonContentType = "application/json";

/**
 * Handler for performing mapping to javascript object.
 * @class JsonMapping
 * @extends Handler
 * @uses Mapper
 */
export const JsonMapping = Handler.extend(
    format(JsonFormat, JsonContentType), {
    @mapTo(Date)
    mapDateToJson(mapTo) {
        return mapTo.object.toJSON();
    },
    @mapTo(RegExp)
    mapRegExpToJson(mapTo) {
        return mapTo.object.toString();
    },
    @mapTo(Array)
    mapArrayToJson(mapTo, composer) {
        const array  = mapTo.object,
              mapper = Mapper(composer);
        return array.map(elem => mapper.mapTo(elem, mapTo.format, mapTo.options)); 
    },
    @mapTo
    mapToJson(mapTo, composer) {
        const object = mapTo.object;
        if (!_canMapJson(object)) { return; }
        if (_isJsonValue(object)) {
            return object && object.valueOf();
        }
        const format  = mapTo.format,
              options = mapTo.options,
              spec    = options && options.spec,
              raw     = $isPlainObject(object),
              all     = !$isPlainObject(spec);              
        if (raw || $isFunction(object.toJSON)) {
            const json = raw ? raw : object.toJSON();
            if (!all) {
                const j = {};
                for (let k in spec) j[k] = json[k];
                mapTo.mapping = j;
                return;
            }
            mapTo.mapping = json;
            return;
        }
        const descriptors = getPropertyDescriptors(object),
              mapper      = Mapper(composer),
              json        = {};
        Reflect.ownKeys(descriptors).forEach(key => {
            if (all || (key in spec)) {
                let keyValue = object[key];
                if (keyValue === undefined) {
                    return;
                }
                const map     = mapping.get(object, key),
                      keySpec = all ? spec : spec[key];
                if (!(all || keySpec) || (map && map.ignore)) {
                    return;
                }
                const keyOptions = keySpec ? Object.create(options, {
                    spec: { value: keySpec }
                }) : options;
                if (!_canMapJson(keyValue)) { return; }
                if (_isJsonValue(keyValue)) {
                    json[key] = keyValue && keyValue.valueOf();
                    return;
                }
                const keyJson = mapper.mapTo(keyValue, format, keyOptions);
                if (map && map.root) {
                    Object.assign(json, keyJson);
                } else {                 
                    json[key] = keyJson;
                }
            }
        });
        return json;
    },
   
    @mapFrom(Date)
    mapDateFromJson(mapFrom) {
        const date = mapFrom.value;
        return instanceOf(date, Date) ? date : Date.parse(date);
    },
    @mapFrom(RegExp)
    mapRegExpFromJson(mapFrom) {
        const pattern   = mapFrom.value,
              fragments = pattern.match(/\/(.*?)\/([gimy])?$/);              
        return new RegExp(fragments[1], fragments[2] || "")
    },
    @mapFrom(Array)
        mapArrayFromJson(mapFrom, composer) {
        const array  = mapTo.value,
              mapper = Mapper(composer);
        return array.map(elem => mapper.mapFrom(elem, mapFrom.format, mapFrom.options)); 
    },        
    @mapFrom
    mapFromJson(mapFrom, composer) {
        const value = mapFrom.value;
        if (!_canMapJson(value)) { return; }
        if (_isJsonValue(value)) { return value; }
        const classOrInstance = mapFrom.classOrInstance;
        if ($isNothing(classOrInstance)) { return; }
        const format  = mapFrom.format,
              options = mapFrom.options,
              object  = $isFunction(classOrInstance)
                      ? Reflect.construct(classOrInstance, emptyArray)
                      : classOrInstance;
        const dynamic     = options && options.dynamic,
              ignoreCase  = options && options.ignoreCase,
              mapper      = Mapper(composer),
              descriptors = getPropertyDescriptors(object);
        Reflect.ownKeys(descriptors).forEach(key => {
            const descriptor = descriptors[key];
            if (_isSettableProperty(descriptor)) {
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
                if (_isSettableProperty(descriptor)) {
                    object[key] = _mapFromJson(object, key, keyValue, mapper, format, options);
                }
            } else {
                const lkey  = key.toLowerCase();
                let   found = false;
                for (let k in descriptors) {
                    if (k.toLowerCase() === lkey) {
                        if (_isSettableProperty(descriptors[k])) {                        
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
    return value === undefined
        || !($isFunction(value) || $isSymbol(value));
}

function _isJsonValue(value) {
    switch (typeOf(value)) {
        case "null":
        case "number":
        case "string":
        case "boolean":        
            return true;
        case "undefined":
            return false;
    }
    return false;
}

function _mapFromJson(target, key, value, mapper, format, options) {
    let type = design.get(target, key);
    if ($isNothing(type)) { return value; };
    if (Array.isArray(type)) {
        type = type[0];
        if (!Array.isArray(value)) {
            value = [value];
        }
    }
    return mapper.mapFrom(value, format, type, options);
}

function _isSettableProperty(descriptor) {
    return !$isFunction(descriptor.value);
}
