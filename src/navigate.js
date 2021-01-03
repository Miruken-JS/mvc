import {
    Base, Protocol, Handler, CompositeHandler,
    Errors, contextual
} from "@miruken/core";

import {
    Validator, Validating
} from "@miruken/validate";

import {
    Navigation, Controller, ControllerNotFound
} from "./controller";

const globalPrepare = [],
      globalExecute = [];

/**
 * Protocol to navigate controllers.
 * @class Navigate
 * @extends Protocol
 */
export const Navigate = Protocol.extend({
    /**
     * Transitions to next `action` on `controller`.
     * @method next
     * @param   {Any}       controller     -  controller key
     * @param   {Function}  action         -  controller action
     * @param   {Function}  [configureIO]  -  configures io
     * @returns {Promise} promise when transition complete.
     */        
    next(controller, action, configureIO) {},
    /**
     * Transitions to next `action` on `controller` in a new context.
     * @method to
     * @param   {Any}       controller     -  controller key
     * @param   {Function}  action         -  controller action
     * @param   {Function}  [configureIO]  -  configures io
     * @returns {Promise} promise when transition complete.
     */        
    push(controller, action, configureIO) {}        
});

/**
 * Default navigation implementation.
 * @class NavigateHandler
 * @constructor
 * @extends CompositeHandler
 * @uses Navigate
 */    
export const NavigateHandler = CompositeHandler.extend(Navigate, {
    next(controller, action, configureIO) {
        return this.to(controller, action, false, configureIO);
    },
    push(controller, action, configureIO) {
        return this.to(controller, action, true, configureIO);
    },        
    to(controller, action, push, configureIO) {
        if (action == null) {
            return Promise.reject(new Error("Missing action"));
        };
        
        let composer  = $composer,
            context   = composer.resolve(Context),
            initiator = composer.resolve(Controller),
            ctx       = push ? context.newChild() : context;

        if (!push && initiator != null && (initiator.context == ctx)) {
            initiator.context = null;
        }
        
        return Promise.resolve(ctx.resolve(controller))
            .then(function (ctrl) {
                if (!ctrl) {
                    return Promise.reject(new ControllerNotFound(controller));
                }
                try {
                    if (push) {
                        composer = composer.pushLayer();
                    }
                    let io = ctx === context ? composer
                           : ctx.$self().$chain(composer);
                    if ($isFunction(configureIO)) {
                        io = configureIO(io, ctrl) || io;
                    }
                    _bindIO(io, ctrl);                        
                    return action(ctrl);
                } catch (exception) {
                    return Errors(ctrl.io).handleException(exception);
                } finally {
                    _bindIO(null, ctrl);
                }
            });
    }
});
