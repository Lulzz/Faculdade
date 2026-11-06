class Grafo {
    constructor() {
        this.grafo = {};
    }

    adicionarAresta(origem, destino, peso) {
        if (!this.grafo[origem]) {
            this.grafo[origem] = [];
        }

        this.grafo[origem].push({
            destino: destino,
            peso: peso
        });
    }

    buscaLargura(inicio) {

        let visitados = new Set();
        let fila = [[inicio]];

        console.log("Busca em Largura:");

        while (fila.length > 0) {

            let caminho = fila.shift();
            let vertice = caminho[caminho.length - 1];

            if (!visitados.has(vertice)) {

                visitados.add(vertice);

                console.log(caminho.join(" -> "));

                let vizinhos = this.grafo[vertice] || [];

                for (let aresta of vizinhos) {

                    if (!visitados.has(aresta.destino)) {

                        let novoCaminho = [...caminho];
                        novoCaminho.push(aresta.destino);

                        fila.push(novoCaminho);
                    }
                }
            }
        }
    }

    dijkstra(inicio, fim) {

        let distancias = {};
        let anteriores = {};
        let fila = [];

        for (let vertice in this.grafo) {
            distancias[vertice] = Infinity;
        }

        distancias[inicio] = 0;

        fila.push({
            vertice: inicio,
            distancia: 0
        });

        while (fila.length > 0) {

            fila.sort((a, b) => a.distancia - b.distancia);

            let atual = fila.shift().vertice;

            let vizinhos = this.grafo[atual] || [];

            for (let aresta of vizinhos) {

                let novaDistancia =
                    distancias[atual] + aresta.peso;

                if (novaDistancia < (distancias[aresta.destino] || Infinity)) {

                    distancias[aresta.destino] = novaDistancia;

                    anteriores[aresta.destino] = atual;

                    fila.push({
                        vertice: aresta.destino,
                        distancia: novaDistancia
                    });
                }
            }
        }

        let caminho = [];
        let atual = fim;

        while (atual) {
            caminho.unshift(atual);
            atual = anteriores[atual];
        }

        console.log(`\nCaminho mínimo de ${inicio} até ${fim}:`);
        console.log(caminho.join(" -> "));
        console.log("Custo total:", distancias[fim]);
    }
}

const grafo = new Grafo();

grafo.adicionarAresta("A", "B", 10);
grafo.adicionarAresta("A", "C", 15);

grafo.adicionarAresta("B", "F", 15);
grafo.adicionarAresta("B", "D", 12);

grafo.adicionarAresta("D", "F", 1);
grafo.adicionarAresta("D", "E", 2);

grafo.adicionarAresta("F", "E", 5);

grafo.adicionarAresta("C", "E", 10);

grafo.buscaLargura("A");

grafo.dijkstra("A", "E");
grafo.dijkstra("A", "F");