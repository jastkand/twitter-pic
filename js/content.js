(function($){
    $(function(){
        function appendImage($owner, pictureUrl) {
            $owner.append($('<img />', {src: pictureUrl, class: 'picified', style: 'width: 375px;'}));
        }

        function onObserve(){
            $('.js-tweet-text.tweet-text').each(function(){
                var $this = $(this),
                    instagramRegexp = /(http:\/\/instagram.com\/p\/\S+\/)/gi,
                    otherRegexp = /(http\S+\.jpg|http\S+\.png|http\S+\.gif)/g, //TODO: Make a beautiful regexp. Add new format.
                    blackListRegexp = /(https:\/\/abs.twimg.com\/)/gi,
                    linkArray;

                //Check existing in black list
                if (blackListRegexp.test($(this).html())) return true;

                //Instagram link parsing
                linkArray = instagramRegexp.exec($(this).html());

                if (linkArray != null) {
                    var link = 'http://api.instagram.com/oembed?url='+linkArray[0];

                    $.ajax({
                        method: 'GET',
                        url: link,
                        dataType: 'json',
                        success: function(data) {
                            var pictureUrl = data.url;

                            if (pictureUrl && $this.find('.picified').length == 0) {
                                appendImage($this, pictureUrl)
                            }
                        }
                    })
                }

                //Other picture link parsing
                linkArray = otherRegexp.exec($(this).html());

                if (linkArray != null) {
                    var pictureUrl = linkArray[0];
                    if (pictureUrl && $this.find('.picified').length == 0) {
                        appendImage($this, pictureUrl)
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
