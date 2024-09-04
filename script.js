const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const suggestionsContainer = document.getElementById('suggestions-container');

// searchButton.addEventListener('click', () => {
//     const searchTerm = searchInput.value;
//     searchWord(searchTerm);
// });
// Adding an event listener for Enter key press
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior  
        searchButton.click(); // Triggers search button click event
    }
});

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    searchWord(searchTerm);
});

const clearIcon = document.getElementById('clear-search');

// Adding an event listener for clear icon click
clearIcon.addEventListener('click', () => {
    searchInput.value = '';
});


function searchWord(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    // Making the API request
    fetch(apiUrl)
        // Asynchronously parsing the response as JSON
        .then(response => response.json()) 
        .then(data => {
            // Processing the API response and displayimg results and suggestions
            displayResults(data);
            displaySuggestions(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            resultsContainer.innerHTML = 'Error fetching data.';
        });
}

function displayResults(data) {
    // Clearing previous results
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.innerHTML = 'Word not found.';
        return;
    }

    // Displayong word information, including audio, pronunciation, and definitions,verbs
    data.forEach(result => {
        const word = result.word;
        const pronunciations = result.phonetics || [];
        const meanings = result.meanings || [];

        const resultElement = document.createElement('div');
        resultElement.classList.add('result');
        resultElement.innerHTML = `
            <h2>${word}</h2>
        `;

        // Displaying the word's pronunciation (if available)
        if (pronunciations.length > 0) {
            const pronunciation = pronunciations[0].text || 'N/A';
            resultElement.innerHTML += `
                <p><strong>Pronunciation:</strong><br> ${pronunciation}</p>
            `;
        }

        // Displaying audio pronunciation (if available)
        if (pronunciations.length > 0) {
            const audio = pronunciations[0].audio || '';
            if (audio) {
                resultElement.innerHTML += `
                    <audio controls src="${audio}"></audio>
                `;
            }
        }

        // Displaying definitions for noun, proper noun, and verb  
        meanings.forEach(meaning => {
            const partOfSpeech = meaning.partOfSpeech || 'N/A';
            const definitions = meaning.definitions || [];

            resultElement.innerHTML += `
                <p><strong>${partOfSpeech}:</strong></p>
            `;

            if (definitions.length > 0) {
                resultElement.innerHTML += '<ol>';
                definitions.forEach(definition => {
                    const definitionText = definition.definition || 'N/A';
                    resultElement.innerHTML += `
                        <li>${definitionText}</li>
                    `;
                });
                resultElement.innerHTML += '</ol>';
            }
        });

        resultsContainer.appendChild(resultElement);
    });
}

function displaySuggestions(data) {
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';

    if (data.length === 0) {
        suggestionsContainer.innerHTML = '';
        return;
    }

    // Displaying similar words (if available)
    const suggestions = data[0].suggestions || [];

    if (suggestions.length > 0) {
        suggestionsContainer.innerHTML = '<h3>Similar Words:</h3>';
        suggestions.forEach(suggestion => {
            suggestionsContainer.innerHTML += `<p>${suggestion}</p>`;
        });
    }
}
