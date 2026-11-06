function analisarGrafoDirecionado(nome, grafo) {
  let inicio = null;
  let fim = null;
  let problemas = 0;

  console.log(`\nGrafo ${nome}`);

  for (let vertice in grafo) {
    let entrada = 0;
    let saida = grafo[vertice].length;

    for (let v in grafo) {
      if (grafo[v].includes(vertice)) {
        entrada++;
      }
    }

    console.log(`${vertice}: entrada = ${entrada}, saída = ${saida}`);

    if (saida - entrada === 1) {
      inicio = vertice;
    } else if (entrada - saida === 1) {
      fim = vertice;
    } else if (entrada !== saida) {
      problemas++;
    }
  }

  if (problemas === 0 && inicio === null && fim === null) {
    console.log("É euleriano");
    console.log("Possui ciclo euleriano");
  } else if (problemas === 0 && inicio !== null && fim !== null) {
    console.log("É semi-euleriano");
    console.log(`Possui caminho euleriano de ${inicio} até ${fim}`);
  } else {
    console.log("Não é euleriano");
    console.log("Não possui caminho nem ciclo euleriano");
  }
}

const H1 = {
  a: ["b"],
  b: ["c"],
  c: ["d"],
  d: ["a"]
};

const H2 = {
  a: ["g"],
  b: ["g"],
  c: ["b"],
  d: ["f"],
  e: ["d", "g"],
  f: ["a"],
  g: ["c"]
};

const H3 = {
  a: ["b"],
  b: [],
  c: ["a", "b", "d"],
  d: ["b"],
};

analisarGrafoDirecionado("H1", H1);
analisarGrafoDirecionado("H2", H2);
analisarGrafoDirecionado("H3", H3);