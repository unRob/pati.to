(function(){
	var Programa = {
		engomado: {
			verde:		{nombre: 'verde',		color: "#339900", verifica: [3,4,9,10], descansa: 4},
			rojo:		{nombre: 'rojo',		color: "#ff3333", verifica: [2,3,8,9],  descansa: 3},
			amarillo:	{nombre: 'amarillo',	color: "#ffff66", verifica: [0,1,6,7],  descansa: 1},
			rosa:		{nombre: 'rosa',		color: "#ff99cc", verifica: [1,2,7,8],  descansa: 2},
			azul:		{nombre: 'azul',		color: "#66ccff", verifica: [5,6,10,11],descansa: 5}
		}
	};
	Programa.terminaciones = {
		1: Programa.engomado.verde,
		2: Programa.engomado.verde,
		3: Programa.engomado.rojo,
		4: Programa.engomado.rojo,
		5: Programa.engomado.amarillo,
		6: Programa.engomado.amarillo,
		7: Programa.engomado.rosa,
		8: Programa.engomado.rosa,
		9: Programa.engomado.azul,
		0: Programa.engomado.azul
	};


	if (typeof module !== 'undefined') {
		module.exports = Programa;
	} else {
		window.Programa = Programa;
	}
})();
