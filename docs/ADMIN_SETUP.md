# 👨‍💼 Configuración para Administradores

## Panel de Control para Monitorear Analytics

---

## 📊 Google Analytics - Dashboard Recomendado

### Crear un Dashboard Personalizado

1. Ve a [Google Analytics](https://analytics.google.com)
2. Selecciona tu propiedad de **Tecnocarton**
3. Haz clic en **+** → **Crear nuevo dashboard**
4. Dale un nombre: **"Tecnocarton - KPIs Principales"**

### Widgets Recomendados

#### 1. Usuarios Activos (Tiempo Real)
- Métrica: Usuarios activos en tiempo real
- Actualización: 1 minuto
- Objetivo: Ver visitantes en vivo

#### 2. Eventos de Cotización
- Evento: `cotizacion_solicitada`
- Rango: Últimos 7 días
- Desglose: Por tipo de producto

#### 3. Eventos de Postulación
- Evento: `postulacion_enviada`
- Rango: Últimos 7 días
- Desglose: Por posición

#### 4. Formularios de Contacto
- Evento: `formulario_contacto`
- Rango: Últimos 7 días
- Desglose: Por tipo

#### 5. Páginas Más Visitadas
- Métrica: Vistas de página
- Dimensión: Página
- Orden: Mayor a menor

---

## 🎯 Configurar Conversiones

Las conversiones te ayudan a medir objetivos de negocio:

### Paso 1: Crear Conversión de Cotización

1. Ve a **Administración** → **Conversiones** (o **Eventos** → **Marcar como conversión**)
2. Selecciona el evento: `cotizacion_solicitada`
3. Nombre: **"Cotización Solicitada"**
4. Valor de conversión: `1`
5. Guardar

### Paso 2: Crear Conversión de Postulación

1. Ve a **Administración** → **Conversiones**
2. Selecciona el evento: `postulacion_enviada`
3. Nombre: **"Postulación Enviada"**
4. Valor de conversión: `1`
5. Guardar

### Paso 3: Crear Conversión de Contacto

1. Ve a **Administración** → **Conversiones**
2. Selecciona el evento: `formulario_contacto`
3. Nombre: **"Formulario de Contacto"**
4. Valor de conversión: `1`
5. Guardar

---

## 📧 Alertas y Notificaciones

### Configurar Alerta de Cambio Anómalo

1. Ve a **Administración** → **Alertas personalizadas**
2. Haz clic en **+ Crear alerta**
3. Configuración:
   - **Nombre**: "Aumento de Cotizaciones"
   - **Métrica**: Cotización Solicitada
   - **Tipo de alerta**: Cambio anómalo o Cambio de umbral
   - **Umbral**: Si el evento sube más de 50% en un día
   - **Notificación**: Tu correo

---

## 🔗 Google Tag Manager - Monitoreo

### Verificar Tag Manager

1. Ve a [Google Tag Manager](https://tagmanager.google.com)
2. Selecciona tu contenedor: **GTM-W5VXBNHX**
3. Haz clic en **Resumen** → **Etiquetas**
4. Verifica que el estado sea ✅ **Funcionando**

### Vista Previa en Tiempo Real

1. Haz clic en **Vista previa**
2. Ingresa la URL de tu sitio: `https://tecnocarton.cl`
3. Abre el sitio en una nueva pestaña
4. Deberías ver los eventos en tiempo real en el panel

---

## 📱 Móvil: Google Analytics App

### Descargar

1. App Store / Google Play
2. Busca **"Google Analytics"**
3. Instala la app oficial de Google

### Configurar

1. Abre la app
2. Inicia sesión con tu cuenta de Google
3. Selecciona la propiedad **Tecnocarton**
4. Fija el dashboard en favoritos

### Beneficios

- Recibe notificaciones en tiempo real
- Accede a datos desde cualquier lugar
- Monitorea conversiones sobre la marcha

---

## 📈 Informes Recomendados

### Informe Semanal

Crea un informe que se envíe cada lunes:

1. Ve a **Informes** → **Compartir**
2. Crea un nuevo informe con:
   - Usuarios únicos
   - Sesiones
   - Tasa de rebote
   - Conversiones por tipo

### Informe Mensual

Para resumen ejecutivo:

1. Crea un informe con:
   - Usuarios nuevos vs. recurrentes
   - Tasa de conversión
   - Productos más consultados
   - Fuentes de tráfico

---

## 🔒 Gestión de Acceso

### Agregar Colaboradores

1. Ve a **Administración**
2. Selecciona tu propiedad
3. Haz clic en **Acceso y administración**
4. Haz clic en **+** para agregar usuario
5. Selecciona el rol:
   - **Administrador**: Acceso completo
   - **Editor**: Puede hacer cambios
   - **Analista**: Solo lectura
   - **Visitante**: Ver datos específicos

---

## 🎓 Capacitación del Equipo

### Guía para el Equipo de Ventas

**Objetivo**: Entender qué productos se consultan más

1. Ve a **Eventos** → `cotizacion_solicitada`
2. Mira el parámetro `product_type`
3. Identifica tendencias

**Acción**: Enfoca tu estrategia en productos populares

### Guía para el Equipo de RRHH

**Objetivo**: Monitorear postulaciones

1. Ve a **Eventos** → `postulacion_enviada`
2. Mira el parámetro `position`
3. Identifica posiciones con más interés

**Acción**: Focaliza reclutamiento donde hay más demanda

### Guía para Ejecutivos

**Objetivo**: KPIs de negocio

1. Ve a tu **Dashboard personalizado**
2. Revisa números de conversión
3. Toma decisiones basadas en datos

---

## 🔍 Debugging

### Verificar que los Eventos se Registran

1. Abre [Google Analytics](https://analytics.google.com)
2. Ve a **Informes** → **Tiempo real** → **Eventos**
3. Realiza una acción en tu sitio (ej: solicitar cotización)
4. En 1-2 segundos deberías verlo en tiempo real

### Si no ves eventos

1. Verifica que `.env.local` esté actualizado
2. Revisa la consola del navegador (F12) para errores
3. Espera 24 horas para que GA4 procese datos históricos

---

## 📊 Análisis Predictivos (Opcional)

Google Analytics incluye predicciones automáticas:

1. Ve a **Informes** → **Predicciones**
2. Google Analytics predice:
   - Usuarios que pueden abandonar
   - Usuarios probables de convertir
   - Valor potencial de usuarios

### Acción Recomendada

Usa estas predicciones para:
- Retargetear usuarios en riesgo
- Priorizar leads más valiosos

---

## 🎯 Objetivos Trimestrales

### Q1 2025

- [ ] Aumentar cotizaciones en 25%
- [ ] Recibir 15 postulaciones cualificadas
- [ ] 500+ contactos por formulario

### Q2 2025

- [ ] Analizar productos más consultados
- [ ] Optimizar tasa de conversión
- [ ] Implementar retargeting

---

## 📞 Soporte y Recursos

| Tema | Recurso |
|------|---------|
| Analytics | https://support.google.com/analytics |
| GTM | https://support.google.com/tagmanager |
| Firebase | https://firebase.google.com/docs |
| Comunidad | https://support.google.com/analytics/community |

---

**Próxima revisión**: [Consulta la guía técnica](./FIREBASE_SETUP.md)

¡Listo para gestionar datos! 📊
