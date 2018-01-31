import {
    Base, Protocol, DisposingMixin
} from "miruken-core";
import { Handler } from "miruken-callback";
import { Validator, Validating } from "miruken-validate";
import { contextual } from "miruken-context";

const globalPrepare = [],
      globalExecute = [];

/**
 * Base class for controllers.
 * @class Controller
 * @constructor
 * @extends Handler
 * @uses contextual
 * @uses Validating
 * @uses DisposingMixin
 */
export const Controller = Handler.extend(
    contextual, Validating, DisposingMixin, {
    get ifValid() {
        return this.io.$validAsync(this);
    },        
    validate(target, scope) {
        return _validate.call(this, target, "validate", scope);
    },
    validateAsync(target, scope) {
        return _validate.call(this, target, "validateAsync", scope);
    },
    _dispose() {
        this.context = null;
        Reflect.deleteProperty(this, "io");
    }        
});

/**
 * Represents the failure to resolve a `controller`.
 * @class ControllerNotFound
 * @constructor
 * @param  {Any}  controller  -  controller key
 * @extends Error
 */    
export function ControllerNotFound(controller) {
    this.message    = `The controller '${controller}' could not be resolved`;
    this.controller = controller;
    
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        Error.call(this);
    }
}
ControllerNotFound.prototype             = new Error;
ControllerNotFound.prototype.constructor = ControllerNotFound;

function _validate(target, method, scope) {
    const context = this.context;
    if (!context) {
        throw new Error("Validation requires a context to be available.");
    }
    const validator = Validator(context);
    return validator[method].call(validator, target || this, scope);
}
