import { Base, design, Context } from "@miruken/core";

import {
    ValidateJsHandler, required, number, valid
} from "miruken-validate";

import { Controller } from "../src/controller";
//import { ModalOptions } from "../src/modal";
import { expect } from "chai";

const Person = Base.extend({
    @required
    firstName: undefined,
    @required
    lastName:  undefined,
    @number.onlyInteger
    @number.greaterThan(11)    
    age:       undefined
});

const Doctor = Person.extend({
    @design(Person)
    patient: undefined
});

const PersonController = Controller.extend({
    @design(Person)
    @required
    @valid
    person: undefined
});

describe("Controller", () => {
    let context;
    beforeEach(() => {
        context   = new Context();
        context.addHandlers(new ValidateJsHandler());
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
            const results = controller.validate(new Person({age: 2}));
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
                  value:   2
            }]);
        });

        it("should access validation errors from controller", () => {
            const controller   = new PersonController();
            controller.person  = new Person({age:2});
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
                  value:   2
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
            const controller   = new PersonController();
            controller.context = context;
            controller.validateAsync(new Person({age:2})).then(results => {
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
                    value:   2
                }]);
                done();
            });
        });

        it("should access validation errors from controller", done => {
            const controller   = new PersonController();
            controller.person  = new Person({age:2});
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
                    value:   2
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
            controller.context.$selfOrDescendant().$validAsync(controller)
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

    /*
    describe("Handler", () => {
        describe("#modal", () => {
            it("should define modal policy", () => {
                var modal = context.modal();
                expect(modal.handle(new ModalPolicy())).to.be.true;
            });

            it("should specify modal title", () => {
                var modal   = context.modal({title: "Hello"}),
                    options = new ModalPolicy();
                expect(modal.handle(options)).to.be.true;
                expect(options.title).to.equal("Hello");
            });
        });
    });
    */
});
