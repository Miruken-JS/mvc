'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModalProviding = exports.ModalPolicy = exports.ButtonClicked = exports.PresentationPolicy = exports.ViewRegionAware = exports.ViewRegion = exports.MasterDetailAware = exports.MasterDetail = exports.Controller = exports.Model = undefined;

var _mirukenCore = require('miruken-core');

var _mirukenValidate = require('miruken-validate');

var _mirukenCallback = require('miruken-callback');

var _mirukenContext = require('miruken-context');

var Model = exports.Model = _mirukenCore.Base.extend(_mirukenCore.$inferProperties, _mirukenValidate.$validateThat, {
    constructor: function constructor(data, options) {
        this.fromData(data, options);
    },
    fromData: function fromData(data, options) {
        if ((0, _mirukenCore.$isNothing)(data)) {
            return this;
        }
        var meta = (0, _mirukenCore.$meta)(this),
            descriptors = meta && meta.getDescriptor(),
            dynamic = options && options.dynamic;
        if (descriptors) {
            for (var key in descriptors) {
                var descriptor = descriptors[key];
                if (descriptor && descriptor.root && descriptor.map) {
                    this[key] = descriptor.map(data);
                }
            }
        }
        for (var _key in data) {
            var _descriptor = descriptors && descriptors[_key],
                mapper = _descriptor && _descriptor.map;
            if (mapper && _descriptor.root || _descriptor && _descriptor.ignore) {
                continue;
            }
            var value = data[_key];
            if (value === undefined) {
                continue;
            }
            if (_key in this) {
                this[_key] = Model.map(value, mapper, options);
            } else {
                var lkey = _key.toLowerCase();
                var found = false;
                for (var k in this) {
                    if (k.toLowerCase() === lkey) {
                        _descriptor = descriptors && descriptors[k];
                        mapper = _descriptor && _descriptor.map;
                        this[k] = Model.map(value, mapper, options);
                        found = true;
                        break;
                    }
                }
                if (!found && dynamic) {
                    this[_key] = value;
                }
            }
        }
        return this;
    },
    toData: function toData(spec, data) {
        var _this = this;

        data = data || {};
        var meta = (0, _mirukenCore.$meta)(this),
            descriptors = meta && meta.getDescriptor();
        if (descriptors) {
            var all = !(0, _mirukenCore.$isObject)(spec);
            for (var key in descriptors) {
                if (all || key in spec) {
                    var _ret = function () {
                        var keyValue = _this[key];
                        if (keyValue === undefined) {
                            return 'continue';
                        }
                        var descriptor = descriptors[key],
                            keySpec = all ? spec : spec[key];
                        if (!(all || keySpec) || descriptor.ignore) {
                            return 'continue';
                        }
                        if (descriptor.root) {
                            if (keyValue) {
                                if ((0, _mirukenCore.$isFunction)(keyValue.toData)) {
                                    keyValue.toData(keySpec, data);
                                } else if ((0, _mirukenCore.$isFunction)(keyValue.toJSON)) {
                                    var json = keyValue.toJSON();
                                    for (var k in json) {
                                        data[k] = json[k];
                                    }
                                }
                            }
                        } else if (Array.isArray(keyValue)) {
                            data[key] = keyValue.map(function (elem) {
                                if (elem) {
                                    if ((0, _mirukenCore.$isFunction)(elem.toData)) {
                                        return elem.toData(keySpec);
                                    } else if ((0, _mirukenCore.$isFunction)(elem.toJSON)) {
                                        return elem.toJSON();
                                    }
                                    return elem;
                                }
                            });
                        } else {
                            if (keyValue) {
                                if ((0, _mirukenCore.$isFunction)(keyValue.toData)) {
                                    keyValue = keyValue.toData(keySpec);
                                } else if ((0, _mirukenCore.$isFunction)(keyValue.toJSON)) {
                                    keyValue = keyValue.toJSON();
                                }
                            }
                            data[key] = keyValue;
                        }
                    }();

                    if (_ret === 'continue') continue;
                }
            }
        }
        return data;
    },
    toJSON: function toJSON() {
        return this.toData();
    },
    mergeInto: function mergeInto(model) {
        if (!(model instanceof this.constructor)) {
            return false;
        }
        var meta = (0, _mirukenCore.$meta)(this),
            descriptors = meta && meta.getDescriptor();
        for (var key in descriptors) {
            var keyValue = this[key];
            if (keyValue !== undefined && this.hasOwnProperty(key)) {
                var modelValue = model[key];
                if (modelValue === undefined || !model.hasOwnProperty(key)) {
                    model[key] = keyValue;
                } else if ((0, _mirukenCore.$isFunction)(keyValue.mergeInto)) {
                    keyValue.mergeInto(modelValue);
                }
            }
        }
        return true;
    }
}, {
    map: function map(value, mapper, options) {
        return Array.isArray(value) ? value.map(function (elem) {
            return Model.map(elem, mapper, options);
        }) : mapper ? mapper(value, options) : value;
    },
    coerce: function coerce() {
        for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return Reflect.construct(this, args);
    }
});

var Controller = exports.Controller = _mirukenCallback.CallbackHandler.extend(_mirukenContext.$contextual, _mirukenValidate.$validateThat, _mirukenValidate.Validating, {
    validate: function validate(target, scope) {
        return _validateController(this, target, 'validate', scope);
    },
    validateAsync: function validateAsync(target, scope) {
        return _validateController(this, target, 'validateAsync', scope);
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

var PresentationPolicy = exports.PresentationPolicy = Model.extend();

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

_mirukenCallback.CallbackHandler.implement({
    presenting: function presenting(policy) {
        return policy ? this.decorate({
            $handle: [PresentationPolicy, function (presenting) {
                return policy.mergeInto(presenting);
            }]
        }) : this;
    }
});

var ModalPolicy = exports.ModalPolicy = PresentationPolicy.extend({
    $properties: {
        title: '',
        style: null,
        chrome: true,
        header: false,
        footer: false,
        forceClose: false,
        buttons: null
    }
});

var ModalProviding = exports.ModalProviding = _mirukenCore.StrictProtocol.extend({
    showModal: function showModal(container, content, policy, context) {}
});

_mirukenCallback.CallbackHandler.implement({
    modal: function modal(options) {
        return this.presenting(new ModalPolicy(options));
    }
});