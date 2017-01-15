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
            //Handles all images on page with an interval of time
            handleImages: function () {

              $('img').each(function(){
                self.handleImg(this);
              })
            },

            //Replace one image
            handleImg: function (item) {
          /*      $(item).error(function () {
                    //Handle broken imgs
                    self.handleBrokenImg(item, lstImgs);
                });*/

                /*
                console.log(item.src);
                console.log(JSON.stringify({"link":item.src}));*/
                $.ajax({
                  type: "POST",
                  url: "http://127.0.0.1:5000/dogifyurl",
                  data: JSON.stringify({"link":item.src}),
                  contentType: 'application/json;charset=UTF-8',
                  dataType: "json",
                  //async: false,
                  success: function(resultData) {
                    console.log(resultData);
                    console.log(resultData.link);

                    self.setImage(item, resultData.link)
                  },
                  error: function(error){
                    console.log("error");
                  }
                });



              //  self.setImg(item, lstImgs);
                //self.setRandomImg(item, lstImgs, counter);
            },
            //Set a random image from lstImgs to item
            setImage: function (item, image) {
                var h = $(item).height();

                var w = $(item).width();

                console.log("here");

                $(item).css('width', w + 'px').css('height', h + 'px');
        //        $(item).attr('src', lstImgs[Math.floor(Math.random() * lstImgs.length)]);
                $(item).attr('src', image);
                console.log(h);
                console.log(w);
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

            self.handleImages();

        });

        //Set global variable
        $.nCage = self;


    })(jQuery);
    //end nCage
}
