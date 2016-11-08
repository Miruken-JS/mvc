import { Base, design } from "miruken-core";
import { Context } from "miruken-context";
import { root, ignore } from "../src/mapping";
import { Mapper, MappingHandler } from "../src/mapper";
import { JsonFormat, JsonMapping } from "../src/json";
import { expect } from "chai";

const Person = Base.extend({
    firstName: undefined,
    lastName:  undefined,
    age:       undefined,
    @ignore
    password:  undefined,
    getHobbies() { return this._hobbies; },
    setHobbies(value) { this._hobbies = value; }
});

const Doctor = Person.extend({
    @design(Person)
    patient: undefined
});

const PersonWrapper = Base.extend({
    @root                
    @design(Person)
    person: undefined
});

describe("JsonMapping", () => {
    let context, mapper;
    beforeEach(() => {
        context = new Context();
        context.addHandlers(new MappingHandler(), new JsonMapping());
        mapper = Mapper(context);
    });
    
    describe("#mapFrom", () => {
        it("should map from json", () => {
            const person = mapper.mapFrom({
                firstName:  "David",
                lastName:   "Beckham",
                occupation: "soccer"
            }, JsonFormat, Person);
            expect(person).to.be.instanceOf(Person);
            expect(person.firstName).to.equal("David");
            expect(person.lastName).to.equal("Beckham");
            expect(person.occupation).to.be.undefined;
        });

        it("should ignore from json", () => {
            const person = mapper.mapFrom({
                password: "1234"
            }, JsonFormat, Person);
            expect(person).to.be.instanceOf(Person);
            expect(person.password).to.be.undefined;
        });
        
        it("should pass through primitives", () => {
            expect(mapper.mapFrom(1, JsonFormat)).to.equal(1);
            expect(mapper.mapFrom(2, JsonFormat)).to.equal(2);
            expect(mapper.mapFrom(true, JsonFormat)).to.equal(true); 
            expect(mapper.mapFrom(false, JsonFormat)).to.equal(false);           
            expect(mapper.mapFrom("hello", JsonFormat)).to.equal("hello");
            expect(mapper.mapFrom("goodbye", JsonFormat)).to.equal("goodbye");
        });
        
        it("should map all from json", () => {
            const person = mapper.mapFrom({
                firstName:  "David",
                lastName:   "Beckham",
                occupation: "soccer"
            }, JsonFormat, Person, { dynamic: true });
            expect(person).to.be.instanceOf(Person);
            expect(person.firstName).to.equal("David");
            expect(person.lastName).to.equal("Beckham");
            expect(person.occupation).to.equal("soccer");
        });

        it("should map all related from json", () => {
            const doctor = mapper.mapFrom({
                firstName: "Mitchell",
                lastName:  "Moskowitz",
                hobbies:   undefined,
                age:       0,
                patient: {
                    firstName:  "Lionel",
                    lastName:   "Messi",
                    occupation: "soccer",
                    age:       24
                }
            }, JsonFormat, Doctor, { dynamic: true });
            expect(doctor).to.be.instanceOf(Doctor);
            expect(doctor.patient).to.be.instanceOf(Person);
            expect(doctor.patient.firstName).to.equal("Lionel");
            expect(doctor.patient.lastName).to.equal("Messi");
            expect(doctor.patient.occupation).to.equal("soccer");
        });

        it("should map all related from json ignoring case", () => {
            const doctor = mapper.mapFrom({
                FirstNAME: "Mitchell",
                LASTName:  "Moskowitz",
                patient: {
                    FIRSTName:  "Lionel",
                    lastNAME:   "Messi"
                }
            }, JsonFormat, Doctor);
            expect(doctor).to.be.instanceOf(Doctor);
            expect(doctor.patient).to.be.instanceOf(Person);
            expect(doctor.firstName).to.equal("Mitchell");
            expect(doctor.lastName).to.equal("Moskowitz");            
            expect(doctor.patient.firstName).to.equal("Lionel");
            expect(doctor.patient.lastName).to.equal("Messi");
        });

        it("should map rooted json", () => {
            const wrapper = mapper.mapFrom({
                    firstName:  "David",
                    lastName:   "Beckham",
                    occupation: "soccer"
                  }, JsonFormat, PersonWrapper, { dynamic: true }),
                  person = wrapper.person;
            expect(person).to.be.instanceOf(Person);
            expect(person.firstName).to.equal("David");
            expect(person.lastName).to.equal("Beckham");
            expect(person.occupation).to.equal("soccer");            
        });
    });

    describe.only("#mapTo", () => {
        it("should ignore symbols", () => {
            expect(mapper.mapTo(Symbol(), JsonFormat)).to.be.undefined;
        });

        it("should ignore functions", () => {
            expect(mapper.mapTo(function () {}, JsonFormat)).to.be.undefined;
        });
        
        it("should pass through primitives", () => {
            expect(mapper.mapTo(1, JsonFormat)).to.equal(1);
            expect(mapper.mapTo(new Number(2), JsonFormat)).to.equal(2);
            expect(mapper.mapTo(true, JsonFormat)).to.equal(true); 
            expect(mapper.mapTo(new Boolean(false), JsonFormat)).to.equal(false);           
            expect(mapper.mapTo("hello", JsonFormat)).to.equal("hello");
            expect(mapper.mapTo(String("goodbye"), JsonFormat)).to.equal("goodbye");
            expect(mapper.mapTo(new Date(2016,11,6), JsonFormat)).to.equal("2016-12-06T06:00:00.000Z");
            expect(mapper.mapTo(/abc/, JsonFormat)).to.eql("/abc/");
        });

        it("should map arrays of primitives", () => {
            expect(mapper.mapTo([1,2,3], JsonFormat)).to.eql([1,2,3]);
            expect(mapper.mapTo([false,true], JsonFormat)).to.eql([false,true]);
            expect(mapper.mapTo(["one","two"], JsonFormat)).to.eql(["one","two"]);
            expect(mapper.mapTo([new Date(2016,11,6)], JsonFormat)).to.eql(["2016-12-06T06:00:00.000Z"]);
            expect(mapper.mapTo([/abc/], JsonFormat)).to.eql(["/abc/"]);
        });
        
        it("should map all properties", () => {
            const person = new Person({
                      firstName: "Christiano",
                      lastName:  "Ronaldo",
                      age:       23
                  }),
                  json = mapper.mapTo(person, JsonFormat);
            expect(json).to.eql({
                firstName: "Christiano",
                lastName:  "Ronaldo",
                age:       23
            });
        });

        it("should ignore some properties", () => {
            const person    = new Person();
            person.password = "1234";
            const json      = mapper.mapTo(person, JsonFormat);
            expect(json).to.eql({});
        });
        
        it("should map specific properties", () => {
            const person = new Person({
                      firstName: "Christiano",
                      lastName:  "Ronaldo",
                      age:       23
                  }),
                  json = mapper.mapTo(person, JsonFormat, { spec: {lastName: true} });
            expect(json).to.eql({
                lastName: "Ronaldo"
            });
        });
        
        it("should map nested properties", () => {
            const person = new Person({
                      firstName: "Lionel",
                      lastName:  "Messi",
                      age:       24
                  }),
                  doctor = new Doctor({
                      firstName: "Mitchell",
                      lastName:  "Moskowitz",
                  });
            doctor.patient = person;
            const json = mapper.mapTo(doctor, JsonFormat);
            expect(json).to.eql({
                firstName: "Mitchell",
                lastName:  "Moskowitz",
                patient: {
                    firstName: "Lionel",
                    lastName:  "Messi",
                    age:       24
                }
            });
        });

        it("should map specific nested properties", () => {
            const person = new Person({
                      firstName: "Lionel",
                      lastName:  "Messi",
                      age:       24
                  }),
                  doctor = new Doctor({
                      firstName: "Mitchell",
                      lastName:  "Moskowitz",
                  });
            doctor.patient = person;
            const json = mapper.mapTo(doctor, JsonFormat, { spec: {
                patient: {
                    lastName: true,
                    age: true
                }}
            });
            expect(json).to.eql({
                patient: {
                    lastName:  "Messi",
                    age:       24
                }
            });
        });

        it("should map rooted properties", () => {
            const wrapper = new PersonWrapper({
                      firstName: "Franck",
                      lastName:  "Ribery",
                      age:       32
                  }),
                  json = mapper.mapTo(wrapper, JsonFormat);
            expect(json).to.eql({
                firstName: "Franck",
                lastName:  "Ribery",
                age:       32
            });
        });

        it("should map specific rooted properties", () => {
            const wrapper = new PersonWrapper({
                      person: new Person({
                          firstName: "Franck",
                          lastName:  "Ribery",
                          age:       32
                      })
                  }),
                  json = mapper.mapTo(wrapper, JsonFormat, {
                      spec: { person: { age: true } }
                  });
            expect(json).to.eql({
                age: 32
            });
        });
    });
    
    describe("#map", () => {
        it("should map one-to-one", () => {
            const data = {
                firstName: "Daniel",
                lastName:  "Worrel",
                patient:   {
                    firstName: "Emitt",
                    lastName:  "Smith"
                }
            };
            const doctor  = new Doctor(data),
                  patient = doctor.patient; 
            expect(doctor.firstName).to.equal("Daniel");
            expect(doctor.lastName).to.equal("Worrel");
            expect(patient).to.be.instanceOf(Person);
            expect(patient.firstName).to.equal("Emitt");
            expect(patient.lastName).to.equal("Smith");
        });

        it("should map one-to-many", () => {
            const data = {
                firstName: "Daniel",
                lastName:  "Worrel",
                patient:   [{
                    firstName: "Emitt",
                    lastName:  "Smith"
                }, {
                    firstName: "Tony",
                    lastName:  "Romo"
                }]  
            };
            const doctor   = new Doctor(data),
                  patients = doctor.patient; 
            expect(doctor.firstName).to.equal("Daniel");
            expect(doctor.lastName).to.equal("Worrel");
            expect(patients).to.be.instanceOf(Array);
            expect(patients).to.have.length(2);
            expect(patients[0].firstName).to.equal("Emitt");
            expect(patients[0].lastName).to.equal("Smith");
            expect(patients[1].firstName).to.equal("Tony");
            expect(patients[1].lastName).to.equal("Romo");
        });

        it("should ignore case", () => {
            const data = {
                fiRstNamE: "Bruce",
                LaStNaMe:  "Lee"
            };
            const person = new Person(data);
            expect(person.firstName).to.equal("Bruce");
            expect(person.lastName).to.equal("Lee");
        });

        it("should preserve grouping", () => {
            const data = {
                patient:   [[{
                    firstName: "Abbot",
                    }, {
                    firstName: "Costello",
                    }],
                    [{
                    firstName: "Bill"
                    }]
                ]  
            };
            const doctor = new Doctor(data),
                  group1 = doctor.patient[0],
                  group2 = doctor.patient[1];
            expect(group1[0].firstName).to.equal("Abbot");
            expect(group1[1].firstName).to.equal("Costello");
            expect(group2[0].firstName).to.equal("Bill");
        });

        it("should use root mapping", () => {
            const PersonModel = Model.extend({
                $properties: {
                    person: { map: Person, root: true }
                }
            });
            const data = {
                firstName: "Henry",
                lastName:  "Ford"
            };
            const model = new PersonModel(data);
            expect(model.person.firstName).to.equal("Henry");
            expect(model.person.lastName).to.equal("Ford");
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
                name: "John",
                children:   [{
                    name: "Ralph"
                }, {
                    name: "Susan"
                }]
                }, {
                name: "Beth",
                children:   [{
                    name: "Lisa"
                }, {
                    name: "Mike"
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
