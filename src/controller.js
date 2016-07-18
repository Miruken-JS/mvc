import { Protocol } from 'miruken-core';
import { CallbackHandler } from 'miruken-callback';
import { $contextual } from 'miruken-context';

import {
    Validator, Validating, $validateThat
} from 'miruken-validate';

/**
 * Base class for controllers.
 * @class Controller
 * @constructor
 * @extends miruken.callback.CallbackHandler
 * @uses miruken.context.$contextual
 * @uses miruken.validate.$validateThat
 * @uses miruken.validate.Validating
 */
export const Controller = CallbackHandler.extend(
    $contextual, $validateThat, Validating, {
        validate(target, scope) {
            return _validateController(this, target, 'validate', scope);
        },
        validateAsync(target, scope) {
            return _validateController(this, target, 'validateAsync', scope);
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

/**
 * Protocol for managing master-detail relationships.
 * @class MasterDetail
 * @extends miruken.Protocol     
 */    
export const MasterDetail = Protocol.extend({
    /**
     * Gets the selected detail.
     * @method getSelectedDetail
     * @param   {Function} detailClass  -  type of detail
     * @returns {Object} selected detail.  Could be a Promise.
     */
    getSelectedDetail(detailClass) {},
    /**
     * Gets the selected details.
     * @method getSelectedDetails
     * @param   {Function} detailClass  -  type of detail
     * @returns {Object}  selected details.  Could be a Promise.
     */
    getSelectedDetails(detailClass) {},
    /**
     * Selects the detail
     * @method selectDetail
     * @param   {Object} detail  -  selected detail
     */
    selectDetail(detail) {},
    /**
     * Unselects the detail
     * @method deselectDetail
     * @param   {Object} detail  -  unselected detail
     */
    deselectDetail(detail) {},
    /**
     * Determines if a previous detail exists.
     * @method hasPreviousDetail
     * @param   {Function} detailClass  -  type of detail
     * @returns {boolean} true if a previous detail exists.
     */
    hasPreviousDetail(detailClass) {},
    /**
     * Determines if a next detail exists.
     * @method hasNextDetail.
     * @param   {Function} detailClass  -  type of detail
     * @returns {boolean} true if a next detail exists.
     */
    hasNextDetail(detailClass) {},
    /**
     * Gets the previous detail.
     * @method getPreviousDetail
     * @param   {Function} detailClass  -  type of detail
     * @returns {Object}  previous detail or undefined..
     */
    getPreviousDetail(detailClass) {},
    /**
     * Gets the next detail.
     * @method getNextDetail
     * @param   {Function} detailClass  -  type of detail
     * @returns {Object}  next detail or undefined.
     */
    getNextDetail(detailClass) {},
    /**
     * Adds the detail to the master.
     * @method addDetail
     * @param   {Object} detail  -  added detail
     */
    addDetail(detail) {},
    /**
     * Updates the detail in the master.
     * @method updateDetail
     * @param   {Object} detail  -  updated detail
     */
    updateDetail(detail) {},
    /**
     * Removes the detail from the master.
     * @method removeDetail
     * @param   {Object}  detail   -  removed detail
     * @param   {boolean} deleteIt -  true to delete it
     */
    removeDetail(detail, deleteIt) {}
});

/**
 * Protocol for receiving master-detail notifications.
 * @class MasterDetailAware
 * @extends miruken.Protocol     
 */    
export const MasterDetailAware = Protocol.extend({
    /**
     * Informs the master has changed.
     * @method masterChanged
     * @param  {Object}  master  -  master
     */
    masterChanged(master) {},
    /**
     * Informs a detail was selected.
     * @method detailSelected
     * @param  {Object}  detail  -  selected detail
     * @param  {Object}  master  -  master
     */
    detailSelected(detail, master) {},
    /**
     * Informs a detail was unselected.
     * @method detailUnselected
     * @param  {Object} detail  -  unselected detail
     * @param  {Object} master  -  master
     */
    detailUnselected(detail, master) {},
    /**
     * Informs a detail was added to the master.
     * @method detailAdded
     * @param  {Object} detail  -  added detail
     * @param  {Object} master  -  master
     */
    detailAdded(detail, master) {},
    /**
     * Informs a detail was updated in the master.
     * @method detailUpdated
     * @param  {Object} detail  -  updated detail
     * @param  {Object} master  -  master
     */
    detailUpdated(detail, master) {},
    /**
     * Informs a detail was removed from the master.
     * @method detailRemoved
     * @param  {Object} detail  -  removed detail
     * @param  {Object} master  -  master
     */
    detailRemoved(detail, master) {}
});
