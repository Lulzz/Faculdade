let grafo = {};

class MinHeap {
  constructor() {
    this.itens = [];
  }

  tamanho() {
    return this.itens.length;
  }

  vazio() {
    return this.itens.length === 0;
  }

  push(valor) {
    this.itens.push(valor);
    this.subir(this.itens.length - 1);
  }

  pop() {
    if (this.vazio()) return null;

    const topo = this.itens[0];
    const ultimo = this.itens.pop();

    if (!this.vazio()) {
      this.itens[0] = ultimo;
      this.descer(0);
    }

    return topo;
  }

  subir(indice) {
    while (indice > 0) {
      const pai = Math.floor((indice - 1) / 2);

      if (this.itens[pai].custo <= this.itens[indice].custo) break;

      [this.itens[pai], this.itens[indice]] = [this.itens[indice], this.itens[pai]];
      indice = pai;
    }
  }

  descer(indice) {
    const tamanho = this.itens.length;

    while (true) {
      let menor = indice;
      const esquerda = 2 * indice + 1;
      const direita = 2 * indice + 2;

      if (esquerda < tamanho && this.itens[esquerda].custo < this.itens[menor].custo) {
        menor = esquerda;
      }

      if (direita < tamanho && this.itens[direita].custo < this.itens[menor].custo) {
        menor = direita;
      }

      if (menor === indice) break;

      [this.itens[indice], this.itens[menor]] = [this.itens[menor], this.itens[indice]];
      indice = menor;
    }
  }
}

async function carregarDados() {
  try {
    const resposta = await fetch("capitais.json");
    const dados = await resposta.json();

    dados.forEach((item) => {
      const cidade = Object.keys(item)[0];
      grafo[cidade] = item[cidade];
    });

    preencherSelects();
    mostrarGrafo();
  } catch (erro) {
    mostrarResultado("erro", "Não foi possível carregar o arquivo <strong>capitais.json</strong>.");
    console.error(erro);
  }
}

function preencherSelects() {
  const origem = document.getElementById("origem");
  const destino = document.getElementById("destino");

  const cidades = Object.keys(grafo).sort((a, b) => a.localeCompare(b, "pt-BR"));

  origem.innerHTML = '<option value="" disabled selected>Selecione a origem</option>';
  destino.innerHTML = '<option value="" disabled selected>Selecione o destino</option>';

  cidades.forEach((cidade) => {
    origem.innerHTML += `<option value="${cidade}">${cidade}</option>`;
    destino.innerHTML += `<option value="${cidade}">${cidade}</option>`;
  });

  if (cidades.length >= 2) {
    origem.value = cidades[0];
    destino.value = cidades[1];
  }
}

function mostrarGrafo() {
  const container = document.getElementById("grafo");

  const linhas = Object.keys(grafo)
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((cidade) => {
      const vizinhos = grafo[cidade].neighbors || {};
      const adjacentes = Object.entries(vizinhos)
        .map(([viz, dist]) => `${viz} (${dist} km)`)
        .join(", ");

      return `
        <li>
          <strong>${cidade}</strong> <em>(pedágio R$ ${grafo[cidade].toll})</em>
          <span>${adjacentes || "sem adjacentes"}</span>
        </li>`;
    })
    .join("");

  container.innerHTML = `<ul class="grafo-lista">${linhas}</ul>`;
}

function dijkstra(inicio, fim, precoCombustivel, autonomia) {
  const distancias = {};
  const anteriores = {};
  const heap = new MinHeap();

  Object.keys(grafo).forEach((cidade) => {
    distancias[cidade] = Infinity;
    anteriores[cidade] = null;
  });

  distancias[inicio] = grafo[inicio].toll || 0;
  heap.push({ cidade: inicio, custo: distancias[inicio] });

  while (!heap.vazio()) {
    const atual = heap.pop();
    if (!atual) break;

    const { cidade, custo } = atual;

    if (custo !== distancias[cidade]) continue;
    if (cidade === fim) break;

    const vizinhos = grafo[cidade].neighbors || {};

    for (const [vizinho, distancia] of Object.entries(vizinhos)) {
      const custoCombustivel = (distancia / autonomia) * precoCombustivel;
      const custoPedagio = grafo[vizinho]?.toll || 0;
      const novoCusto = custo + custoCombustivel + custoPedagio;

      if (novoCusto < distancias[vizinho]) {
        distancias[vizinho] = novoCusto;
        anteriores[vizinho] = cidade;
        heap.push({ cidade: vizinho, custo: novoCusto });
      }
    }
  }

  if (!isFinite(distancias[fim])) {
    return null;
  }

  const caminho = [];
  let atual = fim;

  while (atual) {
    caminho.unshift(atual);
    atual = anteriores[atual];
  }

  let custoCombustivelTotal = 0;
  let custoPedagiosTotal = 0;
  let distanciaTotal = 0;

  for (let i = 0; i < caminho.length; i++) {
    const cidade = caminho[i];
    custoPedagiosTotal += grafo[cidade]?.toll || 0;

    if (i < caminho.length - 1) {
      const prox = caminho[i + 1];
      const distancia = grafo[cidade]?.neighbors?.[prox] || 0;
      distanciaTotal += distancia;
      custoCombustivelTotal += (distancia / autonomia) * precoCombustivel;
    }
  }

  return {
    caminho,
    custoTotal: distancias[fim],
    custoCombustivelTotal,
    custoPedagiosTotal,
    distanciaTotal
  };
}

function mostrarResultado(tipo, html) {
  const resultado = document.getElementById("resultado");
  resultado.className = `resultado ${tipo}`;
  resultado.innerHTML = html;
}

function calcular() {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const preco = Number(document.getElementById("preco").value);
  const autonomia = Number(document.getElementById("autonomia").value);

  if (!origem || !destino) {
    mostrarResultado("erro", "Selecione a origem e o destino.");
    return;
  }

  if (origem === destino) {
    mostrarResultado("erro", "A origem e o destino precisam ser diferentes.");
    return;
  }

  if (!preco || preco <= 0 || !autonomia || autonomia <= 0) {
    mostrarResultado("erro", "Informe valores válidos para preço do combustível e autonomia.");
    return;
  }

  const resultado = dijkstra(origem, destino, preco, autonomia);

  if (!resultado) {
    mostrarResultado("erro", "Rota inexistente entre as capitais selecionadas.");
    return;
  }

  mostrarResultado(
    "sucesso",
    `
      <strong>Rota:</strong> ${resultado.caminho.join(" → ")}<br>
      <strong>Distância total:</strong> ${resultado.distanciaTotal.toFixed(0)} km<br>
      <strong>Custo total:</strong> R$ ${resultado.custoTotal.toFixed(2)}<br>
      <strong>Combustível:</strong> R$ ${resultado.custoCombustivelTotal.toFixed(2)}<br>
      <strong>Pedágios:</strong> R$ ${resultado.custoPedagiosTotal.toFixed(2)}
    `
  );
}

document.getElementById("formBusca").addEventListener("submit", (event) => {
  event.preventDefault();
  calcular();
});

carregarDados();