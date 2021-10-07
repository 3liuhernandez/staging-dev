function getCurrentWidth() {
  return (window.innerWidth > 0) ? window.innerWidth : screen.width;

}

/* VARIABLE DE LA DONA */
var donutChart;
var iso;
var color

function settingIsotope() {
  /* console.log('isotope') */

  if (iso) {
    // iso.destroy();
    /* console.log('isoarrange', iso) */
    iso.updateSortData()
    iso.arrange({
      sortBy: 'roworder',
      sortAscending: false
    });

  } else {
    iso = new Isotope('.data-map-grid', {
      itemSelector: '.row-sortable',
      layoutMode: 'vertical',
      getSortData: {
        roworder: '[data-roworder] parseInt'
      },
      sortBy: 'roworder',
      sortAscending: false
    });
  }
}


/* FUNCION PARA DIBUJAR EL GRAFICO DE DONA */
function draw_chart_donut(valor, color) {
  var data_set = valor;
  var rest_data = 100 - data_set;

  /* SETEAMOS EL TEXTO DEL PROMEDIO EN EL CUADRO DE LA CHART */
  var datasettxt = data_set.toString();

  document.getElementById('num_prom_pais').innerHTML = datasettxt.replace('.', ',')  + "%";

  /* SET DEFAULT CLASS */
  document.getElementById('num_prom_pais').setAttribute("class", "ff-roboto-black display-6 color-item-selected");
  /* SET NEW COLOR */
  document.getElementById('num_prom_pais').classList.add(color)

  /* GET COLORMAX FROM ITEM SELECTED */
  setcolor = "#"+ getColorSection(color, 2);

  /* console.log(`setColor`, setcolor) */
  var pieData = {
      labels: [],
      datasets: [
      {
          data: [data_set, rest_data],
          backgroundColor: [
          setcolor,
          "#CCCCCC",
          ],
          hoverBackgroundColor: [
          setcolor,
          "#CCCCCC",
          ]
      }],
  };

  /* VERIFICA SI LA CHART YA HA SIDO INICIALIZADA; lA DESTRUYE PARA PINTARLA DE NUEVO */
  if(donutChart) {
    donutChart.destroy();
  }

  let width = getCurrentWidth();
  let cutout = 45;

  if(width <= 800 ) {
    cutout = 40;
  } if (width <= 600 ){
    cutout = 30;
  } if (width <= 480 ){
    cutout = 25;
  }
  if(width >= 900 ) {
    cutout = 45;
  }
  /* console.log(`cutout`, cutout) */

  donutChart = new Chart(document.getElementById('myChart'), {
    type: 'doughnut',
    data: pieData,
    options: {
      cutout: cutout,
      plugins: {
        tooltip: {
          enabled: false
        }
      },
      responsive: true
    },
    animation:{
        animateScale:true
    }
  });
}

const popperEl = document.getElementById('popper')
let popperInstance

const getHex = (value) => {
  return value.toString(16).padStart(2, '0')
}

const getColor = (ratio, color) => {

  /* AQUI SE SETEA EL COLOR DEL MAPA */
  const get_color = getColorSection(color, 3);
  /* console.log(`get_color`, get_color) */

  /* const color1 = 'dc4319' */
  /* const color2 = 'f1d3cb' */
  const color1 = get_color[1];
  const color2 = get_color[0];

  /* if (!isFinite(ratio)) { return '#' + color1 } */
  if (!isFinite(ratio) || (ratio == 0)) { return '#dedede' }

  /* const r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio))
  const g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio))
  const b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio)) */

  let r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio))
  let g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio))
  let b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio))
  r = (r > 255 ? 255 : r);
  g = (g > 255 ? 255 : g);
  b = (b > 255 ? 255 : b);

  return '#' + getHex(r) + getHex(g) + getHex(b)
}

/* FUNCION PARA PINTAR EL MAPA */
function printMapaData(dowpdown_item) {
  // console.log('dowpdown_item ',dowpdown_item)

  Array.from(document.querySelectorAll('.dropdown-menu')).forEach(function(el) {
    el.classList.remove('show');
  });

  var target = "";
  var title_selected_item = "";
  var item_dropdown = "";

  map = document.getElementById("map");
  map.innerHTML = "";

  /**
   * si la funcion se ejecuta por default, sin seleccionar previamente un elemento de dowpdown_item
   *  */
  let index_map = 0;
  if (!dowpdown_item) {
    /* console.log(`no dropdown item`) */
    /**
     * ESTOS SERIAN LOS VALORES DEFAULT, ES DECIR,
     * MUESTRA EL MAPA EN LA SECCION "TIPO DE VINCULO LABORAL Y EL PRIMER ELEMENTO DE ESA LISTA"
     * */
    // item_dropdown = "tipo_vinculo_laboral";
    item_dropdown = "mujeres_direcion_medios";
    /* console.log(`item_dropdown`, item_dropdown); */

    index_map = 1;

    // target = Object.keys(data_map[item_dropdown])[2];
    target = Object.keys(data_map[item_dropdown])[2];

    /* console.log(`target`, target) */

    color = "color-item-green"; // EL COLOR DEL TEMA O DEL dowpdown_item SELECCIONADO

    /* TITLE AND DESC DEFAULT */
    // title_selected_item = "Relación de dependencia";
    title_selected_item = "Mujeres en la dirección de los medios";
    // desc_selected_item = "En ese sentido, un rasgo distintivo en gran parte de esta región de Córdoba es el impulso que las cooperativas de servicios públicos le han dado a la producción local de noticias: hay ciudades como Río Tercero, en el departamento Tercero Arriba; Tío Pujio, en el departamento General San Martín; Villa Huidobro, en el departamento General Roca";
    desc_selected_item = "Las directoras encabezan (14,4%) de las 2.464 organizaciones encuestadas. Tierra del Fuego exhibe proporcionalmente el mayor número de lideresas periodísticas (37,5%) mientras que en el otro extremo de la tabla se sitúa Entre Ríos (5,8%).";

  } else {

    /**
     * SINO, TOMAMOS LOS VALORES QUE VIENEN DEL ELEMENTO CLICKEADO
     */

    /* console.log(dowpdown_item.target.text) */

    /* title_selected_item = dowpdown_item.target.text; */
    /* TITLE SECTION */
    title_selected_item = dowpdown_item.target.dataset.title;

    var classnames = dowpdown_item.target.parentNode.className;

    if (classnames.indexOf('item-red') >= 0) {
      index_map = 0;
    } else if (classnames.indexOf('item-green') >= 0) {
      index_map = 1;
    }

    /* console.log(`index_map`, index_map) */


    /* DESCRIPTION SECTION */
    desc_selected_item = dowpdown_item.target.dataset.description;

    Array.from(document.querySelectorAll('.dropdown-item.active')).forEach(function (el) {
      el.classList.remove('active');
    });

    dowpdown_item.target.classList.add('active')

    target = dowpdown_item.target.dataset.target;
    item_dropdown = dowpdown_item.target.dataset.item_dropdown;

    color = "color-" + dowpdown_item.target.dataset.color; /* COLOR DEL ITEM SELECCIONADO */
    /* console.log(`color`, color) */

    Array.from(document.querySelectorAll('.dropdown-toggle')).forEach(function (el) {
      el.classList.remove('active', 'show');
    });
    /* item_dropdown.target.classList.add('active'); */

    document.getElementById(item_dropdown).classList.add('active');
  }

  setTimeout(()=>{
    let url = encodeURIComponent(window.location.href);
    let url2 = encodeURIComponent(window.location.hostname);

    /* url = "https://staging-xyclon.com/fopea/"; */

    let title = '';
    if(index_map === 0) {
      title = encodeURIComponent("Fopea | La precariedad acorrala a los periodistas profesionales !!!");
      document.getElementById('titulo-principal').textContent = "La precariedad acorrala a los periodistas profesionales";
      document.getElementById('desc-principal').textContent = "La investigación “Situación del periodismo local en la Argentina” presenta datos recopilados entre diciembre de 2020 y mayo de 2021. La información aquí disponible confiere una base objetiva para la comprensión y el debate del ejercicio del oficio, y de las libertades de prensa y de expresión en el país.";

    } else if(index_map === 1) {

      title = encodeURIComponent("Fopea | Ellas lideran 14 de cada 100 entidades periodísticas locales");
      document.getElementById('titulo-principal').textContent = "Ellas lideran 14 de cada 100 entidades periodísticas locales";
      document.getElementById('desc-principal').textContent = "La investigación “Situación del periodismo local en la Argentina” presenta datos recopilados entre diciembre de 2020 y mayo de 2021. La información aquí disponible confiere una base objetiva para la comprensión y el debate del ejercicio del oficio, y de las libertades de prensa y de expresión en el país.";
    }

    /* ICONOS GRISES */
    document.getElementById('grey_btn0').href = "whatsapp://send?text=" + title + " " + url2;
    document.getElementById('grey_btn1').href = "https://www.instagram.com/fopea/";
    document.getElementById('grey_btn2').href = "https://twitter.com/FOPEA";
    document.getElementById('grey_btn3').href = "https://www.facebook.com/fopea";
    document.getElementById('grey_btn4').href = "https://www.linkedin.com/company/fopea";
    /* ICONOS NEGROS */
    document.getElementById('btn0').href = "whatsapp://send?text=" + title + " " + url;
    // document.getElementById('btn1').href = "https://www.instagram.com/?url=" + url;
    document.getElementById('btn1').href = "mailto:?subject="+title+"&body="+title+": " + url;
    document.getElementById('btn2').href = "https://twitter.com/intent/tweet?text="+title+"&url=" + url + "&hashtags=#fopea";
    document.getElementById('btn3').href = "https://www.facebook.com/sharer/sharer.php?u=" + url;
    document.getElementById('btn4').href = "https://www.linkedin.com/sharing/share-offsite/?url=" + url;
  }, 500);

  /* console.log(`dowpdown_item`, dowpdown_item) */

    /* SETEAR EL TITULO DE LA SECCION CON EL ITEM SELECCIONADO */
    document.querySelectorAll('#content-title-item-selected h2')[0].innerHTML = title_selected_item;

    /* SETEAR LA DESCRIPCION DE LA SECCION CON EL ITEM SELECCIONADO */
    document.querySelectorAll('#content-title-item-selected p')[0].innerHTML = desc_selected_item;

    /* DEFINIMOS LA DATA BUSCANDO EN EL OBJETO EL MATCH CON EL ELEMENTO SELECCIONADO EN EL DROPDOWN */
    data = Object.values(data_map[item_dropdown][target]);

    /* console.log(`data`, data) */

    /* OBTENER EL VALOR DEL PROMEDIO PAIS Y PINTAR LA DONA */
    draw_chart_donut(data[2], color);

    /* PINTAMOS EL vALOR DEL PROMEDIO PAIS */
    /* Array.from(document.querySelectorAll('.color-item-selected')).forEach(function(el) {
      el.classList.add(color)
    }); */


    fetch('Mapa-Arg-layered_sm.svg')
      .then(response => response.text())
      .then((image) => {

        let startOfSvg = image.indexOf('<svg')
        startOfSvg = startOfSvg >= 0 ? startOfSvg : 0

        const draw = SVG(image.slice(startOfSvg))
          .addTo('#map')
          .size('100%', '100%')
          /*.panZoom()*/

        // get maximum value among the supplied data
        const max = Math.max(...Object.values(data[1]))

        for (const region of draw.find('.js-map-group')) {
          /* const regionValue = data[region.id()] */

          const regionValue = data[1][region.id()]; // objeto.porcentaje
          const periodistas_detectados = data_map[item_dropdown].periodistas_detectados[region.id()];

          const medios_encuestados = data_map[item_dropdown].medios_encuestados[region.id()];

          const respuestas = data[0][region.id()]; // objeto.respuestas
          const porcentaje = data[1][region.id()]; // objeto.porcentaje
          const porcentajetxt = porcentaje +'%';
          const porcentaje80txt = (porcentaje * .8) +'%';
          let row = document.querySelectorAll('[data-row="'+ region.id()+'"]');
          let row_tr = row[0];
          let row_barra = document.querySelectorAll('[data-row="'+ region.id()+'"] span.bar-fill');
          let barra = row_barra[0]
          /* row_tr.setAttribute("data-roworder", Math.floor(porcentaje)); */
          row_tr.setAttribute("data-roworder", porcentaje * 100);
          //row_tr.setAttribute("style", "order:"+ Math.floor(porcentaje)+";");
          barra.setAttribute("style", "width: "+ porcentaje80txt +" !important");
          /* barra.setAttribute("style", "background: var(--"+ color +") !important"); */

          barra.setAttribute('data-bs-original-title', porcentajetxt)
          barra.setAttribute("title", porcentajetxt);

          var barratooltip = bootstrap.Tooltip.getInstance(barra)
          barratooltip.dispose();
          barratooltip = bootstrap.Tooltip.getOrCreateInstance(barra);

          barra.setAttribute("class", "ff-roboto-regular position-absolute bar-fill");
          barra.classList.add("bg-"+color);


          let area = region.find('.area');
          if (isFinite(regionValue)) {
            // color the region based on it's value with respect to the maximum

            /* area.fill(getColor(parseFloat(regionValue / max).toFixed(2), color)) */
            area.fill(getColor((regionValue / max), color))
            /* area.fill(getColor(0.38, color)); */

            /* console.log(`regionValue`,region.id() + ": " + parseFloat(regionValue / max).toFixed(4)) */

            // show region value as a label
            /*draw.text(regionValue.toString())
              .font({
                size: '1.25em'
              })
              .center(region.cx(), region.cy())*/
          }
          
          // show region data when clicking on it
          /*region.on('click', () => {
            console.log(`region`, region.id())
            alert(`${region.attr('name')} (${region.id()}): ${regionValue}`)
          })*/

          region.on('mouseover', () => {

            popperEl.innerHTML = `
            <span class="d-block ff-roboto-bold text-uppercase">${region.attr('name')}</span>
              <table>
                <tbody>
                <tr>
                    <td>${medios_encuestados}</td>
                    <td>Medios encuestados</td>
                  </tr>
                  <tr>
                    <td>${periodistas_detectados}</td>
                    <td>Periodistas detectados</td>
                  </tr>
                  <tr>
                    <td>${respuestas}</td>
                    <td>Respuestas</td>
                  </tr>
                  <tr>
                    <td class="${color}">${porcentaje}%</td>
                    <td class="${color}">del total de encuestados</td>
                  </tr>
                </tbody>
              </table>
            `
            popperEl.style.visibility = 'visible';

            /**
             * let width = ...
             * CALCULAMOS EL ANCHO DE LA PANTALLA PARA DECIDIR
             * EL LUGAR DONDE SE MUESRA EL POPPER
             */
            let width = getCurrentWidth();
            let place = (width < 500 ) ? 'bottom': 'right';

            popperInstance = Popper.createPopper(region.node, popperEl, { placement: place })
          })

          region.on('mouseleave', () => {
            popperEl.style.visibility = 'hidden'
          })
        }

        settingIsotope()

        /* SETEAR EL TEXTO DE INFORMACION DE LA SECCION */
        printTextAfterMap(item_dropdown+".html");
      })
    ;
}

var data_map = new Object();
data_map = {
  tipo_vinculo_laboral: {
    periodistas_detectados: {
      BA: 3679,
      CABA: 807,
      CA: 225,
      CH: 448,
      CT: 407,
      CB: 1385,
      CR: 477,
      ER: 463,
      FO: 179,
      JY: 334,
      LP: 223,
      LR: 245,
      MZ: 1153,
      MI: 210,
      NQN: 344,
      RN: 511,
      SA: 266,
      SJ: 221,
      SL: 232,
      SC: 121,
      SF: 934,
      SE: 261,
      TF: 103,
      TU: 369,
      GBA: 1711,
      M:0
    },
    medios_encuestados: {
      BA: 641,
      CABA: 103,
      CA: 46,
      CH: 112,
      CT: 63,
      CB: 248,
      CR: 118,
      ER: 104,
      FO: 51,
      JY: 75,
      LP: 63,
      LR: 35,
      MZ: 144,
      MI: 25,
      NQN: 70,
      RN: 102,
      SA: 51,
      SJ: 54,
      SL: 41,
      SC: 35,
      SF: 159,
      SE: 54,
      TF: 16,
      TU: 54,
      GBA: 213,
      M:0
    },
    relacion_independencia: {
        respuestas: {
          BA: 192,
          CABA: 10,
          CA: 13,
          CH: 21,
          CT: 34,
          CB: 94,
          CR: 31,
          ER: 26,
          FO: 21,
          JY: 33,
          LP: 15,
          LR: 16,
          MZ: 37,
          MI: 23,
          NQN: 36,
          RN: 36,
          SA: 20,
          SJ: 14,
          SL: 12,
          SC: 12,
          SF: 84,
          SE: 16,
          TF: 10,
          TU: 17,
          GBA: 27,
          M:0
        },
        porcentaje: {
            BA: 30,
            CABA: 9.7,
            CA: 28.3,
            CH: 18.8,
            CT: 54,
            CB: 37.9,
            CR: 26.3,
            ER: 25,
            FO: 41.2,
            JY: 44,
            LP: 23.8,
            LR: 45.7,
            MZ: 25.7,
            MI: 92,
            NQN: 51.4,
            RN: 35.3,
            SA: 39.2,
            SJ: 25.9,
            SL: 29.3,
            SC: 34.3,
            SF: 52.8,
            SE: 29.6,
            TF: 62.5,
            TU: 31.5,
            GBA: 12.7,
            M:0
        },
        promedio_pais: 33.4
    },
    contrato_limitado: {
      respuestas: {
        BA: 57,
        CABA: 2,
        CA: 3,
        CH: 3,
        CT: 12,
        CB: 11,
        CR: 12,
        ER: 4,
        FO: 6,
        JY: 28,
        LP: 2,
        LR: 6,
        MZ: 9,
        MI: 17,
        NQN: 6,
        RN: 12,
        SA: 9,
        SJ: 3,
        SL: 2,
        SC: 3,
        SF: 4,
        SE: 3,
        TF: 4,
        TU: 10,
        GBA: 8,
        M:0
      },
      porcentaje: {
        BA: 8.9,
        CABA: 1.9,
        CA: 6.5,
        CH: 2.7,
        CT: 19,
        CB: 4.4,
        CR: 10.2,
        ER: 3.8,
        FO: 11.8,
        JY: 37.3,
        LP: 3.2,
        LR: 17.1,
        MZ: 6.3,
        MI: 68,
        NQN: 8.6,
        RN: 11.8,
        SA: 17.6,
        SJ: 5.6,
        SL: 4.9,
        SC: 8.6,
        SF: 2.5,
        SE: 5.6,
        TF: 25,
        TU: 18.5,
        GBA: 3.8,
        M:0
      },
      promedio_pais: 9.3
    },
    pasantia: {
      respuestas: {
        BA: 17,
        CABA: 2,
        CA: 2,
        CH: 0,
        CT: 3,
        CB: 12,
        CR: 5,
        ER: 2,
        FO: 1,
        JY: 5,
        LP: 1,
        LR: 3,
        MZ: 8,
        MI: 3,
        NQN: 2,
        RN: 2,
        SA: 2,
        SJ: 4,
        SL: 0,
        SC: 0,
        SF: 12,
        SE: 2,
        TF: 0,
        TU: 5,
        GBA: 8,
        M:0
      },
      porcentaje: {
        BA: 2.7,
        CABA: 1.9,
        CA: 4.3,
        CH: 0,
        CT: 4.8,
        CB: 4.8,
        CR: 4.2,
        ER: 1.9,
        FO: 2,
        JY: 6.7,
        LP: 1.6,
        LR: 8.6,
        MZ: 5.6,
        MI: 12,
        NQN: 2.9,
        RN: 2,
        SA: 3.9,
        SJ: 7.4,
        SL: 0,
        SC: 0,
        SF: 7.5,
        SE: 3.7,
        TF: 0,
        TU: 9.3,
        GBA: 3.8,
        M:0
      },
      promedio_pais: 3.8
    },
    monotributo: {
      respuestas: {
        BA: 109,
        CABA: 48,
        CA: 10,
        CH: 23,
        CT: 20,
        CB: 67,
        CR: 59,
        ER: 40,
        FO: 41,
        JY: 26,
        LP: 9,
        LR: 8,
        MZ: 16,
        MI: 18,
        NQN: 21,
        RN: 41,
        SA: 17,
        SJ: 14,
        SL: 11,
        SC: 12,
        SF: 61,
        SE: 3,
        TF: 4,
        TU: 13,
        GBA: 28,
        M:0
      },
      porcentaje: {
        BA: 17,
        CABA: 46.6,
        CA: 21.7,
        CH: 20.5,
        CT: 31.7,
        CB: 27,
        CR: 50,
        ER: 38.5,
        FO: 80.4,
        JY: 34.7,
        LP: 14.3,
        LR: 22.9,
        MZ: 11.1,
        MI: 72,
        NQN: 30,
        RN: 40.2,
        SA: 33.3,
        SJ: 25.9,
        SL: 26.8,
        SC: 34.3,
        SF: 38.4,
        SE: 5.6,
        TF: 25,
        TU: 24.1,
        GBA: 13.1,
        M:0
      },
      promedio_pais: 28.0
    },
    cuentapropismo: {
      respuestas: {
        BA: 109,
        BA: 58,
        CABA: 52,
        CA: 6,
        CH: 22,
        CT: 8,
        CB: 80,
        CR: 14,
        ER: 13,
        FO: 0,
        JY: 28,
        LP: 18,
        LR: 4,
        MZ: 33,
        MI: 0,
        NQN: 11,
        RN: 16,
        SA: 6,
        SJ: 10,
        SL: 3,
        SC: 4,
        SF: 36,
        SE: 6,
        TF: 0,
        TU: 12,
        GBA: 17,
        M:0
      },
      porcentaje: {
        BA: 9,
        CABA: 50.5,
        CA: 13,
        CH: 19.6,
        CT: 12.7,
        CB: 32.3,
        CR: 11.9,
        ER: 12.5,
        FO: 0,
        JY: 37.3,
        LP: 28.6,
        LR: 11.4,
        MZ: 22.9,
        MI: 0,
        NQN: 15.7,
        RN: 15.7,
        SA: 11.8,
        SJ: 18.5,
        SL: 7.3,
        SC: 11.4,
        SF: 22.6,
        SE: 11.1,
        TF: 0,
        TU: 22.2,
        GBA: 8,
        M:0
      },
      promedio_pais: 17.9
    },
    empleo_no_registrado: {
      respuestas: {
        BA: 9,
        CABA: 6,
        CA: 1,
        CH: 1,
        CT: 1,
        CB: 7,
        CR: 11,
        ER: 1,
        FO: 4,
        JY: 20,
        LP: 3,
        LR: 5,
        MZ: 3,
        MI: 1,
        NQN: 2,
        RN: 0,
        SA: 2,
        SJ: 8,
        SL: 5,
        SC: 1,
        SF: 6,
        SE: 0,
        TF: 0,
        TU: 3,
        GBA: 5,
        M:0
      },
      porcentaje: {
        BA: 1.4,
        CABA: 5.8,
        CA: 2.2,
        CH: 0.9,
        CT: 1.6,
        CB: 2.8,
        CR: 9.3,
        ER: 1,
        FO: 7.8,
        JY: 26.7,
        LP: 4.8,
        LR: 14.3,
        MZ: 2.1,
        MI: 4,
        NQN: 2.9,
        RN: 0,
        SA: 3.9,
        SJ: 14.8,
        SL: 12.2,
        SC: 2.9,
        SF: 3.8,
        SE: 0,
        TF: 0,
        TU: 5.6,
        GBA: 2.3,
        M:0
      },
      promedio_pais: 4.1
    },
    comisión_de_publicidad: {
      respuestas: {
        BA: 28,
        CABA: 3,
        CA: 8,
        CH: 34,
        CT: 8,
        CB: 47,
        CR: 44,
        ER: 19,
        FO: 19,
        JY: 8,
        LP: 8,
        LR: 6,
        MZ: 17,
        MI: 6,
        NQN: 5,
        RN: 17,
        SA: 31,
        SJ: 15,
        SL: 12,
        SC: 3,
        SF: 24,
        SE: 24,
        TF: 1,
        TU: 18,
        GBA: 10,
        M:0
      },
      porcentaje: {
        BA: 4.4,
        CABA: 2.9,
        CA: 17.4,
        CH: 30.4,
        CT: 12.7,
        CB: 19,
        CR: 37.3,
        ER: 18.3,
        FO: 37.3,
        JY: 10.7,
        LP: 12.7,
        LR: 17.1,
        MZ: 11.8,
        MI: 24,
        NQN: 7.1,
        RN: 16.7,
        SA: 60.8,
        SJ: 27.8,
        SL: 29.3,
        SC: 8.6,
        SF: 15.1,
        SE: 44.4,
        TF: 6.3,
        TU: 33.3,
        GBA: 4.7,
        M:0
      },
      promedio_pais: 16.4
    },
    otras_formas_de_relacion: {
      respuestas: {
        BA: 335,
        CABA: 59,
        CA: 18,
        CH: 35,
        CT: 9,
        CB: 55,
        CR: 24,
        ER: 9,
        FO: 4,
        JY: 11,
        LP: 12,
        LR: 4,
        MZ: 96,
        MI: 16,
        NQN: 6,
        RN: 12,
        SA: 6,
        SJ: 2,
        SL: 11,
        SC: 10,
        SF: 34,
        SE: 8,
        TF: 3,
        TU: 3,
        GBA: 157,
        M:0
      },
      porcentaje: {
        BA: 52.3,
        CABA: 57.3,
        CA: 39.1,
        CH: 31.3,
        CT: 14.3,
        CB: 22.2,
        CR: 20.3,
        ER: 8.7,
        FO: 7.8,
        JY: 14.7,
        LP: 19.0,
        LR: 11.4,
        MZ: 66.7,
        MI: 64.0,
        NQN: 8.6,
        RN: 11.8,
        SA: 11.8,
        SJ: 3.7,
        SL: 26.8,
        SC: 28.6,
        SF: 21.4,
        SE: 14.8,
        TF: 18.8,
        TU: 5.6,
        GBA: 73.7,
        M:0
      },
      promedio_pais: 31.7
    }
  },

  mujeres_direcion_medios: {
    periodistas_detectados: {
      BA: 3679,
      CABA: 807,
      CA: 225,
      CH: 448,
      CT: 407,
      CB: 1385,
      CR: 477,
      ER: 463,
      FO: 179,
      JY: 334,
      LP: 223,
      LR: 245,
      MZ: 1153,
      MI: 210,
      NQN: 344,
      RN: 511,
      SA: 266,
      SJ: 221,
      SL: 232,
      SC: 121,
      SF: 934,
      SE: 261,
      TF: 103,
      TU: 369,
      GBA: 1711,
      M:0
    },
    medios_encuestados: {
      BA: 641,
      CABA: 103,
      CA: 46,
      CH: 112,
      CT: 63,
      CB: 248,
      CR: 118,
      ER: 104,
      FO: 51,
      JY: 75,
      LP: 63,
      LR: 35,
      MZ: 144,
      MI: 25,
      NQN: 70,
      RN: 102,
      SA: 51,
      SJ: 54,
      SL: 41,
      SC: 35,
      SF: 159,
      SE: 54,
      TF: 16,
      TU: 54,
      GBA: 213,
      M:0
    },
    medios_liderados: {
      respuestas: {
        BA: 44,
        CABA: 28,
        CA: 9,
        CH: 17,
        CT: 16,
        CB: 55,
        CR: 16,
        ER: 6,
        FO: 4,
        JY: 17,
        LP: 10,
        LR: 4,
        MZ: 26,
        MI: 3,
        NQN: 10,
        RN: 21,
        SA: 9,
        SJ: 12,
        SL: 8,
        SC: 3,
        SF: 20,
        SE: 6,
        TF: 6,
        TU: 4,
        GBA: 24,
        M:0
      },
      porcentaje: {
        BA: 6.9,
        CABA: 27.2,
        CA: 19.6,
        CH: 15.2,
        CT: 25.4,
        CB: 22.2,
        CR: 13.6,
        ER: 5.8,
        FO: 7.8,
        JY: 22.7,
        LP: 15.9,
        LR: 11.4,
        MZ: 18.1,
        MI: 12.0,
        NQN: 14.3,
        RN: 20.6,
        SA: 17.6,
        SJ: 22.2,
        SL: 19.5,
        SC: 8.6,
        SF: 12.6,
        SE: 11.1,
        TF: 37.5,
        TU: 7.4,
        GBA: 11.3,
        M:0
      },
      promedio_pais: 14.4
    },
  },

  diversidad_de_medios: {
    periodistas_detectados: {
      BA: 3679,
      CABA: 807,
      CA: 225,
      CH: 448,
      CT: 407,
      CB: 1385,
      CR: 477,
      ER: 463,
      FO: 179,
      JY: 334,
      LP: 223,
      LR: 245,
      MZ: 1153,
      MI: 210,
      NQN: 344,
      RN: 511,
      SA: 266,
      SJ: 221,
      SL: 232,
      SC: 121,
      SF: 934,
      SE: 261,
      TF: 103,
      TU: 369,
      GBA: 1711,
      M:0
    },
    medios_encuestados: {
      BA: 641,
      CABA: 103,
      CA: 46,
      CH: 112,
      CT: 63,
      CB: 248,
      CR: 118,
      ER: 104,
      FO: 51,
      JY: 75,
      LP: 63,
      LR: 35,
      MZ: 144,
      MI: 25,
      NQN: 70,
      RN: 102,
      SA: 51,
      SJ: 54,
      SL: 41,
      SC: 35,
      SF: 159,
      SE: 54,
      TF: 16,
      TU: 54,
      GBA: 213,
      M:0
    },
    diario_de_papel: {
      respuestas: {
        BA: 68,
        CABA: 11,
        CA: 3,
        CH: 4,
        CT: 7,
        CB: 14,
        CR: 5,
        ER: 11,
        FO: 4,
        JY: 3,
        LP: 4,
        LR: 2,
        MZ: 6,
        MI: 3,
        NQN: 2,
        RN: 3,
        SA: 1,
        SJ: 1,
        SL: 2,
        SC: 1,
        SF: 12,
        SE: 4,
        TF: 4,
        TU: 1,
        GBA: 19,
        M:0
      },
      porcentaje: {
        BA: 10.6,
        CABA: 10.7,
        CA: 6.5,
        CH: 3.6,
        CT: 11.1,
        CB: 5.6,
        CR: 4.2,
        ER: 10.6,
        FO: 7.8,
        JY: 4.0,
        LP: 6.3,
        LR: 5.7,
        MZ: 4.2,
        MI: 12.0,
        NQN: 2.9,
        RN: 2.9,
        SA: 2.0,
        SJ: 1.9,
        SL: 4.9,
        SC: 2.9,
        SF: 7.5,
        SE: 7.4,
        TF: 25.0,
        TU: 1.9,
        GBA: 8.9,
        M:0
      },
      promedio_pais: 7.1
    },
    semanario: {
      respuestas: {
        BA: 29,
        CABA: 0,
        CA: 0,
        CH: 0,
        CT: 1,
        CB: 10,
        CR: 0,
        ER: 1,
        FO: 0,
        JY: 1,
        LP: 2,
        LR: 1,
        MZ: 2,
        MI: 0,
        NQN: 0,
        RN: 0,
        SA: 1,
        SJ: 0,
        SL: 0,
        SC: 1,
        SF: 6,
        SE: 2,
        TF: 0,
        TU: 0,
        GBA: 14,
        M:0
      },
      porcentaje: {
        BA: 4.5,
        CABA: 0.0,
        CA: 0.0,
        CH: 0.0,
        CT: 1.6,
        CB: 4.0,
        CR: 0.0,
        ER: 1.0,
        FO: 0.0,
        JY: 1.3,
        LP: 3.2,
        LR: 2.9,
        MZ: 1.4,
        MI: 0.0,
        NQN: 0.0,
        RN: 0.0,
        SA: 2.0,
        SJ: 0.0,
        SL: 0.0,
        SC: 2.9,
        SF: 3.8,
        SE: 3.7,
        TF: 0.0,
        TU: 0.0,
        GBA: 6.6,
        M:0
      },
      promedio_pais: 2.3
    },
    quincenario: {
      respuestas: {
        BA: 5,
        CABA: 0,
        CA: 0,
        CH: 0,
        CT: 0,
        CB: 1,
        CR: 0,
        ER: 2,
        FO: 0,
        JY: 0,
        LP: 0,
        LR: 0,
        MZ: 0,
        MI: 0,
        NQN: 0,
        RN: 0,
        SA: 0,
        SJ: 0,
        SL: 0,
        SC: 0,
        SF: 2,
        SE: 0,
        TF: 0,
        TU: 0,
        GBA: 3,
        M:0
      },
      porcentaje: {
        BA: 0.8,
        CABA: 0.0,
        CA: 0.0,
        CH: 0.0,
        CT: 0.0,
        CB: 0.4,
        CR: 0.0,
        ER: 1.9,
        FO: 0.0,
        JY: 0.0,
        LP: 0.0,
        LR: 0.0,
        MZ: 0.0,
        MI: 0.0,
        NQN: 0.0,
        RN: 0.0,
        SA: 0.0,
        SJ: 0.0,
        SL: 0.0,
        SC: 0.0,
        SF: 1.3,
        SE: 0.0,
        TF: 0.0,
        TU: 0.0,
        GBA: 1.4,
        M:0
      },
      promedio_pais: 0.4
    },
    mensual_mayor: {
      respuestas: {
        BA: 23,
        CABA: 21,
        CA: 0,
        CH: 0,
        CT: 0,
        CB: 12,
        CR: 0,
        ER: 2,
        FO: 0,
        JY: 0,
        LP: 2,
        LR: 0,
        MZ: 1,
        MI: 0,
        NQN: 0,
        RN: 0,
        SA: 1,
        SJ: 2,
        SL: 0,
        SC: 0,
        SF: 5,
        SE: 1,
        TF: 0,
        TU: 0,
        GBA: 15,
        M:0
      },
      porcentaje: {
        BA: 3.6,
        CABA: 20.4,
        CA: 0.0,
        CH: 0.0,
        CT: 0.0,
        CB: 4.8,
        CR: 0.0,
        ER: 1.9,
        FO: 0.0,
        JY: 0.0,
        LP: 3.2,
        LR: 0.0,
        MZ: 0.7,
        MI: 0.0,
        NQN: 0.0,
        RN: 0.0,
        SA: 2.0,
        SJ: 3.7,
        SL: 0.0,
        SC: 0.0,
        SF: 3.1,
        SE: 1.9,
        TF: 0.0,
        TU: 0.0,
        GBA: 7.0,
        M:0
      },
      promedio_pais: 2.8
    },
    revista: {
      respuestas: {
        BA: 8,
        CABA: 7,
        CA: 0,
        CH: 0,
        CT: 0,
        CB: 4,
        CR: 0,
        ER: 1,
        FO: 0,
        JY: 0,
        LP: 1,
        LR: 1,
        MZ: 7,
        MI: 0,
        NQN: 0,
        RN: 0,
        SA: 0,
        SJ: 1,
        SL: 0,
        SC: 0,
        SF: 6,
        SE: 1,
        TF: 0,
        TU: 1,
        GBA: 6,
        M:0
      },
      porcentaje: {
        BA: 1.2,
        CABA: 6.8,
        CA: 0.0,
        CH: 0.0,
        CT: 0.0,
        CB: 1.6,
        CR: 0.0,
        ER: 1.0,
        FO: 0.0,
        JY: 0.0,
        LP: 1.6,
        LR: 2.9,
        MZ: 4.9,
        MI: 0.0,
        NQN: 0.0,
        RN: 0.0,
        SA: 0.0,
        SJ: 1.9,
        SL: 0.0,
        SC: 0.0,
        SF: 3.8,
        SE: 1.9,
        TF: 0.0,
        TU: 1.9,
        GBA: 2.8,
        M:0
      },
      promedio_pais: 1.5
    },
    agencia_noticias: {
      respuestas: {
        BA: 18,
        CABA: 1,
        CA: 0,
        CH: 2,
        CT: 2,
        CB: 4,
        CR: 7,
        ER: 1,
        FO: 4,
        JY: 0,
        LP: 1,
        LR: 0,
        MZ: 1,
        MI: 0,
        NQN: 3,
        RN: 6,
        SA: 1,
        SJ: 0,
        SL: 0,
        SC: 1,
        SF: 2,
        SE: 0,
        TF: 0,
        TU: 1,
        GBA: 9,
        M:0
      },
      porcentaje: {
        BA: 2.8,
        CABA: 1.0,
        CA: 0.0,
        CH: 1.8,
        CT: 3.2,
        CB: 1.6,
        CR: 5.9,
        ER: 1.0,
        FO: 7.8,
        JY: 0.0,
        LP: 1.6,
        LR: 0.0,
        MZ: 0.7,
        MI: 0.0,
        NQN: 4.3,
        RN: 5.9,
        SA: 2.0,
        SJ: 0.0,
        SL: 0.0,
        SC: 2.9,
        SF: 1.3,
        SE: 0.0,
        TF: 0.0,
        TU: 1.9,
        GBA: 4.2,
        M:0
      },
      promedio_pais: 1.5
    },
    estacion_radio: {
      respuestas: {
        BA: 239,
        CABA: 17,
        CA: 27,
        CH: 75,
        CT: 40,
        CB: 128,
        CR: 71,
        ER: 34,
        FO: 27,
        JY: 68,
        LP: 34,
        LR: 26,
        MZ: 97,
        MI: 15,
        NQN: 43,
        RN: 68,
        SA: 37,
        SJ: 34,
        SL: 28,
        SC: 21,
        SF: 90,
        SE: 38,
        TF: 8,
        TU: 35,
        GBA: 62,
        M:0
      },
      porcentaje: {
        BA: 37.3,
        CABA: 16.5,
        CA: 58.7,
        CH: 67.0,
        CT: 63.5,
        CB: 51.6,
        CR: 60.2,
        ER: 32.7,
        FO: 52.9,
        JY: 90.7,
        LP: 54.0,
        LR: 74.3,
        MZ: 67.4,
        MI: 60.0,
        NQN: 61.4,
        RN: 66.7,
        SA: 72.5,
        SJ: 63.0,
        SL: 68.3,
        SC: 60.0,
        SF: 56.6,
        SE: 70.4,
        TF: 50.0,
        TU: 64.8,
        GBA: 29.1,
        M:0
      },
      promedio_pais: 52.8
    },
    canal_tv: {
      respuestas: {
        BA: 55,
        CABA: 1,
        CA: 2,
        CH: 19,
        CT: 10,
        CB: 57,
        CR: 11,
        ER: 18,
        FO: 8,
        JY: 20,
        LP: 13,
        LR: 10,
        MZ: 14,
        MI: 5,
        NQN: 7,
        RN: 15,
        SA: 8,
        SJ: 6,
        SL: 6,
        SC: 6,
        SF: 26,
        SE: 4,
        TF: 2,
        TU: 8,
        GBA: 15,
        M:0
      },
      porcentaje: {
        BA: 8.6,
        CABA: 1.0,
        CA: 4.3,
        CH: 17.0,
        CT: 15.9,
        CB: 23.0,
        CR: 9.3,
        ER: 17.3,
        FO: 15.7,
        JY: 26.7,
        LP: 20.6,
        LR: 28.6,
        MZ: 9.7,
        MI: 20.0,
        NQN: 10.0,
        RN: 14.7,
        SA: 15.7,
        SJ: 11.1,
        SL: 14.6,
        SC: 17.1,
        SF: 16.4,
        SE: 7.4,
        TF: 12.5,
        TU: 14.8,
        GBA: 7.0,
        M:0
      },
      promedio_pais: 13.4
    },
    /* SUBMENU */
    portal_de_noticias: {
      respuestas: {
        BA: 431,
        CABA: 89,
        CA: 27,
        CH: 51,
        CT: 35,
        CB: 133,
        CR: 74,
        ER: 57,
        FO: 29,
        JY: 26,
        LP: 24,
        LR: 22,
        MZ: 83,
        MI: 16,
        NQN: 27,
        RN: 62,
        SA: 18,
        SJ: 21,
        SL: 22,
        SC: 26,
        SF: 128,
        SE: 23,
        TF: 10,
        TU: 30,
        GBA: 177,
        M:0
      },
      porcentaje: {
        BA: 67.2,
        CABA: 86.4,
        CA: 58.7,
        CH: 45.5,
        CT: 55.6,
        CB: 53.6,
        CR: 62.7,
        ER: 54.8,
        FO: 56.9,
        JY: 34.7,
        LP: 38.1,
        LR: 62.9,
        MZ: 57.6,
        MI: 64.0,
        NQN: 38.6,
        RN: 60.8,
        SA: 35.3,
        SJ: 38.9,
        SL: 53.7,
        SC: 74.3,
        SF: 80.5,
        SE: 42.6,
        TF: 62.5,
        TU: 55.6,
        GBA: 83.1,
        M:0
      },
      promedio_pais: 59.4
    },
    blog: {
      respuestas: {
        BA: 35,
        CABA: 3,
        CA: 2,
        CH: 1,
        CT: 1,
        CB: 5,
        CR: 9,
        ER: 2,
        FO: 2,
        JY: 1,
        LP: 1,
        LR: 0,
        MZ: 6,
        MI: 0,
        NQN: 3,
        RN: 2,
        SA: 0,
        SJ: 0,
        SL: 1,
        SC: 0,
        SF: 3,
        SE: 0,
        TF: 0,
        TU: 2,
        GBA: 5,
        M:0
      },
      porcentaje: {
        BA: 5.5,
        CABA: 2.9,
        CA: 4.3,
        CH: 0.9,
        CT: 1.6,
        CB: 2.0,
        CR: 7.6,
        ER: 1.9,
        FO: 3.9,
        JY: 1.3,
        LP: 1.6,
        LR: 0.0,
        MZ: 4.2,
        MI: 0.0,
        NQN: 4.3,
        RN: 2.0,
        SA: 0.0,
        SJ: 0.0,
        SL: 2.4,
        SC: 0.0,
        SF: 1.9,
        SE: 0.0,
        TF: 0.0,
        TU: 3.7,
        GBA: 2.3,
        M:0
      },
      promedio_pais: 3.2
    },
    newsletter: {
      respuestas: {
        BA: 16,
        CABA: 6,
        CA: 2,
        CH: 2,
        CT: 4,
        CB: 14,
        CR: 5,
        ER: 0,
        FO: 0,
        JY: 0,
        LP: 0,
        LR: 2,
        MZ: 8,
        MI: 0,
        NQN: 3,
        RN: 6,
        SA: 0,
        SJ: 0,
        SL: 0,
        SC: 1,
        SF: 6,
        SE: 1,
        TF: 0,
        TU: 1,
        GBA: 7,
        M:0
      },
      porcentaje: {
        BA: 2.5,
        CABA: 5.8,
        CA: 4.3,
        CH: 1.8,
        CT: 6.3,
        CB: 5.6,
        CR: 4.2,
        ER: 0.0,
        FO: 0.0,
        JY: 0.0,
        LP: 0.0,
        LR: 5.7,
        MZ: 5.6,
        MI: 0.0,
        NQN: 4.3,
        RN: 5.9,
        SA: 0.0,
        SJ: 0.0,
        SL: 0.0,
        SC: 2.9,
        SF: 3.8,
        SE: 1.9,
        TF: 0.0,
        TU: 1.9,
        GBA: 3.3,
        M:0
      },
      promedio_pais: 3.1
    },
    instagram: {
      respuestas: {
        BA: 238,
        CABA: 28,
        CA: 13,
        CH: 22,
        CT: 18,
        CB: 101,
        CR: 46,
        ER: 27,
        FO: 18,
        JY: 13,
        LP: 12,
        LR: 16,
        MZ: 103,
        MI: 4,
        NQN: 15,
        RN: 46,
        SA: 16,
        SJ: 18,
        SL: 19,
        SC: 12,
        SF: 70,
        SE: 10,
        TF: 6,
        TU: 21,
        GBA: 144,
        M:0
      },
      porcentaje: {
        BA: 37.1,
        CABA: 27.2,
        CA: 28.3,
        CH: 19.6,
        CT: 28.6,
        CB: 40.7,
        CR: 39.0,
        ER: 26.0,
        FO: 35.3,
        JY: 17.3,
        LP: 19.0,
        LR: 45.7,
        MZ: 71.5,
        MI: 16.0,
        NQN: 21.4,
        RN: 45.1,
        SA: 31.4,
        SJ: 33.3,
        SL: 46.3,
        SC: 34.3,
        SF: 44.0,
        SE: 18.5,
        TF: 37.5,
        TU: 38.9,
        GBA: 53.5,
        M:0
      },
      promedio_pais: 36.2
    },
    facebook: {
      respuestas: {
        BA: 408,
        CABA: 41,
        CA: 27,
        CH: 69,
        CT: 36,
        CB: 160,
        CR: 84,
        ER: 43,
        FO: 41,
        JY: 66,
        LP: 30,
        LR: 24,
        MZ: 140,
        MI: 11,
        NQN: 25,
        RN: 67,
        SA: 34,
        SJ: 34,
        SL: 29,
        SC: 21,
        SF: 119,
        SE: 19,
        TF: 8,
        TU: 26,
        GBA: 176,
        M:0
      },
      porcentaje: {
        BA: 63.7,
        CABA: 39.8,
        CA: 58.7,
        CH: 61.6,
        CT: 57.1,
        CB: 64.5,
        CR: 71.2,
        ER: 41.3,
        FO: 80.4,
        JY: 88.0,
        LP: 47.6,
        LR: 68.6,
        MZ: 97.2,
        MI: 44.0,
        NQN: 35.7,
        RN: 65.7,
        SA: 66.7,
        SJ: 63.0,
        SL: 70.7,
        SC: 60.0,
        SF: 74.8,
        SE: 35.2,
        TF: 50.0,
        TU: 48.1,
        GBA: 82.6,
        M:0
      },
      promedio_pais: 64.7
    },
    twitter: {
      respuestas: {
        BA: 275,
        CABA: 33,
        CA: 11,
        CH: 19,
        CT: 26,
        CB: 65,
        CR: 36,
        ER: 17,
        FO: 12,
        JY: 14,
        LP: 8,
        LR: 17,
        MZ: 75,
        MI: 5,
        NQN: 14,
        RN: 39,
        SA: 13,
        SJ: 9,
        SL: 9,
        SC: 11,
        SF: 72,
        SE: 6,
        TF: 7,
        TU: 16,
        GBA: 141,
        M:0
      },
      porcentaje: {
        BA: 42.9,
        CABA: 32.0,
        CA: 23.9,
        CH: 17.0,
        CT: 41.3,
        CB: 26.2,
        CR: 30.5,
        ER: 16.3,
        FO: 23.5,
        JY: 18.7,
        LP: 12.7,
        LR: 48.6,
        MZ: 52.1,
        MI: 20.0,
        NQN: 20.0,
        RN: 38.2,
        SA: 25.5,
        SJ: 16.7,
        SL: 22.0,
        SC: 31.4,
        SF: 45.3,
        SE: 11.1,
        TF: 43.8,
        TU: 29.6,
        GBA: 66.2,
        M:0
      },
      promedio_pais: 32.8
    },
    youtube: {
      respuestas: {
        BA: 168,
        CABA: 21,
        CA: 8,
        CH: 18,
        CT: 16,
        CB: 62,
        CR: 23,
        ER: 17,
        FO: 10,
        JY: 14,
        LP: 8,
        LR: 12,
        MZ: 54,
        MI: 3,
        NQN: 8,
        RN: 31,
        SA: 7,
        SJ: 5,
        SL: 11,
        SC: 15,
        SF: 44,
        SE: 5,
        TF: 2,
        TU: 13,
        GBA: 90,
        M:0
      },
      porcentaje: {
        BA: 26.2,
        CABA: 20.4,
        CA: 17.4,
        CH: 16.1,
        CT: 25.4,
        CB: 25.0,
        CR: 19.5,
        ER: 16.3,
        FO: 19.6,
        JY: 18.7,
        LP: 12.7,
        LR: 34.3,
        MZ: 37.5,
        MI: 12.0,
        NQN: 11.4,
        RN: 30.4,
        SA: 13.7,
        SJ: 9.3,
        SL: 26.8,
        SC: 42.9,
        SF: 27.7,
        SE: 9.3,
        TF: 12.5,
        TU: 24.1,
        GBA: 42.3,
        M:0
      },
      promedio_pais: 23.3
    },
    otra: {
      respuestas: {
        BA: 17,
        CABA: 10,
        CA: 0,
        CH: 0,
        CT: 1,
        CB: 6,
        CR: 8,
        ER: 0,
        FO: 0,
        JY: 1,
        LP: 2,
        LR: 3,
        MZ: 6,
        MI: 1,
        NQN: 2,
        RN: 5,
        SA: 2,
        SJ: 1,
        SL: 2,
        SC: 0,
        SF: 1,
        SE: 0,
        TF: 0,
        TU: 2,
        GBA: 7,
        M:0
      },
      porcentaje: {
        BA: 2.7,
        CABA: 9.7,
        CA: 0.0,
        CH: 0.0,
        CT: 1.6,
        CB: 2.4,
        CR: 6.8,
        ER: 0.0,
        FO: 0.0,
        JY: 1.3,
        LP: 3.2,
        LR: 8.6,
        MZ: 4.2,
        MI: 4.0,
        NQN: 2.9,
        RN: 4.9,
        SA: 3.9,
        SJ: 1.9,
        SL: 4.9,
        SC: 0.0,
        SF: 0.6,
        SE: 0.0,
        TF: 0.0,
        TU: 3.7,
        GBA: 3.3,
        M:0
      },
      promedio_pais: 2.8
    },
  }
}

/* console.log(`data_map`, data_map) */
/**
 * function getColorSection(color, selected)
 *
 * color = color-item-[red, green, blue, purple, lblue]
 *
 * selected is type number = 1 | 2
 * 1 == colorMin
 * 2 == colorMax
 * 3 == [colorMin, colorMax]
*/
function getColorSection(color, selected) {
  let colorMax = "";
  let colorMin = "";

  /* PINTAR EL COLOR EN LA DONA */
  if(color === "color-item-red") {
    colorMax = "dc4319";
    colorMin = "f1d3cb";

  } else if(color === "color-item-green") {
    colorMax = "78a842";
    colorMin = "dde9d0";

  } else if(color === "color-item-blue") {
    colorMax = "16618b";
    colorMin = "c5d7e2";

  } else if(color === "color-item-orange") {
    colorMax = "ff9622";
    colorMin = "ffe5c8";

  } else if(color === "color-item-purple") {
    colorMax = "7e6d9b";
    colorMin = "dfdae6";

  } else {
    colorMax = "50bdd4";
    colorMin = "d3eef4";
  }

  if(selected > 2 ){
    return [colorMin, colorMax];
  }
  else if(selected > 1 ){
    return colorMax;

  } else if(selected < 1) {
    return colorMin;

  } else {
    /* RETURN DEFAULT */
    return colorMax;
  }
}

async function printTextAfterMap(section_file) {
  document.getElementById("content-info-general").innerHTML = "";

  /* console.log(`section_file`, section_file); */
  let x = await fetch("texto_info_after_map/"+section_file+"?v=123");
  let y = await x.text();
  document.getElementById("content-info-general").innerHTML = y;
}