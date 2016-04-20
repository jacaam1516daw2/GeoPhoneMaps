/**
 * phonegap plugin add org.apache.cordova.geolocation
 */
var watchID = null;

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
            console.log('id: ' + resultats.rows.item(i).id);
            console.log('latitud: ' + resultats.rows.item(i).latitud);
            console.log('longitud: ' + resultats.rows.item(i).longitud);
            console.log('restaurant: ' + resultats.rows.item(i).restaurant);
        }
    },
    desar: function () {
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM LLISTA');
            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.413985", "2.189674", "restaurant1")');
            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.415729", "2.189676", "restaurant2")');
            tx.executeSql('INSERT INTO LLISTA (latitud, longitud, restaurant) VALUES ("41.414073", "2.192863", "restaurant3")');
        }, app.error, app.obtenirItems);
    },
    //callback per a quan obtenim les dades de l'accelerometre
    onSuccess: function (posicio) {
        var bdLatLng = {
            lat: "",
            lng: "",
            rest: ""
        }
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
        marker = new google.maps.Marker({
            position: myLatLng,
            map: mapa
        });
        marker = new google.maps.Marker({
            position: myLatLng2,
            map: mapa
        });
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
