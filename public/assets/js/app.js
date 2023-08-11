// Template Name: AnimeLoop
// Template URL: https://techpedia.co.uk/AnimeLoop/
// Description: AnimeLoop HTML5 Template
// Author: TPD-Themes
// Version: 1.0.0
(function (window, document, $, undefined) {
  "use strict";
  var animeInit = {
    i: function (e) {
      animeInit.s();
      animeInit.methods();
    },
    s: function (e) {
      (this._window = $(window)),
        (this._document = $(document)),
        (this._body = $("body")),
        (this._html = $("html"));
    },
    methods: function (e) {
      animeInit.w();
      animeInit.hidepreloader();
      animeInit.animeBackToTop();
      animeInit.intializeSlick();
      animeInit.countdownInit(".countdown", "2023/12/01");
      animeInit.salActivation();
      animeInit.weeklyScheduleNav();
      animeInit.videplay();
      animeInit.continueEmail();
      animeInit.trailerModel();
    },
    w: function (e) {
      this._window.on("load", animeInit.l).on("scroll", animeInit.res);
    },
    hidepreloader: function () {
     
      $(document).ready(function(){
        var img = document.getElementById('logo-gif');
        var src = img.src;
        img.src = '';
        img.src = src;
 
        setTimeout(() => {
          setTimeout(() => {
            $('#preloader').animate({ opacity: 0 }, 500);
            setTimeout(() => {
              $('#preloader').hide();
            }, 4000);
      
          }, 1000);
          $('#logo-gif').animate({ opacity: 0 }, 1000);
        }, 4000);
        
      });
    },
    animeBackToTop: function () {
      var btn = $("#backto-top");
      $(window).on("scroll", function () {
        if ($(window).scrollTop() > 300) {
          btn.addClass("show");
        } else {
          btn.removeClass("show");
        }
      });
      btn.on("click", function (e) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          "300"
        );
      });
    },
    countdownInit: function (countdownSelector, countdownTime) {
      var eventCounter = $(countdownSelector);
      if (eventCounter.length) {
        eventCounter.countdown(countdownTime, function (e) {
          $(this).html(
            e.strftime(
              " <li>%D<small>d</small></li>\
                            <li>%H<small>h</small></li>\
                            <li>%M<small>m</small></li>\
                            <li>%S<small>s</small></li>"
            )
          );
        });
      }
    },
    salActivation: function () {
      sal({
        threshold: 0.1,
        once: true,
      });
    },
    intializeSlick: function (e) {
      if ($(".banner-slider").length) {
        $(".banner-slider").slick({
          infinite: true,
          arrows: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          fade: true,
          responsive: [
            {
              breakpoint: 992,
              settings: {
                arrows: false,
              },
            },
          ]
        });
      }
      if ($(".date-slider").length) {
        $(".date-slider").slick({
          infinite: true,
          arrows: true,
          slidesToShow: 7,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 991,
              settings: {
                arrows: true,
                slidesToShow: 5,
              },
            },
            {
              breakpoint: 768,
              settings: {
                arrows: true,
                slidesToShow: 4,
              },
            },
            {
              breakpoint: 480,
              settings: {
                arrows: true,
                slidesToShow: 3,
              },
            },
          ],
        });
      }
      if($('.banner-presonal').length){
        $('.banner-presonal').slick({

          arrows: false,
          dots:true,
          draggable:true,
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                draggable:true,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: false,
                draggable:true,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                draggable:true,
                infinite: true,
                dots: true

              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
        });}
    },
    videplay: function () {
      $(".video .play-btn").on("click", function () {
        $(".video .img-box").hide("slow");
        $(".video .video-box").show("slow");
      });
    },
    weeklyScheduleNav: function () {
      var el = $('.date-slider .nav-item a');
      if (el.length) {
        el.on("click", function () {
          $('.date-slider .nav-item .nav-link').removeClass('active');
          $(this).addClass('active');
        });
      }
    },
    continueEmail: function () {
      $('#continue-email').on('click',function(){
        $('.hide-link').hide()
        $('.login-sec').show()
      })
    },
    trailerModel:function(){
      $('#videoModal').on('hidden.bs.modal', function () {
        $("#videoModal iframe").attr("src", $("#videoModal iframe").attr("src"));
    });
    }
  };
  animeInit.i();
})(window, document, jQuery);
