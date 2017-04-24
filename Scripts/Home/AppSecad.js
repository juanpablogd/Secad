var AppSecadCasos={
  glo:{
  	geom:['cod_dpto','cod_prov','cod_mpio'],
  	geoAdmin:[]
  },
  info:'',
  source:{
  	Mun:'',
  	Prov:'',
  	Dpto:''
  },
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
    	 r: parseInt(result[1], 16),g: parseInt(result[2], 16),b: parseInt(result[3], 16)
    } : null;
  },
  styleFunction:function(feature) {
  	var prop=feature.getProperties();
 	var rgb=AppSecadCasos.hexToRgb(prop.fill);
    return new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: prop.stroke,
            width: 1
          }),
          fill: new ol.style.Fill({
            color: "rgba("+rgb.r+","+rgb.g+","+rgb.b+",0.8)"            
          })
     });
  },
  AutoDisplayLeyend:function(c){
			var leyend=document.getElementById('labels');
			var labels=[];
			for(var i=0;i<c.symbols.length;i++){
				labels.push('<div>'+numeral(c.symbols[i].from).format('0,0')+' - '+numeral(c.symbols[i].to).format('0,0')+'</div>');
			}
			leyend.innerHTML=labels.join('');
			var leyend=document.getElementById('symbols');
			var labels=[];
			for(var i=0;i<c.symbols.length;i++){
				labels.push('<div class="symbolBox" style="background-color:'+c.symbols[i].color+'"></div>');
			}
			leyend.innerHTML=labels.join('')
  },
  displayFeatureInfo:function(pixel) {
        AppSecadCasos.info.css({
          left: pixel[0] + 'px',
          top: (pixel[1] - 5) + 'px'
        });
        var feature = AppMap.map.forEachFeatureAtPixel(pixel, function(feature) {
          return feature;
        });
        if (feature) {
          AppSecadCasos.info.tooltip('hide')
              .attr('data-original-title', feature.get('n')+'<br>'+feature.get('cont'))
              .tooltip('fixTitle')
              .tooltip('show');
        } else {
          AppSecadCasos.info.tooltip('hide');
  		}
  },
  geoTooltip:function(){
  	AppSecadCasos.info = $('#info');
    AppSecadCasos.info.tooltip({animation: false, trigger: 'manual',html:true});
    AppMap.map.on('pointermove', function(evt) {
        if (evt.dragging) {
          AppSecadCasos.info.tooltip('hide');
          return;
        }
        AppSecadCasos.displayFeatureInfo(AppMap.map.getEventPixel(evt.originalEvent));
    });
	AppMap.map.on('click', function(evt) {AppSecadCasos.displayFeatureInfo(evt.pixel);});
  },
  lyr:{
  	Mun:'',
  	Prov:'',
  	Dpto:''
  },
  socket:io.connect(Config.UrlSocket+'/SecadCasos'),
  GetGeo:function(){
	AppSecadCasos.socket.emit('GetGeom',"data",function(data){
		//console.log(data);
		//console.log(data);
	 	$.each( AppSecadCasos.glo.geom, function( i, val ){
	 		var geo =Func.Decrypted(data[val]);
			AppSecadCasos.glo.geoAdmin[val]=topojson.feature(geo, geo.objects.collection);
	    });
    	console.log(AppSecadCasos.glo.geoAdmin);
    	AppSecadCasos.asigDataGeo();
    });
  },
  getData:function(){
  	var data={fecha:'2017-01-12',tipo:'all'}
  	AppSecadCasos.socket.emit('GetData',data,function(data){
  		$.each(AppSecadCasos.glo.geoAdmin["cod_mpio"].features, function( index, value ) {
		  var as=$(data).filter(function (i,n){return n.cod===value.properties.id});
		  if(as.length==1)	AppSecadCasos.glo.geoAdmin["cod_mpio"].features[index].properties.cont=as[0].cont;
		  else 	AppSecadCasos.glo.geoAdmin["cod_mpio"].features[index].properties.cont=0;
		});
		AppSecadCasos.crearGeo();
    });
  },
  asigDataGeo:function(){
  		AppSecadCasos.getData();
  },
  crearGeo:function(){
  	//console.log(AppSecadCasos.glo.geoAdmin["cod_mpio"]);
  	var z = 'cont',numberOfBreaks = 7,colors = ['white','yellow', 'orange', '#8A0808'];
	geoJenks = geocolor.jenks(AppSecadCasos.glo.geoAdmin["cod_mpio"], z, numberOfBreaks, colors);
	console.log(geoJenks);
	AppSecadCasos.AutoDisplayLeyend(geoJenks.legend);
	AppSecadCasos.source.Mun=new ol.source.Vector({
	    features: (new ol.format.GeoJSON()).readFeatures(geoJenks)
	});
     AppSecadCasos.source.Prov=new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(AppSecadCasos.glo.geoAdmin["cod_prov"])
     });
     AppSecadCasos.source.Dpto=new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(AppSecadCasos.glo.geoAdmin["cod_dpto"])
     });
     AppSecadCasos.lyr.Mun= new ol.layer.Vector({
        source: AppSecadCasos.source.Mun,
        style: AppSecadCasos.styleFunction
     });
     //console.log("paso");
     AppMap.map.addLayer(AppSecadCasos.lyr.Mun);
  },
  	
  Init:function(){
  	$('#fechaIni').datetimepicker({
            format: 'DD/MM/YYYY',
            inline: true,
            locale: 'es'
            
    });
    $('#fechaIni').data('DateTimePicker').date(moment('20170101','YYYYMMDD'));
    
    $('#fechaFin').datetimepicker({
            format: 'DD/MM/YYYY',
            inline: true,
            locale: 'es'
    });
    
    
    
 	AppSecadCasos.GetGeo();
  	AppSecadCasos.geoTooltip();
  }
}

AppSecadCasos.Init();
