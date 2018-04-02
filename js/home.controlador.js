function home(){
	var mapaHome = undefined;
	
	$.get("vistas/home.html", function(resp){
		$(".modulo").html(resp);
		
		getReportes();
		
		setInterval(function(){
			navigator.geolocation.getCurrentPosition(function(pos){
				posicionActual = pos.coords;
			});
		}, 1000);
		
		$("#winCompartirUbicacion").on('show.bs.modal', function (e) {
			$("#winCompartirUbicacion").find("form")[0].reset();
			$.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + posicionActual.latitude + "," + posicionActual.longitude + "&key=" + key_maps, function(resp){
				$("#winCompartirUbicacion").find("[campo=direccion]").text(resp.results[0].formatted_address);
			}, "json");
		});
		
		$.post(server + "listatiporeportes", {
			"movil": 1,
			"json": true,
			"usuario": objUser.idUsuario
		}, function(resp){
			$("#selTipoReporte").find("option").remove();
			
			$.each(resp, function(i, el){
				$("#selTipoReporte").append($("<option />", {
					text: el.nombre,
					value: el.idTipoReporte
				}));
			});
		}, "json");
		
		
		$("#winCompartirUbicacion").find("form").validate({
			debug: true,
			errorClass: "validateError",
			rules: {
				selReporte: {
					required : true
				}
			},
			wrapper: 'span',
			submitHandler: function(form){
				form = $(form);
				objUser.sendReporte({
					"posicion": posicionActual,
					"direccion": $("#winCompartirUbicacion").find("[campo=direccion]").html(),
					"tipo": form.find("#selTipoReporte").val(),
					"comentarios": form.find("#txtComentarios").val(),
					fn: {
						before: function(){
							form.find("[type=submit]").prop("disabled", true);
						},
						after: function(resp){
							form.find("[type=submit]").prop("disabled", false);
							
							if (resp.band){
								mensajes.alert({mensaje: "Tu reporte de ubicación fue entregado", "titulo": "Envío entregado"});
								$("#winCompartirUbicacion").modal("hide");
								getReportes();
							}else
								mensajes.alert({mensaje: "No se pudo entregar, intenta más tarde", "titulo": "Error"});
						}
					}
				})
			}
		});
	});
	
	function getReportes(){
		$("#listaReportes").find("div").remove();
		objUser.getReportes({
			fn: {
				after: function(reportes){
					$.each(reportes, function(i, reporte){
						var tpl = $(plantillas['reportePosicion']);
						$.each(reporte, function(key, valor){
							tpl.find("[campo=" + key + "]").text(valor);
						});
						
						tpl.find("i").addClass(reporte.icono).css("color", reporte.color);
						
						$("#listaReportes").append(tpl);
					});
				}
			}
		});
	}
}