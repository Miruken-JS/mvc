import { StrictProtocol } from "miruken-core";
import { Handler } from "miruken-callback";
import { PresentationPolicy } from "./view";

/**
 * Policy for describing modal presentation.
 * @class ModalPolicy
 * @extends PresentationPolicy
 */
export const ModalPolicy = PresentationPolicy.extend({
    title:      "",
    style:      null,
    chrome:     true,
    header:     false,
    footer:     false,
    forceClose: false,
    buttons:    null
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
     * @param   {Element}      container  -  element modal bound to
     * @param   {Element}      content    -  modal content element
     * @param   {ModalPolicy}  policy     -  modal policy options
     * @param   {Context}      context    -  modal context
     * @returns {Promise} promise representing the modal result.
     */
    showModal(container, content, policy, context) {}
});

Handler.implement({
    /**
     * Configures modal presentation options.
     * @method modal
     * @param {Object}  options  -  modal options
     * @returns {Handler} modal handler.
     * @for Handler
     */                                                                
    modal(options) {
        return this.presenting(new ModalPolicy(options));
    }
});
