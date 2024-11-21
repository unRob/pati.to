var Auto = require('../lib/auto');
var autos = require('./_autos');


describe("Últimos dígitos de las placas", function(){

	it("debería mostrar los últimos dígitos de las placas", function(){
		autos.forEach(function(auto){
			var a = new Auto(auto.placa, auto.holograma);
			//console.log(a);
			expect(a.ultimo_digito()).toBe(auto.ultimo_digito);
		});
	});

});