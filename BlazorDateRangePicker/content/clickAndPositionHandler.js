/**
* @author: Sergey Zaikin zaikinsr@yandex.ru
* @copyright: Copyright (c) 2019 Sergey Zaikin. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
*/
window.clickAndPositionHandler = {
    addClickOutsideEvent: function (elementId, parentId, dotnetHelper) {
        window.addEventListener("click", function (e) {
            if ((document.getElementById(elementId) != null && !document.getElementById(elementId).contains(e.target)) &&
                (document.getElementById(parentId) != null && !document.getElementById(parentId).contains(e.target))) {
                dotnetHelper.invokeMethodAsync("InvokeClickOutside");
            }
        });
    },
    getPickerPosition: function (elementId, parentId, drops, opens, skipAddListener) {
        var parentOffset = { top: 0, left: 0 },
            containerTop;
        var parentRightEdge = window.innerWidth;
        var container = document.getElementById(elementId);
        var parentEl = document.getElementById(parentId);
        var element = parentEl;

        if (parentEl === document.body) {
            var rect = parentEl.getBoundingClientRect();
            parentOffset = {
                top: rect.top,
                left: rect.left
            };

            parentRightEdge = parentEl[0].clientWidth + rect.left;
        }

        var elementRect = element.getBoundingClientRect();

        var outerHeight = function (el) {
            return el.offsetHeight;
        }

        var outerWidth = function (el) {
            return el.offsetWidth;
        }

        var setStylesOnElement = function (styles, element) {
            //Object.assign(element.style, styles);
            for (var prop in styles) {
                element.style[prop] = styles[prop];
            }
        }

        if (drops == 'up')
            containerTop = elementRect.top - outerHeight(container) - parentOffset.top;
        else
            containerTop = elementRect.top + outerHeight(element) - parentOffset.top;

        // Force the container to it's actual width
        /*setStylesOnElement({
            top: 0 + 'px',
            left: 0 + 'px',
            right: 'auto',
            position: 'fixed'
        }, container);*/
        var containerWidth = outerWidth(container);

        /*if (drops == 'up') {
            container.classList.add("drop-up");
        } else {
            container.classList.remove("drop-up");
        }*/

        if (opens == 'left') {
            var containerRight = parentRightEdge - elementRect.left - outerWidth(element);
            if (containerWidth + containerRight > window.innerWidth) {
                setStylesOnElement({
                    position: 'fixed',
                    top: containerTop + 'px',
                    right: 'auto',
                    left: 9 + 'px'
                }, container);
            } else {
                setStylesOnElement({
                    position: 'fixed',
                    top: containerTop + 'px',
                    right: containerRight + 'px',
                    left: 'auto'
                }, container);
            }
        } else if (opens == 'center') {
            var containerLeft = elementRect.left - parentOffset.left + outerWidth(element) / 2 - containerWidth / 2;
            if (containerLeft < 0) {
                setStylesOnElement({
                    position: 'fixed',
                    top: containerTop + 'px',
                    right: 'auto',
                    left: 9 + 'px'
                }, container);
            } else if (containerLeft + containerWidth > window.innerWidth) {
                setStylesOnElement({
                    position: 'fixed',
                    top: containerTop + 'px',
                    left: 'auto',
                    right: 0 + 'px'
                }, container);
            } else {
                setStylesOnElement({
                    position: 'fixed',
                    top: containerTop + 'px',
                    left: containerLeft + 'px',
                    right: 'auto'
                }, container);
            }
        } else {
            var containerLeft = elementRect.left - parentOffset.left;
            if (containerLeft + containerWidth > window.innerWidth) {
                setStylesOnElement({
                    position: 'fixed',
                    top: containerTop + 'px',
                    left: 'auto',
                    right: 0 + 'px'
                }, container);
            } else {
                setStylesOnElement({
                    position: 'fixed',
                    top: containerTop + 'px',
                    left: containerLeft + 'px',
                    right: 'auto'
                }, container);
            }
        }

        if (skipAddListener !== true) {
            var resizeFunction = function () {
                window.clickAndPositionHandler.getPickerPosition(elementId, parentId, drops, opens, true);
            };
            window.addEventListener('resize', resizeFunction, true);
            window.addEventListener('onwheel', resizeFunction, true);
            window.addEventListener('onmousewheel', resizeFunction, true);
            window.addEventListener('scroll', resizeFunction, true);
        };
    }
};