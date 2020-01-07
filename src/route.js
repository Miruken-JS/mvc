import {
    Base, Protocol, StrictProtocol
} from "miruken-core";

import { ControllerNotFound } from "./controller";
import { Navigate } from "./navigate";

/**
 * Route definition.
 * @class Route
 * @extends Base
 */    
export const Route = Base.extend({
    name:    undefined,
    pattern: undefined,
    params:  undefined
});
    
/**
 * Protocol for routing.
 * @class Routing
 * @extends Protocol
 */
export const Routing = StrictProtocol.extend({
    /**
     * Handles to the specified `route`.
     * @method handleRoute
     * @param    {Route}  route  -  route
     * @returns  {Promise} promise.
     */
    handleRoute(route) {},
    /**
     * Follows the route matching `navigation`.
     * @method followNavigation
     * @param    {Navigation}  navigation  -  navigation
     */
    followNavigation(navigation) {}
});

const controllerKeyRegExp = /(.*)controller$/i;

/**
 * Base class for routing.
 * @class Router
 * @constructor
 * @extends Base
 * @uses Routing
 */    
export const Router = Base.extend(Routing, {
    handleRoute(route) {
        const { name, params } = route;
        try {
            if (params == null) {
                throw new Error(
                    `Missing params route '${name}'`);
            }
            if (params.controller == null) {
                throw new Error(
                    `Missing controller for route '${name}'`);
            }
            this.validateRoute(route);
        } catch (ex) {
            return _rejectRoute.call(this, route, ex);
        }
        const composer = global.$composer,
              navigate = Navigate(composer),
              action   = params.action || (params.action = "index"),
              execute  = ctrl => {
                const property = this.selectActionMethod(ctrl, action),
                      method   = property && ctrl[property];
                return $isFunction(method) ? method.call(ctrl, params)
                     : Promise.reject(new Error(
                         `${ctrl} missing action '${action}' for route '${name}'`));
              },
              controllerKey = this.expandControllerKey(controller);
        return navigate.next(controllerKey, execute)
            .catch(err => {
                if ((err instanceof ControllerNotFound) &&
                    (controllerKey !== controller)) {
                    return navigate.next(controller, execute)
                        .catch(err => _rejectRoute.call(this, route, err));
                }
                return _rejectRoute.call(this, route, err);
            });
    },
    validateRoute(route) {},
    rejectRoute(route, error) {
        return Promise.reject(error);
    },
    extractControllerKey(controller) {
        const matches = controller.match && controller.match(controllerKeyRegExp);
        return matches ? matches[1].toLowerCase() : controller;
    },
    expandControllerKey(controller) {
        return controller.match && !controller.match(controllerKeyRegExp)
            ? controller + "Controller"
            : controller;
    },
    selectActionMethod(controller, action) {
        if (Reflect.has(controller, action)) { return action; }
        action = action.toLowerCase();
        for (const property in controller) {
            if (action === property.toLowerCase()) {
                return property;
            }
        }
    }
});

function _rejectRoute(route, error) {
    try {
        return Promise.resolve(this.rejectRoute(route, error));
    } catch (err) {
        return Promise.reject(err);
    }
}
