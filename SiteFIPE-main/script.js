const marcaSelect = document.getElementById('marcaSelect');
const resultadoDiv = document.getElementById('resultado');

async function carregarMarcas() {
  try {
    const response = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    const marcas = await response.json();

    marcas.forEach(marca => {
      const option = document.createElement('option');
      option.value = marca.codigo;
      option.textContent = marca.nome;
      marcaSelect.appendChild(option);
    });
  } catch (error) {
    resultadoDiv.innerHTML = `<p class="error">Erro ao carregar marcas. Tente novamente mais tarde.</p>`;
  }
}

marcaSelect.addEventListener('change', async () => {
  const marcaId = marcaSelect.value;
  resultadoDiv.innerHTML = '';

  if (!marcaId) return;

  try {
    const response = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos`);
    const data = await response.json();
    const modelos = data.modelos;

    if (!modelos.length) {
      resultadoDiv.innerHTML = `<p class="error">Nenhum modelo encontrado para essa marca.</p>`;
      return;
    }

    const ul = document.createElement('ul');
    modelos.forEach(modelo => {
      const li = document.createElement('li');
      li.textContent = modelo.nome;
      ul.appendChild(li);
    });

    resultadoDiv.appendChild(ul);

  } catch (error) {
    resultadoDiv.innerHTML = `<p class="error">Erro ao buscar modelos. Tente novamente.</p>`;
  }
  
});

carregarMarcas();
