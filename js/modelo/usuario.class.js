TUsuario = function(datos){
	var self = this;
	this.idUsuario = "";
	this.nombre = "";
	this.email = "";
	
	if (datos == undefined)
		this.idUsuario = window.localStorage.getItem("sesion");
	else
		if (datos.idUsuario == '' || datos.idUsuario == undefined)
			this.idUsuario = window.localStorage.getItem("sesion");
		else
			this.idUsuario = datos.idUsuario;
		
	this.getDatos = function(datos){
		if (datos != undefined)
			if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cusuarios', {
				"usuario": self.idUsuario,
				"action": 'getData',
				"movil": true
			}, function(resp){
				self.nombre = resp.nombre;
				self.empresa = resp.idEmpresa;
				self.idPerfil = resp.idPerfil;
				self.email = resp.email;
				self.telefono = resp.telefono;
				
				if (datos != undefined)
					if (datos.fn.after !== undefined){
						datos.fn.after(resp);
					}
			}, "json");

	}
	
	this.getDatos(datos);
	
	this.login = function(datos){
		if (datos.before !== undefined) datos.before();
		
		$.post(server + 'clogin', {
				"usuario": datos.usuario,
				"pass": datos.pass,
				"action": 'login',
				"movil": true
			}, function(resp){
				if (resp.band == false)
					console.log(resp.mensaje);
					
				if (datos.after !== undefined)
					datos.after(resp);
			}, "json");
	}
	
	this.sendReporte = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cusuarios', {
				"usuario": self.idUsuario,
				"posicion": datos.posicion,
				"direccion": datos.direccion,
				"tipo": datos.tipo,
				"comentarios": datos.comentarios,
				"action": 'addReporteUbicacion',
				"movil": true
			}, function(resp){
				if (resp.band == false)
					console.log(resp.mensaje);
					
				if (datos.fn.after !== undefined)
					datos.fn.after(resp);
			}, "json");
	}
	
	this.getReportes = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'listareportesusuario', {
				"usuario": self.idUsuario,
				"json": true,
				"movil": true
			}, function(resp){
				if (resp.band == false)
					console.log(resp.mensaje);
					
				if (datos.fn.after !== undefined)
					datos.fn.after(resp);
			}, "json");
	}
};