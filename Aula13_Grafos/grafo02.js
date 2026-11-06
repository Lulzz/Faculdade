class Grafo {
  constructor() {
    this.vertices = [];
    this.arestas = [];
    this.adjacencia = {};
  }

  adicionarVertice(v) {
    this.vertices.push(v);
    this.adjacencia[v] = [];
  }

  adicionarAresta(origem, destino, peso) {
    this.arestas.push({ origem, destino, peso });
    this.adjacencia[origem].push({ destino, peso });
  }

  dijkstra(inicio) {
    const dist = {};
    const pred = {};
    const visitados = new Set();

    for (const v of this.vertices) {
      dist[v] = Infinity;
      pred[v] = null;
    }

    dist[inicio] = 0;

    while (visitados.size < this.vertices.length) {
      let atual = null;

      for (const v of this.vertices) {
        if (!visitados.has(v) && (atual === null || dist[v] < dist[atual])) {
          atual = v;
        }
      }

      if (atual === null || dist[atual] === Infinity) break;

      visitados.add(atual);

      for (const vizinho of this.adjacencia[atual]) {
        const novaDist = dist[atual] + vizinho.peso;

        if (novaDist < dist[vizinho.destino]) {
          dist[vizinho.destino] = novaDist;
          pred[vizinho.destino] = atual;
        }
      }
    }

    return { dist, pred };
  }

  bellmanFord(inicio) {
    const dist = {};
    const pred = {};

    for (const v of this.vertices) {
      dist[v] = Infinity;
      pred[v] = null;
    }

    dist[inicio] = 0;

    for (let i = 0; i < this.vertices.length - 1; i++) {
      for (const aresta of this.arestas) {
        const novaDist = dist[aresta.origem] + aresta.peso;

        if (dist[aresta.origem] !== Infinity && novaDist < dist[aresta.destino]) {
          dist[aresta.destino] = novaDist;
          pred[aresta.destino] = aresta.origem;
        }
      }
    }

    for (const aresta of this.arestas) {
      if (
        dist[aresta.origem] !== Infinity &&
        dist[aresta.origem] + aresta.peso < dist[aresta.destino]
      ) {
        console.log("Existe ciclo negativo no grafo.");
        return null;
      }
    }

    return { dist, pred };
  }

  montarCaminho(pred, destino) {
    const caminho = [];
    let atual = destino;

    while (atual !== null) {
      caminho.unshift(atual);
      atual = pred[atual];
    }

    return caminho.join(" -> ");
  }
}

const grafo = new Grafo();

["A", "B", "C", "D", "E", "F"].forEach(v => grafo.adicionarVertice(v));

grafo.adicionarAresta("A", "B", 10);
grafo.adicionarAresta("A", "C", 15);
grafo.adicionarAresta("B", "D", 12);
grafo.adicionarAresta("B", "F", 15);
grafo.adicionarAresta("D", "F", 1);
grafo.adicionarAresta("D", "E", 2);
grafo.adicionarAresta("F", "E", 5);
grafo.adicionarAresta("C", "E", 10);

console.time("Tempo Dijkstra");
const resultadoDijkstra = grafo.dijkstra("A");
console.timeEnd("Tempo Dijkstra");

console.time("Tempo Bellman-Ford");
const resultadoBellman = grafo.bellmanFord("A");
console.timeEnd("Tempo Bellman-Ford");

console.log("\n===== DIJKSTRA =====");
console.log("Caminho mínimo de A até F:");
console.log(grafo.montarCaminho(resultadoDijkstra.pred, "F"));
console.log("Distância total:", resultadoDijkstra.dist["F"]);

console.log("\n===== BELLMAN-FORD =====");
console.log("Caminho mínimo de A até F:");
console.log(grafo.montarCaminho(resultadoBellman.pred, "F"));
console.log("Distância total:", resultadoBellman.dist["F"]);