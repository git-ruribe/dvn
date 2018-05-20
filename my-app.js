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
    {
      path: '/favoritos/',
      componentUrl: './pages/favoritos.html',
    },
    {
      path: '/cotiza/',
      componentUrl: './pages/cotiza.html',
    },
  ],
  // ... other parameters
});

var mainView = app.views.create('.view-main', {
  url: '/'
})

$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

var local_user
var cliente
var vendedor
var datos = {};
var temp = JSON.parse(window.localStorage.getItem('local_carrito'));

if (temp) {
  var carrito = temp;
} else {
  var carrito = {}
}

/*
var array = [];
var campoEmail = 3;
var campoSolicita = 4;

function escoge(myRadio) {
  array = []
  var checkboxes = document.querySelectorAll('input[name=opciones]:checked')
  for (var i = 0; i < checkboxes.length; i++) {
    array.push(checkboxes[i].value)
  }
  console.log("pelos");
}
*/

function agregarcarrito(producto) {
  console.log(producto + "x>" + cliente.codigo);
  actual = carrito[producto];
  var texto = "";
  if (actual) { texto = 'Tienes en carrito: ' + actual + '\n'}

      app.dialog.prompt( texto + ' ¿Cuántos deseas?', 'Cotización Actual', function (cuantos) {
        if (cuantos>0){

        carrito[producto] = cuantos;

        datos ={};
        datos.cliente = cliente.codigo;
        datos.carrito = JSON.stringify(carrito);
        window.localStorage.setItem('local_carrito', datos.carrito);

        console.log(datos.carrito);

        app.dialog.prompt( '¿Quieres finalizar y grabar?', 'Cotización Actual', function () {

        app.request({
            url: 'https://us-central1-dvn-app.cloudfunctions.net/addOrder',
            data: datos,
            method: 'GET',
            dataType: 'json',
            success: function (datos) {
              app.dialog.alert('Pedido OK');
              carrito = {};
              window.localStorage.setItem('local_carrito', JSON.stringify(carrito));
            },
            error: function (data) {
              app.dialog.alert(data.responseText, 'Pedido');
              carrito = {};
              window.localStorage.setItem('local_carrito', JSON.stringify(carrito));
            },
          });
        });


      } else {
        delete carrito[producto];
        window.localStorage.setItem('local_carrito', JSON.stringify(carrito));
        console.log(JSON.stringify(carrito));
      }
      });
}

function delFavorite(producto) {
  console.log(producto + "x>" + cliente.codigo);

  datos ={};
  datos.producto = producto;
  datos.cliente = cliente.codigo;

  app.request({
      url: 'https://us-central1-dvn-app.cloudfunctions.net/delFavorite',
      data: datos,
      method: 'GET',
      dataType: 'json',
      success: function (datos) {
        app.dialog.alert('Borrado de Favoritos');
        $('#productoF').html('');
        $('#productoF').text('Borrado de Favoritos');
      },
      error: function (data) {
        app.dialog.alert(data.responseText, 'Error');
        $('#productoF').html('');
        $('#productoF').text('Borrado de favoritos');
      },
    });

}

function addFavorite(producto) {
  console.log(producto + "->" + cliente.codigo);

  datos ={};
  datos.producto = producto;
  datos.cliente = cliente.codigo;

  app.request({
      url: 'https://us-central1-dvn-app.cloudfunctions.net/addFavorite',
      data: datos,
      method: 'GET',
      dataType: 'json',
      success: function (datos) {
        app.dialog.alert('Agregado a favoritos');
        $('#productoF').html('');
        $('#productoF').text('En Favoritos');
      },
      error: function (data) {
        app.dialog.alert(data.responseText, 'Error');
        $('#productoF').html('');
        $('#productoF').text('En Favoritos');
      },
    });

}

function ocultar() {
  document.getElementById("productoX").style.visibility="hidden";
}

function seleccionaproducto(pelos) {
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

function deshabilitar() {
  $('#solicitar').addClass('disabled');
  $('#whats').addClass('disabled');
}

function habilitar() {
  $('#solicitar').removeClass('disabled');

}

function traevendedor(cliente) {
  console.log('leyendo vendedor');
  app.request({
    url: 'https://dvn-app.firebaseio.com/vendedores.json',
    method: 'GET',
    dataType: 'json',
    //send "query" to server. Useful in case you generate response dynamically,
    success: function (data) {
      for (var i in data) {
        if (data[i].nombre == cliente) {
          vendedor = data[i];
          break
          }
        }
      console.log('vendedor:'+vendedor.nombre);
      $('#whats').removeClass('disabled');
      }
    });
}

function traecliente(usuario) {
  console.log('leyendo cliente');
  app.request({
    url: 'https://dvn-app.firebaseio.com/clientes.json',
    method: 'GET',
    dataType: 'json',
    //send "query" to server. Useful in case you generate response dynamically,
    success: function (data) {
      for (var i in data) {
        if (data[i].email == usuario) {
          cliente = data[i];
          traevendedor(cliente.vendedor)
          break
          }
        }
      console.log('cliente:'+cliente.nombre);
      habilitar();
      }
    });
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

    local_user = window.localStorage.getItem('local_user');

    if (local_user) {
      console.log('local_user:' + local_user);
      traecliente(local_user);
      $('#iconios').removeClass('color-red');
      $('#iconmd').removeClass('color-red');
      $('#iconios').addClass('color-green');
      $('#iconmd').addClass('color-green');
      $('#signin').text('Salir');
      $('#demo-password-1').val('');
      $('#demo-username-1').val(local_user);
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        console.log('user es verdadero');
        // Guarda usuario en el dispositivo

        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        if (local_user!=email) {
          window.localStorage.setItem('local_user', email);
          local_user = email;
          traecliente(local_user);
        };
        // [START_EXCLUDE]
        $('#iconios').removeClass('color-red');
        $('#iconmd').removeClass('color-red');
        $('#iconios').addClass('color-green');
        $('#iconmd').addClass('color-green');
        $('#signin').text('Salir');
        $('#demo-password-1').val('');
        $('#demo-username-1').val(local_user);
        if (!emailVerified) {

        }
        // [END_EXCLUDE]
      } else {
        console.log('user es falso');
        // User is signed out.
        // [START_EXCLUDE]
        if (!local_user) {
        $('#demo-username-1').val('');
        $('#iconios').removeClass('color-green');
        $('#iconmd').removeClass('color-green');
        $('#iconios').addClass('color-red');
        $('#iconmd').addClass('color-red');
        $('#signin').text('Entrar');
        }
        // [END_EXCLUDE]
      }

    });

  }

window.onload = initApp;
