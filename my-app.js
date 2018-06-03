// Dom7
var $ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

var app = new Framework7({

  init: false,
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
var productoOBJ = {};
var datos = {};
var favoritos = {};
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

function fav(producto) {
  var detalle = favoritos[producto][Object.keys(favoritos[producto])];
  $('#productoH').text(detalle.nombre);
  $('#productoT').html('');
  $('#productoT').html(detalle.descripcion);
  productoOBJ = detalle;
  $('#productoF').html("<a onclick='favdelFavorite(\""+ producto + "\")'>Quitar de favoritos</a><a onclick='agregarcarrito(\""+ producto + "\")'>Agregar a cotizador</a>");

  $('#productoX').attr('style','visibility:visible');

}

function enviarcarrito() {
  datos ={};
  datos.cliente = cliente.codigo;
  datos.carrito = JSON.stringify(carrito);


  app.dialog.confirm( '¿Quieres cotizar estos productos?', 'Enviar', function () {

  app.request({
      url: 'https://us-central1-dvn-app.cloudfunctions.net/addOrder',
      data: datos,
      method: 'GET',
      dataType: 'json',
      success: function (datos) {
        app.dialog.alert('Solictud enviada OK');
        carrito = {};
        window.localStorage.setItem('local_carrito', JSON.stringify(carrito));
        mainView.router.back()
      },
      error: function (xhr,status) {
        // REVISAR ... si es error de a deveras no se debe borrar el carrito.
        if (status=='parseerror') {status = 'Solictud enviada'}
        app.dialog.alert(xhr.statusText, status, function () {
                carrito = {};
                window.localStorage.setItem('local_carrito', JSON.stringify(carrito));
                mainView.router.back({
                    url: '/buscap/',
                    force: true,
                    ignoreCache: true
                });
              });
      },
    });

});
};

function pop(producto) {
  var dialog = app.dialog.prompt('Cambiar cantidad o 0 para borrar',carrito[producto].producto.nombre, function (cuantos) {
    if (cuantos>0){
    carrito[producto].cantidad = cuantos;
    datos.carrito = JSON.stringify(carrito);
    window.localStorage.setItem('local_carrito', datos.carrito);
    var output="";
    for (j in Object.keys(carrito))
    {
        output+="<li><div class='item-content'>";
        output+="<div class='item-inner' onclick='pop(\""+ Object.keys(carrito)[j] + "\")'>";
        output+="<div class='item-title'>" + carrito[Object.keys(carrito)[j]].producto.nombre  + "</div>"
        output+="<div class='item-after'>" + carrito[Object.keys(carrito)[j]].cantidad  + "</div>"
        output+="</div></div></li> ";
    }
    $('#textoXX').html(output);
  } else {
    delete carrito[producto];
    window.localStorage.setItem('local_carrito', JSON.stringify(carrito));
    var output="";
    for (j in Object.keys(carrito))
    {
        output+="<li><div class='item-content'>";
        output+="<div class='item-inner' onclick='pop(\""+ Object.keys(carrito)[j] + "\")'>";
        output+="<div class='item-title'>" + carrito[Object.keys(carrito)[j]].producto.nombre  + "</div>"
        output+="<div class='item-after'>" + carrito[Object.keys(carrito)[j]].cantidad  + "</div>"
        output+="</div></div></li> ";
    }
    $('#textoXX').html(output);
  }
  });
  dialog.$el.find('input').val(carrito[producto].cantidad);

}

function agregarcarrito(producto) {
  console.log(producto + "x>" + cliente.codigo);
  actual = carrito[producto];
  linea = {};
  var texto = "";
  if (actual) { texto = 'Tienes en carrito: ' + actual.cantidad + '\n'}

      var dialog = app.dialog.prompt( texto + ' ¿Cuántos deseas?', 'Cotización Actual', function (cuantos) {
        if (cuantos>0){
        linea.cantidad = cuantos;
        linea.producto = productoOBJ;
        carrito[producto] = linea;

        datos ={};
        productoOBJ = {};
        datos.cliente = cliente.codigo;
        datos.carrito = JSON.stringify(carrito);
        window.localStorage.setItem('local_carrito', datos.carrito);

        console.log(datos.carrito);
        $('#numCot1').text(Object.keys(carrito).length);

        /*app.dialog.prompt( '¿Quieres finalizar y grabar?', 'Cotización Actual', function () {

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
        });*/


      } else {
        delete carrito[producto];
        window.localStorage.setItem('local_carrito', JSON.stringify(carrito));
        console.log(JSON.stringify(carrito));
      }
      });

      if (actual) { dialog.$el.find('input').val(actual.cantidad) }
}

function favdelFavorite(producto) {
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
        app.dialog.alert(data.responseText, 'Borrado de Favoritos');
        $('#productoF').html('');
        $('#productoF').text('Borrado de favoritos');
      },
    });

    if (cliente.codigo) {
      var urlfavoritos = 'https://dvn-app.firebaseio.com/favoritos/' + cliente.codigo + '.json';

      app.request({
          url: urlfavoritos,
          method: 'GET',
          dataType: 'json',
          success: function (datos) {

          favoritos = datos;
          //console.log(favoritos);

          var output="";
          for (j in Object.keys(favoritos))
          {
            for (k in favoritos[Object.keys(favoritos)[j]]) {

              output+="<li><div class='item-content'>";
              //var str = JSON.stringify(favoritos[Object.keys(favoritos)[j]][k]);
              //var texto = str.replace(/"/gi, '');
              output+="<div class='item-inner' onclick='fav(\""+ favoritos[Object.keys(favoritos)[j]][k].codigo+"\")'>";
              output+="<div class='item-title'>" + favoritos[Object.keys(favoritos)[j]][k].nombre  + "</div>"
              output+="</div></div></li> ";

            }
          }


          $('#textoX').html(output);

      },
      error: function (data) {alert("Error :" + data.responseText);},
      });
    }
    $('#productoX').attr('style','visibility:hidden');

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
        app.dialog.alert(data.responseText, 'Borrado de Favoritos');
        $('#productoF').html('');
        $('#productoF').text('Borrado de favoritos');
      },
    });

}

function addFavorite(producto) {
  console.log(producto + "->" + cliente.codigo);

  datos ={};
  datos.detalle = JSON.stringify(productoOBJ);
  datos.cliente = cliente.codigo;
  datos.producto = producto;

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
        app.dialog.alert(data.responseText, 'Agregado a favoritos');
        $('#productoF').html('');
        $('#productoF').text('En Favoritos');
      },
    });

}

function cambioDD() {
  console.log("CambioDD");
  filtraproductos();
  ocultar();
}

function clickDD() {
  console.log("ClickDD");
  filtraproductos();
  ocultar();
}

function ocultar() {
  console.log("Ocultar");
  document.getElementById("productoX").style.visibility="hidden";
}

function filtraproductos() {
  console.log("Filtra productos");
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

//window.onload = initApp;

//se hizo la inicialización de esta forma para que funcionara al inicio y en el back de dos niveles.
$(document).on('page:init', '.page[data-name="home"]', function (e) {
  initApp();
})

app.init();
