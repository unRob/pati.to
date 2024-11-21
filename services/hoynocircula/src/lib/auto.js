(function(){
	var Programa = (function(w){
		if (typeof module === 'undefined') {
			return window.Programa;
		} else {
			return require('./programa');
		}
	})();

	var Auto = function(placa, holograma){
		this.placa = placa;
		this.holograma = parseInt(holograma, 10);

		this.info = Programa.terminaciones[this.ultimo_digito()];
		return this;
	};

	Auto.prototype.ultimo_digito = function(){
		return parseInt(this.placa.toString().match(/(\d)\b/)[0]);
	};

	Auto.prototype.proxima_verificacion = function(fecha) {
		var fecha = fecha || new Date();
		var meses = this.info.verifica;
		var esteMes = fecha.getMonth();
	};


	if (typeof module !== 'undefined') {
		module.exports = Auto;
	} else {
		window.Auto = Auto;
	}

})();
