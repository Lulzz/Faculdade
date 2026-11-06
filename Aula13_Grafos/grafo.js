class Grafo {
    constructor() {
        this.vertices = [];
        this.arestas = [];
    }

    adicionarVertice(vertice) {
        this.vertices.push(vertice);
    }

    adicionarAresta(origem, destino, peso) {
        this.arestas.push({ origem, destino, peso });
    }

    bellmanFord(origem) {
        let distancias = {};
        let predecessores = {};

        for (let vertice of this.vertices) {
            distancias[vertice] = Infinity;
            predecessores[vertice] = null;
        }

        distancias[origem] = 0;

        for (let i = 0; i < this.vertices.length - 1; i++) {
            for (let aresta of this.arestas) {
                let { origem, destino, peso } = aresta;

                if (
                    distancias[origem] !== Infinity &&
                    distancias[origem] + peso < distancias[destino]
                ) {
                    distancias[destino] = distancias[origem] + peso;
                    predecessores[destino] = origem;
                }
            }
        }

        for (let aresta of this.arestas) {
            let { origem, destino, peso } = aresta;

            if (
                distancias[origem] !== Infinity &&
                distancias[origem] + peso < distancias[destino]
            ) {
                console.log("O grafo possui ciclo negativo!");
                return;
            }
        }

        return { distancias, predecessores };
    }

    mostrarCaminho(predecessores, destino) {
        let caminho = [];
        let atual = destino;

        while (atual !== null) {
            caminho.unshift(atual);
            atual = predecessores[atual];
        }

        return caminho.join(" -> ");
    }
}

const grafo = new Grafo();

["A", "B", "C", "D", "E", "F"].forEach(v =>
    grafo.adicionarVertice(v)
);

grafo.adicionarAresta("A", "B", 9);
grafo.adicionarAresta("A", "C", 7);
grafo.adicionarAresta("C", "D", 2);
grafo.adicionarAresta("D", "B", -3);
grafo.adicionarAresta("B", "E", 2);
grafo.adicionarAresta("D", "E", -2);
grafo.adicionarAresta("E", "F", -2);
grafo.adicionarAresta("F", "B", 2);

const resultado = grafo.bellmanFord("A");

if (resultado) {
    const caminho = grafo.mostrarCaminho(
        resultado.predecessores,
        "F"
    );

    console.log("===== RESULTADO =====");
    console.log("Caminho mínimo de A até F:");
    console.log(caminho);

    console.log(
        "Distância total:",
        resultado.distancias["F"]
    );
}