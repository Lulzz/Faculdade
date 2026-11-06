// Exercício 1 (versão web): soma apenas números pares
// - Aceita inteiros separados por vírgula, espaço, ponto-e-vírgula ou quebras de linha.
// - Ignora entradas vazias e acusa erro se houver valores não inteiros.

(function () {
  const form = document.getElementById("sum-form");
  const txt = document.getElementById("numbers");

  const outParsed = document.getElementById("parsed-list");
  const outEven = document.getElementById("even-list");
  const outCountTotal = document.getElementById("count-total");
  const outCountEven = document.getElementById("count-even");
  const outSumEven = document.getElementById("sum-even");
  const outErrors = document.getElementById("errors");
  const btnClear = document.getElementById("btn-clear");

  function parseNumbers(raw) {
    // Divide por vírgula, espaço, ponto-e-vírgula ou quebra de linha
    const parts = raw.split(/[,\s;]+/).filter(Boolean);

    const numbers = [];
    const invalids = [];

    for (const p of parts) {
      // Permite sinais +/-, exige dígitos (inteiro)
      if (/^[+-]?\d+$/.test(p)) {
        numbers.push(Number(p));
      } else {
        invalids.push(p);
      }
    }
    return { numbers, invalids };
  }

  function sumEven(nums) {
    return nums.filter(n => n % 2 === 0).reduce((acc, n) => acc + n, 0);
  }

  function renderResult({ numbers, evenList, sum, invalids }) {
    outParsed.textContent = numbers.length ? numbers.join(", ") : "—";
    outEven.textContent = evenList.length ? evenList.join(", ") : "—";

    outCountTotal.textContent = String(numbers.length);
    outCountEven.textContent = String(evenList.length);
    outSumEven.textContent = String(sum);

    if (invalids.length) {
      outErrors.hidden = false;
      outErrors.textContent =
        `Foram ignoradas ${invalids.length} entrad${invalids.length > 1 ? "as" : "a"} inválid` +
        `${invalids.length > 1 ? "as" : "a"}: ${invalids.join(", ")}`;
    } else {
      outErrors.hidden = true;
      outErrors.textContent = "";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = txt.value.trim();
    if (!raw) {
      renderResult({ numbers: [], evenList: [], sum: 0, invalids: [] });
      return;
    }

    const { numbers, invalids } = parseNumbers(raw);
    const evenList = numbers.filter(n => n % 2 === 0);
    const sum = sumEven(numbers);

    renderResult({ numbers, evenList, sum, invalids });
  });

  btnClear.addEventListener("click", () => {
    // Reset visual dos resultados
    renderResult({ numbers: [], evenList: [], sum: 0, invalids: [] });
  });

  // Estado inicial
  renderResult({ numbers: [], evenList: [], sum: 0, invalids: [] });
})();
