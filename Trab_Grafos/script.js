const adjList = new Map();
const actorSet = new Set();
const movieSet = new Set();
let ready = false;

function addEdge(a, b) {
    if (!adjList.has(a)) adjList.set(a, new Set());
    if (!adjList.has(b)) adjList.set(b, new Set());
    adjList.get(a).add(b);
    adjList.get(b).add(a);
}

function bfs(start, end) {
    if (!adjList.has(start) || !adjList.has(end)) return null;
    if (start === end) return [start];
    const queue = [[start]];
    const visited = new Set([start]);
    while (queue.length) {
        const path = queue.shift();
        const cur = path[path.length - 1];
        for (const nb of (adjList.get(cur) || [])) {
            if (nb === end) return [...path, nb];
            if (!visited.has(nb)) {
                visited.add(nb);
                queue.push([...path, nb]);
            }
        }
    }
    return null;
}

function countAllPaths(start, end) {
    const MAX = 16;
    
    // dp[node] = número de caminhos de 'start' até 'node' em exatamente 'step' passos
    let dp = new Map();
    dp.set(start, 1);

    let total = 0;

    for (let step = 1; step <= MAX; step++) {
        const next = new Map();
        for (const [cur, ways] of dp) {
            for (const nb of (adjList.get(cur) || [])) {
                if (nb === start) continue; // não volta à origem
                next.set(nb, (next.get(nb) || 0) + ways);
            }
        }
        if (next.has(end)) {
            total += next.get(end);
            next.delete(end); // não continua a partir do destino
        }
        dp = next;
    }

    return total;
}

function formatPath(path) {
    return path.join(" -> ");
}

function findConnection() {
    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const result = document.getElementById("result");

    if (!ready) {
        result.textContent = "Aguarde o grafo carregar...";
        return;
    }

    if (!origin || !destination) {
        result.textContent = "Preencha ambos os campos.";
        return;
    }

    const path = bfs(origin, destination);

    if (!path) {
        result.textContent = "Relacionamento não encontrado.";
        return;
    }

    result.textContent =
`MENOR CAMINHO:

${formatPath(path)}

Graus de separação: ${path.length - 1}`;
}

function findAllConnections() {
    const origin = document.getElementById("origin").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const result = document.getElementById("result");

    if (!ready) {
        result.textContent = "Aguarde o grafo carregar...";
        return;
    }

    if (!origin || !destination) {
        result.textContent = "Preencha ambos os campos.";
        return;
    }

    result.textContent = "Buscando caminhos...";

    setTimeout(() => {
        const path = bfs(origin, destination);

        if (!path) {
            result.textContent = "Relacionamento não encontrado.";
            return;
        }

        const count = countAllPaths(origin, destination);

        result.textContent =
`MENOR CAMINHO:

${formatPath(path)}

Graus de separação: ${path.length - 1}
Caminhos até 8 graus: ${count}`;
    }, 10);
}

async function loadData() {
    const result = document.getElementById("result");
    result.textContent = "Carregando grafo...";

    try {
        const resp = await fetch("./latest_movies 2.json");
        const movies = await resp.json();

        movies.forEach(m => {
            movieSet.add(m.title);
            (m.cast || []).forEach(actor => {
                actorSet.add(actor);
                addEdge(m.title, actor);
            });
        });

        const dl = document.getElementById("actors");
        dl.innerHTML = [...actorSet]
            .sort()
            .map(a => `<option value="${a}">`)
            .join("");

        ready = true;

        result.textContent =
`Grafo carregado!

Atores: ${actorSet.size.toLocaleString()}
Filmes: ${movieSet.size.toLocaleString()}

Digite dois atores e clique em um dos botões.`;

    } catch (e) {
        result.textContent =
            "Erro ao carregar o JSON.\nVerifique o caminho do arquivo.";
    }
}

loadData();