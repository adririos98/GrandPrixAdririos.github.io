//Aqui se define todo el codigo utilizado a nivel de funciones de Javascript.
//En los siguientes puntos se definira el tiempo de cada "avance", distancia minima,, la máxima y la distancia de pixeles hasta finalizar la carrera.
const tiempo = 60;
const distanciaMinima = 1;
const distanciaMaxima = 10;
const meta = 900;
//Estas variables son de música, seran llamadas en las funciones siguientes:
let sonidoCarrera = new Audio('sounds/Lobato.mp3');
let sonidoFormula = new Audio('sounds/fondo.mp3');
//Definición del array para los coches.
let cars;
let periodo;
//Definición de funciones.
$(document).ready(function () {
    //Ocultar el botón de reiniciar y por defecto mostrar un minimo de 1 coche.
    $("#restart").hide();
    $("#cantidad").val('1');
    addcoche($("#cantidad").val());
    //Esto servirá para detectar que en cada momento que cambie el input de cantidad de coches 
    $("#cantidad").change(function () {
        $(" #cars").empty();
        addcoche($("#cantidad").val()); //Número de coches incorporados en el input.
    });

    //Esto servirá para detectar que en cada momento que se haga click en el botón iniciar
    $("#start").click(function () {
        //Ocultamos el botón iniciar, mostramos el botón reiniciar y deshabilitamos el input de cantidad de coches
        $("#start").hide();
        $("#restart").show();
        $("#cantidad").prop("disabled", true);
        //Iniciamos el sonido de carrera de coches y la música de la fórmula 1 que dura hasta terminar completamente.
        sonidoCarrera.play();
        sonidoFormula.play();
        //Definición del array.
        cars = $('#cars .coche').toArray();
        //Configuramos un periodo que llama periodicamente a la función avanzar
        periodo = setInterval(avanzar, tiempo + 8, distanciaMinima, distanciaMaxima);
    });

    //Esto servirá para detectar que en cada momento que se haga click en el botón reiniciar
    $("#restart").click(function () {
        //Lo definido a continuación es el botón reiniciar. Se muestra el botón iniciar.
        clearInterval(periodo);
        $("#restart").hide();
        $("#start").show();
        $("#cantidad").prop("disabled", false);
        //limpiar los resultados previos.
        $('#cars h3').remove();
        //Parar el sonido de la carrera.
        sonidoCarrera.pause();
        //Restart de los cars participantes.
        retroceder();
    });
});

//Función que añade un cierto número de cars
function addcoche(numero) {
    //Para cada coche que queremos insertar añadimos el siguiente fragmento de código al div contenedor de cars
    for (i = 0; i < numero; i++) {
        $("#cars").append("<div><h2>" + (i + 1)
            + "<img src='img/bandera.gif' alt='premio' width='100px'></h2><img class='carretera' src='img/carretera.png'>"
            + "<img class='coche' src='img/car" + aleatorio(1, 9) + ".png' width='150px' height='75'></div>");
        //El modelo de coche se elige de forma aleatoria
    }
}

//Función que devuelve un numero aleatorio entre un periodo dado
function aleatorio(minimo, maximo) {
    return Math.floor(Math.random() * maximo) + minimo;
}
//Función que hace avanzar a los coches una distancia aleatoria entre el periodo especificado
function avanzar(min, max) {
    //Para cada coche se determina la distancia a avanzar y se posiciona el coche en la nueva ubicación
    cars.forEach((coche) => {
        $(coche).animate({ "margin-left": '+=' + aleatorio(min, max) }, tiempo - 10);
        //Comprobamos si algun coche ha sobrepasado la meta
        if (comprobarGanador(coche)) {
            //Limpiamos el periodo que hace avanzar a los coches
            clearInterval(periodo);
            //GenerarClasificación es la función a la que se llama.
            setTimeout(function () {
                generarClasificacion();
            }, tiempo * 2);
            sonidoCarrera.pause();
            return;
        }
    });
}

//Función para comprobar si un coche ha sobrepasado la meta
function comprobarGanador(coche) {
    //si el margin left es mayor que la "meta" devuelve true, sino false
    if (parseInt($(coche).css("margin-left"), 10) > meta) {
        return true;
    } else {
        return false;
    }
}

//Función para poner los coches en la linea de salida
function retroceder() {
    //Para cada coche de la competición
    cars.forEach((coche) => {
        //Giramos el coche sobre su eje vertical
        $(coche).addClass('mirror');
        //Lo posicionamos en la salida y una vez hecho volvemos a dejar el coche mirando hacia la meta
        $(coche).animate({ "margin-left": '0' }, 1000, () => { $(coche).removeClass('mirror'); });
    });
}

//Generación de la clasificación final de la carrera, esta será mostrada en las mismas pistas.
function generarClasificacion() {
    //Array vacio que va a almacenar los resultados.
    let resultados = [];
    //Guardar los resultados de cada coche en el array, guardando los pixeles recorridos y su correspondiente número en carrera.
    cars.forEach((coche, indice) => {
        resultados.push({ distancia: parseInt($(coche).css("margin-left"), 10), posicion: indice })
    });
    //Array que guarda la distancia en pixeles recorridos
    resultados.sort(function (a, b) { return b.distancia - a.distancia });
    let pistas = $('#cars div').toArray();
    //En este último código se puede observar que se muestran los resultados en cada carretera o pista.
    resultados.forEach((resultado, indice) => {
        $(pistas[resultado.posicion]).prepend("<h3 class='puesto" + (indice + 1) + "'>"
            + "Clasificación " + (indice + 1) + " ( " + resultado.distancia + "km en pista.) </h3>");
    });
}