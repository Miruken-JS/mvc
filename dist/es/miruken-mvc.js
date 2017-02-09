import { Handler } from 'miruken-callback';
import { Validating, Validator } from 'miruken-validate';
import { contextual } from 'miruken-context';
import { Base, Disposing, Policy, Protocol } from 'miruken-core';

var Controller = Handler.extend(contextual, Validating, {
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
    var validator = Validator(context);
    return validator[method].call(validator, target || controller, scope);
}

var MasterDetail = Protocol.extend({
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

var MasterDetailAware = Protocol.extend({
  masterChanged: function masterChanged(master) {},
  detailSelected: function detailSelected(detail, master) {},
  detailUnselected: function detailUnselected(detail, master) {},
  detailAdded: function detailAdded(detail, master) {},
  detailUpdated: function detailUpdated(detail, master) {},
  detailRemoved: function detailRemoved(detail, master) {}
});

var ViewLayer = Protocol.extend(Disposing, {
  get index() {}
});

var ViewRegion = Protocol.extend({
  show: function show(view) {}
});

var ViewRegionAware = Protocol.extend({
  viewRegionCreated: function viewRegionCreated(viewRegion) {}
});

var PresentationPolicy = Policy.extend();

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

var ButtonClicked = Base.extend({
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

Handler.registerPolicy(PresentationPolicy, "presenting");

Handler.implement({
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

export { Controller, MasterDetail, MasterDetailAware, ViewLayer, ViewRegion, ViewRegionAware, PresentationPolicy, ModalPolicy, RegionPolicy, ButtonClicked, ModalProviding };
