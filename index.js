/**
 * @ngdoc module
 * @name date-picker
 *
 * @description
 * Date-picker widget
 */
require('angular').module('battlesnake.date-picker', ['battlesnake.language'])
	.service('datePickerLocale', require('./date-picker-locale'))
	.directive('jquiDatePicker', require('./date-picker-directive'))
	;

require('../language');
