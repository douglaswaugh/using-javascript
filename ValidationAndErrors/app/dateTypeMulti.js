app.directive('dateTypeMulti', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        //scope: {
        //    viewModel: {
        //        viewDate: {}
        //    }
        //},
        link: function (scope, elem, attrs, ngModel) {
            ngModel.$render = function () {
               /* console.log("attrs " + attrs);
                console.log("attrs.dateTypeMulti " + attrs.dateTypeMulti);
                console.log(ngModel);*/
                //angular.extend(scope.$eval(attrs.dateTypeMulti), ngModel.$viewValue);
            };

            scope.$watch(attrs.dateTypeMulti, function (viewValue) {
                console.log("watch run");
                if (!viewValue)
                {
                    return;
                }
                ngModel.$setViewValue(viewValue);
            }, true);

            ngModel.$formatters.push(function (modelValue) {
                console.log("inside formatters");
                if (!modelValue) return;

                var parts = String(modelValue).split('/');

                return {
                    year: parts[0],
                    month: parts[1],
                    day: parts[2]
                };
            });

            ngModel.$parsers.unshift(function (viewValue) {
                var isValid = true,
                    modelValue = '',
                    date;

                //console.log(viewValue);

                if (viewValue) {
                    date = new Date(viewValue.year, viewValue.month - 1, viewValue.day);
                    modelValue = [viewValue.year, viewValue.month, viewValue.day].join('/');

                    if ('//' === modelValue) {
                        modelValue = '';
                    } else if (
                        date.getFullYear() != viewValue.year ||
                        date.getMonth() != viewValue.month - 1 ||
                        date.getDate() != viewValue.day) {
                        isValid = false;
                    }
                }

                console.log("is valid: " + isValid);

                ngModel.$setValidity('dateTypeMulti', isValid);

                return isValid ? modelValue : undefined;
            });
        }
    };
});