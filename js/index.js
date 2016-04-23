/**
 * phonegap plugin add org.apache.cordova.geolocation
 */
var watchID = null;

var bdLatLng = [{
    id: "",
    lat: "",
    lng: "",
    rest: ""
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
            //tx.executeSql('DROP TABLE LLISTA');
            tx.executeSql('CREATE TABLE IF NOT EXISTS LLISTA(id INTEGER PRIMARY KEY AUTOINCREMENT, latitud, longitud, restaurant)');
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

            list.push(bdLatLng.lat + ', ' + bdLatLng.lon);
        }
    },
    desar: function () {
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM LLISTA');
            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.453765", "2.251968", "restaurant1")');
            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.454553", "2.253363", "restaurant2")');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.455181", "2.227799", "restaurant3")');
            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.454751", "2.227048", "restaurant4")');

            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.413985", "2.189674", "restaurant5")');
            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.415729", "2.189676", "restaurant6")');
            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.414073", "2.192863", "restaurant7")');
        }, app.error, app.obtenirItems);
    },
    //callback per a quan obtenim les dades de l'accelerometre
    onSuccess: function (posicio) {
        var myLatLng = {
            lat: 0,
            lng: 0
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
        var marker = new google.maps.Marker({
            position: latLng,
            map: mapa
        });
        for (var x = 0; x < list.length; x++) {
            var elem = list[x].split(',');
            myLatLng.lat = parseFloat(elem[0]);
            myLatLng.lng = parseFloat(elem[1])
            console.log(myLatLng);
            marker = new google.maps.Marker({
                position: myLatLng,
                map: mapa
            });
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
