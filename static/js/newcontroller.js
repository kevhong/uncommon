// KEY_ENTER = 13;
// STATES = {
//     on: { icon: 'glyphicon glyphicon-check' },
//     off: { icon: 'glyphicon glyphicon-unchecked' }
// };


// Wait for jQuery to initialize
$(document).ready(function () {

    $("#index-search").on("keypress", function(){});

    $("#index-search").keyup(function (ev) {

      console.log("here1");
      if (ev.keyCode == '13') {

        var url = $("#index-search").val();
        var postData = {
          link: url
        };
        $.post('/dogifyurlsearch', postData)
            .done(function (data) {
              console.log(data);
                if (data.status === 200) {
                  console.log(data);
                  window.location = data.link;
                }
            })
            .fail(function (err) {

            })
            .always(function () {
              $("#index-search").clear();
            });
      }

    })

    return;
});
