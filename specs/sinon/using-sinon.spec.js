function TestClass(dependency) {
    this.dep = dependency;
}

TestClass.prototype.callDep = function(arg) {
    return this.dep.functionCall(arg);
};

function Dependency() {}

Dependency.prototype.functionCall = function(args) {
    return args;
};

function NoDependency() {}

describe('sinon', function(){
    describe('stub with args', function(){
        var testClass, preferences, futureSupply;

        preferences = { name: 'preferences' };
        futureSupply = { name: 'future supply' };

        beforeEach(function(){
            var depFunctionCall = sinon.stub();
            depFunctionCall
                .withArgs('/rels/domestic/preferences')
                .returns(preferences);
            depFunctionCall
                .withArgs('/rels/domestic/future-supply')
                .returns(futureSupply);

            var dep = {};
            dep.functionCall = depFunctionCall;
            testClass = new TestClass(dep);
        });

        it('should return preferences when argument is preferences rel', function(){
            var returnVal = testClass.callDep('/rels/domestic/preferences');
            expect(returnVal).toBe(preferences);
        });

        it('should return future supply when argument is future supply rel', function(){
            var returnVal = testClass.callDep('/rels/domestic/future-supply');
            expect(returnVal).toBe(futureSupply);
        });
    });

    describe('stub without args', function(){
        var testClass, preferences, futureSupply;

        preferences = { name: 'preferences' };
        futureSupply = { name: 'future supply' };

        beforeEach(function(){
            var depFunctionCall = sinon.stub();
            depFunctionCall.returns(preferences);
            var dep = {};
            dep.functionCall = depFunctionCall;
            testClass = new TestClass(dep);
        });

        it('should return preferences when argument is preferences rel', function(){
            var returnVal = testClass.callDep('/rels/domestic/preferences');
            expect(returnVal).toBe(preferences);
        });

        it('should return preferences when argument is future supply rel', function(){
            var returnVal = testClass.callDep('/rels/domestic/future-supply');
            expect(returnVal).toBe(preferences);
        });
    });

    describe('spy', function(){
        var spy, textClass, dep;

        beforeEach(function(){
            dep = new Dependency();
            spy = sinon.spy(dep, "functionCall");
            testClass = new TestClass(dep);
        });

        it('should have called functionCall with preferences rel', function(){
            var returnVal = testClass.callDep('/rels/domestic/preferences');
            expect(returnVal).toBe('/rels/domestic/preferences');
            expect(spy).toHaveBeenCalledWith('/rels/domestic/preferences');
        });

        it('should have called functionCall with future supply rel', function(){
            var returnVal = testClass.callDep('/rels/domestic/future-supply');
            expect(returnVal).toBe('/rels/domestic/future-supply');
            expect(spy).toHaveBeenCalledWith('/rels/domestic/future-supply');
        });
    });

    describe('mock', function() {
        var testClass, mock, expectPreferences, dep2;

        beforeEach(function(){
            var expectFutureSupply;
            dep2 = new Dependency();
            /* need to pass in the real object as the dependency instead of the mock.  I find this weird. */
            mock = sinon.mock(dep2);
            mock.expects("functionCall").withExactArgs('/rels/domestic/preferences');
            /*doesn't handle two difference expectations*/
            /*expectFutureSupply = sinon.mock(dep2).expects('functionCall').withExactArgs('/rels/domestic/future-supply');*/
            testClass = new TestClass(dep2);
        });

        it('should have called functionCall with preferences rel', function(){
            testClass.callDep('/rels/domestic/preferences');
            mock.verify();
        });

        it('should be able to verify calls on literal objects', function() {
            var mock2,
                testClass,
                dep3;

            dep3 = {functionCall: function(){}};
            mock = sinon.mock(dep3);
            mock.expects('functionCall').withExactArgs('/rels/domestic/preferences');

            testClass = {
                dependency: dep3,
                callDep: function(args) {
                    return this.dependency.functionCall(args);
                }
            };

            console.log(testClass);
            testClass.callDep('/rels/domestic/preferences');
            mock.verify();
        });
    });
});

describe('spy option', function() {
    var testClass, dep, preferences, futureSupply, returnVal1, returnVal2;

    preferences = { name: 'preferences' };
    futureSupply = { name: 'future supply' };

    dep = jasmine.createSpyObj('dependency', ['functionCall']);

    describe('and callFake', function(){
        beforeEach(function(){
            dep.functionCall.and.callFake(function(rel){
                if (rel === '/rels/domestic/preferences'){
                    return preferences;
                }
                else if (rel === '/rels/domestic/future-supply'){
                    return futureSupply;
                }
            });
            testClass = new TestClass(dep);
        });

        it('should return future supply', function() {
            var returnVal = testClass.callDep('/rels/domestic/future-supply');
            expect(dep.functionCall).toHaveBeenCalledWith('/rels/domestic/future-supply');
            expect(returnVal).toBe(futureSupply);
        });

        it('should return preferences', function() {
            var returnVal = testClass.callDep('/rels/domestic/preferences');
            expect(dep.functionCall).toHaveBeenCalledWith('/rels/domestic/preferences');
            expect(returnVal).toBe(preferences);
        });
    });

    describe('returnValue', function(){
        beforeEach(function(){
            dep.functionCall.and.returnValue(preferences);
            dep.functionCall.and.returnValue(futureSupply);
            returnVal1 = testClass.callDep('/rels/domestic/preferences');
            returnVal2 = testClass.callDep('/rels/domestic/future-supply');
        });

        it('dep functionCall should have been called with the preferences rel', function(){
            expect(dep.functionCall).toHaveBeenCalledWith('/rels/domestic/preferences');
        });

        it('dep functionCall should have been called with the future supply rel', function(){
            expect(dep.functionCall).toHaveBeenCalledWith('/rels/domestic/future-supply');
        });

        it('should return value 2 first', function(){
            expect(returnVal1).toBe(futureSupply);
        });

        it('should return value 2 second', function(){
            expect(returnVal2).toBe(futureSupply);
        });
    });
});
