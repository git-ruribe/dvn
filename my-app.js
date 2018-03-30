// Dom7
var $ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'DVN',
  // Theme
  theme: theme,
  // App id
  id: 'com.dvn.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/',
      url: './index.html',
      name: 'home',
    },
    {
      path: '/about/',
      url: './about.html',
    },
    {
      path: '/solicita/',
      componentUrl: './pages/solicita.html',
    },
    {
      path: '/buscap/',
      componentUrl: './pages/buscaproducto.html',
    },
  ],
  // ... other parameters
});

var mainView = app.views.create('.view-main', {
  url: '/'
})

var datos = {};
var array = [];
var campoEmail = 3;
var campoSolicita = 4;

function escoge(myRadio) {
  array = []
  var checkboxes = document.querySelectorAll('input[name=opciones]:checked')
  for (var i = 0; i < checkboxes.length; i++) {
    array.push(checkboxes[i].value)
  }
}

function qqq(pelos) {
  division = document.getElementById("division").value;
  tipo = document.getElementById("tipo").value;
  especie = document.getElementById("especie").value;
  marca = document.getElementById("marca").value;
  cuantos = 0;
  var data = self.datos;
  for (var i = 0; i < data.length; i++) {
    data[i].cuenta = 0;
    if ( ((data[i].division == division) || (division=="*") ) &&
         ((data[i].tipo == tipo) || (tipo=="*") ) &&
         ((data[i].especie == especie) || (especie=="*") ) &&
         ((data[i].marca == marca) || (marca=="*") )
       ) {
    data[i].cuenta = 1;
    cuantos += 1;
    }
  }
    document.getElementById("titulo").textContent="(" +cuantos + ")";
}




function initApp() {

  app.request({
    url: 'https://dvn-app.firebaseio.com/promociones.json',
    method: 'GET',
    dataType: 'json',
    //send "query" to server. Useful in case you generate response dynamically,
    success: function (data) {
      for (var i in data) {
        var j = Number(i) + 1;
        var pa='#promo' + j.toString();
        $(pa).attr("style", "background-image:url(" + data[i].imagen + ")");
        $(pa).html(data[i].html);
        }
      }
    });

    firebase.auth().onAuthStateChanged(function(user) {

      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // [START_EXCLUDE]
        $('#iconios').removeClass('color-red');
        $('#iconmd').removeClass('color-red');
        $('#iconios').addClass('color-green');
        $('#iconmd').addClass('color-green');
        $('#signin').text('Salir');
        $('#demo-password-1').val('');
        if (!emailVerified) {

        }
        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE]
        $('#iconios').removeClass('color-green');
        $('#iconmd').removeClass('color-green');
        $('#iconios').addClass('color-red');
        $('#iconmd').addClass('color-red');
        $('#signin').text('Entrar');

        // [END_EXCLUDE]
      }

    });

  }

window.onload = initApp;
