(function( $, undefined ) {
    $.widget( "ui.labeletipslider", $.ui.slider, {

      options: {
        show_marker:false,
        show_tip:false,
        tickInterval: 0,
        tickLabels: null,
        tip_format:null,
        show_dis:true,
        toolTip:{
          'color':'black',
          'text-align': 'center',
          'background-color':'yellow',
          'width':'120',
          'height':'20',
          'top':-30
        }
      },

      uiSlider: null,
      tickInterval: 0,

      _create: function( ) {

        $this = this
        this._detectOrientation();

        if(this.options.show_marker){
          this._buildMarker();
        }

        this._super();

        if (this.options.show_tip){
          this._buildToolTip();
        }
        
      },

      _buildMarker:function(){
        this.uiSlider =
          this.element
          .wrap( '<div class="ui-slider-wrapper ui-widget"></div>' )
          .before( '<div class="ui-slider-labels">' ).parent()
          .addClass( this.orientation )
          .css( 'font-size', this.element.css('font-size') );

        this.element.removeClass( 'ui-widget' )
        this._alignWithStep();
        if ( this.orientation == 'horizontal' ) {
          this.uiSlider.width( this.element.width() );
        } else {
          this.uiSlider.height( this.element.height() );
        }
        this._drawLabels();        
      },

      _buildToolTip:function(){
        this.element.find('.ui-slider-handle').each(function(i,handle){

          var handle_width = $($this.handles[i]).width();
          
          // set horizontal tooltip left  position  value
          if(!$this.options.toolTip.left){
            var left_value =  0 - (parseInt($this.options.toolTip.width / 2)  - handle_width / 2) + 'px';
            $this.options.toolTip.left = left_value;
          }
   
          // set tooltip final style
          var style_string = JSON.stringify($this.options.toolTip);
          var tip_value    = $this.values(i);
          var tip_format   = $this.options.tip_format;
          var tip_txt = $this.values(i);
          
          var tip = $('<div class="tooltip"  value="' + tip_txt + ' "/>')
            .css('position','absolute')
            .css(JSON.parse(style_string))
            .text(tip_txt)
            .hide();

          $(this).text(''); // remove old tooltip before append new
          $(this).append(tip).hover(function(){
            if($this.options.tip_format){
              tip.text(tip_format.replace('{value}',tip.attr('value')))
              tip.show();
            }else{
              tip.show();  
            } 
          },function(){
            tip.hide();
          });
        })
      },

      _drawLabels: function () {
        if(this.options.show_marker){
          var labels = this.options.tickLabels || {},
          $lbl = this.uiSlider.children( '.ui-slider-labels' ),
          dir = this.orientation == 'horizontal' ? 'left' : 'bottom',
          min = this.options.min,
          max = this.options.max,
          inr = this.tickInterval,
          cnt = ( max - min ) / inr,
          i = 0;
  
          $lbl.html('');
  
          for (;i<=cnt;i++) {
            $('<div>').addClass( 'ui-slider-label-ticks' )
            .css( dir, (Math.round( i / cnt * 10000 ) / 100) + '%' )
            .html( '<span>'+( labels[i*inr] ? labels[i*inr] : i*inr )+'</span>' )
            // .html( '<span>'+( labels[i*inr+min] ? labels[i*inr+min] : i*inr+min )+'</span>' )
            .appendTo( $lbl );
          }
        }
      },

      _setOption: function( key, value ) {

          this._super( key, value );

          switch ( key ) {

             case 'tickInterval':
             case 'tickLabels':
             case 'min':
             case 'max':
             case 'step':

                this._alignWithStep();
                this._drawLabels();
                break;

             case 'orientation':
                this.element
                   .removeClass( 'horizontal vertical' )
                   .addClass( this.orientation );

                this._drawLabels();
                break;
          }
       },

      _alignWithStep: function () {
        if(this.options.show_marker){
          if ( this.options.tickInterval < this.options.step )
            this.tickInterval = this.options.step;
          else
            this.tickInterval = this.options.tickInterval;
        }
      },

       _destroy: function() {
          this._super();
          this.uiSlider.replaceWith( this.element );
       },

       widget: function() {
          this.uiSlider = this.uiSlider || this.element;
          return this.uiSlider;
       }

   });

}(jQuery));