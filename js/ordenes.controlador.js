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
				"posicion": posicion["coords"],
				"action": "savePosicionRuta"
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
				if (orden.idOrden == window.localStorage.getItem("orden")){
					$("#btnIniSeguimiento").hide();
					$("#btnStopSeguimiento").show();
				}else{
					$("#btnIniSeguimiento").show();
					$("#btnStopSeguimiento").hide();
				}
			});
			
			$("#ordenes").append(plantilla);
		});
	}, "json");
	
	$("#btnIniSeguimiento").click(function(){
		if (window.localStorage.getItem("orden") == '' || window.localStorage.getItem("orden") == undefined)
			setSeguimiento($("#btnIniSeguimiento").attr("orden"));
		else{
			mensajes.confirm({titulo: "¿Seguro?", mensaje: "Ya se está realizando el seguimiento de una orden ¿Estás seguro de detener para iniciar el de esta orden?", funcion: function(result){
				if (result)
					setSeguimiento($("#btnIniSeguimiento").attr("orden"));
			}})
		}
	});
	
	$("#btnStopSeguimiento").click(function(){
		cordova.plugins.backgroundMode.disable();
		window.localStorage.removeItem("orden");
		mensajes.log({mensaje: "El reporte de ubicación ha finalizado"});
	});
	
	function setSeguimiento(orden){
		window.localStorage.setItem("orden", orden);
		cordova.plugins.backgroundMode.enable();
		mensajes.log({mensaje: "Se inició el reporte de esta orden"});
	}
}