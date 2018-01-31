import {
    Base, Protocol
} from "miruken-core";

import {
    Handler, CompositeHandler
} from "miruken-callback";

import {
    Validator, Validating
} from "miruken-validate";

import { contextual } from "miruken-context";

import {
    Controller, ControllerNotFound
} from "./controller";

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
 * Protocol to navigate controllers.
 * @class Navigate
 * @extends Protocol
 */
export const Navigate = Protocol.extend({
    /**
     * Transitions to next `action` on `controller`.
     * @method next
     * @param   {Any}       controller  -  controller key
     * @param   {Function}  action      -  controller action
     * @returns {Promise} promise when transition complete.
     */        
    next(controller, action) {},
    /**
     * Transitions to next `action` on `controller` in a new context.
     * @method to
     * @param   {Any}       controller  -  controller key
     * @param   {Function}  action      -  controller action
     * @returns {Promise} promise when transition complete.
     */        
    push(controller, action) {}        
});

/**
 * Default navigation implementation.
 * @class NavigateHandler
 * @constructor
 * @extends CompositeHandler
 * @uses Navigate
 */    
export const NavigateHandler = CompositeHandler.extend(Navigate, {
    next(controller, action) {
        return this.to(controller, action, false);
    },
    push(controller, action) {
        return this.to(controller, action, true);            
    },        
    to(controller, action, push) {
        if (action == null) {
            return Promise.reject(new Error("Missing action"));
        };
        
        var composer  = $composer,
            context   = composer.resolve(Context),
            initiator = composer.resolve(Controller),
            ctx       = push ? context.newChild() : context;

        var oldIO = Controller.io;
        return Promise.resolve(ctx.resolve(controller))
            .then(function (ctrl) {
                if (!ctrl) {
                    return Promise.reject(new ControllerNotFound(controller));
                }
                try {
                    if (push) {
                        composer = composer.pushLayer();
                    } else if ((ctrl != initiator) && (initiator != null) &&
                               (initiator.context == ctx)) {
                        initiator.context = null;
                    }
                    Controller.io = ctx === context ? composer
                                  : ctx.$self().next(composer);
                    return action(ctrl);
                } finally {
                    if (oldIO) {
                        Controller.io = oldIO;
                    } else {
                        Reflect.deleteProperty(Controller, "io");
                    }
                }
            });
    }
});
