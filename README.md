# Introducción

Este proyecto se creó con fines exclusivamente educativos y para seguir aprendiendo, no está vinculado a ninguna empresa ni replica ningún algoritmo propietario. La aplicación está desarrollada en **React Native** y consume la API de **MangaDex**.
El código fuente es completamente abierto, de modo que cualquier persona puede estudiarlo o modificarlo libremente, siempre otorgando los créditos correspondientes.

# Como Iniciar

1. Deben tener instalador reaccionar nativo con expo
1. Instala las dependencias con `npm i`
2. Inicio el código con el seguimiento comando en consola. 

```bash
npm start
```

# Estructura del proyecto

* `app`: aquí se encuentran todas las pantallas de la aplicación.
* `api`: gestiona las peticiones a la API, transforma los datos y actualiza los mangas guardados.
* `assets`: contiene las imágenes estáticas de la aplicación.
* `components`: agrupa componentes reutilizables que optimizan el código de las pantallas.
* `utils`: incluye los mensajes para compartir y la configuración de los temas de la aplicación.
* 
# Pantallas

## Bienvenida

Presenta brevemente el propósito de la aplicación con un enfoque principalmente estético. Incluye tarjetas informativas y un carrusel infinito que muestra diversas portadas de manga.

![welcome](https://github.com/user-attachments/assets/8bda47af-a676-4dd6-8a3b-7c9659ece9c1)

## Home

Aquí podrás consultar los mangas más recientemente actualizados, los títulos más populares de MangaDex y las incorporaciones más nuevas al catálogo.

![home](https://github.com/user-attachments/assets/a3c550ef-58a2-4b28-96dd-712e0b984c2d)

## Manga

En esta vista podrás consultar el estado del manga—ya sea que esté en publicación, en pausa o finalizado—y agregarlo a Favoritos para acceder fácilmente a los nuevos capítulos desde esa pestaña.
También encontrarás la sinopsis en los idiomas disponibles y los tags que describen su género, junto con la lista completa de capítulos. Al seleccionar un capítulo se mostrarán los grupos de scanlation disponibles y el estado de lectura (leído o no leído),
con la opción de ordenar la lista en orden ascendente o descendente según tu preferencia.

![mangapage1](https://github.com/user-attachments/assets/ad68b41b-2526-45d3-b874-a2b03e62b91e)


## Buscar

Vista la cual podrás buscar tu manga favorito, mostrando en forma de 2 columnas las opciones que coinciden con el nombre que realizaste la busqueda.

![search](https://github.com/user-attachments/assets/daf0ca08-f6d8-49c3-afd1-1e59056fdc66)
![search2](https://github.com/user-attachments/assets/dbcbb391-4b3a-41fe-bcdd-f1cba800831e)

## Favoritos

Aquí podrás ver los mangas que hayas marcado como favoritos; su información se almacena localmente mediante **AsyncStorage**.

![saved](https://github.com/user-attachments/assets/abc4c75d-2c08-488c-a9bc-26a420eeb87b)
![saved2](https://github.com/user-attachments/assets/a70a4c6b-4241-4ef0-be45-deb3638cb2e8)

## Configuraciones

En la pantalla de ajustes podrás personalizar la aplicación a tu gusto. Desde aquí es posible cambiar el tema visual y vaciar la caché, eliminando tanto los capítulos que ya marcaste como leídos como los mangas guardados en tu dispositivo.

Además, encontrarás distintas formas de contactarme y secciones con información adicional sobre la app y su desarrollo.

![settings](https://github.com/user-attachments/assets/b700507d-7676-4e17-a5d1-a0cc1e312b4a)
![themes](https://github.com/user-attachments/assets/d9cda104-d778-4e9c-acba-425029e1149f)

## Capítulos

Durante la lectura de cada capítulo podrás seleccionar el sentido de desplazamiento de las páginas, ya sea de izquierda a derecha o de derecha a izquierda.
Un toque en el centro de la pantalla oculta la interfaz de opciones, y tocando el borde derecho o izquierdo avanzarás o retrocederás una página, respectivamente.

![readmanga](https://github.com/user-attachments/assets/c1a5c7b5-fb89-48a5-ac7a-3954ef705284)

