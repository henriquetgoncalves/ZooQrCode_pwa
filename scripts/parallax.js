$(function(){
    $(window).scroll(function() {
        var $parallax = $('header');
        var st = $(this).scrollTop();
        if (st > $parallax.height()){
            $parallax.height( st );
        }
        if( st == 0 ) {
            $parallax.hide();
        } else {
            $parallax.show();
        }
    }).scroll();
})