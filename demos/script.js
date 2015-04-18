require('../');

var moment = require('moment');
var _ = require('lodash');

/* Get locale from URL hash if possible */
var locale = (window.location.hash || '').replace(/^#/, '');
var locales = [ { id: 'en', name: 'English' }, { id: 'et', name: 'Estonian' },
	{ id: 'ru', name: 'Russian' }];

function hasLocale(id) {
	return _.findWhere(locales, { id: locale });
}

if (!hasLocale(locale)) {
	locale = 'en';
}

require('moment/locale/en-gb');
require('moment/locale/et');
require('moment/locale/ru');

moment.locale(locale);

require('jquery-ui/ui/i18n/datepicker-en-GB');
require('jquery-ui/ui/i18n/datepicker-et');
require('jquery-ui/ui/i18n/datepicker-ru');

require('angular').module('demo', ['battlesnake.date-picker'])
	.controller('demoController', demoController);

function demoController($scope) {
	$scope.model = {
		title: 'Date-picker demo',
		date: moment(Date.parse('23 Feb 2015')),
		active: false,
		locale: locale,
		locales: locales,
		newLocale: null
	};
	$scope.$watch('model.locale', function () {
		var value = $scope.model.locale;
		if (value === locale || !hasLocale(value)) {
			return;
		}
		window.location.hash = '#' + value;
		window.location.reload();
	});
}
