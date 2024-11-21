(function(){

	var entre_semana = function(auto, date) {
		if (auto.holograma === 0) {
			return true;
		}
		
		return auto.info.descansa !== date.getDay();
	};
	var los_sabados = function(auto, date) {
		if (auto.holograma === 0) {
			return true;
		}
		
		if (auto.holograma === 2) {
			return false;
		}

		//es 1 entonces..

		var sabados = (function(dia){
			dia = new Date(dia);
			var mes = dia.getMonth();
			var ret = [];
			while (dia.getMonth() === mes) {
				if (dia.getDay() === 6)
					ret.push(dia.getDate());
				dia = new Date(dia.setDate(dia.getDate()+1));
			}
			return ret;
		})(date.setDate(1));

		var numSabado = sabados.indexOf(date.getDay())+1;
		if (numSabado === 5) {
			// Sólo holograma 2 deja de circular el quinto sábado del mes
			return true;
		}

		var par = auto.ultimo_digito() % 2 === 0;
		return (numSabado%2===0) ? par : !par;

	};

	var sabados_descansa = function(auto, circula) {
		circula = circula || false;
		switch (auto.holograma) {
			case 0:
				return false;
			case 1:
				var placaPar = (auto.ultimo_digito() % 2 === 0);
				var impar = 'el primer y tercer sábado';
				var par = 'el segundo y cuarto sábado';
				return placaPar ? par : impar;
			case 2:
				return "todos los sábados";
		}
	};

	var Circula = function(auto, fecha) {
		var r = {};
		if (auto.holograma === 0) {
			r.circula = true;
			r.razon = "Tú circulas todos los días, chatoa!";
		} else {
			fecha = fecha || new Date();
			var numDia = fecha.getDay();

			var dia_descanso = Localizador(auto.info.descansa);

			if (numDia === 0) {
				r.circula = true;
				r.razon = "Todos los vehículos circulan el día domingo. Tu vehículo descansa todos los "+dia_descanso;
				ds = sabados_descansa(auto);
				r.razon += ds && " y "+ds+" del mes";
			} else if (numDia <= 5) {
				r.circula = entre_semana(auto, fecha);
				info = auto.info;
				r.razon = r.circula ? 
					"Los vehículos engomado color "+auto.info.nombre+" circulan hoy y descansan el "+dia_descanso :
					"Los vehículos con placa terminación "+auto.ultimo_digito()+" no circulan los días "+Localizador(numDia);
			} else {
				r.circula = los_sabados(auto, fecha);
				r.razon = "Tu vehículo holograma "+auto.holograma+" ";

				if (auto.holograma == 2) {
					r.razon += "no circula ningún sábado del mes";
				} else {
					var placaPar = (auto.ultimo_digito() % 2);
					var numero = '';
					var impar = 'primer y tercer';
					var par = 'segundo y cuarto';
					if (r.circula) {
						r.razon += " circula el "+
						(placaPar ? impar : par)+
						" sábado del mes";
					} else {
						r.razon += " no circula el "+
						(placaPar ? par : impar)+
						" sábado del mes";
					}
				}
				
			}

			r.razon += '.';

			if (!r.circula) {
				antes5 = (fecha.getHours() < 5);
				despues10 = (fecha.getHours() > 21);

				if (antes5 || despues10) {
					r.circula = true;
					r.warn = antes5 ? "No circulas de 5:00am a 10:00pm" : "Sólamente pasado de las 10:00pm";
				} else {
					r.warn = "Sólo circulas después de las 10:00pm";
				}
			}

		}
		return r;
	};

	if (typeof module !== 'undefined') {
		module.exports = Circula;
		Localizador = require('./localizador');
	} else {
		window.Circula = Circula;
	}

})();