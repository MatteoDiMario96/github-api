// Import for the auth-key token GitHub API
import config from '../config.js';


/**
 * Add an eventListener on load for reset the select
 */
window.addEventListener('load', () => {
    document.getElementById('typeSelected').value = '';
});


// Take the token from config.js 
const token = config.GITHUB_TOKEN;


// Take from the HTML the element i need to append
const searchButton = document.getElementById('searchButton');
const typeSelected = document.getElementById('typeSelected');
const cards = document.getElementById('cards');


// Create variables for currentPage, totalPage and how much for page 
let currentPage = 1;
const perPage = 10;


/**
 * Add at the button of search  an eventListener 'click' for call the func debouncedFetchData
 * Only if the input it's not empty
 */
searchButton.addEventListener('click', () => {
    const inputUser = document.getElementById('searchInput').value.trim();
    const inputSelect = typeSelected.value;
    
    if (inputUser === '') {
        return cards.innerHTML = '<h4>Non ci sono risultati</h4>';
    } else {
        debouncedFetchData(inputUser, inputSelect); // Usa la funzione debounced
    }
});


//********************FUNCTION**********************/ 

async function fetchData(inputUser, inputSelect, page = 1) {
    const url = inputSelect === 'users' ? 
    `https://api.github.com/users/${inputUser}/repos` : 
    `https://api.github.com/search/repositories`;
    
    try {
        const response = await axios.get(url, {
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
        });
        
        const data = inputSelect === 'repositories' ? response.data.items : response.data;
        displayResults(data);
        
        const linkHeader = response.headers.link;
        let totalPages = 1;
        if (linkHeader) {
            totalPages = getTotalPagesFromLinkHeader(linkHeader);
        }
        
        if (inputUser !== '') {
            createPaginator(totalPages, inputUser, inputSelect);
        }
    } catch (error) {
        console.error('Errore:', error.message);
    }
}

/**
 * Function for the debounce of the func 
 */
function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

/**
 * Function debounced for fetchData
 * the execute of the func is 500 ms delayed  
 */ 
const debouncedFetchData = debounce((inputUser, inputSelect) => {
    fetchData(inputUser, inputSelect, currentPage);
}, 500);


/**
 * Function for take from the headers link the totalPages if have pagination 
 * thanks at the rel=  i can menage the pagination
 */
function getTotalPagesFromLinkHeader(linkHeader) {
    const links = linkHeader.split(',');
    let lastPage = 1;
    
    links.forEach(link => {
        const section = link.split(';');
        if (section[1].includes('rel="last"')) {
            const url = section[0].replace(/<(.*)>/, '$1').trim();
            const urlParams = new URLSearchParams(new URL(url).search);
            lastPage = urlParams.get('page');
        }
    });

    return parseInt(lastPage, 10);
}


/**
 * Function for create the paginator 
 */
function createPaginator(totalPages, inputUser, inputSelect) {
    const paginator = document.getElementById('paginator');
    paginator.innerHTML = '';

    const maxButtonsToShow = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = startPage + maxButtonsToShow - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginator.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginator.appendChild(ellipsis);
        }
        addPageButton(totalPages);
    }

    /**
     * Function for create the button for the pages
     */
    function addPageButton(pageNumber) {
        const pageButton = document.createElement('button');
        pageButton.textContent = pageNumber;
        pageButton.className = pageNumber === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = pageNumber;
            fetchData(inputUser, inputSelect, currentPage);
        });
        paginator.appendChild(pageButton);
    }
}


/**
 * Function for display all the results dynamically
 */
function displayResults(data) {
    cards.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const cardImg = document.createElement('div');
        cardImg.className = 'div-img';
        const img = document.createElement('img');
        img.src = item.owner.avatar_url;

        cardImg.appendChild(img);
        card.appendChild(cardImg);

        const cardFullName = document.createElement('div');
        cardFullName.className = 'div-fullName';
        cardFullName.textContent = item.full_name;
        card.appendChild(cardFullName);

        const cardDescription = document.createElement('div');
        cardDescription.className = 'div-description';
        cardDescription.textContent = item.description;
        card.appendChild(cardDescription);

        const cardStar = document.createElement('div');
        const textStar = document.createElement('span');
        textStar.className = 'text-count';

        cardStar.className = 'div-count';
        const iconStar = document.createElement('i');
        iconStar.className = 'fa-solid fa-star';
        cardStar.appendChild(iconStar);
        textStar.textContent = item.stargazers_count;
        cardStar.appendChild(textStar);
        card.appendChild(cardStar);

        const cardIssues = document.createElement('div');
        const textIssues = document.createElement('span');
        textIssues.className = 'text-count';

        cardIssues.className = 'div-count';
        const iconIssues = document.createElement('i');
        iconIssues.className = 'fa-solid fa-circle-exclamation';
        cardIssues.appendChild(iconIssues);
        textIssues.textContent = item.open_issues_count;
        cardIssues.appendChild(textIssues);
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
