(function($){
    $(function(){
        function onObserve(){
            $('.js-tweet-text.tweet-text').each(function(){
                var $this = $(this),
                    linkRegexp = /(http:\/\/instagram.com\/p\/\S+\/)/g,
                    linkArray = linkRegexp.exec($(this).html());

                if (linkArray != null) {
                    var link = linkArray[0];

                    $.ajax({
                        method: 'GET',
                        url: link,
                        dataType: 'html',
                        success: function(data) {
                            var imageLinkRegexp = /<meta property="og:image" content="(.+)" \/>/g,
                                src = imageLinkRegexp.exec(data)[1];

                            if (src && $this.find('.picified').length == 0) {
                                $this.append($('<img />', {src: src, class: 'picified', style: 'width: 375px; height: 375px;'}));
                            }
                        }
                    })
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
