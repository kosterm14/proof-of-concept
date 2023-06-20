const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const blogPostsContainer = document.getElementById('blogPosts');

searchInput.addEventListener('input', handleSearchInput);

function handleSearchInput() {
    const query = searchInput.value.trim();

    if (query.length >= 4) {
        // Perform autocomplete search
        performAutocompleteSearch(query);
    } else {
        // Clear search results if query length is less than 4
        clearSearchResults();
    }
}

function performAutocompleteSearch(query) {
    const queryData = `
    query BlogpostSearch($query: String!) {
      allBlogPosts(filter: {title: {matches: {pattern: $query}}}) {
        title
      }
    }
  `;

    const variables = {
        query: query
    };

    fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer 10a0ae10c2d6418c1acd4346de9329',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: queryData,
            variables: variables,
        })
    })
        .then(response => response.json())
        .then(data => {
            const blogPosts = data.data.allBlogPosts;
            const htmlContent = blogPosts.map(blogPost => {
                const title = blogPost.title;
                const query = searchInput.value.trim();
                const regex = new RegExp(query, 'gi');
                const highlightedTitle = title.replace(regex, match => `<strong>${match}</strong>`);
                return `<li>${highlightedTitle}</li>`;
            }).join('');
            blogPostsContainer.innerHTML = htmlContent;
            searchResults.textContent = `Showing search results for: ${query}`;
        })
        .catch(error => {
            console.error('Error fetching GraphQL data:', error);
        });
}

function clearSearchResults() {
    blogPostsContainer.innerHTML = '34 Blogs by 7 Authors';
    searchResults.textContent = '';
}