// الدالة المسؤولة عن جلب بيانات العناصر وعرض صورها أونلاين
async function loadFreeFireItems() {
  try {
    // 1. جلب ملف الـ JSON الذي يحتوي على المعرفات والأسماء والروابط
    const response = await fetch('items.json');
    const items = await response.json();
    
    // 2. تحديد الحاوية داخل الـ HTML التي ستعرض الكروت
    const container = document.getElementById('items-container');
    container.innerHTML = ''; // تنظيف الحاوية قبل العرض

    // 3. التكرار بناءً على مصفوفتك لجلب وعرض الصور ديناميكياً
    items.forEach(item => {
      // جلب رابط الصورة مباشرة من ملف الـ JSON بناءً على طلبك
      const imageUrl = item.image || '';

      // إنشاء الهيكل البرمجي المخصص لكارت العنصر
      const itemCard = document.createElement('div');
      itemCard.className = 'item-card'; // كلاس التنسيق (CSS)

      itemCard.innerHTML = `
        <div class="image-wrapper">
          <img src="${imageUrl}" alt="${item.name}" loading="lazy">
        </div>
        <h3 class="item-name">${item.name}</h3>
        <span class="item-id">ID: ${item.id}</span>
      `;

      // إضافة الكارت إلى صفحة الموقع
      container.appendChild(itemCard);
    });
    
  } catch (error) {
    console.error('حدث خطأ أثناء جلب البيانات أو تحميل الصور:', error);
  }
}

// تشغيل الدالة تلقائياً بمجرد تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', loadFreeFireItems);
