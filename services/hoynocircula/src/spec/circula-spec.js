var Auto = require('../lib/auto')
var Circula = require('../lib/circula');
var autos = require('./_autos');

describe('Con Holograma Cero', function(){

	it("Debe permitir todos los dias", function(){
		autos.forEach(function(auto){
			if (auto.holograma == 0) {
				a = new Auto(auto.placa, auto.holograma);
				expect(Circula(a, 0).circula).toBe(true);
			}
		});
	});

});


describe('Los lunes', function(){

	var lunes = new Date(1898,10,21,16); // René Magritte

	autos.forEach(function autoLunes(auto){
		var puede = auto.results.lunes;
		var accion = puede ? 'permitir' : 'negar';
		it("Debe "+accion+" a "+auto.nombre+" circular", function(){
			var a = new Auto(auto.placa, auto.holograma);
			expect(Circula(a, lunes).circula).toBe(auto.results.lunes);
		});
	});
	
	
});


describe('Los viernes', function(){

	
	var viernes = new Date(1879,02,14,5); // Albert Einstein

	autos.forEach(function autoViernes(auto){
		var puede = auto.results.viernes;
		var accion = puede ? 'permitir' : 'negar';
		var a = new Auto(auto.placa, auto.holograma);
		
		it("Debe "+accion+" a "+auto.nombre+':'+a.info.descansa+" circular", function(){
			expect(auto.results.viernes)
			.toBe(Circula(a, viernes).circula);
		});
	});


});