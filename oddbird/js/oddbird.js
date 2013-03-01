(function ( document, window ) {
    'use strict';

    // LIs in top-level UL (i.e. not notes) in data-reveal:1 step are innerSteps
    [].slice.call(document.querySelectorAll('.step[data-reveal="1"] > ul > li')).forEach( function (elem) {
        elem.classList.add('innerStep');
    });

})(document, window);
