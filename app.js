// مصفوفة لتخزين البيانات
let itemsData = [];

// دالة جلب البيانات باستخدام رابط مباشر ومحدد زمني لمنع الكاش تماماً
async function loadItems() {
    try {
        // استخدمنا رابطاً نسبياً مع طابع زمني ديناميكي يضمن جلب أحدث ملف items.json رفعته
        const timestamp = new Date().getTime();
        const response = await fetch(`items.json?update=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        itemsData = await response.json();
        
        // عرض البيانات فوراً بعد جلبها
        displayItems(itemsData);
    } catch (error) {
        console.error("خطأ أثناء جلب ملف البيانات JSON:", error);
        // خطة بديلة: إذا فشل جلب الملف لأي سبب، يتم إظهار رسالة تنبيهية للمطور في الكونسول
    }
}

// دالة بناء الكروت وعرضها داخل الواجهة
function displayItems(items) {
    const container = document.getElementById('itemsContainer');
    if (!container) return;

    container.innerHTML = '';

    // إذا كانت المصفوفة فارغة
    if (!items || items.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #888; font-weight: 700; font-family: \'Cairo\', sans-serif;">لم يتم العثور على أي عناصر...</p>';
        return;
    }

    // توليد كروت العناصر بناءً على البيانات الجديدة
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';

        // الروابط تعتمد على مستودع الصور المباشر بدقة مع معالجة حماية الصور المكسورة
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/102000004.png';">
            <div class="item-name" style="font-weight: 900;">${item.name}</div>
            <div class="item-id">ID: ${item.id}</div>
        `;

        container.appendChild(card);
    });
}

// دالة التصفية الحية والبحث المشترك (بالاسم أو المعرّف)
function filterItems() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!searchInput || !categoryFilter) return;

    const query = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filtered = itemsData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(query) || item.id.toString().includes(query);
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    displayItems(filtered);
}

// ربط المستمعات وتشغيل السكريبت فور تحميل الواجهة
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) searchInput.addEventListener('input', filterItems);
    if (categoryFilter) categoryFilter.addEventListener('change', filterItems);

    // تشغيل الجلب الفوري
    loadItems();
});
