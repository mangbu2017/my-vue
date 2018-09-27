(function ($) {
    'use strict';

    const auth = {
        get token() {
            const identity = JSON.parse(localStorage.getItem('CONSOLE_USER_IDENTITY'));
            if (identity && identity.token) {
                return 'Bearer ' + identity.token;
            }

            return '';
        },
    };

    $.ajaxSetup({
        headers: {
            Authorization: auth.token,
        },
    });

    $(document).ajaxSuccess(function (event, xhr, options, data) {
        var parent = window.parent;
        if (data.code === 4) {
            if (parent !== window && typeof parent.showReAuthorize === 'function') {
                parent.showReAuthorize();
            }
        }
    });
}(this.jQuery));
