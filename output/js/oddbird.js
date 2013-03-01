(function ( document, window ) {
    'use strict';

    // LIs in data-reveal:1 step are innerSteps
    [].slice.call(document.querySelectorAll('.step[data-reveal="1"] li')).forEach( function (elem) {
        elem.classList.add('innerStep');
    });

})(document, window);
