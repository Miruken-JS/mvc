import {
    Metadata, $isFunction, $isPlainObject, isDescriptor
} from "miruken-core";

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
