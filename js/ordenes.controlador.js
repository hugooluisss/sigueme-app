var mapaDetalle = undefined;
var bgGPS = false;
function ordenes(){
	$(".modulo").html(plantillas['ordenes']);
	$(".modulo").find("#btnRegresar").click(function(){
		$("#detalleOrden").hide();
	});
	
	cordova.plugins.backgroundMode.on('activate', function() {
		cordova.plugins.backgroundMode.disableWebViewOptimizations(); 
	});
	
	cordova.plugins.backgroundMode.setDefaults({
		title: "En ruta",
		text: "El seguimiento está en progreso",
		icon: 'icon', // this will look for icon.png in platforms/android/res/drawable|mipmap
		color: "F14F4D", // hex format like 'F14F4D'
		resume: true,
		hidden: false,
		bigText: Boolean
	});
	
	cordova.plugins.backgroundMode.on('enable', function(){
		cordova.plugins.backgroundMode.disableWebViewOptimizations(); 
		navigator.geolocation.watchPosition(function(posicion){
			$.post(server + "cordenes", {
				"movil": true,
				"orden": window.localStorage.getItem("orden"),
				"posicion": posicion
			}, function(resp){
				if (!resp.band)
					console.log('Punto no reportado');
			}).fail(function(){
				console.log('Error en el servidor al reportar la ubicación');
			});
		}, function(error){
			console.log("Error GPS", error);
		}, {
			enableHighAccuracy: false, 
			maximumAge        : 1200000, 
			timeout           : 1200000
		});
	});
	
	$.post(server + "cordenes", {
		"movil": 1,
		"usuario": objUser.idUsuario,
		"action": "getOrdenesTrabajador"
	}, function(ordenes){
		mapaDetalle = new google.maps.Map(document.getElementById("mapaDetalle"), {	
			scrollwheel: true,
			fullscreenControl: true,
			zoom: 10,
			zoomControl: true
		});
					
		$.each(ordenes, function(i, orden){
			var plantilla = $(plantillas['orden']);
			$.each(orden, function(key, valor){
				plantilla.find("[campo=" + key + "]").html(valor);
			});
			
			plantilla.find(".showDetalle").click(function(){
				$("#detalleOrden").show();
				$.each(orden, function(key, valor){
					$("#detalleOrden").find("[campo=" + key + "]").html(valor);
				});
				
				$("#puntosRevision").find("ul").find("li").remove();
				mapaDetalle.clearMarkers();
				$.each(orden.puntos, function(i, punto){
					var marca = new google.maps.Marker({
						title: punto.direccion,
						icon: {
							path: google.maps.SymbolPath.CIRCLE,
							scale: 10
						}
					});
					
					marca.setPosition(new google.maps.LatLng(punto.latitude, punto.longitude));
					marca.setMap(mapaDetalle);
					mapaDetalle.setCenter(marca.getPosition());
					
					
					var li = $("<li />", {
						text: punto.direccion,
						class: "list-group-item"
					});
					
					$("#puntosRevision").find("ul").append(li);
				});
				$("#btnIniSeguimiento").attr("orden", orden.idOrden);
				if (orden.idOrden == window.localStorage.getItem("orden"))
					$("#btnIniSeguimiento").hide();
				else
					$("#btnIniSeguimiento").show();
			});
			
			$("#ordenes").append(plantilla);
		});
	}, "json");
	
	$("#btnIniSeguimiento").click(function(){
		setSeguimiento($("#btnIniSeguimiento").attr("orden"));
	});
	
	function setSeguimiento(orden){
		window.localStorage.setItem("orden", orden);
		cordova.plugins.backgroundMode.enable();
	}
}