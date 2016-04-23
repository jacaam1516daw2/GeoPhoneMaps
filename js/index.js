/**
 * phonegap plugin add org.apache.cordova.geolocation
 */
var watchID = null;

var bdLatLng = [{
    id: "",
    lat: "",
    lng: "",
    rest: "",
    foto: "",
    descripcion: ""
}];

var list = [];
var app = {
    // Constructor
    initialize: function () {
        app.bindEvents();
    },
    // Esdeveniments possibles en la inicialització de l'app:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    // callback per a esdeveiniment deviceready
    // this representa l'esdeveniment
    onDeviceReady: function () {
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
        //watchID =  navigator.geolocation.watchPosition(onSuccess, onError, options);
        //BD
        db = app.obtenirBaseDades();
        db.transaction(function (tx) {
            // tx.executeSql('DROP TABLE LLISTA');
            tx.executeSql('CREATE TABLE IF NOT EXISTS LLISTA(id INTEGER PRIMARY KEY AUTOINCREMENT, latitud, longitud, restaurant, foto, descripcion)');
        }, app.error, app.desar());

    },
    obtenirBaseDades: function () {
        return window.openDatabase("llistaBD", "1.0", "Llista BD", 200000);
    },
    obtenirItems: function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM LLISTA', [], app.consultar, app.error);
        }, app.error);
    },
    consultar: function (tx, resultats) {
        var len = resultats.rows.length;
        var sortida = '';
        for (var i = 0; i < len; i++) {
            bdLatLng.id = resultats.rows.item(i).id;
            bdLatLng.lat = resultats.rows.item(i).latitud;
            bdLatLng.lon = resultats.rows.item(i).longitud;
            bdLatLng.rest = resultats.rows.item(i).restaurant;
            bdLatLng.foto = resultats.rows.item(i).foto;
            bdLatLng.descripcion = resultats.rows.item(i).descripcion;

            list.push(bdLatLng.lat + ', ' + bdLatLng.lon + ', ' + bdLatLng.rest + ', ' + bdLatLng.foto + ', ' + bdLatLng.descripcion + ', ' + bdLatLng.id);
        }
    },
    desar: function () {
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM LLISTA');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant, foto, descripcion) VALUES ("41.453765", "2.251968", "Restaurant1", "http://www.hotelatalaia.com/images/restaurante.jpg", "Gran Restaurante de degustación con 230 años de experiencia")');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant, foto, descripcion) VALUES ("41.454553", "2.253363", "Restaurant2", "https://media-cdn.tripadvisor.com/media/photo-s/01/a4/35/6e/restaurante-argentino.jpg", "Gran Restaurante de degustación con 1230 años de experiencia")');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant, foto, descripcion) VALUES ("41.455181", "2.227799", "Restaurant3", "http://images.sonesta.com/method=get&s=DCBCCB24-0A58-D3A2-88DD93070D5ACB20.JPG", "Pequeño Restaurante con comida de muy mala calidad y muy caro")');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant, foto, descripcion) VALUES ("41.454751", "2.227048", "Restaurant4", "http://www.hoteles-silken.com/content/imgsxml/es/galerias/panel_restaurants_list/1/hoteles-puertamalaga-restaurante-restaurante-panoramica.jpg", "Hamburguesas a mitad de precio")');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant, foto, descripcion) VALUES ("41.413985", "2.189674", "Restaurant5", "http://www.segurocomercioonline.com/wp-content/uploads/2015/06/restaurantes.jpg", "Actuaciones en directo")');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant, foto, descripcion) VALUES ("41.415729", "2.189676", "Restaurant6", "http://ideas4all.com/ideas/0000/1013/restaurante2.jpg", "Restaurante de alta cocina")');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant, foto, descripcion) VALUES ("41.414073", "2.192863", "Restaurant7", "http://www.gruposagardi.com/admin/restaurantes/153987076comedor_bodega_sagardi_restaurante_vasco_argentina.JPG", "Tenemos a los mejores expertos")');

        }, app.error, app.obtenirItems);
    },
    //callback per a quan obtenim les dades de l'accelerometre
    onSuccess: function (posicio) {
        var myLatLng = {
            lat: 0,
            lng: 0,
            id: "",
            rest: "",
            foto: "",
            descripcion: ""
        };
        var latLng =
            new google.maps.LatLng(
                posicio.coords.latitude,
                posicio.coords.longitude);
        var opcionsMapa = {
            center: latLng,
            panControl: false,
            zoomControl: true,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapa = new google.maps.Map(
            document.getElementById('mapa'),
            opcionsMapa
        );

        /* var marker1 = new google.maps.Marker({
             position: latLng,
             map: mapa
         });*/

        var infowindow = new google.maps.InfoWindow();

        var marker, i;

        for (i = 0; i < list.length; i++) {
            var elem = list[i].split(',');
            myLatLng.lat = parseFloat(elem[0]);
            myLatLng.lng = parseFloat(elem[1]);
            myLatLng.rest = elem[2];
            myLatLng.foto = elem[3];
            myLatLng.descripcion = elem[4];
            myLatLng.id = elem[5];

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(myLatLng.lat, myLatLng.lng),
                map: mapa,
                id: myLatLng.id,
                lat: myLatLng.lat,
                lng: myLatLng.lng,
                rest: myLatLng.rest,
                foto: myLatLng.foto,
                descripcion: myLatLng.descripcion

            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var contentString = "<div id='content'><h1 id='firstHeading' class='firstHeading'>" + marker.rest + "</h1><div id='bodyContent'><p><b>" + marker.rest + "</b>," + marker.descripcion + "</p></div></div>";
                    infowindow.setContent(contentString);
                    infowindow.open(mapa, marker);
                    var element = document.getElementById('info');
                    element.innerHTML = "<img src=" + marker.foto + " width=360 height=150><div id='infoText'>" + contentString + "</div>";
                }
            })(marker, i));
        }
    },
    //callback per a un cas d'error
    onError: function (error) {
        var tipusError;

        if (error.code) {
            switch (error.code) {
                case 1: // PERMISSION_DENIED
                    tipusError = 'manca de permisos';
                    break;
                case 2: // POSITION_UNAVAILABLE
                    tipusError = 'posició no disponible.';
                    break;
                case 3: // TIMEOUT
                    tipusError = 'Timeout';
                    break;
                default: // UNKOWN_ERROR
                    tipusError = 'Error desconegut';
                    break;
            }
        }
        var element = document.getElementById('dades');
        element.innerHTML = tipusError;

    }
};
