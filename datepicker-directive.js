(function (angular, $, moment, _) {
	'use strict';

	angular.module('battlesnake.date-picker')
		.directive('jquiDatePicker', jquiDatePickerDirective);

	function jquiDatePickerDirective() {
		$("<style>.kartulita.ui-datepicker .ui-datepicker-next:before,.kartulita.ui-datepicker .ui-datepicker-prev:before { content: ''; }</style>").appendTo($('head'));

		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				datePickerSelect: '&',
				datePickerActive: '=',
				datePickerAlign: '@'
			},
			link: link
		};

		/* Too lazy to code a separate controller */
		function link(scope, element, attrs, ngModel) {
			var loc_id = (moment.locale() || 'et').substr(0, 2);
			var locales = $.datepicker.regional || {};
			var config = _({}).extend(locales[loc_id], {
				dateFormat: 'yy-mm-dd',
				onSelect: viewValueChanged,
				showOptions: { direction: 'down' }
			});
			var container = angular.element('<div></div>')
				.css({
					position: 'absolute',
					display: 'inline-block',
					top: 0,
					left: 0
				})
				.addClass('ui-datepicker ui-widget kartulita')
				.datepicker(config)
				;

			scope.$watch('datePickerActive', setActive);

			container.appendTo(angular.element('body'));

			return;

			function setActive(value) {
				/* Don't use display:none as it stops getBoundingClientRect from working */
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
					x += window.scrollX;
					y += window.scrollY;
					container
						.css({
							left: x + 'px',
							top: y + 'px',
							zIndex: 999999,
							visibility: 'visible'
						})
						.datepicker('setDate', ngModel.$modelValue.toDate())
						;
				} else {
					container.css({
						visibility: 'hidden',
						top: 0,
						left: 0
					});
				}
			}

			function viewValueChanged(value) {
				value = moment(Date.parse(value));
				scope.$apply(function () {
					ngModel.$setViewValue(value);
					scope.datePickerActive = false;
				});
				scope.$apply(function () {
					scope.datePickerSelect({ value: value });
				});
			}
		}
	}

})(window.angular, window.$, window.moment, window._);
