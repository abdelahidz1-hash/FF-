// مصفوفة لتخزين البيانات المجلوبة من السيرفر
let itemsData = [];

// 1. دالة جلب البيانات من ملف الـ JSON مع منع الكاش
async function loadItems() {
    try {
        // إضافة محدد زمني عشوائي لمنع المتصفح من كاش الملف المحدث
        const response = await fetch(`items.json?v=${new Date().getTime()}`);
        itemsData = await response.json();
        
        // عرض العناصر لأول مرة بعد جلبها بنجاح
        displayItems(itemsData);
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// 2. دالة عرض العناصر داخل الـ Grid في صفحة الـ HTML
function displayItems(items) {
    const container = document.getElementById('itemsContainer');
    if (!container) return;

    // تنظيف الحاوية أولاً قبل عرض العناصر الجديدة
    container.innerHTML = '';

    // في حال عدم العثور على أي عنصر يطابق البحث
    if (items.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #888; font-weight: 700;">لم يتم العثور على نتائج</p>';
        return;
    }

    // بناء الكروت للعناصر الممررة
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/102000004.png'">
            <div class="item-name">${item.name}</div>
            <div class="item-id">ID: ${item.id}</div>
        `;

        container.appendChild(card);
    });
}

// 3. دالة الفلترة والبحث المشترك (تصفية حية)
function filterItems() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!searchInput || !categoryFilter) return;

    const query = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    // تصفية المصفوفة الأصلية بناءً على المدخلات
    const filtered = itemsData.filter(item => {
        // التحقق من المطابقة مع الاسم أو الـ ID
        const matchesSearch = item.name.toLowerCase().includes(query) || item.id.toString().includes(query);
        // التحقق من مطابقة التصنيف
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // تحديث الواجهة بالعناصر المفلترة فقط
    displayItems(filtered);
}

// 4. ربط الأحداث وتشغيل الدالة عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    // تشغيل الفلترة الحية عند الكتابة في حقل البحث
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }

    // تشغيل الفلترة الحية عند تغيير تصنيف القائمة المنسدلة
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterItems);
    }

    // استدعاء دالة جلب البيانات الأساسية للبدء
    loadItems();
});
