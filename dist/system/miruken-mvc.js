'use strict';

System.register(['miruken-core', 'miruken-validate', 'miruken-callback', 'miruken-context'], function (_export, _context) {
    "use strict";

    var Base, Metadata, $isNothing, $isFunction, $isObject, $inferProperties, Protocol, StrictProtocol, $validateThat, Validator, Validating, CallbackHandler, $contextual, Model, Controller, MasterDetail, MasterDetailAware, ViewRegion, ViewRegionAware, PresentationPolicy, ButtonClicked, ModalPolicy, ModalProviding;


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
            Metadata = _mirukenCore.Metadata;
            $isNothing = _mirukenCore.$isNothing;
            $isFunction = _mirukenCore.$isFunction;
            $isObject = _mirukenCore.$isObject;
            $inferProperties = _mirukenCore.$inferProperties;
            Protocol = _mirukenCore.Protocol;
            StrictProtocol = _mirukenCore.StrictProtocol;
        }, function (_mirukenValidate) {
            $validateThat = _mirukenValidate.$validateThat;
            Validator = _mirukenValidate.Validator;
            Validating = _mirukenValidate.Validating;
        }, function (_mirukenCallback) {
            CallbackHandler = _mirukenCallback.CallbackHandler;
        }, function (_mirukenContext) {
            $contextual = _mirukenContext.$contextual;
        }],
        execute: function () {
            _export('Model', Model = Base.extend($inferProperties, $validateThat, {
                constructor: function constructor(data, options) {
                    this.fromData(data, options);
                },
                fromData: function fromData(data, options) {
                    if ($isNothing(data)) {
                        return this;
                    }
                    var meta = this[Metadata],
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
                    var meta = this[Metadata],
                        descriptors = meta && meta.getDescriptor();
                    if (descriptors) {
                        var all = !$isObject(spec);
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
                                            if ($isFunction(keyValue.toData)) {
                                                keyValue.toData(keySpec, data);
                                            } else if ($isFunction(keyValue.toJSON)) {
                                                var json = keyValue.toJSON();
                                                for (var k in json) {
                                                    data[k] = json[k];
                                                }
                                            }
                                        }
                                    } else if (Array.isArray(keyValue)) {
                                        data[key] = keyValue.map(function (elem) {
                                            if (elem) {
                                                if ($isFunction(elem.toData)) {
                                                    return elem.toData(keySpec);
                                                } else if ($isFunction(elem.toJSON)) {
                                                    return elem.toJSON();
                                                }
                                                return elem;
                                            }
                                        });
                                    } else {
                                        if (keyValue) {
                                            if ($isFunction(keyValue.toData)) {
                                                keyValue = keyValue.toData(keySpec);
                                            } else if ($isFunction(keyValue.toJSON)) {
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
                    var meta = this[Metadata],
                        descriptors = meta && meta.getDescriptor();
                    for (var key in descriptors) {
                        var keyValue = this[key];
                        if (keyValue !== undefined && this.hasOwnProperty(key)) {
                            var modelValue = model[key];
                            if (modelValue === undefined || !model.hasOwnProperty(key)) {
                                model[key] = keyValue;
                            } else if ($isFunction(keyValue.mergeInto)) {
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
            }));

            _export('Model', Model);

            _export('Controller', Controller = CallbackHandler.extend($contextual, $validateThat, Validating, {
                validate: function validate(target, scope) {
                    return _validateController(this, target, 'validate', scope);
                },
                validateAsync: function validateAsync(target, scope) {
                    return _validateController(this, target, 'validateAsync', scope);
                }
            }));

            _export('Controller', Controller);

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

            _export('PresentationPolicy', PresentationPolicy = Model.extend());

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

            CallbackHandler.implement({
                presenting: function presenting(policy) {
                    return policy ? this.decorate({
                        $handle: [PresentationPolicy, function (presenting) {
                            return policy.mergeInto(presenting);
                        }]
                    }) : this;
                }
            });

            _export('ModalPolicy', ModalPolicy = PresentationPolicy.extend({
                $properties: {
                    title: '',
                    style: null,
                    chrome: true,
                    header: false,
                    footer: false,
                    forceClose: false,
                    buttons: null
                }
            }));

            _export('ModalPolicy', ModalPolicy);

            _export('ModalProviding', ModalProviding = StrictProtocol.extend({
                showModal: function showModal(container, content, policy, context) {}
            }));

            _export('ModalProviding', ModalProviding);

            CallbackHandler.implement({
                modal: function modal(options) {
                    return this.presenting(new ModalPolicy(options));
                }
            });
        }
    };
});