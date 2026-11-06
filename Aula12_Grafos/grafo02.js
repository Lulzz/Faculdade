class MinHeap {
    constructor() {
        this.heap = [];
    }

    inserir(item) {
        this.heap.push(item);
        this.subir();
    }

    remover() {
        if (this.heap.length === 1) return this.heap.pop();

        const menor = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.descer();

        return menor;
    }

    subir() {
        let i = this.heap.length - 1;

        while (i > 0) {
            let pai = Math.floor((i - 1) / 2);

            if (this.heap[pai].distancia <= this.heap[i].distancia) break;

            [this.heap[pai], this.heap[i]] = [this.heap[i], this.heap[pai]];
            i = pai;
        }
    }

    descer() {
        let i = 0;

        while (true) {
            let menor = i;
            let esquerda = 2 * i + 1;
            let direita = 2 * i + 2;

            if (
                esquerda < this.heap.length &&
                this.heap[esquerda].distancia < this.heap[menor].distancia
            ) {
                menor = esquerda;
            }

            if (
                direita < this.heap.length &&
                this.heap[direita].distancia < this.heap[menor].distancia
            ) {
                menor = direita;
            }

            if (menor === i) break;

            [this.heap[i], this.heap[menor]] = [this.heap[menor], this.heap[i]];
            i = menor;
        }
    }

    vazio() {
        return this.heap.length === 0;
    }
}

class Grafo {
    constructor() {
        this.grafo = {};
    }

    adicionarAresta(origem, destino, peso) {
        if (peso <= 0) {
            console.log("Erro: o peso precisa ser positivo.");
            return;
        }

        if (!this.grafo[origem]) this.grafo[origem] = [];
        if (!this.grafo[destino]) this.grafo[destino] = [];

        this.grafo[origem].push({ destino, peso });
    }

    dijkstraHeap(inicio, fim) {
        let distancias = {};
        let anteriores = {};
        let heap = new MinHeap();

        for (let vertice in this.grafo) {
            distancias[vertice] = Infinity;
        }

        distancias[inicio] = 0;
        heap.inserir({ vertice: inicio, distancia: 0 });

        while (!heap.vazio()) {
            let atual = heap.remover();

            if (atual.distancia > distancias[atual.vertice]) continue;

            for (let aresta of this.grafo[atual.vertice]) {
                let novaDistancia = distancias[atual.vertice] + aresta.peso;

                if (novaDistancia < distancias[aresta.destino]) {
                    distancias[aresta.destino] = novaDistancia;
                    anteriores[aresta.destino] = atual.vertice;

                    heap.inserir({
                        vertice: aresta.destino,
                        distancia: novaDistancia
                    });
                }
            }
        }

        return this.montarResultado(inicio, fim, distancias, anteriores);
    }

    dijkstraTradicional(inicio, fim) {
        let distancias = {};
        let anteriores = {};
        let visitados = new Set();

        for (let vertice in this.grafo) {
            distancias[vertice] = Infinity;
        }

        distancias[inicio] = 0;

        while (visitados.size < Object.keys(this.grafo).length) {
            let atual = null;
            let menorDistancia = Infinity;

            for (let vertice in distancias) {
                if (!visitados.has(vertice) && distancias[vertice] < menorDistancia) {
                    menorDistancia = distancias[vertice];
                    atual = vertice;
                }
            }

            if (atual === null) break;

            visitados.add(atual);

            for (let aresta of this.grafo[atual]) {
                let novaDistancia = distancias[atual] + aresta.peso;

                if (novaDistancia < distancias[aresta.destino]) {
                    distancias[aresta.destino] = novaDistancia;
                    anteriores[aresta.destino] = atual;
                }
            }
        }

        return this.montarResultado(inicio, fim, distancias, anteriores);
    }

    montarResultado(inicio, fim, distancias, anteriores) {
        let caminho = [];
        let atual = fim;

        while (atual !== undefined) {
            caminho.unshift(atual);
            atual = anteriores[atual];
        }

        return {
            caminho: caminho.join(" -> "),
            custo: distancias[fim]
        };
    }
}

const grafo = new Grafo();

grafo.adicionarAresta("0", "1", 5);
grafo.adicionarAresta("0", "3", 21);
grafo.adicionarAresta("1", "2", 40);
grafo.adicionarAresta("2", "4", 19);
grafo.adicionarAresta("2", "3", 13);
grafo.adicionarAresta("3", "5", 41);
grafo.adicionarAresta("4", "5", 32);
grafo.adicionarAresta("4", "6", 14);
grafo.adicionarAresta("5", "6", 8);

console.log("===== DIJKSTRA COM MIN-HEAP =====");

let inicioHeap = performance.now();
let resultadoHeap = grafo.dijkstraHeap("0", "6");
let fimHeap = performance.now();

console.log("Caminho mínimo de 0 até 6:");
console.log(resultadoHeap.caminho);
console.log("Custo total:", resultadoHeap.custo);
console.log("Tempo:", (fimHeap - inicioHeap).toFixed(6), "ms");

console.log("\n===== DIJKSTRA TRADICIONAL =====");

let inicioTrad = performance.now();
let resultadoTrad = grafo.dijkstraTradicional("0", "6");
let fimTrad = performance.now();

console.log("Caminho mínimo de 0 até 6:");
console.log(resultadoTrad.caminho);
console.log("Custo total:", resultadoTrad.custo);
console.log("Tempo:", (fimTrad - inicioTrad).toFixed(6), "ms");