// Load and display products from JSON
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('product_list.json');
        const data = await response.json();
        
        // Load Granite By Colour
        loadGraniteByColour(data.graniteCollections.categories.byColour.subcategories);
        
        // Load Granite By Spaces
        loadGraniteBySpaces(data.graniteCollections.categories.bySpaces.subcategories);
        
        // Load Marble By Colours
        loadMarbleByColours(data.marbleCollections.categories.byColours.subcategories);
        
        // Load Marble By Space
        loadMarbleBySpace(data.marbleCollections.categories.bySpace.subcategories);
        
    } catch (error) {
        console.error('Error loading product data:', error);
    }
});

function loadGraniteByColour(subcategories) {
    const colourMap = {
        black: 'granite-black',
        blue: 'granite-blue',
        brown: 'granite-brown',
        green: 'granite-green',
        grey: 'granite-grey',
        red: 'granite-red',
        white: 'granite-white',
        yellow: 'granite-yellow'
    };
    
    Object.keys(colourMap).forEach(colour => {
        const listId = colourMap[colour];
        const products = subcategories[colour].products;
        populateProductList(listId, products);
    });
}

function loadGraniteBySpaces(subcategories) {
    const spaceMap = {
        frontWall: 'granite-frontwall',
        highlighters: 'granite-highlighters',
        kitchenTop: 'granite-kitchen',
        parking: 'granite-parking',
        tableTop: 'granite-tabletop'
    };
    
    Object.keys(spaceMap).forEach(space => {
        const listId = spaceMap[space];
        const products = subcategories[space].products;
        populateProductList(listId, products);
    });
}

function loadMarbleByColours(subcategories) {
    const colourMap = {
        beige: 'marble-beige',
        black: 'marble-black',
        blue: 'marble-blue',
        brown: 'marble-brown',
        green: 'marble-green',
        grey: 'marble-grey',
        pink: 'marble-pink',
        red: 'marble-red',
        white: 'marble-white',
        yellow: 'marble-yellow'
    };
    
    Object.keys(colourMap).forEach(colour => {
        const listId = colourMap[colour];
        const products = subcategories[colour].products;
        populateProductList(listId, products);
    });
}

function loadMarbleBySpace(subcategories) {
    const spaceMap = {
        bedroom: 'marble-bedroom',
        flooring: 'marble-flooring',
        kitchen: 'marble-kitchen',
        livingRoom: 'marble-livingroom',
        wall: 'marble-wall',
        washroom: 'marble-washroom'
    };
    
    Object.keys(spaceMap).forEach(space => {
        const listId = spaceMap[space];
        const products = subcategories[space].products;
        populateProductList(listId, products);
    });
}

function populateProductList(listId, products) {
    const listElement = document.getElementById(listId);
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    if (products && products.length > 0) {
        products.forEach(product => {
            const li = document.createElement('li');
            li.textContent = product;
            li.addEventListener('click', () => {
                showProductDetails(product);
            });
            listElement.appendChild(li);
        });
    }
}

function showProductDetails(productName) {
    // Placeholder for product details modal or navigation
    console.log('Product clicked:', productName);
    // You can implement a modal or navigate to a product detail page here
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
