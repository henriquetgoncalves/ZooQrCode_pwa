$( ".main-parallax" ).scroll(function() {
    var $parallax = $('header');
            var st = $(this).scrollTop();
            if( st == 0 ) {
                $parallax.fadeIn( "slow" );
            } else {                
                $parallax.fadeOut( "slow" );
            }    
});