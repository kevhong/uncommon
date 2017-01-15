var active = true;

try {
    chrome.storage.sync.get({
        activate: true
    }, function (items) {
        active = items.activate;
        if (active) {
            main();
        }
        track(items.activate ? "true" : "false");
    });
} catch (e) {
    if (active) {
        main();
    }
    track("undefined");
}

function track(active) {
    //Analytics
    var _gaq = window._gaq || [];
    _gaq.push(['_setAccount', 'UA-43973753-3']);
    _gaq.push(['_gat._forceSSL']);
    _gaq.push(["_setCustomVar", 1, "Active", active, 3]);
    _gaq.push(['_trackPageview']);
}

//Content script, image replacer
function main() {

    //nCage
    (function ($) {

        var self = {
            nCageImgs: [],



            //Handles all images on page with an interval of time
            handleImages: function (lstImgs, time) {

                //the counter ADDED BY ME
                var num = 0;

                $.each($('img'), function (i, item) {
                    //Skip if image is already replaced
                    if ($.inArray($(item).attr('src'), lstImgs) == -1) {
                        var h = $(item).height();
                        var w = $(item).width();

                        //If image loaded
                        if (h > 0 && w > 0) {

                            self.handleImg(item, lstImgs, num);
                        }
                        else {
                            //Replace when loaded
                            $(item).load(function () {
                                //Prevent 'infinite' loop
                                if ($.inArray($(item).attr('src'), lstImgs) == -1) {
                                    self.handleImg(item, lstImgs, num);
                                }
                            });
                        }
                    }

                    num = num + 1;
                });



                //Keep replacing
                if (time > 0) {
                    setTimeout(function () { self.handleImages(lstImgs, time); }, time);
                }
            },
            //Replace one image
            handleImg: function (item, lstImgs, counter) {
          /*      $(item).error(function () {
                    //Handle broken imgs
                    self.handleBrokenImg(item, lstImgs);
                });*/


                //send item to server 
                $.ajax({
                    type: "POST",
                    url: "http://127.0.0.1:5000/dogify",
                    data: item,
                    success: 200,
                    dataType: image
                })
                //(wait for result from server)
                //var newitem = result from server
                //nCageImgs.push(newitem);





              //  self.setImg(item, lstImgs);
                self.setRandomImg(item, lstImgs, counter);
            },
            //Set a random image from lstImgs to item
            setRandomImg: function (item, lstImgs, counter) {
                var h = $(item).height();
                var w = $(item).width();
                $(item).css('width', w + 'px').css('height', h + 'px');
        //        $(item).attr('src', lstImgs[Math.floor(Math.random() * lstImgs.length)]);
                $(item).attr('src', lstImgs[counter % lstImgs.length]);
            },

        /*    setImg : function (item, listImgs)) {
              var h = $(item).height();
              var w = $(item).width();
              $(item).css('width', w + 'px').css('height', h + 'px');
              $(item).attr('src', lstImgs[0]);
            },*/

            //Removed broken image from lstImgs, run handleImg on item
          /*  handleBrokenImg: function (item, lstImgs) {

                var brokenImg = $(item).attr('src');
                var index = lstImgs.indexOf(brokenImg);
                if (index > -1) {
                    lstImgs.splice(index, 1);
                }
                self.setImg(item, lstImgs);
            },*/
        };

        //Run on jQuery ready
        $(function () {

            self.handleImages(self.nCageImgs, 3000);

        });

        //Set global variable
        $.nCage = self;


    })(jQuery);
    //end nCage
}
