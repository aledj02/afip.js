<!-- PROJECT SHIELDS -->
[![NPM][npm-shield]](https://www.npmjs.com/package/@aledj02/afip.js)
[![Contributors][contributors-shield]](https://github.com/afipsdk/afip.js/graphs/contributors)
[![Closed issues][issues-shield]](https://github.com/afipsdk/afip.js/issues)
[![License][license-shield]](https://github.com/afipsdk/afip.js/blob/master/LICENSE)

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Este es un fork de @afipsdk/afip.js</h3>
  <a href="https://github.com/afipsdk/afip.js">
    <img src="https://github.com/afipsdk/afipsdk.github.io/blob/master/images/logo-colored.png" alt="Afip.js" width="130" height="130">
  </a>

  <h3 align="center">Afip.js</h3>

  <p align="center">
    Necesitaba aislar los certificados digitales de AFIP del código, por eso hicimos el fork. Los certificados
    y el token generado son enviados por parámetros a la librería. Esto era necesario para poder desplegarlo en Nube.
  </p>
</p>

<!-- ABOUT THE PROJECT -->
## Acerca del proyecto
Gracias Afip SDK por el gran aporte!

[Afip SDK](https://afipsdk.com/).


<!-- START GUIDE -->
## Guia de inicio

### Instalacion
#### Via npm

```
npm install --save @aledj02/afip.js
```

#### Via Yarn

```
yarn add @aledj02/afip.js
```

# Como usarlo

Lo primero es incluir el SDK en tu aplicación
````js
const Afip = require('@aledj02/afip.js');
````

Luego creamos una instancia de la clase Afip pasandole un Objeto como parámetro.
````js
const afip = new Afip({ CUIT: 20111111112,
                        production: false,
                        cert: "put your cert string here",
                        key: "put your key string here",
                      });
````

Ahora debemos pedir un token y almacenarlo, como parámetro enviar el nombre de servicio.
'ws_sr_padron_a5'
'ws_sr_padron_a10'
'ws_sr_padron_a13'
etc...
````js
var token = afip.Authorization.getTokenAuth('ws_sr_padron_a13');
````
Luego usar el token generado para consumir el servicio.
````js
const taxpayerDetails = afip.RegisterScopeThirteen.getTaxpayerDetails("cuit a consultar", token.credentials);
````

Puede ver como usario la librería en el repo original, tener en cuenta que al llamar la función para 
pedir los datos de un cuit, enviar como parámetro un json con { token, sign}. [Primeros pasos](https://github.com/afipsdk/afip.js/wiki/Primeros-pasos#como-usarlo) de la documentación

