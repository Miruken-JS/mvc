'use strict';

System.register(['miruken-core', 'miruken-callback', 'miruken-validate', 'miruken-context'], function (_export, _context) {
  "use strict";

  var Base, Protocol, StrictProtocol, Policy, Handler, handle, Validator, Validating, contextual, ViewRegion, ViewRegionAware, PresentationPolicy, ButtonClicked, MasterDetail, MasterDetailAware, Controller, ModalPolicy, ModalProviding;


  function _validateController(controller, target, method, scope) {
    var context = controller.context;
    if (!context) {
      throw new Error("Validation requires a context to be available.");
    }
    var validator = Validator(context);
    return validator[method].call(validator, target || controller, scope);
  }

  return {
    setters: [function (_mirukenCore) {
      Base = _mirukenCore.Base;
      Protocol = _mirukenCore.Protocol;
      StrictProtocol = _mirukenCore.StrictProtocol;
      Policy = _mirukenCore.Policy;
    }, function (_mirukenCallback) {
      Handler = _mirukenCallback.Handler;
      handle = _mirukenCallback.handle;
    }, function (_mirukenValidate) {
      Validator = _mirukenValidate.Validator;
      Validating = _mirukenValidate.Validating;
    }, function (_mirukenContext) {
      contextual = _mirukenContext.contextual;
    }],
    execute: function () {
      _export('ViewRegion', ViewRegion = StrictProtocol.extend({
        get name() {},

        get context() {},

        get container() {},

        get controller() {},

        get controllerContext() {},
        present: function present(presentation) {}
      }));

      _export('ViewRegion', ViewRegion);

      _export('ViewRegionAware', ViewRegionAware = Protocol.extend({
        viewRegionCreated: function viewRegionCreated(viewRegion) {}
      }));

      _export('ViewRegionAware', ViewRegionAware);

      _export('PresentationPolicy', PresentationPolicy = Policy.extend());

      _export('PresentationPolicy', PresentationPolicy);

      _export('ButtonClicked', ButtonClicked = Base.extend({
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
      }));

      _export('ButtonClicked', ButtonClicked);

      Handler.registerPolicy(PresentationPolicy, "presenting");

      _export('MasterDetail', MasterDetail = Protocol.extend({
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
      }));

      _export('MasterDetail', MasterDetail);

      _export('MasterDetailAware', MasterDetailAware = Protocol.extend({
        masterChanged: function masterChanged(master) {},
        detailSelected: function detailSelected(detail, master) {},
        detailUnselected: function detailUnselected(detail, master) {},
        detailAdded: function detailAdded(detail, master) {},
        detailUpdated: function detailUpdated(detail, master) {},
        detailRemoved: function detailRemoved(detail, master) {}
      }));

      _export('MasterDetailAware', MasterDetailAware);

      _export('Controller', Controller = Handler.extend(contextual, Validating, {
        validate: function validate(target, scope) {
          return _validateController(this, target, "validate", scope);
        },
        validateAsync: function validateAsync(target, scope) {
          return _validateController(this, target, "validateAsync", scope);
        }
      }));

      _export('Controller', Controller);

      _export('ModalPolicy', ModalPolicy = PresentationPolicy.extend({
        title: "",
        style: null,
        chrome: true,
        header: false,
        footer: false,
        forceClose: false,
        buttons: null
      }));

      _export('ModalPolicy', ModalPolicy);

      _export('ModalProviding', ModalProviding = StrictProtocol.extend({
        showModal: function showModal(container, content, policy, context) {}
      }));

      _export('ModalProviding', ModalProviding);

      Handler.implement({
        modal: function modal(options) {
          return this.presenting(new ModalPolicy(options));
        }
      });
    }
  };
});