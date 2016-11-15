'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModalProviding = exports.ModalPolicy = exports.Controller = exports.MasterDetailAware = exports.MasterDetail = exports.ButtonClicked = exports.PresentationPolicy = exports.ViewRegionAware = exports.ViewRegion = undefined;

var _mirukenCore = require('miruken-core');

var _mirukenCallback = require('miruken-callback');

var _mirukenValidate = require('miruken-validate');

var _mirukenContext = require('miruken-context');

var ViewRegion = exports.ViewRegion = _mirukenCore.StrictProtocol.extend({
  get name() {},

  get context() {},

  get container() {},

  get controller() {},

  get controllerContext() {},
  present: function present(presentation) {}
});

var ViewRegionAware = exports.ViewRegionAware = _mirukenCore.Protocol.extend({
  viewRegionCreated: function viewRegionCreated(viewRegion) {}
});

var PresentationPolicy = exports.PresentationPolicy = _mirukenCore.Policy.extend();

var ButtonClicked = exports.ButtonClicked = _mirukenCore.Base.extend({
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

_mirukenCallback.Handler.registerPolicy(PresentationPolicy, "presenting");

var MasterDetail = exports.MasterDetail = _mirukenCore.Protocol.extend({
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

var MasterDetailAware = exports.MasterDetailAware = _mirukenCore.Protocol.extend({
  masterChanged: function masterChanged(master) {},
  detailSelected: function detailSelected(detail, master) {},
  detailUnselected: function detailUnselected(detail, master) {},
  detailAdded: function detailAdded(detail, master) {},
  detailUpdated: function detailUpdated(detail, master) {},
  detailRemoved: function detailRemoved(detail, master) {}
});

var Controller = exports.Controller = _mirukenCallback.Handler.extend(_mirukenContext.contextual, _mirukenValidate.Validating, {
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
  var validator = (0, _mirukenValidate.Validator)(context);
  return validator[method].call(validator, target || controller, scope);
}

var ModalPolicy = exports.ModalPolicy = PresentationPolicy.extend({
  title: "",
  style: null,
  chrome: true,
  header: false,
  footer: false,
  forceClose: false,
  buttons: null
});

var ModalProviding = exports.ModalProviding = _mirukenCore.StrictProtocol.extend({
  showModal: function showModal(container, content, policy, context) {}
});

_mirukenCallback.Handler.implement({
  modal: function modal(options) {
    return this.presenting(new ModalPolicy(options));
  }
});