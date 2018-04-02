/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db = null;
var objUser;
var plantillas = {};
var posicionActual = undefined;

var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		document.addEventListener("backbutton", function(){
			return false;
		}, true);
		
		objUser = new TUsuario();
		
		getPlantillas({
			fn: {
				after: function(){
					home();
				}
			}
		});
	}
};

app.initialize();

$(document).ready(function(){
	//app.onDeviceReady();
	
	$("button[data-target]").click(function(){
		var self = $(this);
		$(self.attr("data-target")).show("slide", { direction: "left" }, 500);
	});
	
	$("button[hide-target]").click(function(){
		var self = $(this);
		$(self.attr("hide-target")).hide("slide", { direction: "left" }, 500);
	});
	
	$("#menuPrincipal").find("#menuOrdenes").click(function(){
		ordenes();
		
		$("#menuPrincipal").hide("slide", { direction: "left" }, 500);
	});
	
	$("#menuPrincipal").find("#menuInicio").click(function(){
		home();
		$("#menuPrincipal").hide("slide", { direction: "left" }, 500);
	});
	
	home();
});