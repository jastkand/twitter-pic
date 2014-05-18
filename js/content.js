(function($){
    window.addEventListener('load', function () {
        function appendImage ($owner, pictureUrl) {
            $owner
                .addClass('picified')
                .append($('<img />', {src: pictureUrl, style: 'width: 375px;'}));
        }

        function onObserve () {
            $('.js-tweet-text.tweet-text:not(.picified)').each(function () {
                var $this = $(this),
                    instagramRegexp = /(http:\/\/instagram.com\/p\/\S+\/)/gi,
                    otherRegexp = /(http\S+\.jpg|http\S+\.png|http\S+\.gif)/g, //TODO: Make a beautiful regexp. Add new format.
                    blackListRegexp = /(https:\/\/abs.twimg.com\/)/gi;

                var instagramLinkArray = instagramRegexp.exec($(this).html());
                var allPicLinkArray = otherRegexp.exec($(this).html());

                if (allPicLinkArray != null) {
                    for (var i = 0; i < allPicLinkArray.length; i++) {
                        var pictureUrl = allPicLinkArray[i];

                        if (!blackListRegexp.test(pictureUrl)) {
                            appendImage($this, pictureUrl)
                        }
                    }
                }

                //Instagram link parsing
                if (instagramLinkArray != null) {
                    for (var i = 0; i < instagramLinkArray.length; i++) {
                        var link = 'https://api.instagram.com/oembed?url=' + instagramLinkArray[i];
                        $.ajax({
                            method: 'GET',
                            url: link,
                            dataType: 'json',
                            success: function (data) {
                                var pictureUrl = data.url;
                                if (pictureUrl) {
                                    appendImage($this, pictureUrl);
                                }
                            }
                        });
                    }
                }
            });
        }

        var observer = new MutationObserver(function (mutations) {
            setTimeout(onObserve, 500);
        });

        // find element and create an observer instance
        observer.observe($('#stream-items-id')[0], { attributes: true, childList: true, characterData: true });

        onObserve();
    }, false);
})(jQuery);
