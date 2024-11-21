module.exports = [
	{
		nombre: "Local,H0",
		placa: 666,
		holograma: 0,
		ultimo_digito: 6,
		results: {
			lunes: true,
			viernes: true,
		}
	},
	{
		nombre: "Local,Par,H1",
		placa: 420,
		holograma: 1,
		ultimo_digito: 0,
		results: {
			lunes: true,
			viernes: false,
		}
	},
	{
		nombre: "Local,Par,H2",
		placa: 420,
		holograma: 2,
		ultimo_digito: 0,
		results: {
			lunes: true,
			viernes: false,
		}
	},
	{
		nombre: "Local,Impar,H1",
		placa: 555,
		holograma: 1,
		ultimo_digito: 5,
		results: {
			lunes: false,
			viernes: true,
		}
	},
	{
		nombre: "Local,Impar,H2",
		placa: 555,
		holograma: 2,
		ultimo_digito: 5,
		results: {
			lunes: false,
			viernes: true,
		}
	}
];