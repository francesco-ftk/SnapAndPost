var id = null;

(function ($) {

    $.fn.slider = function (images, title, options) {

        var defaults = {
            speed: 1000,
            pause: 3000,
            transition: "fade"
        }

        options = $.extend(defaults, options);

        if (options.pause <= options.speed) {
            options.pause = options.speed + 100;
        }

        return this.each(function () {
            var $this = $(this);
            $this.wrap('<div class="slider-wrap" id="wrapper"></div>');
            $title = title;

            for (var i = 0; i < images.length; i++) {
                $src = images[i].img;
                $this.append("<li class='sliderElement'><img src=" + $src + " alt='" + $title + "'></li>");
            }

            $('#title').html($title);

            if (options.transition == "fade") {
                $this.children().css({
                    position: 'absolute',
                    left: 0,
                    top: 0
                });

                $this.css({
                    position: 'relative',
                });

                $this.parent().css({
                    width: $this.width(),
                    overflow: 'hidden'
                });

                for (var i = $this.children().length, y = 0; i > 0; i--, y++) {
                    $this.children().eq(y).css('zIndex', i + 99999)
                }

                var $cover = $('#cover');
                var $alert = $('#alert2');
                $alert.css("display", "none");
                $cover.css("display", "none");

                $coverSlider = $('#coverSlider');
                $coverSlider.css("display", "flex");

                fade();
            }

            function fade() {
                id = setInterval(function () {
                    var firstElement = $this.children().first();

                    if ($this.children().length > 1) {
                        firstElement.animate(
                            {opacity: 0},
                            options.speed,
                            function () {
                                var self = $(this);
                                self.css({
                                    zIndex: $this.children().last().css('zIndex') - 1,
                                    opacity: 1
                                });
                                $this.append(self);
                            }
                        );
                    }
                }, options.pause);
            }
        });
    }

})(jQuery);


function closeGallery() {
    clearInterval(id);
    var coverSlider = document.getElementById('coverSlider');
    var wrapper = document.getElementById('wrapper');
    coverSlider.removeChild(wrapper);
    var newList = document.createElement('ul');
    newList.setAttribute("id", "slider");
    coverSlider.appendChild(newList);
    coverSlider.style.display = "none";
}