let itemsData = [];

// 1. دالة جلب البيانات من ملف items.json الخارجي مع كسر الكاش الشديد لمتصفحات الهواتف
async function loadItems() {
    try {
        // إضافة Timestamp لإجبار السيرفر والمتصفح على تقديم أحدث نسخة مرفوعة فوراً
        const nocache = new Date().getTime();
        const response = await fetch(`items.json?v=${nocache}`);
        
        if (!response.ok) {
            throw new Error('تعذر جلب ملف الـ JSON الخارجي');
        }
        
        itemsData = await response.json();
        displayItems(itemsData);
    } catch (error) {
        console.error("حدث خطأ أثناء تحميل البيانات:", error);
        const container = document.getElementById('itemsContainer');
        if (container) {
            container.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: #ff3e3e; font-weight: 700;">خطأ في تحميل ملف items.json تأكد من رفعه بشكل صحيح.</p>`;
        }
    }
}

// 2. دالة بناء وعرض الكروت داخل الواجهة
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

        // تعيين صورة افتراضية في حال فشل تحميل الرابط المباشر
        const defaultImg = 'https://raw.githubusercontent.com/ShahGCreator/icon/main/PNG/102000004.png';

        card.innerHTML = `
            <img src="${item.image || item.صورة || defaultImg}" alt="${item.name || item.اسم}" onerror="this.onerror=null; this.src='${defaultImg}';">
            <div class="item-name">${item.name || item.اسم || 'عنصر غير مسمى'}</div>
            <div class="item-id">ID: ${item.id || '000000'}</div>
        `;

        container.appendChild(card);
    });
}

// 3. دالة الفلترة والبحث الذكي المتوافقة مع الكلمات العربية والإنجليزية
function filterItems() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const selectedCategory = document.getElementById('categoryFilter').value;

    const filtered = itemsData.filter(item => {
        // التحقق من تطابق الاسم أو الـ ID
        const itemName = (item.name || item.اسم || '').toLowerCase();
        const itemId = (item.id || '').toString();
        const matchesSearch = itemName.includes(query) || itemId.includes(query);

        // التحقق من الفئة (دعم الكلمات العربية والإنجليزية لتجنب أخطاء الإدخال في الـ JSON)
        const itemCat = (item.category || item.فئة || '').toLowerCase();
        let matchesCategory = selectedCategory === 'all';
        
        if (!matchesCategory) {
            if (selectedCategory === 'characters' && (itemCat === 'characters' || itemCat === 'شخصيات')) matchesCategory = true;
            if (selectedCategory === 'weapons' && (itemCat === 'weapons' || itemCat === 'أسلحة' || itemCat === 'الأسلحة')) matchesCategory = true;
            if (selectedCategory === 'bundles' && (itemCat === 'bundles' || itemCat === 'حزم' || itemCat === 'الحزم')) matchesCategory = true;
        }

        return matchesSearch && matchesCategory;
    });

    displayItems(filtered);
}

// 4. تشغيل الاستماع للأحداث فور اكتمال بنية الـ DOM
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) searchInput.addEventListener('input', filterItems);
    if (categoryFilter) categoryFilter.addEventListener('change', filterItems);

    loadItems();
});
