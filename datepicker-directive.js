(function (angular, jquery, moment) {
	'use strict';

	angular.module('battlesnake.date-picker')
		.directive('jquiDatePicker', jquiDatePickerDirective);

	function jquiDatePickerDirective() {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				datePickerClose: '&',
				datePickerSelect: '&',
				datePickerActive: '=',
				datePickerAlign: '@'
			},
			link: link
		};

		/* Too lazy to code a separate controller */
		function link(scope, element, attrs, ngModel) {
			var container = angular.element('<div></div>')
				.css({
					position: 'absolute',
					display: 'inline-block'
				})
				.addClass('ui-datepicker ui-widget')
				.datepicker({
					dateFormat: 'yy-mm-dd',
					onSelect: viewValueChanged,
					onClose: onClose,
					showOptions: { direction: 'down' }
				});

			scope.$watch('datePickerActive', setActive);

			container.appendTo(angular.element('body'));

			return;

			function setActive(value) {
				if (value) {
					var p = element[0].getBoundingClientRect();
					var c = container[0].getBoundingClientRect();
					var x = p.left, y = p.top;
					var align = scope.datePickerAlign || 'top left';
					if (align.match(/\btop\b/)) {
						y = p.bottom;
					} else if (align.match(/\bbottom\b/)) {
						y = p.top - (c.bottom - c.top);
					}
					if (align.match(/\bleft\b/)) {
						x = p.left;
					} else if (align.match(/\bright\b/)) {
						x = p.right - (c.right - c.left);
					}
					container
						.css({
							left: x + 'px',
							top: y + 'px',
							visibility: 'visible'
						})
						.datepicker('setDate', ngModel.$modelValue.toDate())
				} else {
					container.css({
						visibility: 'hidden'
					});
				}
			}

			function viewValueChanged(value) {
				scope.$apply(function () {
					ngModel.$setViewValue(moment(Date.parse(value)));
					scope.datePickerSelect({});
					scope.datePickerActive = false;
				});
			}

			function onClose() {
				scope.datePickerClose({});
			}
		}
	}

})(window.angular, window.$, window.moment);