define(['exports', 'miruken-core', 'miruken-callback', 'miruken-validate', 'miruken-context'], function (exports, _mirukenCore, _mirukenCallback, _mirukenValidate, _mirukenContext) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.JsonMapping = exports.JsonContentType = exports.JsonFormat = exports.format = exports.ModalProviding = exports.ModalPolicy = exports.Controller = exports.MappingHandler = exports.MapFrom = exports.MapTo = exports.Mapper = exports.Mapping = exports.$mapFrom = exports.$mapTo = exports.mapping = exports.MasterDetailAware = exports.MasterDetail = exports.ButtonClicked = exports.PresentationPolicy = exports.ViewRegionAware = exports.ViewRegion = undefined;
    exports.root = root;
    exports.ignore = ignore;
    exports.mapTo = mapTo;
    exports.mapFrom = mapFrom;

    var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc2, _value2, _obj2;

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

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

    _mirukenCallback.Handler.implement({
        presenting: function presenting(policy) {
            var _desc, _value, _obj;

            return policy ? this.decorate((_obj = {
                mergePolicy: function mergePolicy(presenting) {
                    policy.mergeInto(presenting);
                }
            }, (_applyDecoratedDescriptor(_obj, 'mergePolicy', [_mirukenCallback.handles], Object.getOwnPropertyDescriptor(_obj, 'mergePolicy'), _obj)), _obj)) : this;
        }
    });

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

    var mappingMetadataKey = Symbol();

    var mapping = exports.mapping = _mirukenCore.Metadata.decorator(mappingMetadataKey, function (target, key, descriptor, mapping) {
        if (!$isPlainObjet(mapping)) {
            throw new TypeError("@mapping must be a simple object");
        }
        if (!(0, _mirukenCore.isDescriptor)(descriptor)) {
            mapping = key;
            key = null;
        }
        _mirukenCore.Metadata.define(mappingMetadataKey, mapping, target, key);
    });

    function root(target, key, descriptor) {
        _getOrCreateMapping(target, key).root = true;
    }

    function ignore(target, key, descriptor) {
        _getOrCreateMapping(target, key).ignore = true;
    }

    function _getOrCreateMapping(target, key) {
        return _mirukenCore.Metadata.getOrCreateOwn(mappingMetadataKey, target, key, function () {
            return {};
        });
    }

    exports.default = mapping;
    var $mapTo = exports.$mapTo = (0, _mirukenCallback.$define)(_mirukenCore.Variance.Contravariant);

    var $mapFrom = exports.$mapFrom = (0, _mirukenCallback.$define)(_mirukenCore.Variance.Covariant);

    var Mapping = exports.Mapping = _mirukenCore.Protocol.extend({
        mapTo: function mapTo(object, format, options) {},
        mapFrom: function mapFrom(value, format, classOrInstance, options) {}
    });

    var Mapper = exports.Mapper = _mirukenCore.StrictProtocol.extend(Mapping);

    var MapCallback = _mirukenCore.Base.extend({
        constructor: function constructor(format, options) {
            this.extend({
                get format() {
                    return format;
                },

                get options() {
                    return options;
                }
            });
        }
    });

    var MapTo = exports.MapTo = MapCallback.extend({
        constructor: function constructor(object, format, options) {
            this.base(format, options);
            this.extend({
                get object() {
                    return object;
                }
            });
        }
    });

    var MapFrom = exports.MapFrom = MapCallback.extend({
        constructor: function constructor(value, format, classOrInstance, options) {
            this.base(format, options);
            if ((0, _mirukenCore.$isNothing)(classOrInstance)) {
                classOrInstance = (0, _mirukenCore.$classOf)(value);
            }
            this.extend({
                get value() {
                    return value;
                },

                get classOrInstance() {
                    return classOrInstance;
                }
            });
        }
    });

    var MappingHandler = exports.MappingHandler = _mirukenCallback.Handler.extend(Mapper, {
        mapTo: function mapTo(object, format, options) {
            if ((0, _mirukenCore.$isNothing)(object)) {
                throw new TypeError("Missing object to map.");
            }
            var mapTo = new MapTo(object, format, options);
            if (_mirukenCallback.$composer.handle(mapTo)) {
                return mapTo.mapping;
            }
        },
        mapFrom: function mapFrom(value, format, classOrInstance, options) {
            if ((0, _mirukenCore.$isNothing)(value)) {
                throw new TypeError("Missing value to map from.");
            }
            var mapFrom = new MapFrom(value, format, classOrInstance, options);
            if (_mirukenCallback.$composer.handle(mapFrom)) {
                return mapFrom.mapping;
            }
        }
    });

    (0, _mirukenCallback.$handle)(_mirukenCallback.Handler.prototype, MapTo, function (mapTo, composer) {
        var target = mapTo.object,
            source = (0, _mirukenCore.$classOf)(target);
        if ((0, _mirukenCore.$isNothing)(source)) {
            return false;
        }
        return $mapTo.dispatch(this, mapTo, source, composer, false, function (m) {
            return mapTo.mapping = m;
        });
    });

    (0, _mirukenCallback.$handle)(_mirukenCallback.Handler.prototype, MapFrom, function (mapFrom, composer) {
        var classOrInstance = mapFrom.classOrInstance,
            source = (0, _mirukenCore.$isFunction)(classOrInstance) ? classOrInstance : (0, _mirukenCore.$classOf)(classOrInstance);
        if ((0, _mirukenCore.$isNothing)(source)) {
            return false;
        }
        return $mapFrom.dispatch(this, mapFrom, source, composer, false, function (m) {
            return mapFrom.mapping = m;
        });
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

    var formatMetadataKey = Symbol();

    function mapTo() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return (0, _mirukenCore.decorate)((0, _mirukenCallback.addDefinition)("mapTo", $mapTo, false, _filterFormat), args);
    }

    function mapFrom() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return (0, _mirukenCore.decorate)((0, _mirukenCallback.addDefinition)("mapFrom", $mapFrom, false, _filterFormat), args);
    }

    var format = exports.format = _mirukenCore.Metadata.decorator(formatMetadataKey, function (target, key, descriptor, formats) {
        var property = (0, _mirukenCore.isDescriptor)(descriptor);
        formats = (0, _mirukenCore.$flatten)(property ? formats : key);
        if (formats.length === 0) {
            return;
        }
        var metadata = property ? _mirukenCore.Metadata.getOrCreateOwn(formatMetadataKey, target, key, function () {
            return new Set();
        }) : _mirukenCore.Metadata.getOrCreateOwn(formatMetadataKey, target.prototype, function () {
            return new Set();
        });
        formats.forEach(function (format) {
            return metadata.add(format);
        });
    });

    function _filterFormat(key, mapCallback) {
        var prototype = Object.getPrototypeOf(this);
        var formats = format.get(prototype, key);
        if (!formats || formats.size === 0) {
            formats = format.get(prototype);
        }
        return !formats || formats.size === 0 || [].concat(_toConsumableArray(formats)).some(function (f) {
            return (0, _mirukenCore.$equals)(mapCallback.format, f);
        });
    }

    var JsonFormat = exports.JsonFormat = "json",
        JsonContentType = exports.JsonContentType = "application/json";

    var JsonMapping = exports.JsonMapping = _mirukenCallback.Handler.extend(format(JsonFormat, JsonContentType), (_dec = mapTo(Date), _dec2 = mapTo(RegExp), _dec3 = mapTo(Array), _dec4 = mapFrom(Date), _dec5 = mapFrom(RegExp), _dec6 = mapFrom(Array), (_obj2 = {
        mapDateToJson: function mapDateToJson(mapTo) {
            return mapTo.object.toJSON();
        },
        mapRegExpToJson: function mapRegExpToJson(mapTo) {
            return mapTo.object.toString();
        },
        mapArrayToJson: function mapArrayToJson(mapTo, composer) {
            var array = mapTo.object,
                mapper = Mapper(composer);
            return array.map(function (elem) {
                return mapper.mapTo(elem, mapTo.format, mapTo.options);
            });
        },
        mapToJson: function mapToJson(mapTo, composer) {
            var object = mapTo.object;
            if (!_canMapJson(object)) {
                return;
            }
            if (_isJsonValue(object)) {
                return object && object.valueOf();
            }
            var format = mapTo.format,
                options = mapTo.options,
                spec = options && options.spec,
                raw = (0, _mirukenCore.$isPlainObject)(object),
                all = !(0, _mirukenCore.$isPlainObject)(spec);
            if (raw || (0, _mirukenCore.$isFunction)(object.toJSON)) {
                var _json = raw ? raw : object.toJSON();
                if (!all) {
                    var j = {};
                    for (var k in spec) {
                        j[k] = _json[k];
                    }mapTo.mapping = j;
                    return;
                }
                mapTo.mapping = _json;
                return;
            }
            var descriptors = (0, _mirukenCore.getPropertyDescriptors)(object),
                mapper = Mapper(composer),
                json = {};
            Reflect.ownKeys(descriptors).forEach(function (key) {
                if (all || key in spec) {
                    var keyValue = object[key];
                    if (keyValue === undefined) {
                        return;
                    }
                    var map = mapping.get(object, key),
                        keySpec = all ? spec : spec[key];
                    if (!(all || keySpec) || map && map.ignore) {
                        return;
                    }
                    var keyOptions = keySpec ? Object.create(options, {
                        spec: { value: keySpec }
                    }) : options;
                    if (!_canMapJson(keyValue)) {
                        return;
                    }
                    if (_isJsonValue(keyValue)) {
                        json[key] = keyValue && keyValue.valueOf();
                        return;
                    }
                    var keyJson = mapper.mapTo(keyValue, format, keyOptions);
                    if (map && map.root) {
                        Object.assign(json, keyJson);
                    } else {
                        json[key] = keyJson;
                    }
                }
            });
            return json;
        },
        mapDateFromJson: function mapDateFromJson(mapFrom) {
            var date = mapFrom.value;
            return (0, _mirukenCore.instanceOf)(date, Date) ? date : Date.parse(date);
        },
        mapRegExpFromJson: function mapRegExpFromJson(mapFrom) {
            var pattern = mapFrom.value,
                fragments = pattern.match(/\/(.*?)\/([gimy])?$/);
            return new RegExp(fragments[1], fragments[2] || "");
        },
        mapArrayFromJson: function mapArrayFromJson(mapFrom, composer) {
            var array = mapTo.value,
                mapper = Mapper(composer);
            return array.map(function (elem) {
                return mapper.mapFrom(elem, mapFrom.format, mapFrom.options);
            });
        },
        mapFromJson: function mapFromJson(mapFrom, composer) {
            var value = mapFrom.value;
            if (!_canMapJson(value)) {
                return;
            }
            if (_isJsonValue(value)) {
                return value;
            }
            var classOrInstance = mapFrom.classOrInstance;
            if ((0, _mirukenCore.$isNothing)(classOrInstance)) {
                return;
            }
            var format = mapFrom.format,
                options = mapFrom.options,
                object = (0, _mirukenCore.$isFunction)(classOrInstance) ? Reflect.construct(classOrInstance, _mirukenCore.emptyArray) : classOrInstance;
            var dynamic = options && options.dynamic,
                ignoreCase = options && options.ignoreCase,
                mapper = Mapper(composer),
                descriptors = (0, _mirukenCore.getPropertyDescriptors)(object);
            Reflect.ownKeys(descriptors).forEach(function (key) {
                var descriptor = descriptors[key];
                if (_isSettableProperty(descriptor)) {
                    var map = mapping.get(object, key);
                    if (map && map.root) {
                        object[key] = _mapFromJson(object, key, value, mapper, format, options);
                    }
                }
            });
            for (var key in value) {
                var descriptor = descriptors[key];
                var map = mapping.get(object, key);
                if (map && (map.root || map.ignore)) {
                    continue;
                }
                var keyValue = value[key];
                if (keyValue === undefined) {
                    continue;
                }
                if (descriptor) {
                    if (_isSettableProperty(descriptor)) {
                        object[key] = _mapFromJson(object, key, keyValue, mapper, format, options);
                    }
                } else {
                    var lkey = key.toLowerCase();
                    var found = false;
                    for (var k in descriptors) {
                        if (k.toLowerCase() === lkey) {
                            if (_isSettableProperty(descriptors[k])) {
                                object[k] = _mapFromJson(object, k, keyValue, mapper, format, options);
                            }
                            found = true;
                            break;
                        }
                    }
                    if (!found && dynamic) {
                        object[key] = keyValue;
                    }
                }
            }
            return object;
        }
    }, (_applyDecoratedDescriptor(_obj2, 'mapDateToJson', [_dec], Object.getOwnPropertyDescriptor(_obj2, 'mapDateToJson'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapRegExpToJson', [_dec2], Object.getOwnPropertyDescriptor(_obj2, 'mapRegExpToJson'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapArrayToJson', [_dec3], Object.getOwnPropertyDescriptor(_obj2, 'mapArrayToJson'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapToJson', [mapTo], Object.getOwnPropertyDescriptor(_obj2, 'mapToJson'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapDateFromJson', [_dec4], Object.getOwnPropertyDescriptor(_obj2, 'mapDateFromJson'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapRegExpFromJson', [_dec5], Object.getOwnPropertyDescriptor(_obj2, 'mapRegExpFromJson'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapArrayFromJson', [_dec6], Object.getOwnPropertyDescriptor(_obj2, 'mapArrayFromJson'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapFromJson', [mapFrom], Object.getOwnPropertyDescriptor(_obj2, 'mapFromJson'), _obj2)), _obj2)));

    function _canMapJson(value) {
        return value === undefined || !((0, _mirukenCore.$isFunction)(value) || (0, _mirukenCore.$isSymbol)(value));
    }

    function _isJsonValue(value) {
        switch ((0, _mirukenCore.typeOf)(value)) {
            case "null":
            case "number":
            case "string":
            case "boolean":
                return true;
            case "undefined":
                return false;
        }
        return false;
    }

    function _mapFromJson(target, key, value, mapper, format, options) {
        var type = _mirukenCore.design.get(target, key);
        if ((0, _mirukenCore.$isNothing)(type)) {
            return value;
        };
        if (Array.isArray(type)) {
            type = type[0];
            if (!Array.isArray(value)) {
                value = [value];
            }
        }
        return mapper.mapFrom(value, format, type, options);
    }

    function _isSettableProperty(descriptor) {
        return !(0, _mirukenCore.$isFunction)(descriptor.value);
    }
});