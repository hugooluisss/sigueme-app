var server = "http://192.168.0.5/sigueme-web/";
var server = "http://192.168.2.4/sigueme-web/";
var server = "http://sigueme.cpymes.com.mx/";
var key_maps = "AIzaSyDksOeHNOatBXxpyejOzleqK6PZCQk2gq0";


function showPanel(panel, after, efecto){
	$("[panel]").hide();
	
	if (after == undefined)
		after = null;
	
	switch(efecto){
		case 'faderight':
			$("[panel=" + panel + "]").show("slide", { direction: "right" }, 500);
		break;
		case 'fadeleft':
			$("[panel=" + panel + "]").show("slide", { direction: "left" }, 500);
		break;
		case 'slow':
			$("[panel=" + panel + "]").show("slow", after);
		break;
		default:
			$("[panel=" + panel + "]").show(1, after);
			
	}
}


var mensajes = {
	alert: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		try{
			navigator.notification.alert(data.mensaje, data.funcion, data.titulo, data.boton);
		}catch(err){
			window.alert(data.mensaje);
		}

	},
	
	confirm: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.confirm(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			if (confirm(data.mensaje))
				data.funcion(1);
			else
				data.funcion(2);
		}
	},
	
	log: function(data){
		alertify.log(data.mensaje);
	},
	
	prompt: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.prompt(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			var result = prompt(data.mensaje);
			data.funcion({
				buttonIndex: 1,
				input1: result
			});
		}
	},
};


function checkConnection(alertar = true) {
	try{
		var networkState = navigator.connection.type;
	
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
		
		switch(networkState){
			case Connection.NONE:
				if(alertar)
					alertify.error("Verifica tu conexión, la aplicación necesita conexión a internet");
					
				return false;
			break;
			default:
				return true;
		}
	}catch(e){
		return true;
	}
}

function getPlantillas(){
	plantillas['ordenes'] = "";
	plantillas['orden'] = "";
	plantillas['reportePosicion'] = "";
	
	$.each(plantillas, function(pl, valor){
		$.get("vistas/" + pl + ".html", function(html){
			plantillas[pl] = html;
		});
	});
};

(function() {
    // Añado a Map un array con los markers que contiene
    google.maps.Map.prototype.markers = new Array();
 
    // Añado a Map un método clearMakers que borrar los markers
    google.maps.Map.prototype.clearMarkers = function() {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = new Array();
    };
 
    // Reescribo el método setMap de Marker para que cuando se 
    // asigne el map se guarde en la propiedad markers del map
    // OJO: almaceno en oldSetMap el antiguo método setMap
    //      para poder seguir utilizándolo
    var oldSetMap = google.maps.Marker.prototype.setMap;
    google.maps.Marker.prototype.setMap = function(map) {
        if (map) {
            map.markers.push(this);
        }
        oldSetMap.call(this, map);
    }
})();