const subirArchivo = document.getElementById('subirArchivo')
const btnSubirArchivo = document.getElementById('btnSubirArchivo')
const btnAlinearSecuencia = document.getElementById('btnAlinearSecuencia')
const HUECO = -5
btnSubirArchivo.addEventListener('click', buscarArchivo)
btnAlinearSecuencia.addEventListener('click', crearAlineacion)


class Secuencias {
	constructor(nombre, descripcion){
		this.nombre = nombre
		this.descripcion = descripcion
	}

}

class Archivo {
	constructor(){
		this.obtenerArchivo = this.obtenerArchivo.bind(this)
		this.leerArchivo = this.leerArchivo.bind(this)
		this.guardarTexto = this.guardarTexto.bind(this)
		this.seleccionarArchivo()
	}

	seleccionarArchivo(){
		subirArchivo.addEventListener('change', this.obtenerArchivo)
		subirArchivo.click()
	}

	obtenerArchivo(){
		this.archivoSeleccionado = subirArchivo.files[0]
		this.leerArchivo()
	}

	leerArchivo() {
		this.lector = new FileReader()
		this.lector.readAsText(this.archivoSeleccionado)
		this.lector.addEventListener('load', this.guardarTexto)
	}

	guardarTexto() {
		this.texto = this.lector.result.split(/>|\n/)
		archivo.guardarSecuencias()
	}

	guardarSecuencias() {
		let espaciosEnBlanco = new Array().fill(0)
		let descripcion = ""
		let nombreSecuencia = ""

		for(let i=0; i<this.texto.length; i++){
			if(this.texto[i]===""){
				espaciosEnBlanco.push(i)
			}
		} 
		// Guardar Secuencia Uno en un objeto
		nombreSecuencia = this.texto[espaciosEnBlanco[0]+1]
		for(let i=espaciosEnBlanco[0]+2; i<espaciosEnBlanco[1]; i++){
			descripcion += this.texto[i]
		}
		this.secuenciaUno = new Secuencias(nombreSecuencia, descripcion)

		// Guardar Secuencia Dos en un objeto
		nombreSecuencia = this.texto[espaciosEnBlanco[1]+1]
		descripcion=""
		for(let i=espaciosEnBlanco[1]+2; i<this.texto.length; i++){
			descripcion += this.texto[i]
		}
		this.secuenciaDos = new Secuencias(nombreSecuencia, descripcion)

		this.mostrarSecuencia()
		
	}

	mostrarSecuencia(){
		this.visorArchivo = document.getElementById('visorArchivo')
		this.visorArchivo.innerHTML = `>${this.secuenciaUno.nombre}${this.secuenciaUno.descripcion}>${this.secuenciaDos.nombre}${this.secuenciaDos.descripcion}`
	}

}


class Alinear {
	constructor(){
		this.secuenciaUno = archivo.secuenciaUno.descripcion
		this.secuenciaDos = archivo.secuenciaDos.descripcion
		this.crearMatrizScore()
		this.calcularMatrizF()
	}

	crearMatrizScore(){
		this.matrizScore = new  Array(4).fill(0)
		for(let i=0; i<4; i++){
			this.matrizScore[i] = new Array(4).fill(0)
		}
		this.matrizScore[0][0] = 10;
		this.matrizScore[0][1] = -1;
		this.matrizScore[0][2] = -3;
		this.matrizScore[0][3] = -4;
		this.matrizScore[1][0] = -1;
		this.matrizScore[1][1] = 7;
		this.matrizScore[1][2] = -5;
		this.matrizScore[1][3] = -3;
		this.matrizScore[2][0] = -3;
		this.matrizScore[2][1] = -5;
		this.matrizScore[2][2] = 9;
		this.matrizScore[2][3] = 0;
		this.matrizScore[3][0] = -4;
		this.matrizScore[3][1] = -3;
		this.matrizScore[3][2] = 0;
		this.matrizScore[3][3] = 8;
	}

	crearMatrizF(){
		this.matrizF = new Array(this.secuenciaUnoEnNumero.length+1).fill(0)
		for(let i=0; i<this.matrizF.length; i++){
			this.matrizF[i] = new Array(this.secuenciaDosEnNumero.length+1).fill(0)
		}
	}

	calcularMatrizF(){
		this.secuenciaUnoEnNumero = new Array().fill(0)
		this.secuenciaDosEnNumero = new Array().fill(0)
		this.nucleotidoANumero(this.secuenciaUno, this.secuenciaUnoEnNumero)
		this.nucleotidoANumero(this.secuenciaDos, this.secuenciaDosEnNumero)
		this.crearMatrizF()
		
		for (let i=0; i<=this.secuenciaUnoEnNumero.length; i++){
			this.matrizF[i][0] = HUECO * i
		}
		for (let i=0; i<=this.secuenciaDosEnNumero.length; i++){
			this.matrizF[0][i] = HUECO * i
		}
		
		for (let i=1; i<= this.secuenciaUnoEnNumero.length; i++){
			for(let j=1; j<=this.secuenciaDosEnNumero.length; j++){
				let A = this.secuenciaUnoEnNumero[i-1]
	 			let B = this.secuenciaDosEnNumero[j-1]
	 			let opcionUno = this.matrizF[i-1][j-1] +  this.matrizScore[A][B]
	 			let opcionDos = this.matrizF[i-1][j] + HUECO
				let opcionTres = this.matrizF[i][j-1] + HUECO
				this.matrizF[i][j] = Math.max(opcionUno, opcionDos, opcionTres)
			}
		}
		this.seleccionarAlineacion()

	}

	nucleotidoANumero(secuencia, secuenciaEnNumero){
		for(let i=0; i<secuencia.length; i++){
			switch (secuencia.charAt(i)){
				case "A":
					secuenciaEnNumero.push(0)
					break
				case "G":
					secuenciaEnNumero.push(1)
					break
				case "C":
					secuenciaEnNumero.push(2)
					break
				case "T":
					secuenciaEnNumero.push(3)
					break
			}
		}
	}

	seleccionarAlineacion() {
		this.secuenciaUnoAlineada = new Array().fill(0)
		this.secuenciaDosAlineada = new Array().fill(0)
		let i = this.secuenciaUnoEnNumero.length 
		let j = this.secuenciaDosEnNumero.length
		while(i>0 && j>0){
			let indiceScoreUno = this.secuenciaUnoEnNumero[i-1]
			let indiceScoreDos = this.secuenciaDosEnNumero[j-1]
			let score = this.matrizF[i][j]
			let scoreDiagonal = this.matrizF[i-1][j-1] + this.matrizScore[indiceScoreUno][indiceScoreDos]
			let scoreIzquierda = this.matrizF[i][j-1] + HUECO
			let scoreArriba = this.matrizF[i-1][j] + HUECO
			if(score === scoreDiagonal){
				this.secuenciaUnoAlineada.unshift(indiceScoreUno)
				this.secuenciaDosAlineada.unshift(indiceScoreDos)
				i--
				j--
			}else if(score === scoreIzquierda){
				this.secuenciaUnoAlineada.unshift('-')
				this.secuenciaDosAlineada.unshift(indiceScoreDos)
				j--
			}else if(score === scoreArriba){
				this.secuenciaUnoAlineada.unshift(indiceScoreUno)
				this.secuenciaDosAlineada.unshift('-')
				i--
			}
		}
		while(i>0){
			this.secuenciaUnoAlineada.unshift(this.secuenciaUnoEnNumero[i-1])
			this.secuenciaDosAlineada.unshift('-')
			i--
		}
		while(j>0){
			this.secuenciaUnoAlineada.unshift('-')
			this.secuenciaDosAlineada.unshift(this.secuenciaDosEnNumero[j-1])
			j--
		}
		this.numeroANucleotido(this.secuenciaUnoAlineada)
		this.numeroANucleotido(this.secuenciaDosAlineada)
		this.mostrarAlineacion()
	}

	numeroANucleotido(secuenciaEnNumero){
		for(let i=0; i<secuenciaEnNumero.length; i++){
			switch (secuenciaEnNumero[i]){
				case 0:
					secuenciaEnNumero[i] = 'A'
					break
				case 1:
					secuenciaEnNumero[i] = 'G'
					break
				case 2:
					secuenciaEnNumero[i] = 'C'
					break
				case 3:
					secuenciaEnNumero[i] = 'T'
					break
				case '-':
					secuenciaEnNumero[i] = '-'
			}
		}
	}

	mostrarAlineacion(){
		this.visorAlineacion = document.getElementById('visorAlineacion')
		this.puntajeDeAlineacion = document.getElementById('puntajeDeAlineacion')
		let score = this.matrizF[this.secuenciaUnoEnNumero.length][this.secuenciaDosEnNumero.length]
		let tabla = `<tr> <td class="nombreSecuencia"> ${archivo.secuenciaUno.nombre} <br/> ${archivo.secuenciaDos.nombre} </td>`
		for (let i=0; i<this.secuenciaUnoAlineada.length; i++){
			let numUno = this.secuenciaUnoAlineada[i]
			let numDos = this.secuenciaDosAlineada[i]
			if(i%40 === 0 && i!=0){
				tabla += `</tr> <tr> <td class="nombreSecuencia"> ${archivo.secuenciaUno.nombre} <br/> ${archivo.secuenciaDos.nombre} </td>`
			}
			tabla += `<td class="${this.validarColor(numUno, numDos)}"> ${numUno} <br/> ${numDos} </td> `
			
		}
		tabla += '</tr>'
		this.visorAlineacion.innerHTML = tabla
		this.puntajeDeAlineacion.innerHTML = score
	}

	validarColor(a, b){
		let id = ""
		if(a=="-" || b=="-"){
			id = 'hueco'	
		}else if(a==b){
			id = 'iguales'
		}else if(a!=b){
			id = 'diferentes"'
		}
		return id
	}

}


function buscarArchivo () {
	window.archivo = new Archivo()
}

function crearAlineacion () {
	window.alineacion = new Alinear()
}