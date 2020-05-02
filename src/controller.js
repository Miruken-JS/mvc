import {
    Base, Protocol, DisposingMixin
} from "miruken-core";

import { Handler } from "miruken-callback";
import { contextual } from "miruken-context";
import { ViewRegion } from "./view";

const globalPrepare = [],
      globalExecute = [];

/**
 * Captures a navigation context.
 * @class Navigation
 * @extends Base
 */        
export const Navigation = Base.extend({
    push:       undefined,
    controller: undefined,
    action:     undefined,
    args:       undefined
});

/**
 * Base class for controllers.
 * @class Controller
 * @constructor
 * @extends Handler
 * @uses contextual
 * @uses DisposingMixin
 */
export const Controller = Handler.extend(
    contextual, DisposingMixin, {
        
    get ifValid() {
        return this.io.$validAsync(this);
    },

    show(handler, view) {
        return handler instanceof Handler
             ? ViewRegion(handler).show(view)
             : ViewRegion(io).show(handler);
    },
    next(controller, handler) {
        const io = handler || this.io || this.context;            
        return createTrampoline(controller, io, "next");
    },
    push(controller, handler) {
        const io = handler || this.io || this.context;
        return createTrampoline(controller, io, "push");
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
}, {
   coerce(source) {
       const controller = this;
       return {
           get next() {
               return _createTrampoline(controller, source, "next");
           },
           get push() {
               return _createTrampoline(controller, source, "push");
           }
       };
   },
    get prepare() { return globalPrepare; },
    get execute() { return globalExecute; }        
});

const TRAMPOLINE_IGNORE = [ "base", "constructor", "initialize", "dispose" ];

function _createTrampoline(controller, source, style) {
    if (!(controller.prototype instanceof Controller)) {
        throw new TypeError(`${controller} is not a Controller`);
    }        
    let trampoline = {},
        navigate   = Navigate(source),
        obj        = controller.prototype;
    const action = navigate[style];
    do {
        Reflect.ownKeys(obj).forEach(key => {
            if (TRAMPOLINE_IGNORE.includes(key) ||
                key.lastIndexOf("_", 0) === 0   ||
                Reflect.has(trampoline, key)) { return; }
            const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
            if (descriptor == null || !$isFunction(descriptor.value)) {
                return;
            }
            trampoline[key] = function (...args) {
                return action.call(navigate, controller, ctrl =>
                    ctrl[key].apply(ctrl, args), (io, ctrl) =>
                    io.$$provide([Navigation, new Navigation({
                        push:       style === "push",
                        controller: ctrl,
                        action:     key,
                        args
                    })])
                );
            };
        });
    } while (obj = Object.getPrototypeOf(obj) && obj instanceof Controller);
    return trampoline;
}

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

function _bindIO(io, controller) {
    io = _assemble(io || controller.context, globalPrepare, controller);
    if (io == null) {
        Reflect.deleteProperty(controller, "io");
        return;
    }
    if (globalExecute.length === 0) {
        controller.io = io;
        return;
    }
    const executor = controller.io = io.decorate({
        toDelegate: function () {
            const ex = _assemble(this, globalExecute, controller);
            Reflect.deleteProperty(executor, "toDelegate");
            return ex.toDelegate();
        }
    });
}

function _assemble(handler, builders, context) {
    return handler && builders
         ?  builders.reduce((result, builder) =>
                $isFunction(builder)
                    ? builder.call(context, result) || result
                    : result, handler)
         : handler;
}
    
function _validate(target, method, scope) {
    const context = this.context;
    if (!context) {
        throw new Error("Validation requires a context to be available.");
    }
    return context[method].call(context, target || this, scope);
}
