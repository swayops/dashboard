function initIncrGroup() {

  $(".increment-group").append('<div class="btn-action"><div class="inc button">+</div><div class="dec button">-</div></div>');

  $(".increment-group .button").on("click", function() {

    var $button = $(this);
    var oldValue = $button.parent().parent().find("input").val();

    if ($button.text() == "+") {
  	  var newVal = parseFloat(oldValue) + 1;
  	} else {
	   // Don't allow decrementing below zero
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
	    } else {
        newVal = 0;
      }
	  }

    $button.parent().parent().find("input").val(newVal);

  });

};


function hexFromRGB(r, g, b) {
    var hex = [
      r.toString( 16 ),
      g.toString( 16 ),
      b.toString( 16 )
    ];
    $.each( hex, function( nr, val ) {
      if ( val.length === 1 ) {
        hex[ nr ] = "0" + val;
      }
    });
    return hex.join( "" ).toUpperCase();
  }
  $(function() {

    // $( "#progress1-bar" ).slider( "value", 50 );
    // $( "#progress2-bar" ).slider( "value", 50 );
    // $( "#progress3-bar" ).slider( "value", 50 );
	// $( "#progress4-bar" ).slider( "value", 50 );
	$( ".prog-bar div" ).each(function( index ) {
	  $( this ).slider({
		  orientation: "horizontal",
		  range: "min",
		  max: 100,
		  value: $( this ).attr('data')
		});

	});
  });

function initSliderRange() {

	$( ".slider-range" ).each(function( index ) {
	  $( this ).slider({
		  range: true,
		  min: $(this).attr('data-min'),
		  max: $(this).attr('data-max'),
		  values: [ $(this).attr('data-start'), $(this).attr('data-end') ],
		  slide: function( event, ui ) {
			$( this ).siblings().val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
		  }
		});

	});

	$('.notification .fui-cross').click(function(){
		$( this ).parent().fadeOut(450);
	});

 };