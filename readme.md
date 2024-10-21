# GitHub Search App

## Descrizione

Questa applicazione consente agli utenti di cercare repository o utenti su GitHub. Utilizza l'API di GitHub per recuperare informazioni sui repository pubblici e sugli utenti, presentando i risultati in un formato visivamente accattivante. L'app include funzionalità di paginazione per navigare tra i risultati.

## Funzionalità

- **Ricerca di Repository**: Cerca repository pubblici su GitHub in base a un termine di ricerca.
- **Ricerca di Utenti**: Trova repository associati a un utente specifico.
- **Paginazione**: Naviga facilmente tra le pagine di risultati.
- **Interfaccia User-Friendly**: Visualizzazione chiara dei risultati con dettagli come nome del repository, descrizione, numero di stelle e link al repository.

## Tecnologie Utilizzate

- **Frontend**: HTML, CSS, JavaScript (con Axios per le chiamate API)
- **API**: GitHub REST API
- **Icone**: Font Awesome per le icone

## Utilizzo

1. Inserisci un termine di ricerca nel campo di input.
2. Seleziona se desideri cercare "Utenti" o "Repository" dal menu a discesa.
3. Fai clic sul pulsante di ricerca.
4. Visualizza i risultati della ricerca sotto il modulo.

## Esempi di Richiesta

- Per cercare repository:
  - Termini di ricerca: "react", "vue", ecc.
- Per cercare repository di un utente:
  - Nome utente: "torvalds", "octocat", ecc.



## Installazione

1. **Clona il repository**:
   ```bash
        git clone https://github.com/MatteoDiMario96/github-api.git
   ```


2. **Naviga nella cartella del progetto**:
   ```bash
        cd github-api
   ```


3. **Apri il file** `index.html` nel tuo browser.



4. **Configura il token di accesso**:
    1. **Crea il file `config.js`**:
    - Nella cartella principale del tuo progetto (dove si trova il file `index.html`), fai clic con il tasto destro e seleziona "Nuovo" > "File" (su Windows) o "Nuovo documento" > "File" (su Mac).
    - Nomina il file `config.js`.

    2. **Aggiungi il tuo token GitHub**:
    - Apri il file `config.js` con un editor di testo (come Visual Studio Code, Sublime Text, Notepad++, o anche il Blocco Note).
    - Copia e incolla il seguente codice, sostituendo `'il_tuo_token'` con il tuo token GitHub reale:

    ```javascript
    export default {
        GITHUB_TOKEN: 'il_tuo_token'
    };



## Contribuire

Se desideri contribuire a questo progetto, apri una richiesta di pull o segnalami eventuali problemi. Ogni contributo è benvenuto!

## Contatti

- **Nome**: Matteo Di Mario
- **LinkedIn**: [Matteo Di mario LinkedIn](https://www.linkedin.com/in/di-mario-matteo/)
