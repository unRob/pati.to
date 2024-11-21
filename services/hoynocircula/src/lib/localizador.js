(function(){

	var Localizador = function(i, tipo) {
		tipo = tipo || 'dias';
		var type = (typeof i).toLowerCase();
		var opts = Localizador[tipo];
		if (type === 'string' || type === 'number') {
			return opts[i-1];
		} else {
			return i.map(function(periodo){ return opts[periodo-1]; });
		}
	};

	Localizador.dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	Localizador.meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

	if (typeof module !== 'undefined') {
		module.exports = Localizador;
	} else {
		window.Localizador = Localizador;
	}

})();