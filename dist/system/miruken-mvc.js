'use strict';

System.register(['miruken-core', 'miruken-callback', 'miruken-validate', 'miruken-context'], function (_export, _context) {
    "use strict";

    var Base, Protocol, StrictProtocol, Policy, Metadata, $isFunction, $isPlainObject, isDescriptor, Variance, decorate, $flatten, $equals, typeOf, $isNothing, $classOf, design, instanceOf, $isSymbol, getPropertyDescriptors, emptyArray, Handler, handle, $define, addDefinition, $handle, $composer, $unhandled, Validator, Validating, contextual, _desc, _value, _obj, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc2, _value2, _obj2, ViewRegion, ViewRegionAware, PresentationPolicy, ButtonClicked, MasterDetail, MasterDetailAware, mappingMetadataKey, mapping, formatMetadataKey, $mapFrom, $mapTo, format, Controller, ModalPolicy, ModalProviding, Mapping, Mapper, MapCallback, MapFrom, MapTo, MappingHandler, AbstractMapping, JsonFormat, JsonContentType, JsonMapping;

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

    function root(target, key, descriptor) {
        _getOrCreateMapping(target, key).root = true;
    }

    _export('root', root);

    function ignore(target, key, descriptor) {
        _getOrCreateMapping(target, key).ignore = true;
    }

    _export('ignore', ignore);

    function _getOrCreateMapping(target, key) {
        return Metadata.getOrCreateOwn(mappingMetadataKey, target, key, function () {
            return {};
        });
    }

    function mapFrom() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return decorate(addDefinition("mapFrom", $mapFrom, false, _filterFormat), args);
    }

    _export('mapFrom', mapFrom);

    function mapTo() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return decorate(addDefinition("mapTo", $mapTo, false, _filterFormat), args);
    }

    _export('mapTo', mapTo);

    function _filterFormat(key, mapCallback) {
        var prototype = Object.getPrototypeOf(this);
        var formats = format.get(prototype, key);
        if (!formats || formats.size === 0) {
            formats = format.get(prototype);
        }
        return !formats || formats.size === 0 || [].concat(_toConsumableArray(formats)).some(function (f) {
            return $equals(mapCallback.format, f);
        });
    }

    function _validateController(controller, target, method, scope) {
        var context = controller.context;
        if (!context) {
            throw new Error("Validation requires a context to be available.");
        }
        var validator = Validator(context);
        return validator[method].call(validator, target || controller, scope);
    }

    function _canMapJson(value) {
        return value !== undefined && !$isFunction(value) && !$isSymbol(value);
    }

    function _mapFromJson(target, key, value, mapper, format, options) {
        var type = design.get(target, key);
        return mapper.mapTo(value, format, type, options);
    }
    return {
        setters: [function (_mirukenCore) {
            Base = _mirukenCore.Base;
            Protocol = _mirukenCore.Protocol;
            StrictProtocol = _mirukenCore.StrictProtocol;
            Policy = _mirukenCore.Policy;
            Metadata = _mirukenCore.Metadata;
            $isFunction = _mirukenCore.$isFunction;
            $isPlainObject = _mirukenCore.$isPlainObject;
            isDescriptor = _mirukenCore.isDescriptor;
            Variance = _mirukenCore.Variance;
            decorate = _mirukenCore.decorate;
            $flatten = _mirukenCore.$flatten;
            $equals = _mirukenCore.$equals;
            typeOf = _mirukenCore.typeOf;
            $isNothing = _mirukenCore.$isNothing;
            $classOf = _mirukenCore.$classOf;
            design = _mirukenCore.design;
            instanceOf = _mirukenCore.instanceOf;
            $isSymbol = _mirukenCore.$isSymbol;
            getPropertyDescriptors = _mirukenCore.getPropertyDescriptors;
            emptyArray = _mirukenCore.emptyArray;
        }, function (_mirukenCallback) {
            Handler = _mirukenCallback.Handler;
            handle = _mirukenCallback.handle;
            $define = _mirukenCallback.$define;
            addDefinition = _mirukenCallback.addDefinition;
            $handle = _mirukenCallback.$handle;
            $composer = _mirukenCallback.$composer;
            $unhandled = _mirukenCallback.$unhandled;
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

            mappingMetadataKey = Symbol();

            _export('mapping', mapping = Metadata.decorator(mappingMetadataKey, function (target, key, descriptor, mapping) {
                if (!$isPlainObjet(mapping)) {
                    throw new TypeError("@mapping must be a simple object");
                }
                if (!isDescriptor(descriptor)) {
                    mapping = key;
                    key = null;
                }
                Metadata.define(mappingMetadataKey, mapping, target, key);
            }));

            _export('mapping', mapping);

            _export('default', mapping);

            formatMetadataKey = Symbol();

            _export('$mapFrom', $mapFrom = $define(Variance.Contravariant));

            _export('$mapFrom', $mapFrom);

            _export('$mapTo', $mapTo = $define(Variance.Covariant));

            _export('$mapTo', $mapTo);

            _export('format', format = Metadata.decorator(formatMetadataKey, function (target, key, descriptor, formats) {
                var property = isDescriptor(descriptor);
                formats = $flatten(property ? formats : key);
                if (formats.length === 0) {
                    return;
                }
                var metadata = property ? Metadata.getOrCreateOwn(formatMetadataKey, target, key, function () {
                    return new Set();
                }) : Metadata.getOrCreateOwn(formatMetadataKey, target.prototype, function () {
                    return new Set();
                });
                formats.forEach(function (format) {
                    return metadata.add(format);
                });
            }));

            _export('format', format);

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

            _export('Mapping', Mapping = Protocol.extend({
                mapFrom: function mapFrom(object, format, options) {},
                mapTo: function mapTo(value, format, classOrInstance, options) {}
            }));

            _export('Mapping', Mapping);

            _export('Mapper', Mapper = StrictProtocol.extend(Mapping));

            _export('Mapper', Mapper);

            MapCallback = Base.extend({
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

            _export('MapFrom', MapFrom = MapCallback.extend({
                constructor: function constructor(object, format, options) {
                    this.base(format, options);
                    this.extend({
                        get object() {
                            return object;
                        }
                    });
                }
            }));

            _export('MapFrom', MapFrom);

            _export('MapTo', MapTo = MapCallback.extend({
                constructor: function constructor(value, format, classOrInstance, options) {
                    this.base(format, options);
                    if ($isNothing(classOrInstance)) {
                        classOrInstance = $classOf(value);
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
            }));

            _export('MapTo', MapTo);

            _export('MappingHandler', MappingHandler = Handler.extend(Mapper, {
                mapFrom: function mapFrom(object, format, options) {
                    if ($isNothing(object)) {
                        throw new TypeError("Missing object to map");
                    }
                    var mapFrom = new MapFrom(object, format, options);
                    if ($composer.handle(mapFrom)) {
                        return mapFrom.mapping;
                    }
                },
                mapTo: function mapTo(value, format, classOrInstance, options) {
                    if ($isNothing(value)) {
                        throw new TypeError("Missing value to map from");
                    }
                    if (Array.isArray(classOrInstance)) {
                        var type = classOrInstance[0];
                        if (type && !$isFunction(type) && !Array.isArray(type)) {
                            throw new TypeError("Cannot infer array type");
                        }
                    } else if (Array.isArray(value) && $isFunction(classOrInstance)) {
                        classOrInstance = [classOrInstance];
                    }
                    var mapTo = new MapTo(value, format, classOrInstance, options);
                    if ($composer.handle(mapTo)) {
                        return mapTo.mapping;
                    }
                }
            }));

            _export('MappingHandler', MappingHandler);

            _export('AbstractMapping', AbstractMapping = Handler.extend((_obj = {
                mapFrom: function mapFrom(_mapFrom, composer) {
                    return $unhandled;
                },
                mapTo: function mapTo(_mapTo, composer) {},
                canSetProperty: function canSetProperty(descriptor) {
                    return !$isFunction(descriptor.value);
                },
                isPrimitiveValue: function isPrimitiveValue(value) {
                    switch (typeOf(value)) {
                        case "null":
                        case "number":
                        case "string":
                        case "boolean":
                            return true;
                    }
                    return false;
                }
            }, (_applyDecoratedDescriptor(_obj, 'mapFrom', [mapFrom], Object.getOwnPropertyDescriptor(_obj, 'mapFrom'), _obj), _applyDecoratedDescriptor(_obj, 'mapTo', [mapTo], Object.getOwnPropertyDescriptor(_obj, 'mapTo'), _obj)), _obj)));

            _export('AbstractMapping', AbstractMapping);

            $handle(Handler.prototype, MapFrom, function (mapFrom, composer) {
                var target = mapFrom.object,
                    source = $classOf(target);
                if ($isNothing(source)) {
                    return false;
                }
                return $mapFrom.dispatch(this, mapFrom, source, composer, false, function (m) {
                    return mapFrom.mapping = m;
                });
            });

            $handle(Handler.prototype, MapTo, function (mapTo, composer) {
                var classOrInstance = mapTo.classOrInstance,
                    source = $isFunction(classOrInstance) ? classOrInstance : $classOf(classOrInstance);
                if ($isNothing(source)) {
                    return false;
                }
                return $mapTo.dispatch(this, mapTo, source, composer, false, function (m) {
                    return mapTo.mapping = m;
                });
            });

            _export('JsonFormat', JsonFormat = Symbol());

            _export('JsonContentType', JsonContentType = "application/json");

            _export('JsonFormat', JsonFormat);

            _export('JsonContentType', JsonContentType);

            _export('JsonMapping', JsonMapping = AbstractMapping.extend(format(JsonFormat, JsonContentType), (_dec = mapFrom(Date), _dec2 = mapFrom(RegExp), _dec3 = mapFrom(Array), _dec4 = mapTo(Date), _dec5 = mapTo(RegExp), _dec6 = mapTo(Array), (_obj2 = {
                mapFromDate: function mapFromDate(mapFrom) {
                    return mapFrom.object.toJSON();
                },
                mapFromRegExp: function mapFromRegExp(mapFrom) {
                    return mapFrom.object.toString();
                },
                mapFromArray: function mapFromArray(mapFrom, composer) {
                    var array = mapFrom.object,
                        format = mapFrom.format,
                        options = mapFrom.options,
                        mapper = Mapper(composer);
                    return array.map(function (elem) {
                        return mapper.mapFrom(elem, format, options);
                    });
                },
                mapFrom: function mapFrom(_mapFrom2, composer) {
                    var _this = this;

                    var object = _mapFrom2.object;
                    if (!_canMapJson(object)) {
                        return;
                    }
                    if (this.isPrimitiveValue(object)) {
                        return object && object.valueOf();
                    }
                    var format = _mapFrom2.format,
                        options = _mapFrom2.options,
                        spec = options && options.spec,
                        raw = $isPlainObject(object),
                        all = !$isPlainObject(spec);
                    if (raw || $isFunction(object.toJSON)) {
                        var _json = raw ? object : object.toJSON();
                        if (!all) {
                            var j = {};
                            for (var k in spec) {
                                j[k] = _json[k];
                            }return j;
                        }
                        return _json;
                    }
                    var descriptors = getPropertyDescriptors(object),
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
                            if (_this.isPrimitiveValue(keyValue)) {
                                json[key] = keyValue && keyValue.valueOf();
                                return;
                            }
                            var keyJson = mapper.mapFrom(keyValue, format, keyOptions);
                            if (map && map.root) {
                                Object.assign(json, keyJson);
                            } else {
                                json[key] = keyJson;
                            }
                        }
                    });
                    return json;
                },
                mapToDate: function mapToDate(mapTo) {
                    var date = mapTo.value;
                    return instanceOf(date, Date) ? date : Date.parse(date);
                },
                mapToRegExp: function mapToRegExp(mapTo) {
                    var pattern = mapTo.value,
                        fragments = pattern.match(/\/(.*?)\/([gimy])?$/);
                    return new RegExp(fragments[1], fragments[2] || "");
                },
                mapToArray: function mapToArray(mapTo, composer) {
                    var array = mapTo.value,
                        format = mapTo.format,
                        options = mapTo.options,
                        mapper = Mapper(composer);
                    var type = mapTo.classOrInstance;
                    type = Array.isArray(type) ? type[0] : undefined;
                    return array.map(function (elem) {
                        return mapper.mapTo(elem, format, type, options);
                    });
                },
                mapTo: function mapTo(_mapTo2, composer) {
                    var _this2 = this;

                    var value = _mapTo2.value;
                    if (!_canMapJson(value)) {
                        return;
                    }
                    if (this.isPrimitiveValue(value)) {
                        return value;
                    }
                    var classOrInstance = _mapTo2.classOrInstance;
                    if ($isNothing(classOrInstance)) {
                        return;
                    }
                    var format = _mapTo2.format,
                        options = _mapTo2.options,
                        object = $isFunction(classOrInstance) ? Reflect.construct(classOrInstance, emptyArray) : classOrInstance;
                    var dynamic = options && options.dynamic,
                        ignoreCase = options && options.ignoreCase,
                        mapper = Mapper(composer),
                        descriptors = getPropertyDescriptors(object);
                    Reflect.ownKeys(descriptors).forEach(function (key) {
                        var descriptor = descriptors[key];
                        if (_this2.canSetProperty(descriptor)) {
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
                            if (this.canSetProperty(descriptor)) {
                                object[key] = _mapFromJson(object, key, keyValue, mapper, format, options);
                            }
                        } else {
                            var lkey = key.toLowerCase();
                            var found = false;
                            for (var k in descriptors) {
                                if (k.toLowerCase() === lkey) {
                                    if (this.canSetProperty(descriptors[k])) {
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
            }, (_applyDecoratedDescriptor(_obj2, 'mapFromDate', [_dec], Object.getOwnPropertyDescriptor(_obj2, 'mapFromDate'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapFromRegExp', [_dec2], Object.getOwnPropertyDescriptor(_obj2, 'mapFromRegExp'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapFromArray', [_dec3], Object.getOwnPropertyDescriptor(_obj2, 'mapFromArray'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapToDate', [_dec4], Object.getOwnPropertyDescriptor(_obj2, 'mapToDate'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapToRegExp', [_dec5], Object.getOwnPropertyDescriptor(_obj2, 'mapToRegExp'), _obj2), _applyDecoratedDescriptor(_obj2, 'mapToArray', [_dec6], Object.getOwnPropertyDescriptor(_obj2, 'mapToArray'), _obj2)), _obj2))));

            _export('JsonMapping', JsonMapping);
        }
    };
});