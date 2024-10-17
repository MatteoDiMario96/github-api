import config from '../config.js';

window.addEventListener('load', () => {
    document.getElementById('typeSelected').value = '';
});

const token = config.GITHUB_TOKEN;

const searchButton = document.getElementById('searchButton');
const typeSelected = document.getElementById('typeSelected');
const cards = document.getElementById('cards');

let currentPage = 1; // Moved outside fetchData for better scope
const perPage = 10;

searchButton.addEventListener('click', () => {
    const inputUser = document.getElementById('searchInput').value.trim();
    console.log(inputUser);
    const inputSelect = typeSelected.value;

    if(inputUser === ''){
        return cards.innerHTML = '<h4>Non ci sono risultati</h4>'
    }else{
        // Chiamata iniziale per caricare i dati e creare il paginatore
        fetchData(inputUser, inputSelect, currentPage);
    }
});

const cardContainer = document.getElementById('card-container');

function fetchData(inputUser, inputSelect, page = 1) {
    const url = inputSelect === 'users' ? 
        `http://api.github.com/users/${inputUser}/repos` : 
        `http://api.github.com/search/repositories`;

    axios.get(url, {
        params: {
            q: inputSelect === 'repositories' ? inputUser : undefined,
            per_page: perPage,
            page: page
        },
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github+json'
        }
    })
    .then(response => {
        if(inputSelect === 'repositories'){
            console.log(response.data.items)
            displayResults(response.data.items); // Funzione per visualizzare i risultati

        }else if(inputSelect === 'users'){
            console.log(response.data); // Gestisci i dati ottenuti
            displayResults(response.data); // Funzione per visualizzare i risultati

        }
        // Aggiorna il numero totale di pagine se disponibile
        const linkHeader = response.headers.link;
        let totalPages = 1; // Inizialmente impostato a 1
        if (linkHeader) {
            totalPages = getTotalPagesFromLinkHeader(linkHeader);
        }
        if(inputUser !== ''){
            createPaginator(totalPages, inputUser, inputSelect); // Aggiorna il paginatore
        }
        
    })
    .catch(error => {
        console.error('Errore:', error.message);
    });
}

function getTotalPagesFromLinkHeader(linkHeader) {
    const links = linkHeader.split(','); // Dividi i vari link
    let lastPage = 1;

    links.forEach(link => {
        const section = link.split(';');
        if (section[1].includes('rel="last"')) {
            // Estrai il numero di pagina dall'URL
            const url = section[0].replace(/<(.*)>/, '$1').trim();
            const urlParams = new URLSearchParams(new URL(url).search);
            lastPage = urlParams.get('page');
        }
    });

    return parseInt(lastPage, 10); // Restituisci l'ultima pagina come numero
}

function createPaginator(totalPages, inputUser, inputSelect) {
    const paginator = document.getElementById('paginator');
    paginator.innerHTML = ''; // Svuota il paginatore

    // Decidi quanti bottoni visualizzare, ad esempio massimo 5
    const maxButtonsToShow = 200; 
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = startPage + maxButtonsToShow - 1;

    // Assicurati che endPage non superi totalPages
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    // Bottone per la prima pagina
    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginator.appendChild(ellipsis);
        }
    }

    // Bottoni per le pagine nel range
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }

    // Bottone per l'ultima pagina
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginator.appendChild(ellipsis);
        }
        addPageButton(totalPages);
    }

    function addPageButton(pageNumber) {
        const pageButton = document.createElement('button');
        pageButton.textContent = pageNumber;
        pageButton.className = pageNumber === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = pageNumber; // Aggiorna currentPage qui
            fetchData(inputUser, inputSelect, currentPage); // Passa il numero di pagina corretto
        });
        paginator.appendChild(pageButton);
    }
}

// Funzione per visualizzare i risultati
function displayResults(data) {
    // Implementa la logica per visualizzare i dati ottenuti dalla richiesta
    cards.innerHTML = ''; // Svuota il contenitore
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';




        const cardImg = document.createElement('div');
        cardImg.className = 'div-img';
        const img = document.createElement('img');
        img.src = item.owner.avatar_url; // Modifica in base ai tuoi dati
        
        cardImg.appendChild(img);
        card.appendChild(cardImg);



        const cardFullName = document.createElement('div');
        cardFullName.className = 'div-fullName';
        cardFullName.textContent = item.full_name; // Modifica in base ai tuoi dati
        card.appendChild(cardFullName);
        
        
        const cardDescription = document.createElement('div');
        cardDescription.className = 'div-description';
        cardDescription.textContent = item.description; // Modifica in base ai tuoi dati
        card.appendChild(cardDescription);
        
        
        const cardStar = document.createElement('div');
        const textStar = document.createElement('span');
        textStar.className = 'text-count';

        cardStar.className = 'div-count';
        const iconStar = document.createElement('i');
        iconStar.className = 'fa-solid fa-star';
        cardStar.appendChild(iconStar) // Modifica in base ai tuoi dati
        textStar.textContent = item.stargazers_count;
        cardStar.appendChild(textStar) // Modifica in base ai tuoi dati
        card.appendChild(cardStar);
        
        
        const cardIssues = document.createElement('div');
        const textIssues = document.createElement('span');
        textIssues.className = 'text-count';


        cardIssues.className = 'div-count';
        const iconIssues = document.createElement('i');
        iconIssues.className = 'fa-solid fa-circle-exclamation';
        cardIssues.appendChild(iconIssues) // Modifica in base ai tuoi dati
        textIssues.textContent = item.open_issues_count;
        cardIssues.appendChild(textIssues) // Modifica in base ai tuoi dati
         // Modifica in base ai tuoi dati
        card.appendChild(cardIssues);
        
        
        
        
        
        
        
        const hr = document.createElement('hr');
        card.appendChild(hr);



        const divA = document.createElement('div');
        divA.className = 'div-link';
        const divALink = document.createElement('a');
        divALink.className = 'a-margin';
        divALink.textContent = 'Link alla repository';
        divALink.href = item.clone_url;
        divALink.target = '_blank';
        const iconLink = document.createElement('i');
        iconLink.className = 'fa-solid fa-arrow-up-right-from-square';
        divA.appendChild(iconLink);
        divA.appendChild(divALink);
        card.appendChild(divA);



        cards.appendChild(card);


        


    });
}


// open_issues_count: 0

// description: "🏆 Swiper component for @vuejs"

// full_name: "surmon-china/vue-awesome-swiper"

// stargazers_count: 12808

// clone_url: "https://github.com/surmon-china/vue-awesome-swiper.git"

// owner avatar_url "https://avatars.githubusercontent.com/u/6128107?v=4"
