// Espera a que el DOM esté listo
window.addEventListener("DOMContentLoaded", function () {

  // ANUNCIO INICIAL DE PEDIDOS
const pedidosCerrados = false; // ← CAMBIA A true si ya no se aceptan más

const overlay = document.getElementById("anuncioOverlay");
const mensaje = document.getElementById("mensajeAnuncio");
const botonContinuar = document.getElementById("btnContinuar");
const contenidoPagina = document.getElementById("contenidoPagina");

// Calcular fecha del próximo viernes
const hoy = new Date();
const diaActual = hoy.getDay();
const diasParaViernes = (5 - diaActual + 7) % 7 || 7;
const proximoViernes = new Date(hoy.setDate(hoy.getDate() + diasParaViernes));
const fechaFormateada = proximoViernes.toLocaleDateString("es-CO", {
  day: 'numeric',
  month: 'long'
});

if (pedidosCerrados) {
  mensaje.innerHTML = `
    🚫 Ya hemos alcanzado el <strong>tope máximo de encargos</strong> para este viernes <strong>${fechaFormateada}</strong> 🚛<br><br>
    🕐 ¡Gracias por tu interés! Te esperamos la proxima semana 🙌
  `;
  botonContinuar.style.display = "none";
  contenidoPagina.style.display = "none";
  overlay.style.display = "flex";
} else {
  mensaje.innerHTML = `
    📢 <strong>¡Atención!</strong> Los pasteles de <strong>Candelaria - Sabor y Sazón</strong> se preparan por encargo 🍽️<br><br>
    🗓️ Los próximos pasteles estarán listos para el <strong>${fechaFormateada}</strong>.<br><br>
    ✅ Separa el tuyo con anticipación, ¡hay cupos limitados! 🛒
  `;
  overlay.style.display = "flex";

  botonContinuar.addEventListener("click", () => {
    overlay.style.display = "none";
    contenidoPagina.style.display = "block";
  });
}
// FIN ANUNCIO INICIAL DE PEDIDOS
  
  const precios = {
    cerdo: 15000,
    pollo: 15000,
    mixto: 15000,
    domicilio: 5000,
  };

  let cantidades = {
    cerdo: 0,
    pollo: 0,
    mixto: 0,
  };

  const resumenPasteles = document.getElementById("pastelResumen");
  const totalBar = document.getElementById("totalBar");
  const botonPedir = document.getElementById("pedirAhora");
  const formulario = document.getElementById("formularioPedido");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeGracias = document.getElementById("mensajeGracias");
  const volverInicio = document.getElementById("volverInicio");
  const seccionFormulario = document.getElementById("formulario");
  const imagenQR = document.getElementById("qrField");

 function actualizarResumen() {
  const totalPasteles = cantidades.cerdo + cantidades.pollo + cantidades.mixto;
  const totalPrecio = totalPasteles * precios.cerdo + (totalPasteles > 0 ? precios.domicilio : 0);

  document.getElementById("btnEnviarPedido").disabled = totalPasteles === 0;

  document.getElementById("cantidadCerdo").textContent = cantidades.cerdo;
  document.getElementById("cantidadPollo").textContent = cantidades.pollo;
  document.getElementById("cantidadMixto").textContent = cantidades.mixto;

  document.getElementById("resCerdo").innerText = cantidades.cerdo;
  document.getElementById("resPollo").innerText = cantidades.pollo;
  document.getElementById("resMixto").innerText = cantidades.mixto;
  document.getElementById("resTotalPasteles").innerText = totalPasteles;
  document.getElementById("resTotalPrecio").innerText = `$${totalPrecio.toLocaleString()}`;

  document.getElementById("totalBar").textContent = `Total + Domicilio: $${totalPrecio.toLocaleString()}`;

}

  function incrementar(tipo) {
    cantidades[tipo]++;
    actualizarResumen();
  }

  function decrementar(tipo) {
    if (cantidades[tipo] > 0) {
      cantidades[tipo]--;
      actualizarResumen();
    }
  }

  window.incrementar = incrementar;
  window.decrementar = decrementar;

  btnEnviarPedido.addEventListener("click", function () {
     mensajeError.textContent = "";

  const totalPasteles = cantidades.cerdo + cantidades.pollo + cantidades.mixto;
  if (totalPasteles === 0) {
    mensajeError.textContent = "Selecciona al menos un producto.";
    return;
  }

  let camposValidos = true;
  formulario.querySelectorAll("input, select").forEach((input) => {
    input.classList.remove("error-input");
    if (!input.value.trim()) {
      input.classList.add("error-input");
      camposValidos = false;
    }
  });

  if (!camposValidos) {
    mensajeError.textContent = "Por favor completa todos los campos del formulario.";
    seccionFormulario.scrollIntoView({ behavior: "smooth" });
    return;
  }

    // Construcción del mensaje de WhatsApp
    const nombre = formulario.nombre.value;
    const direccion = formulario.direccion.value;
    const telefono = formulario.telefono.value;
    const metodoPago = formulario.metodoPago.value;
    const total = cantidades.cerdo + cantidades.pollo + cantidades.mixto;
    const valorTotal = total * precios.cerdo + precios.domicilio;

  // Fecha y hora
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString("es-CO");
  const hora = ahora.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  // Construcción dinámica del pedido
  let detallePedido = "";
  if (cantidades.pollo > 0) detallePedido += `     *🐔 Pastel de Pollo: ${cantidades.pollo}*\n`;
  if (cantidades.cerdo > 0) detallePedido += `     *🐷 Pastel de Cerdo: ${cantidades.cerdo}*\n`;
  if (cantidades.mixto > 0) detallePedido += `     *🐔🐷 Pastel Mixto: ${cantidades.mixto}*\n`;

  // Mensaje final
  let mensaje = `*Candelaria Sabor y Sazón*
📆 ${fecha} - ${hora}
----------------------------------------------------------
Hola, quiero hacer un pedido:

📦 *Pedido:*
👋🏼Nombre: *${nombre}.*
${detallePedido}

🏠 *Dirección:* ${direccion}
📞 *Teléfono:* ${telefono}
----------------------------------------------------------
📋Total pasteles: *${totalPasteles}*
💳 Pago: *${metodoPago}*
💰 Total + domicilio: *$${valorTotal.toLocaleString("es-CO")}*
----------------------------------------------------------`;

    const url = `https://wa.me/573202849245?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    formulario.reset();
    cantidades = { cerdo: 0, pollo: 0, mixto: 0 };
    actualizarResumen();
    mensajeGracias.style.display = "block";
    formulario.style.display = "none";
  });

  volverInicio.addEventListener("click", function () {
    formulario.style.display = "block";
    mensajeGracias.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const metodoPagoSelect = document.getElementById("metodoPago");
  metodoPagoSelect.addEventListener("change", function () {
    if (this.value === "transferencia") {
      imagenQR.style.display = "block";
    } else {
      imagenQR.style.display = "none";
    }
  });

  actualizarResumen();
});
