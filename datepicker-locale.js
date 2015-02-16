(function (angular) {
	'use strict';

	angular.module('battlesnake.date-picker')
		.service('datePickerLocale', datePickerLocale);

	function datePickerLocale() {
		this.en = {
			today: 'Today',
			clear: 'Clear',
			close: 'Close'
		};
		this.et = {
			today: 'Täna',
			clear: 'Eemalda',
			close: 'Sulge'
		};
		this.ru = {
			today: 'Сегодня',
			clear: null,
			close: null
		};
	}

})(window.angular);
