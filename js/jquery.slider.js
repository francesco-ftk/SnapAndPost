(function($){

    $.fn.slider = function(options){

        var defaults = {
            speed: 1000,
            pause: 2000,
            transition: "slide"
        }

        options = $.extend(defaults, options);

        console.log("options.speed: " + options.speed);
        console.log("options.pause: " + options.pause);
        console.log("options.transition: " + options.transition);

        if (options.pause <= options.speed){
            options.pause = options.speed + 100;
        }

        return this.each(function(){
            console.log("init instance");

            var $this = $(this);

            $this.wrap('<div class="slider-wrap"></div>');

            if(options.transition == "slide"){

                $this.css({
                    width: '9999px',
                    position: 'relative',
                    padding: 0
                });

                $this.children().css({
                    float: 'left',
                    listStyleType: 'none'
                });

                $this.parent().css({
                    width: $this.children(0).width(),
                    overflow: 'hidden'
                });

                slide();
            }

            function slide(){

                setInterval(function(){
                    $this.animate(
                        {left: '-' + $this.parent().width()},
                        options.speed,
                        function(){
                            $this.css('left', 0)
                                .children(":first")
                                .appendTo($this);
                        }
                    )
                }, options.pause)

            }


        });

    }

})(jQuery);