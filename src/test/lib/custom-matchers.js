var NeosavvyTest = NeosavvyTest || {};
NeosavvyTest.Matchers = {
    toBeTypeOf: function(expected) {
        this.message = function() {
            return this.actual + " is not type of " + expected;
        };

        return typeof this.actual === expected;
    },
    toEqualStringified: function (expected) {
        this.message = function() {
            return this.actual + " is not equal to " + JSON.stringify(expected);
        };

        return this.actual === JSON.stringify(expected);
    },
    parsedToEqual: function (expected) {
        this.message = function() {
            return this.actual + " is not equal to " + JSON.stringify(expected);
        };

        return JSON.parse(this.actual) === expected;
    },
    toEqualFromCollection: function (collection, definition) {
        this.message = function() {
            return this.actual + " is not equal to " + definition + " or found in collection.";
        };

        return this.actual === _.find(collection, definition);
    },
    toContainWithoutCase: function (expected) {
        this.message = function () {
            return this.actual.toLowerCase() + ' does not contain ' + expected.toLowerCase();
        };

        return (this.actual.toLowerCase().indexOf(expected.toLowerCase()) !== -1);
    },
    toReturnEachWhenCalledWith: function(expectedAr) {
        this.message = function () {
            return this.actual.toString() + " may not be a function, or one of the expectations is failing.";
        };

        var passes = false;
        for (var i = 0; i < expectedAr.length; i++) {
            passes = (this.actual(expectedAr[i]) === expectedAr[i]);
            if (!passes) {
                return false;
            }
        }
        return true;
    }
};