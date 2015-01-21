(function($) {
    var defaults = {
        eventype: 'click',
        effect: "fade", //String: "none"  "fade"  "hSlide" "vSlide"         
        autoSlide: true,
        animDuration: 300,
        animSpeed: 3000,
        hoverStop: true,

        active: 0,
        content: ".ui-slide-content",
        controlNav: false,
        directionNav: false
    };

    function Slide(elem, option) {
        this.$container = $(elem);
        this.opts = $.extend({}, defaults, option);
        this.init();
    }

    Slide.prototype = {
        init: function() {
            var self = this,
                opts = self.opts;

            self.setup();
            self.render();
            self.bindEvent();
            self.activate();
        },
        setup: function() {
            var self = this,
                opts = self.opts,
                $container = self.$container,
                $panels;

            self.$content = $content = $container.find(opts.content);
            self.$panels = $panels = $content.children();
            self.activeIndex = 0;
            self.panelLength = $panels.length;
            self.panelWidth = $content.outerWidth();
            self.panelHeight = $content.outerHeight();
            self.zIndex = parseInt($container.css("zIndex"), 10);

            if (typeof opts.controlNav === "string") {
                self.$controlNav = $(opts.controlNav);
            }

            if (typeof opts.directionNav === "string") {
                self.$directionNav = $(opts.directionNav);
            }
        },
        render: function() {
            var self = this,
                opts = self.opts;

            self.doEffectInit();

            if (opts.controlNav === true) {
                self.buildControl("control");
            }

            if (opts.directionNav === true) {
                self.buildControl("direction");
            }
        },
        doEffectInit: function() {
            var self = this,
                opts = self.opts,

                effectInitFn = {
                    'none': function() {
                        self.$panels.css({
                            display: 'none'
                        });

                        self.$panels.eq(self.activeIndex).css({
                            'display': 'block'
                        });
                    },
                    'vSlide': function() {
                        self.buildWrap();

                        self.$content.css({
                            'height': self.panelLength * self.panelHeight + 'px',
                            'top': -1 * self.activeIndex * self.panelHeight + 'px',
                            'overflow': 'hidden'
                        });

                        self.$panels.css({
                            'float': 'none',
                            'overflow': 'hidden'
                        });
                    },

                    'hSlide': function() {
                        self.buildWrap();

                        self.$content.css({
                            'width': self.panelLength * self.panelWidth + 'px',
                            'overflow': 'hidden',
                            'left': -1 * self.activeIndex * self.panelWidth + 'px'
                        });

                        self.$panels.css({
                            'float': 'left',
                            'width': self.panelWidth + 'px',
                            'overflow': 'hidden'
                        });
                    },
                    'fade': function() {
                        self.$panels.css({
                            'position': 'absolute',
                            'zIndex': 0,
                            'width': self.panelWidth + 'px'
                        });
                    }
                };

            effectInitFn[opts.effect]();

            return self;
        },
        buildWrap: function() {
            var self = this;

            self.$animWrap = $("<div></div>").css({
                "position": "relative",
                'height': self.panelHeight + 'px',
                "overflow": "hidden"
            });

            self.$content.wrap(self.$animWrap);

            return self;
        },
        buildControl: function(type) {
            var self = this,
                length = self.panelLength,
                navStr = '';

            if (type === "control") {

                navStr += '<ol class="ui-slide-control">';
                for (var i = 1; i <= length; i++) {
                    navStr += '<li>' + i + '</li>';
                }
                navStr += '</ol>';

                self.$controlNav = $(navStr).appendTo(self.$container).css("zIndex", self.zIndex + 1);
            } else {
                navStr = '<p class="ui-slide-direction">' + '<a href="javascript:;" class="vm-prev"></a>' + '<a href="javascript:;" class="vm-next"></a>' + '</p>';

                self.$directionNav = $(navStr).appendTo(self.$container).css("zIndex", self.zIndex + 2);
            }
        },
        bindEvent: function() {
            var self = this,
                opts = self.opts;


            if (self.$controlNav !== undefined) {
                self.$controlNav.on("click", "li", function() {
                    var $elem = $(this),
                        index = $elem.index();

                    self.move(index);
                });
            }

            if (self.$directionNav !== undefined) {
                self.$directionNav.on("click", ".vm-prev", function() {
                    self.prev();
                });
                self.$directionNav.on("click", ".vm-next", function() {
                    self.next();
                });
            }
        },
        move: function(index) {
            var self = this,
                opts = self.opts,
                effectFn = {
                    'none': function() {
                        self.$panels.hide().eq(index).show();
                    },
                    'hSlide': function() {
                        self.$content.animate({
                            'left': -1 * self.panelWidth * index + 'px'
                        }, opts.animDuration);
                    },
                    'vSlide': function() {
                        self.$content.animate({
                            'top': -1 * self.panelHeight * index + 'px'
                        }, opts.animDuration);
                    },
                    'fade': function() {
                        self.$panels.eq(self.activeIndex).hide().end().eq(index).fadeIn();
                    }
                };
            if(self.activeIndex === index) return;

            effectFn[opts.effect]();
            self.activeIndex = index;
            self.activate(index);
            self.$container.trigger("move", [index]);
        },
        activate: function(index) {
            var self = this,
                opts = self.opts,
                active = index ? index : opts.active;

            self.$panels.eq(active).addClass("active").siblings().removeClass("active");

            if (self.$controlNav) {
                self.$controlNav.find("li").eq(active).addClass("active").siblings().removeClass("active");
            }
        },
        play: function() {
        },
        prev: function() {
            var self = this,
                currentIndex = self.activeIndex;

            if (currentIndex === 0) return;

            self.move(--currentIndex);
        },
        next: function() {
            var self = this,
                currentIndex = self.activeIndex;

            if (currentIndex >= self.panelLength - 1) return;

            self.move(++currentIndex);
        }
    };

    // bridging
    $.fn.vslide = function(option) {
        return this.each(function() {
            var $elem = $(this),
                data = $elem.data('vslide');

            if (!data) $elem.data('vslide', (data = new Slide(this, option)));
            if (typeof option == 'string') data[option]();
        });
    };
})(jQuery);