async function processHeroes() {
  const response = await fetch('https://akabab.github.io/superhero-api/api/all.json');
  const heroes = await response.json();

  const alterEgosList = heroes.map(hero => hero.biography.alterEgos);

  const totalCharsFirstAppMarvel = heroes
    .filter(hero => hero.biography.publisher === 'Marvel Comics')
    .reduce((sum, hero) => {
      const fa = hero.biography.firstAppearance || '';
      return sum + fa.length;
    }, 0);

  const dcHeroes = heroes.filter(hero => hero.biography.publisher === 'DC Comics');

  const sortedByNameLength = [...heroes].sort((a, b) => a.name.length - b.name.length);

  displayList('alterEgosList', alterEgosList);
  document.getElementById('totalCharsMarvel').textContent = totalCharsFirstAppMarvel;
  displayList('dcHeroesList', dcHeroes.map(hero => hero.name));
  displayList('sortedByNameLength', sortedByNameLength.map(hero => hero.name));
}

function displayList(elementId, items) {
  const ul = document.getElementById(elementId);
  ul.innerHTML = ''; 
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}
