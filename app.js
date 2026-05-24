let itemsData = [];

// جلب البيانات من ملف الـ JSON
async function loadItems() {
    try {
        const response = await fetch('items.json');
        itemsData = await response.json();
        displayItems(itemsData);
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// عرض العناصر داخل الـ Grid
function displayItems(items) {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = ''; // تنظيف الحاوية أولاً

    if(items.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:#666;">لم يتم العثور على نتائج</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-name">${item.name}</div>
            <div class="item-id">ID: ${item.id}</div>
        `;
        container.appendChild(card);
    });
}

// المراقبة والبحث الفوري (Real-time Filter)
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

function filterData() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = itemsData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchText) || item.id.includes(searchText);
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    displayItems(filtered);
}

searchInput.addEventListener('input', filterData);
categoryFilter.addEventListener('change', filterData);

// تشغيل الدالة عند تحميل الصفحة
window.onload = loadItems;
