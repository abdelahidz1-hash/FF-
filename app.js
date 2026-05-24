let itemsData = [];

async function loadItems() {
    try {
        const nocache = new Date().getTime();
        const response = await fetch(`items.json?v=${nocache}`);
        
        if (!response.ok) {
            throw new Error('تعذر جلب ملف الـ JSON');
        }
        
        itemsData = await response.json();
        displayItems(itemsData);
    } catch (error) {
        console.error("خطأ:", error);
        const container = document.getElementById('itemsContainer');
        if (container) {
            container.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: #ff3e3e; font-weight: 900;">خطأ في قراءة بيانات ملف items.json</p>`;
        }
    }
}

function displayItems(items) {
    const container = document.getElementById('itemsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!items || items.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #888; font-weight: 900;">لم يتم العثور على نتائج متطابقة</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        const defaultImg = 'https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/102000004.png';

        card.innerHTML = `
            <img src="${item.image || defaultImg}" alt="${item.name}" onerror="this.onerror=null; this.src='${defaultImg}';">
            <div class="item-name">${item.name || 'عنصر غير مسمى'}</div>
            <div class="item-id">ID: ${item.id || '000000'}</div>
        `;
        container.appendChild(card);
    });
}

function filterItems() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const selectedCategory = document.getElementById('categoryFilter').value;

    const filtered = itemsData.filter(item => {
        const itemName = (item.name || '').toLowerCase();
        const itemId = (item.id || '').toString();
        const matchesSearch = itemName.includes(query) || itemId.includes(query);

        const itemCat = (item.category || '').toLowerCase();
        const matchesCategory = selectedCategory === 'all' || itemCat === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayItems(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) searchInput.addEventListener('input', filterItems);
    if (categoryFilter) categoryFilter.addEventListener('change', filterItems);

    loadItems();
});
