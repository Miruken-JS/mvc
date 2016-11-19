(function (exports,mirukenCallback,mirukenValidate,mirukenContext,mirukenCore) {
'use strict';

var Controller = mirukenCallback.Handler.extend(mirukenContext.contextual, mirukenValidate.Validating, {
    validate: function validate(target, scope) {
        return _validateController(this, target, "validate", scope);
    },
    validateAsync: function validateAsync(target, scope) {
        return _validateController(this, target, "validateAsync", scope);
    }
});

function _validateController(controller, target, method, scope) {
    var context = controller.context;
    if (!context) {
        throw new Error("Validation requires a context to be available.");
    }
    var validator = mirukenValidate.Validator(context);
    return validator[method].call(validator, target || controller, scope);
}

var MasterDetail = mirukenCore.Protocol.extend({
  getSelectedDetail: function getSelectedDetail(detailClass) {},
  getSelectedDetails: function getSelectedDetails(detailClass) {},
  selectDetail: function selectDetail(detail) {},
  deselectDetail: function deselectDetail(detail) {},
  hasPreviousDetail: function hasPreviousDetail(detailClass) {},
  hasNextDetail: function hasNextDetail(detailClass) {},
  getPreviousDetail: function getPreviousDetail(detailClass) {},
  getNextDetail: function getNextDetail(detailClass) {},
  addDetail: function addDetail(detail) {},
  updateDetail: function updateDetail(detail) {},
  removeDetail: function removeDetail(detail, deleteIt) {}
});

var MasterDetailAware = mirukenCore.Protocol.extend({
  masterChanged: function masterChanged(master) {},
  detailSelected: function detailSelected(detail, master) {},
  detailUnselected: function detailUnselected(detail, master) {},
  detailAdded: function detailAdded(detail, master) {},
  detailUpdated: function detailUpdated(detail, master) {},
  detailRemoved: function detailRemoved(detail, master) {}
});

var ViewRegion = mirukenCore.StrictProtocol.extend({
  get name() {},

  get context() {},

  get container() {},

  get controller() {},

  get controllerContext() {},
  present: function present(presentation) {}
});

var ViewRegionAware = mirukenCore.Protocol.extend({
  viewRegionCreated: function viewRegionCreated(viewRegion) {}
});

var PresentationPolicy = mirukenCore.Policy.extend();

var ButtonClicked = mirukenCore.Base.extend({
  constructor: function constructor(button, buttonIndex) {
    this.extend({
      get button() {
        return button;
      },

      get buttonIndex() {
        return buttonIndex;
      }
    });
  }
});

mirukenCallback.Handler.registerPolicy(PresentationPolicy, "presenting");

var ModalPolicy = PresentationPolicy.extend({
  title: "",
  style: null,
  chrome: true,
  header: false,
  footer: false,
  forceClose: false,
  buttons: null
});

var ModalProviding = mirukenCore.StrictProtocol.extend({
  showModal: function showModal(container, content, policy, context) {}
});

mirukenCallback.Handler.implement({
  modal: function modal(options) {
    return this.presenting(new ModalPolicy(options));
  }
});

exports.Controller = Controller;
exports.MasterDetail = MasterDetail;
exports.MasterDetailAware = MasterDetailAware;
exports.ModalPolicy = ModalPolicy;
exports.ModalProviding = ModalProviding;
exports.ViewRegion = ViewRegion;
exports.ViewRegionAware = ViewRegionAware;
exports.PresentationPolicy = PresentationPolicy;
exports.ButtonClicked = ButtonClicked;

}((this.miruken-mvc = this.miruken-mvc || {}),mirukenCallback,mirukenValidate,mirukenContext,mirukenCore));
