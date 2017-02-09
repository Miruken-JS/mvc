'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mirukenCallback = require('miruken-callback');
var mirukenValidate = require('miruken-validate');
var mirukenContext = require('miruken-context');
var mirukenCore = require('miruken-core');

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

var ViewLayer = mirukenCore.Protocol.extend(mirukenCore.Disposing, {
  get index() {}
});

var ViewRegion = mirukenCore.Protocol.extend({
  show: function show(view) {}
});

var ViewRegionAware = mirukenCore.Protocol.extend({
  viewRegionCreated: function viewRegionCreated(viewRegion) {}
});

var PresentationPolicy = mirukenCore.Policy.extend();

var ModalPolicy = PresentationPolicy.extend({
  title: "",
  style: null,
  chrome: true,
  header: false,
  footer: false,
  forceClose: false,
  buttons: null
});

var RegionPolicy = PresentationPolicy.extend({
  tag: undefined,
  push: false,
  modal: undefined
});

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

var ModalProviding = StrictProtocol.extend({
  showModal: function showModal(container, content, policy, context) {}
});

mirukenCallback.Handler.registerPolicy(PresentationPolicy, "presenting");

mirukenCallback.Handler.implement({
  region: function region(tag) {
    return this.presenting(new RegionPolicy({ tag: tag }));
  },
  pushLayer: function pushLayer() {
    return this.presenting(new RegionPolicy({ push: true }));
  },
  modal: function modal(_modal) {
    return this.presenting(new RegionPolicy({
      modal: new ModalPolicy(_modal)
    }));
  }
});

exports.Controller = Controller;
exports.MasterDetail = MasterDetail;
exports.MasterDetailAware = MasterDetailAware;
exports.ViewLayer = ViewLayer;
exports.ViewRegion = ViewRegion;
exports.ViewRegionAware = ViewRegionAware;
exports.PresentationPolicy = PresentationPolicy;
exports.ModalPolicy = ModalPolicy;
exports.RegionPolicy = RegionPolicy;
exports.ButtonClicked = ButtonClicked;
exports.ModalProviding = ModalProviding;
