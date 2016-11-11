import {
    Variance, Metadata, decorate,
    $flatten, $equals, isDescriptor
} from "miruken-core";

import { $define, addDefinition } from "miruken-callback";

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
