import { Handler } from "miruken-callback";
import { Validator, Validating } from "miruken-validate";
import { contextual } from "miruken-context";

/**
 * Base class for controllers.
 * @class Controller
 * @constructor
 * @extends Handler
 * @uses contextual
 * @uses Validating
 */
export const Controller = Handler.extend(contextual, Validating, {
    validate(target, scope) {
        return _validateController(this, target, "validate", scope);
    },
    validateAsync(target, scope) {
        return _validateController(this, target, "validateAsync", scope);
    }
});

function _validateController(controller, target, method, scope) {
    const context = controller.context;
    if (!context) {
        throw new Error("Validation requires a context to be available.");
    }
    const validator = Validator(context);
    return validator[method].call(validator, target || controller, scope);
}
