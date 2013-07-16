(function($){
    $(function(){
        function onObserve(){
            $('.js-tweet-text.tweet-text').each(function(){
                var $this = $(this),
                    instagramRegexp = /(http:\/\/instagram.com\/p\/\S+\/)/g,
                    otherRegexp = /(http\S+\.jpg|http\S+\.png|http\S+\.gif)/g, //TODO Make a beautiful regexp. Add new format.
                    linkArray = [];

                //Instagram link parsing
                linkArray = instagramRegexp.exec($(this).html())

                if (linkArray != null) {
                    var link = 'http://api.instagram.com/oembed?url='+linkArray[0];

                    $.ajax({
                        method: 'GET',
                        url: link,
                        dataType: 'json',
                        success: function(data) {
                            var pictureUrl = data.url;

                            if (pictureUrl && $this.find('.picified').length == 0) {
                                $this.append($('<img />', {src: pictureUrl, class: 'picified', style: 'width: 375px; height: 375px;'}));
                            }
                        }
                    })
                }

                //Other picture link parsing
                linkArray = otherRegexp.exec($(this).html());

                if (linkArray != null) {
                    var pictureUrl = linkArray[0];
                    if (pictureUrl && $this.find('.picified').length == 0) {
                        $this.append($('<img />', {src: pictureUrl, class: 'picified', style: 'width: 375px;'}));
                    }
                }
            });
        }

        var observer = new MutationObserver(function(mutations) {
            setTimeout(onObserve, 500);
        });

        // find element and create an observer instance
        observer.observe($('#stream-items-id')[0], { attributes: true, childList: true, characterData: true });

        onObserve();
    });
})(jQuery);
