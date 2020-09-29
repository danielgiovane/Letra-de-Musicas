const url = `https://api.lyrics.ovh`;

const form = document.querySelector('.form');
const inputSearch = document.querySelector('.search');
const btn = document.querySelector('.busca-btn');
const musicasContainer = document.querySelector('.musicas-container');
const anteriorEProximo = document.querySelector('.anterior-e-proximo');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const termoDaBusca = inputSearch.value.trim();
  if(!termoDaBusca){
    musicasContainer.innerHTML = `<li class="aviso-vermelho">Por favor digite um termo valido</li>`
    return
  }

})
