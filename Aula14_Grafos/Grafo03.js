function temAresta(grafo, a, b) {
  return grafo[a].includes(b);
}

function hamiltoniano(nome, grafo) {
  const vertices = Object.keys(grafo);

  function buscarCiclo(caminho) {
    if (caminho.length === vertices.length) {
      return temAresta(grafo, caminho[caminho.length - 1], caminho[0]);
    }

    for (let v of vertices) {
      if (!caminho.includes(v) && temAresta(grafo, caminho[caminho.length - 1], v)) {
        if (buscarCiclo([...caminho, v])) return true;
      }
    }

    return false;
  }

  function buscarCaminho(caminho) {
    if (caminho.length === vertices.length) return true;

    for (let v of vertices) {
      if (!caminho.includes(v) && temAresta(grafo, caminho[caminho.length - 1], v)) {
        if (buscarCaminho([...caminho, v])) return true;
      }
    }

    return false;
  }

  let temCiclo = false;
  let temCaminho = false;

  for (let v of vertices) {
    if (buscarCiclo([v])) temCiclo = true;
    if (buscarCaminho([v])) temCaminho = true;
  }

  console.log(`\nGrafo ${nome}`);

  if (temCiclo) {
    console.log("Possui ciclo hamiltoniano");
  } else if (temCaminho) {
    console.log("Não possui ciclo hamiltoniano, mas possui caminho hamiltoniano");
  } else {
    console.log("Não possui ciclo nem caminho hamiltoniano");
  }
}

const azul = {
  a: ["b", "d", "e"],
  b: ["a", "c", "e"],
  c: ["b", "d", "e"],
  d: ["a", "c", "e"],
  e: ["a", "b", "c", "d"]
};

const verdePequeno = {
  a: ["b", "e"],
  b: ["a", "e"],
  c: ["d", "e"],
  d: ["c", "e"],
  e: ["a", "b", "c", "d"]
};

const verdeGrande = {
  u: ["v", "t", "z"],
  v: ["u", "t"],
  t: ["u", "v", "z", "w"],
  z: ["u", "t", "y", "w"],
  y: ["z", "x"],
  x: ["y", "w"],
  w: ["t", "z", "x"]
};


const G1 = {
  a: ["b", "e", "c"],
  b: ["a", "c", "e"],
  c: ["b", "e", "a", "d"],
  d: ["e", "c"],
  e: ["a", "c", "b", "d"]
};

const G2 = {
  a: ["b"],
  b: ["a", "c", "d"],
  c: ["b", "d"],
  d: ["b", "c"]
};

const G3 = {
  a: ["b"],
  b: ["a", "c", "g"],
  c: ["b", "d", "e"],
  d: ["c"],
  e: ["c", "g", "f"],
  f: ["e"],
  g: ["b", "e"]
};

hamiltoniano("Azul", azul);
hamiltoniano("Verde pequeno", verdePequeno);
hamiltoniano("Verde grande", verdeGrande);
hamiltoniano("G1", G1);
hamiltoniano("G2", G2);
hamiltoniano("G3", G3);