import { StrictProtocol } from 'miruken-core';
import { CallbackHandler } from 'miruken-callback';
import { PresentationPolicy } from './view';

/**
 * Policy for describing modal presentation.
 * @class ModalPolicy
 * @extends miruken.mvc.PresentationPolicy
 */
export const ModalPolicy = PresentationPolicy.extend({
    $properties: {
        title:      '',
        style:      null,
        chrome:     true,
        header:     false,
        footer:     false,
        forceClose: false,
        buttons:    null
    }
});

/**
 * Protocol for interacting with a modal provider.
 * @class ModalProviding
 * @extends StrictProtocol
 */
export const ModalProviding = StrictProtocol.extend({
    /**
     * Presents the content in a modal dialog.
     * @method showModal
     * @param   {Element}                  container  -  element modal bound to
     * @param   {Element}                  content    -  modal content element
     * @param   {miruken.mvc.ModalPolicy}  policy     -  modal policy options
     * @param   {miruken.context.Context}  context    -  modal context
     * @returns {Promise} promise representing the modal result.
     */
    showModal(container, content, policy, context) {}
});

CallbackHandler.implement({
    /**
     * Configures modal presentation options.
     * @method modal
     * @param {Object}  options  -  modal options
     * @returns {miruken.callback.CallbackHandler} modal handler.
     * @for miruken.callback.CallbackHandler
     */                                                                
    modal(options) {
        return this.presenting(new ModalPolicy(options));
    }
});
