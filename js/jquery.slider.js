(function($){

    $.fn.slider = function(images, title, options){

        var defaults = {
            speed: 1000,
            pause: 2000,
            transition: "slide"
        }

        options = $.extend(defaults, options);

        if (options.pause <= options.speed){
            options.pause = options.speed + 100;
        }

        return this.each(function(){
            console.log("Carosello");

            var $this = $(this);

            $this.wrap('<div class="slider-wrap"></div>');

            $title= title;
            for(var i=0; i<images.length; i++){
                $src= images[i].img;
                $this.prepend("<li><img src="+$src+" alt="+ $title +" height='100px'></li>");
            }

            if(options.transition == "slide"){

                $this.css({
                    width: '9999px',
                    position: 'relative'
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

                $coverSlider= $('#coverSlider');
                $coverSlider.css("display", "flex");

                setInterval(function(){
                    $this.animate(
                        {left: '-' + $this.parent().width()},
                        options.speed,
                        function(){
                            $this.css('left', 0)
                                .children(":first")
                                .appendTo($this);
                            $this.parent().css({
                                width: $this.children(0).width()
                            });
                        }
                    )
                }, options.pause)

            }


        });

    }

})(jQuery);