(function (){
	"use strict";

	window.app = angular.module('validation', []);

	app.controller('sectionController', function($scope) {
		$scope.viewModel = {
			label: 'This is a label',
			topLevelText: ''
		};
	});	
}());