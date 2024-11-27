const form = document.getElementById('myForm');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Redirecionamento para outra página
    window.location.href = 'feedback_sucess.html';
});
