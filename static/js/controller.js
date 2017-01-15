// KEY_ENTER = 13;
// STATES = {
//     on: { icon: 'glyphicon glyphicon-check' },
//     off: { icon: 'glyphicon glyphicon-unchecked' }
// };


// Wait for jQuery to initialize
$(document).ready(function () {

    /**
     * Execute on every document load
     */

    // Check to see if a search term has been stored from the index
    // search field. If so, perform a search API call similar to the
    // process of searching for a term on the actual find page.
    var term = sessionStorage.getItem('indexSearchTerm');
    if (term != null && term !== '') {
        searchForTerm(term);

        // Clear the term from session storage so that it doesn't
        // perform the search on subsequent document loads.
        sessionStorage.setItem('indexSearchTerm', '');
    }


    /**
     * Click and Event Handlers for forms
     */

    // Handle a search for articles from the index search box
    function searchAndSwitch(event) {
        if (event.which == KEY_ENTER) {
            var term = $("#index-search").val();
            if (term === null || term === '') {
                warnUser('Oops, please provide a search term first');
                return;
            }

            // Add the search term to session storage so that
            // it persists on change to documnet.location
            sessionStorage.setItem('indexSearchTerm', term);
            document.location = '/find';
        }
    }
    $("#index-search").keyup(searchAndSwitch);


    function searchForTerm(term) {
        var query = term
        console.log("query");
        $.get('/dogify/search' + query)
            .done(function (data) {
                if (data.status === 'ok') {

                }
            })
            .fail(function (err) {
                if (err !== undefined && err.status === 400) {
                    warnUser("Sorry, we couldn't find an image for '" + term + ",' please try again.");
                }
            })
            .always(function () {

            });
    }

    return;
});
