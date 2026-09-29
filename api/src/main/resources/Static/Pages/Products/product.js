// js/product.js


document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch products from Spring Boot API
        const response = await apiClient.get('/products?size=1000');
        const products = response.content || [];
        
        // Group products to map them to the HTML structure
        const subcategories = {
            granite: { byColour: {}, bySpace: {} },
            marble: { byColour: {}, bySpace: {} }
        };

        // Initialize maps
        const colours = ['black', 'blue', 'brown', 'green', 'grey', 'red', 'white', 'yellow', 'pink', 'beige'];
        const spacesGranite = ['frontwall', 'highlighters', 'kitchen', 'parking', 'tabletop'];
        const spacesMarble = ['bedroom', 'flooring', 'kitchen', 'livingroom', 'wall', 'washroom'];
        
        colours.forEach(c => {
            subcategories.granite.byColour[c] = [];
            subcategories.marble.byColour[c] = [];
        });

        spacesGranite.forEach(s => subcategories.granite.bySpace[s] = []);
        spacesMarble.forEach(s => subcategories.marble.bySpace[s] = []);

        // Sort products into subcategories
        products.forEach(product => {
            const cat = product.category ? product.category.toLowerCase() : '';
            const color = product.color ? product.color.toLowerCase() : '';
            // For spaces, we rely on the product's finishType or a custom field, 
            // but since we only have basic fields, we will assign based on description keywords or just put them everywhere.
            // A better way is to see if category/color matches.
            
            if (cat === 'granite') {
                if (subcategories.granite.byColour[color]) {
                    subcategories.granite.byColour[color].push(product);
                } else {
                    // Put in grey by default if unknown
                    subcategories.granite.byColour['grey'].push(product);
                }
                
                // Randomly distribute into spaces for demonstration if no explicit space
                const spaceKey = spacesGranite[Math.floor(Math.random() * spacesGranite.length)];
                subcategories.granite.bySpace[spaceKey].push(product);

            } else if (cat === 'marble') {
                if (subcategories.marble.byColour[color]) {
                    subcategories.marble.byColour[color].push(product);
                } else {
                    subcategories.marble.byColour['white'].push(product);
                }

                // Randomly distribute into spaces for demonstration
                const spaceKey = spacesMarble[Math.floor(Math.random() * spacesMarble.length)];
                subcategories.marble.bySpace[spaceKey].push(product);
            }
        });

        // Load Granite By Colour
        loadGraniteByColour(subcategories.granite.byColour);
        
        // Load Granite By Spaces
        loadGraniteBySpaces(subcategories.granite.bySpace);
        
        // Load Marble By Colours
        loadMarbleByColours(subcategories.marble.byColour);
        
        // Load Marble By Space
        loadMarbleBySpace(subcategories.marble.bySpace);

    } catch (error) {
        console.error('Error loading product data from API:', error);
    }
});

function loadGraniteByColour(byColourMap) {
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
        const products = byColourMap[colour];
        populateProductList(listId, products);
    });
}

function loadGraniteBySpaces(bySpaceMap) {
    const spaceMap = {
        frontwall: 'granite-frontwall',
        highlighters: 'granite-highlighters',
        kitchen: 'granite-kitchen',
        parking: 'granite-parking',
        tabletop: 'granite-tabletop'
    };
    
    Object.keys(spaceMap).forEach(space => {
        const listId = spaceMap[space];
        const products = bySpaceMap[space];
        populateProductList(listId, products);
    });
}

function loadMarbleByColours(byColourMap) {
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
        const products = byColourMap[colour];
        populateProductList(listId, products);
    });
}

function loadMarbleBySpace(bySpaceMap) {
    const spaceMap = {
        bedroom: 'marble-bedroom',
        flooring: 'marble-flooring',
        kitchen: 'marble-kitchen',
        livingroom: 'marble-livingroom',
        wall: 'marble-wall',
        washroom: 'marble-washroom'
    };
    
    Object.keys(spaceMap).forEach(space => {
        const listId = spaceMap[space];
        const products = bySpaceMap[space];
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
            li.textContent = product.name || product; // product string if fallback, product.name if API
            li.addEventListener('click', () => {
                showProductDetails(product);
            });
            listElement.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "No products available";
        li.style.color = "#999";
        li.style.fontStyle = "italic";
        listElement.appendChild(li);
    }
}

function showProductDetails(product) {
    if (product && product.id) {
        window.location.href = `product-details.html?id=${product.id}`;
    } else {
        window.location.href = `product-details.html?name=${encodeURIComponent(product)}`;
    }
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
