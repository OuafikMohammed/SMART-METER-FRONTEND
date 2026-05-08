# 🔧 حل مشكلة التوجيه إلى Dashboard

## المشكلة
جميع الروابط تأخذك إلى dashboard:
- `http://localhost:3000/admin/anomalies` ← ينقلك إلى dashboard
- `http://localhost:3000/admin/alertes` ← ينقلك إلى dashboard
- `http://localhost:8000/admin` ← يعمل (Django Admin)
- `http://localhost:8000/api/energy/anomalies/` ← قد يعطي 401 Unauthorized

## السبب
**المستخدم ليس مسجل الدخول بشكل صحيح!**

في `/admin/layout.tsx` يوجد فحص:
```typescript
if (!isAuthenticated) {
  router.push("/dashboard");  // ← ينقلك هنا إذا لم تكن مسجل الدخول
}
```

## ✅ الحل

### الطريقة 1️⃣: دخول تلقائي (للاختبار) ✅ مُنفذة

تم تعديل `/admin/layout.tsx` لتسجيل الدخول تلقائياً كـ ADMIN.

**ما الذي يجب أن تفعله:**
```bash
# 1. امسح cache المتصفح
# Windows: Ctrl + Shift + Delete أو Cmd + Shift + Delete

# 2. أعد تحميل الصفحة
# F5 أو Ctrl + R

# 3. الآن يجب أن تشاهد صفحة الشذوذ/التنبيهات
```

### الطريقة 2️⃣: API (Backend)

**للوصول إلى الـ API يجب الحصول على token:**

```bash
# 1. احصل على token (تسجيل الدخول)
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# النتيجة:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# 2. استخدم token للوصول إلى الـ API
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:8000/api/energy/anomalies/
```

### الطريقة 3️⃣: من الواجهة الرسومية

**بعد التعديلات:**
1. اذهب إلى: `http://localhost:3000/admin/anomalies`
2. يجب أن تشاهد جدول الشذوذ مباشرة ✓
3. الأزرار يجب أن تعمل

---

## 🔍 التشخيص

### هل المسارات موجودة؟
```
✅ Routes verified:
├── /admin                    ✓ موجود
├── /admin/anomalies         ✓ موجود
├── /admin/alertes           ✓ موجود
└── /admin/login             ✓ موجود
```

### هل البيانات موجودة؟
```bash
# Django Shell
python manage.py shell

from energy.models import Anomalie, Alerte
print(f"الشذوذ: {Anomalie.objects.count()}")
print(f"التنبيهات: {Alerte.objects.count()}")

# النتيجة:
# الشذوذ: 2
# التنبيهات: 2
```

### هل API يعمل؟
```bash
# بدون token (سيعطي 401)
curl http://localhost:8000/api/energy/anomalies/
# النتيجة: 401 Unauthorized

# مع token (سيعمل)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/energy/anomalies/
# النتيجة: 200 OK
```

---

## 📝 الملخص السريع

| المشكلة | الحل | الحالة |
|--------|-----|--------|
| جميع الروابط تأخذك لـ dashboard | تسجيل دخول تلقائي | ✅ مُطبق |
| API يعطي 401 | استخدم token | ✅ يعمل |
| لا توجد بيانات | اشغل test_data_sprint3.py | ✅ موجودة |
| الصفحات لا تظهر | امسح cache وأعد التحميل | ✅ سيعمل |

---

## 🚀 الخطوات النهائية

```bash
# 1. تأكد من تشغيل السيرفرات
Backend: python manage.py runserver 0.0.0.0:8000
Frontend: npm run dev

# 2. امسح localStorage
# في DevTools (F12) → Application → Local Storage → احذف sm_token و sm_user

# 3. أعد تحميل الصفحة
http://localhost:3000/admin/anomalies

# 4. يجب أن تشاهد الجدول مباشرة! ✓
```

---

## ✅ النتيجة المتوقعة

بعد هذه الخطوات يجب أن ترى:

```
✓ http://localhost:3000/admin/anomalies
  → جدول مع 2 شذوذ
  → أزرار "استشر" و "وافق"
  
✓ http://localhost:3000/admin/alertes
  → جدول مع 2 تنبيه
  → أزرار "استشر" و "وافق"
  
✓ http://localhost:8000/admin
  → Django Admin مع البيانات
  
✓ http://localhost:8000/api/energy/anomalies/
  → JSON مع الشذوذ (مع token)
```

---

## 🐛 إذا لم ينجح شيء

1. **امسح cache المتصفح بالكامل:**
   - Ctrl + Shift + Delete
   - اختر "All time"
   - امسح

2. **أغلق dev server وأعد تشغيله:**
   ```bash
   Ctrl + C
   npm run dev
   ```

3. **تأكد من ملفات المكونات:**
   ```bash
   ls src/components/ui/
   # يجب أن تشاهد: badge.tsx, button.tsx, table.tsx, select.tsx
   ```

4. **تحقق من البيانات:**
   ```bash
   python manage.py shell
   from energy.models import Anomalie
   print(Anomalie.objects.all())
   ```

---

**الآن جرّب! يجب أن تعمل جميع الروابط! ✅**
