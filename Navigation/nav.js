document.addEventListener('DOMContentLoaded', () => {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('../Navigation/nav.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                navPlaceholder.innerHTML = data;
            })
            .catch(err => console.error('Error loading navigation:', err));
    }
});
