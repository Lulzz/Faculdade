function analisarGrafo(nome, grafo) {
  let impares = [];

  for (let vertice in grafo) {
    let grau = grafo[vertice].length;

    if (grau % 2 !== 0) {
      impares.push(vertice);
    }
  }

  console.log(`\nGrafo ${nome}`);

  if (impares.length === 0) {
    console.log("É euleriano");
    console.log("Possui ciclo euleriano");
  } else if (impares.length === 2) {
    console.log("É semi-euleriano");
    console.log(`Possui caminho euleriano entre ${impares[0]} e ${impares[1]}`);
  } else {
    console.log("Não é euleriano");
    console.log("Não possui caminho nem ciclo euleriano");
  }

  console.log("Vértices de grau ímpar:", impares);
}

const grafo1 = {
  a: ["b", "d"],
  b: ["a", "c"],
  c: ["b", "d"],
  d: ["a", "c"]
};

const grafo2 = {
  a: ["b", "c"],
  b: ["a", "c", "d"],
  c: ["a", "b", "d"],
  d: ["b", "c"]
};

const grafoA = {
  a: ["b", "c", "d"],
  b: ["a", "c", "d"],
  c: ["a", "b", "d"],
  d: ["a", "b", "c"]
};

const grafoB = {
  a: ["b", "d", "e"],
  b: ["a", "c", "f"],
  c: ["b", "d", "g"],
  d: ["a", "c", "h"],
  e: ["a", "f", "h"],
  f: ["b", "e", "g"],
  g: ["c", "f", "h"],
  h: ["d", "e", "g"]
};

const grafoC = {
  a: ["d", "e"],
  b: ["d", "e"],
  c: ["d", "e"],
  d: ["a", "b", "c"],
  e: ["a", "b", "c"]
};

analisarGrafo("1", grafo1);
analisarGrafo("2", grafo2);
analisarGrafo("A", grafoA);
analisarGrafo("B", grafoB);
analisarGrafo("C", grafoC);