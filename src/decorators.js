import {
    Metadata, decorate, $flatten, $equals, isDescriptor
} from "miruken-core";

import { addDefinition } from "miruken-callback";
import { $mapTo, $mapFrom } from "./mapper";

const formatMetadataKey = Symbol();

/**
 * Map to decorator.
 * @method mapTo
 * @param {Array}  ...types  -  types to map
 */
export function mapTo(...args) {
    return decorate(addDefinition("mapTo", $mapTo, false, _filterFormat), args);
}

/**
 * Map from decorator.
 * @method mapFrom
 * @param {Array}  ...types  -  types to map
 */
export function mapFrom(...args) {
    return decorate(addDefinition("mapFrom", $mapFrom, false, _filterFormat), args);
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
