/*jshint expr:true */
var VERSION = '0.0.3';

document.addEventListener('DOMContentLoaded', function(){

	var storage = window.localStorage;

	var _show = function(el) {el = el.container || el; el.classList.remove('hidden');};
	var _hide = function(el) {el = el.container || el; el.classList.add('hidden');};
	var DOM = {
		setup: {
			container: document.querySelector('#setup'),
			placa: document.querySelector('#placa'),
			hologramas: document.getElementsByName('holograma'),
			valueFor: function(el) {
				if (el === 'placa') {
					return DOM.setup.placa.value.replace(/\D/g, '+');
				} else if (el === 'holograma') {
					return (function(els){
						var num;
						[].forEach.call(els, function(el){
							if (el.checked) {
								num = el.value;
							}
						});
						return parseInt(num, 10);
					})(DOM.setup.hologramas);
				}
			}
		},
		result: {
			container: document.querySelector('#result'),
			header: document.querySelector('#hoy-circulo'),
			razon: document.querySelector('#razon'),
			warn: document.querySelector('#warn')
		}
	};

	var Actions = {
		Reset: function(evt) {
			evt && evt.preventDefault();
			_show(DOM.setup);
			_hide(DOM.result);
		},
		Setup: function(evt) {
			evt && evt.preventDefault();
			var placa = DOM.setup.valueFor('placa');
			var holograma = DOM.setup.valueFor('holograma');

			if (!placa || placa.length < 3 || placa.length > 4) {

				alert("Parece que no has introducido correctamente los datos de tu placa :(");
				DOM.setup.placa.focus();
				return;
			}

			if ([0,1,2].indexOf(holograma) < 0) {
				alert("Es necesario que elijas el holograma de tu vehículo");
				return;
			}

			console.log('storing...');
			storage.placa = placa;
			storage.holograma = holograma;
			Actions.Result();
		},
		Result: function(){
			_show(DOM.result);
			_hide(DOM.setup);
			var d = new Date();
			var mi_auto = new Auto(storage.placa, storage.holograma);
			var clase;

			var res = Circula(mi_auto, d);

			clase = res.circula ? 'yay' : 'nay';
			if (res.warn) {
				DOM.result.warn.innerText = res.warn;
				clase = 'warn';
				_show(DOM.result.warn);
			} else {
				_hide(DOM.result.warn);
			}
			DOM.result.header.className = clase;
			DOM.result.header.innerText = res.circula ? 'Sí' : 'No';
			DOM.result.razon.innerText = res.razon;
		}
	};



	if (storage.placa && storage.holograma) {
		DOM.setup.placa.value = storage.placa;
		DOM.setup.hologramas[parseInt(storage.holograma, 10)].checked = 'checked';
		Actions.Result();
	} else {
		Actions.Reset();
	}

	document.querySelector('#guardar-datos').addEventListener('mouseup', Actions.Setup);
	document.querySelector('#guardar-datos').addEventListener('touchend', Actions.Setup);
	document.querySelector('#reset').addEventListener('mousedown', Actions.Reset);
	document.querySelector('#reset').addEventListener('touchend', Actions.Reset);

	var doFlip = function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		var card = document.querySelector('#card');
		card.classList.toggle('flipped');
		return false;
	};

	[].forEach.call(document.querySelectorAll('.flippy'), function(el) {
		el.addEventListener('click', doFlip, false);
	});

});
