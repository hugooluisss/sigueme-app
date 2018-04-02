var mapaDetalle = undefined;
var bgGPS = false;
function ordenes(){
	$(".modulo").html(plantillas['ordenes']);
	$(".modulo").find("#btnRegresar").click(function(){
		$("#detalleOrden").hide();
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
				
				if (orden.idOrden == window.localStorage.setItem("orden"))
					$("#btnIniSeguimiento").hide();
				else
					$("#btnIniSeguimiento").show();
			});
			
			$("#ordenes").append(plantilla);
		});
	}, "json");
	
	function setSeguimiento(orden){
		window.localStorage.setItem("orden", orden);
		backgroundGeolocation.configure(function(location) {
			$.post(server + "cordenes", {
				"movil": true,
				"orden": window.localStorage.getItem("orden"),
				"posicion": location
			}, function(resp){
				if (!resp.band)
					console.log('Punto no reportado');
			}).fail(function(){
				console.log('Error en el servidor al reportar la ubicación');
			});
		}, function(error) {
			console.log('BackgroundGeolocation error');
		}, {
			desiredAccuracy: 10,
			stationaryRadius: 10,
			distanceFilter: 5,
			locationProvider: 0,
			interval: 10,
			fastestInterval: 5,
			activitiesInterval: 10,      
			notificationText: 'Seguimiento en proceso',
			notificationIconColor: '#F47321'
		});
		
		  backgroundGeolocation.start();
	}
}