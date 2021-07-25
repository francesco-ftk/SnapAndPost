(function ($) {

    $.fn.slider = function (images, title, options) {

        var defaults = {
            speed: 100,
            transition: "fade"
        }

        $right = $('#right');
        $left = $('#left');

        $right.on('click', function (event) {
            fadeRight();
        });

        $left.on('click', function (event) {
            fadeLeft();
        });

        options = $.extend(defaults, options);

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
                    overflow: 'hidden',
                    order: 1
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

                if ($this.children().length > 1) {
                    $right.css("display", "block");
                    $left.css("display", "block");
                } else {
                    $right.css("display", "none");
                    $left.css("display", "none");
                }

            }

        });

        function fadeRight() {
            $this = $('#slider');
            var firstElement = $this.children().first();

            var a = 0;

            firstElement.animate(
                {opacity: 0},
                options.speed,
                function () {
                    if (a == 0) {
                        var self = $(this);
                        self.css({
                            zIndex: $this.children().last().css('zIndex') - 1,
                            opacity: 1
                        });
                        $this.append(self);
                        a++;
                    }
                }
            );
        }

        function fadeLeft() {
            $this = $('#slider');
            var lastElement = $this.children().last();

            lastElement.css({
                zIndex: parseInt($this.children().first().css('zIndex')) + 1,
                opacity: 0
            });

            var a = 0;

            lastElement.animate(
                {opacity: 1},
                options.speed,
                function () {
                    if (a == 0) {
                        var self = $(this);
                        $this.prepend(self);
                    }
                }
            );
        }
    }

})(jQuery);


function closeGallery() {
    var coverSlider = document.getElementById('coverSlider');
    var container = document.getElementById('container6');
    var wrapper = document.getElementById('wrapper');
    container.removeChild(wrapper);
    var newList = document.createElement('ul');
    newList.setAttribute("id", "slider");
    container.appendChild(newList);
    coverSlider.style.display = "none";
}