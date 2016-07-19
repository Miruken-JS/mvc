import { Model } from '../src/model';
import { Controller } from '../src/controller';
import { Context } from 'miruken-context';
import { ModalPolicy } from '../src/modal';

import {
    ValidationCallbackHandler, ValidateJsCallbackHandler,
    $required
} from 'miruken-validate';

import { expect } from 'chai';

const Person = Model.extend({
    $properties: {
        firstName: { 
            validate: $required 
        },
        lastName:  {
            validate: $required
        },
        age: {
            value: 0,
            validate: {
                numericality: {
                    onlyInteger: true,
                    greaterThan: 11
                }
            }
        },
        password: { ignore: true }
    },
    getHobbies() { return this._hobbies; },
    setHobbies(value) { this._hobbies = value; }
});

const Doctor = Person.extend({
    $properties: {
        patient: { map: Person }
    }
});

const PersonController = Controller.extend({
    $properties: {
        person: {
            map: Person,
            validate: {
                presence: true,
                nested:   true
            }
        }
    }
});

describe("Model", () => {
    describe("#constructor", () => {
        it("should infer properties", () => {
            const person = new Person();
            person.setHobbies(['Soccer', 'Tennis']);
            expect(person.hobbies).to.eql(['Soccer', 'Tennis']);
        });

        it("should construct model from data", () => {
            const person = new Person({
                firstName: 'Carl',
                lastName:  'Lewis'
            });
            expect(person.firstName).to.equal('Carl');
            expect(person.lastName).to.equal('Lewis');
        });
    });

    describe("#fromData", () => {
        it("should import from data", () => {
            const person = new Person();
            person.fromData({
                firstName:  'David',
                lastName:   'Beckham',
                occupation: 'soccer'
            });
            expect(person.firstName).to.equal('David');
            expect(person.lastName).to.equal('Beckham');
            expect(person.occupation).to.be.undefined;
        });

        it("should ignore import from data", () => {
            const person = new Person();
            person.fromData({
                password:   '1234'
            });
            expect(person.password).to.be.undefined;
        });
        
        it("should import all from data", () => {
            const person = new Person();
            person.fromData({
                firstName:  'David',
                lastName:   'Beckham',
                occupation: 'soccer'
            }, { dynamic: true });
            expect(person.firstName).to.equal('David');
            expect(person.lastName).to.equal('Beckham');
            expect(person.occupation).to.equal('soccer');
        });

        it("should import all related from data", () => {
            const doctor = new Doctor();
            doctor.fromData({
                firstName: 'Mitchell',
                lastName:  'Moskowitz',
                hobbies:   undefined,
                age:       0,
                patient: {
                    firstName:  'Lionel',
                    lastName:   'Messi',
                    occupation: 'soccer',
                    age:       24
                }
            }, { dynamic: true });
            expect(doctor.patient.firstName).to.equal('Lionel');
            expect(doctor.patient.lastName).to.equal('Messi');
            expect(doctor.patient.occupation).to.equal('soccer');
        });

        it("should import all related from data ignoring case", () => {
            const doctor = new Doctor();
            doctor.fromData({
                FirstNAME: 'Mitchell',
                LASTName:  'Moskowitz',
                patient: {
                    FIRSTName:  'Lionel',
                    lastNAME:   'Messi'
                }
            });
            expect(doctor.firstName).to.equal('Mitchell');
            expect(doctor.lastName).to.equal('Moskowitz');            
            expect(doctor.patient.firstName).to.equal('Lionel');
            expect(doctor.patient.lastName).to.equal('Messi');
        });        
    });

    describe("#toData", () => {
        it("should export all data", () => {
            const person = new Person({
                   firstName: 'Christiano',
                   lastName:  'Ronaldo',
                   age:       23
                }),
                data = person.toData();
            expect(data).to.eql({
                firstName: 'Christiano',
                lastName:  'Ronaldo',
                age:       23
            });
        });

        it("should ignore export some data", () => {
            const person    = new Person();
            person.password = '1234';
            const data      = person.toData();
            expect(data).to.eql({
                age: 0
            });
        });
        
        it("should export partial data", () => {
            const person = new Person({
                    firstName: 'Christiano',
                    lastName:  'Ronaldo',
                    age:       23
                }),
                data = person.toData({lastName: true});
            expect(data).to.eql({
                lastName: 'Ronaldo'
            });
        });
        
        it("should export nested data", () => {
            const person = new Person({
                    firstName: 'Lionel',
                    lastName:  'Messi',
                    age:       24
                }),
                doctor = new Doctor({
                    firstName: 'Mitchell',
                    lastName:  'Moskowitz',
                });
            doctor.patient = person;
            expect(doctor.toData()).to.eql({
                firstName: 'Mitchell',
                lastName:  'Moskowitz',
                age:       0,
                patient: {
                    firstName: 'Lionel',
                    lastName:  'Messi',
                    age:       24
                }
            });
        });

        it("should export partial nested data", () => {
            const person = new Person({
                    firstName: 'Lionel',
                    lastName:  'Messi',
                    age:       24
                }),
                doctor = new Doctor({
                    firstName: 'Mitchell',
                    lastName:  'Moskowitz',
                });
            doctor.patient = person;
            const data = doctor.toData({
                patient: {
                    lastName: true,
                    age: true
                }
            });
            expect(data).to.eql({
                patient: {
                    lastName:  'Messi',
                    age:       24
                }
            });
        });

        it("should export rooted data", () => {
            const PersonWrapper = Model.extend({
                    $properties: {
                        person: { map: Person, root: true }
                    }
                }),
                wrapper = new PersonWrapper({
                    firstName: 'Franck',
                    lastName:  'Ribery',
                    age:       32
                });
            expect(wrapper.person.firstName).to.equal('Franck');
            expect(wrapper.person.lastName).to.equal('Ribery');
            expect(wrapper.toData()).to.eql({
                firstName: 'Franck',
                lastName:  'Ribery',
                age:       32
            });
        });

        it("should export partial rooted data", () => {
            const PersonWrapper = Model.extend({
                    $properties: {
                        person: { map: Person, root: true }
                    }
                }),
                wrapper = new PersonWrapper({
                    firstName: 'Franck',
                    lastName:  'Ribery',
                    age:       32
                });
            expect(wrapper.toData({person: { age: true }})).to.eql({
                age: 32
            });
        });
    });

    describe("#mergeInto", () => {
        it("should merge simple data", () => {
            const person = new Person({
                   firstName: 'Alexi',
                   lastName:  'Sanchez',
                   age:       10
                }),
                other = new Person();
            expect(person.mergeInto(other)).to.be.true;
            expect(other.firstName).to.equal(person.firstName);
            expect(other.lastName).to.equal(person.lastName);
            expect(other.age).to.equal(person.age);
        });

        it("should merge nested data", () => {
            const patient = new Person({
                   firstName: 'Raheem',
                   lastName:  'Sterling',
                   age:       10
                }),
                doctor = new Doctor({
                    firstName: 'Daniel',
                    lastName:  'Worrel',
                }),
                other  = new Doctor({
                    lastName:  'Zigler',
                    patient:   {
                        firstName: 'Brad',
                    }
                });;
            doctor.patient = patient;
            expect(doctor.mergeInto(other)).to.be.true;
            expect(other.firstName).to.equal(doctor.firstName);
            expect(other.lastName).to.equal('Zigler');
            expect(other.patient.firstName).to.equal('Brad');
            expect(other.patient.lastName).to.equal(patient.lastName);
            expect(other.patient.age).to.equal(patient.age);            
        });

        it("should merge contravariantly", () => {
            const person = new Person({
                   firstName: 'Client',
                   lastName:  'Dempsey'
                }),
                doctor = new Doctor();
            expect(person.mergeInto(doctor)).to.be.true;
            expect(doctor.firstName).to.equal(person.firstName);
            expect(doctor.lastName).to.equal(person.lastName);
            expect(doctor.age).to.equal(0);
        });

        it("should not merge unrelated models", () => {
            const person = new Person({
                   firstName: 'Eduardo',
                   lastName:  'Vargas'
                }),
                controller = new PersonController();
            expect(person.mergeInto(controller)).to.be.false;
        });
    });
    
    describe("#map", () => {
        it("should map one-to-one", () => {
            const data = {
                firstName: 'Daniel',
                lastName:  'Worrel',
                patient:   {
                    firstName: 'Emitt',
                    lastName:  'Smith'
                }
            };
            const doctor  = new Doctor(data),
                  patient = doctor.patient; 
            expect(doctor.firstName).to.equal('Daniel');
            expect(doctor.lastName).to.equal('Worrel');
            expect(patient).to.be.instanceOf(Person);
            expect(patient.firstName).to.equal('Emitt');
            expect(patient.lastName).to.equal('Smith');
        });

        it("should map one-to-many", () => {
            const data = {
                firstName: 'Daniel',
                lastName:  'Worrel',
                patient:   [{
                    firstName: 'Emitt',
                    lastName:  'Smith'
                }, {
                    firstName: 'Tony',
                    lastName:  'Romo'
                }]  
            };
            const doctor   = new Doctor(data),
                  patients = doctor.patient; 
            expect(doctor.firstName).to.equal('Daniel');
            expect(doctor.lastName).to.equal('Worrel');
            expect(patients).to.be.instanceOf(Array);
            expect(patients).to.have.length(2);
            expect(patients[0].firstName).to.equal('Emitt');
            expect(patients[0].lastName).to.equal('Smith');
            expect(patients[1].firstName).to.equal('Tony');
            expect(patients[1].lastName).to.equal('Romo');
        });

        it("should ignore case", () => {
            const data = {
                fiRstNamE: 'Bruce',
                LaStNaMe:  'Lee'
            };
            const person = new Person(data);
            expect(person.firstName).to.equal('Bruce');
            expect(person.lastName).to.equal('Lee');
        });

        it("should preserve grouping", () => {
            const data = {
                patient:   [[{
                    firstName: 'Abbot',
                    }, {
                    firstName: 'Costello',
                    }],
                    [{
                    firstName: 'Bill'
                    }]
                ]  
            };
            const doctor = new Doctor(data),
                  group1 = doctor.patient[0],
                  group2 = doctor.patient[1];
            expect(group1[0].firstName).to.equal('Abbot');
            expect(group1[1].firstName).to.equal('Costello');
            expect(group2[0].firstName).to.equal('Bill');
        });

        it("should use root mapping", () => {
            const PersonModel = Model.extend({
                $properties: {
                    person: { map: Person, root: true }
                }
            });
            const data = {
                firstName: 'Henry',
                lastName:  'Ford'
            };
            const model = new PersonModel(data);
            expect(model.person.firstName).to.equal('Henry');
            expect(model.person.lastName).to.equal('Ford');
        });

        it("should map arrays", () => {
            const Child = Model.extend({
                $properties: {
                    name: { map: upper }
                }
            });
            const Parent = Model.extend({
                $properties: {
                    name: { map: upper },
                    children: { map: Child }
                }
            });
            const data = [{
                name: 'John',
                children:   [{
                    name: 'Ralph'
                }, {
                    name: 'Susan'
                }]
                }, {
                name: 'Beth',
                children:   [{
                    name: 'Lisa'
                }, {
                    name: 'Mike'
                }]
                }
            ];
            const parents = Model.map(data, Parent, { dynamic: true });
            expect(parents).to.have.length(2);
            expect(parents[0].name).to.equal("JOHN");
            expect(parents[1].name).to.equal("BETH");
            expect(parents[0].children[0].name).to.equal("RALPH");
            expect(parents[0].children[1].name).to.equal("SUSAN");
            expect(parents[1].children[0].name).to.equal("LISA");
            expect(parents[1].children[1].name).to.equal("MIKE");
            function upper(str) {
                return str.toUpperCase();
            }
        });        
    });
});

describe("Controller", () => {
    let context;
    beforeEach(() => {
        context   = new Context();
        context.addHandlers(new ValidationCallbackHandler(), new ValidateJsCallbackHandler());
    });

    describe("#validate", () => {
        it("should require a context", () => {
            const controller = new PersonController();
            expect(() => {
                controller.validate();
            }).to.throw(Error, "Validation requires a context to be available.");
        });

        it("should validate the controller", () => {
            const controller = new PersonController();
            controller.context = context;
            const results = controller.validate();
            expect(results.valid).to.be.false;
            expect(results.person.errors.presence).to.eql([{
                message: "Person can't be blank",
                value:   undefined
            }]);
        });

        it("should validate object", () => {
            const controller     = new PersonController();
            controller.context = context;
            const results = controller.validate(new Person);
            expect(results.valid).to.be.false;
            expect(results.firstName.errors.presence).to.eql([{
                message: "First name can't be blank",
                value:   undefined
            }]);
            expect(results.lastName.errors.presence).to.eql([{
                message: "Last name can't be blank",
                value:   undefined
            }]);
            expect(results.age.errors.numericality).to.deep.include.members([{
                  message: "Age must be greater than 11",
                  value:   0
            }]);
        });

        it("should access validation errors from controller", () => {
            const controller     = new PersonController();
            controller.person  = new Person();
            controller.context = context;
            controller.validate();
            const results = controller.$validation;
            expect(results.valid).to.be.false;
            expect(results.errors.presence).to.deep.have.members([{
                key: "person.firstName",
                message: "First name can't be blank",
                value:   undefined
            }, {
                key: "person.lastName",
                message: "Last name can't be blank",
                value:   undefined
            }]);
            expect(results.errors.numericality).to.deep.include.members([{
                  key:     "person.age",
                  message: "Age must be greater than 11",
                  value:   0
            }]);
        });
    });

    describe("#validateAsync", () => {
        it("should require a context", () => {
            const controller = new PersonController();
            expect(() => {
                controller.validateAsync();
            }).to.throw(Error, "Validation requires a context to be available.");
        });

        it("should validate the controller", done => {
            const controller = new PersonController();
            controller.context = context;
            controller.validateAsync().then(results => {
                expect(results.valid).to.be.false;
                expect(results.person.errors.presence).to.eql([{
                    message: "Person can't be blank",
                    value:   undefined
                }]);
                done();
            });
        });

        it("should validate object", done => {
            const controller     = new PersonController();
            controller.context = context;
            controller.validateAsync(new Person).then(results => {
                expect(results.valid).to.be.false;
                expect(results.firstName.errors.presence).to.eql([{
                    message: "First name can't be blank",
                    value:   undefined
                }]);
                expect(results.lastName.errors.presence).to.eql([{
                    message: "Last name can't be blank",
                    value:   undefined
                }]);
                expect(results.age.errors.numericality).to.deep.include.members([{
                    message: "Age must be greater than 11",
                    value:   0
                }]);
                done();
            });
        });

        it("should access validation errors from controller", done => {
            const controller     = new PersonController();
            controller.person  = new Person();
            controller.context = context;
            controller.validateAsync().then(() => {
                const results = controller.$validation;
                expect(results.valid).to.be.false;
                expect(results.errors.presence).to.eql([{
                    key: "person.firstName",
                    message: "First name can't be blank",
                    value:   undefined
                }, {
                    key: "person.lastName",
                    message: "Last name can't be blank",
                    value:   undefined
                }]);
                expect(results.errors.numericality).to.deep.include.members([{
                    key:     "person.age",
                    message: "Age must be greater than 11",
                    value:   0
                }]);
                done();
            });
        });

        it("should validate the controller implicitly", done => {
            const controller = new PersonController();
            controller.context = context;
            controller.context.$validAsync(controller)
                .resolve(Controller).catch(err => {
                    expect(controller.$validation.valid).to.be.false;
                    expect(controller.$validation.person.errors.presence).to.eql([{
                        message: "Person can't be blank",
                        value:   undefined
                    }]);
                    done();
                });
        });

        it("should validate the controller implicitly with traversal", done => {
            const controller = new PersonController();
            controller.context = context;
            controller.context.$descendantOrSelf().$validAsync(controller)
                .resolve(Controller).catch(err => {
                    expect(controller.$validation.valid).to.be.false;
                    expect(controller.$validation.person.errors.presence).to.eql([{
                        message: "Person can't be blank",
                        value:   undefined
                    }]);
                    done();
                });
        });        
    });

    describe("CallbackHandler", () => {
        describe("#modal", () => {
            it("should define modal policy", () => {
                var modal = context.modal();
                expect(modal.handle(new ModalPolicy())).to.be.true;
            });

            it("should specify modal title", () => {
                var modal   = context.modal({title: 'Hello'}),
                    options = new ModalPolicy();
                expect(modal.handle(options)).to.be.true;
                expect(options.title).to.equal('Hello');
            });
        });
    });
});
