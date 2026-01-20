
# SN STYLE - Manual de Operaciones 🚀

Este proyecto usa dos herramientas potentes para que tu tienda sea profesional: **GitHub** (para el diseño) y **Supabase** (para los datos).

---

## 🏗️ 1. Instalación Inicial (El "Cuerpo")
Para que tu web esté online por primera vez:
1. Sube estos archivos a un repositorio en **GitHub**.
2. Conecta ese repositorio con **Vercel**.
3. Vercel te dará una dirección web (ej: `sn-style.vercel.app`).

## 🧠 2. Conexión de la Nube (La "Memoria")
Para que los cambios del panel sean permanentes y globales:
1. Crea un proyecto en [Supabase.com](https://supabase.com).
2. Ve a **Settings > API** y copia la `URL` y la `anon key`.
3. Edita el archivo `constants.tsx` en tu **GitHub** y pega esas llaves.
4. En Supabase, ve al **SQL Editor** y ejecuta el código de creación de tablas (ver abajo).

---
Force rebuild 2026-01-20 19:50


## 🛠️ ¿Dónde hago los cambios?

### A. Si quieres cambiar el DISEÑO o FUNCIONES:
*(Ejemplo: cambiar el color rojo por azul, cambiar el logo, o agregar una nueva página)*
- **¿Dónde?** En **GitHub**.
- **¿Cómo?** Editas el código y haces "Commit". Vercel actualiza la web en 1 minuto.

### B. Si quieres cambiar PRODUCTOS, PRECIOS o STOCK:
*(Ejemplo: Llegaron medias nuevas, subió el precio del algodón, o vendiste un par por fuera de la web)*
- **¿Dónde?** En el **Panel Admin** de tu propia página web.
- **¿Cómo?** Entras a tu web, vas a "Panel Admin" -> "Gestionar Productos". Al darle a "Guardar", se guarda en **Supabase** y todos los dispositivos se actualizan al instante. **¡No necesitas tocar GitHub para esto!**

---
# Cambio para forzar redeploy
rebuild at 2026-01-20 19:45


## 📝 Código SQL para Supabase (Copiar y Pegar)
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  type TEXT NOT NULL,
  gender TEXT NOT NULL,
  images TEXT[] NOT NULL,
  stock INTEGER DEFAULT 0,
  description TEXT,
  "salesCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  status TEXT DEFAULT 'pendiente'
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON products FOR ALL USING (true);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON orders FOR ALL USING (true);
```
