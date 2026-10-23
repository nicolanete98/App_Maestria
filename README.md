# Territoria — prototipo académico

Aplicación frontend en HTML, CSS y JavaScript para explorar un modelo de eficacia territorial del emprendimiento femenino en Medellín (2016–2025).

## Archivos
- `index.html`: estructura de la aplicación.
- `styles.css`: estilos responsive.
- `app.js`: interacción, gráficos, simulador, plantilla e importación CSV.

## Ejecutar
Abre `index.html` en un navegador moderno. Chart.js se carga desde CDN, por lo que los gráficos requieren conexión a internet. El resto de la interfaz y el simulador funcionan localmente.

## Importante sobre los datos
- La serie histórica ficticia fue sustituida por una gráfica de distribución EMICRON 2024 basada en las cifras oficiales incorporadas. Los territorios aparecen como N/D, sin puntuaciones ficticias.
- El panel de probabilidad se mantiene como `N/D` porque no se ha estimado ni validado un modelo con microdatos observados.
- La importación CSV valida el formato básico, pero no reentrena un modelo estadístico ni verifica por sí sola la fuente.
- El índice del simulador es un promedio ponderado ilustrativo; las ponderaciones deben justificarse y validarse en el trabajo académico.
- La plantilla CSV requiere: `year`, `territory`, `indicator`, `value`, `source`. Puede incluir también `unit`, `numerator`, `denominator`, `quality_status`.
- No se incluyen datos personales. Antes de incorporar microdatos, anonimizar y revisar autorizaciones y protección de datos.

## Publicación
Puedes subir los tres archivos a GitHub Pages, Netlify o cualquier hosting estático. Para un modelo probabilístico real se necesitará una capa de datos/backend o ejecutar la estimación en un proceso estadístico validado.

## Datos oficiales incorporados en esta versión
- DANE, EMICRON 2024: en Medellín A.M., 93,4% de micronegocios fueron creados por una sola persona; 6,4% por la persona encuestada junto con otras personas; 0,3% por otra categoría. Por redondeo, la suma puede no ser exactamente 100%.
- Alcaldía de Medellín, informe de gestión 2022: reportó 22.746 créditos a mujeres emprendedoras entre enero 1 y agosto 31 de 2022, por más de COP $16.244 millones. La cifra corresponde a créditos, no necesariamente a mujeres únicas.
- DANE, EMICRON 2025: Medellín A.M. representó 20,5% del valor agregado de los micronegocios en el conjunto de 24 ciudades y áreas metropolitanas. No es una cifra exclusiva de negocios de mujeres.
- La página oficial de DANE EMICRON 2025 también reporta que Medellín A.M. representó 17,7% de los ingresos nominales de los micronegocios de las 24 ciudades y áreas metropolitanas.
- Las puntuaciones por comuna/corregimiento se muestran como N/D en lugar de fabricar valores. Las cifras EMICRON son agregadas a nivel de Medellín A.M. y no se deben extrapolar a las 21 unidades territoriales.

Fuentes oficiales enlazadas en la interfaz:
- DANE EMICRON 2024: https://www.dane.gov.co/files/operaciones/EMICRON/pres-EMICRON-2024.pdf
- DANE EMICRON: https://www.dane.gov.co/index.php/estadisticas-por-tema/mercado-laboral/micronegocios
- Alcaldía de Medellín, informe final de gestión 2022: https://www.medellin.gov.co/es/wp-content/uploads/2022/11/0-Informe-Final-de-Gestion-Anexo-170008523364.pdf
- Mapa de estructura empresarial por comuna: https://www.medellin.gov.co/es/secretaria-desarrollo-economico/observatorio-de-desarrollo-economico/visores-de-datos/mapas/mapa-de-estructura-empresarial/
- Cifras por comuna y corregimiento: https://www.medellin.gov.co/es/centro-documental/cifras-y-estadisticas-por-comuna-y-corregimiento/

## Cálculos derivados de las cifras oficiales
- Crédito promedio mínimo: COP $16.244.000.000 / 22.746 créditos = más de COP $714.148 por crédito. El resultado es un límite inferior aproximado porque la fuente reporta “más de $16.244 millones”.
- Relación de categorías EMICRON: 93,4% / 6,4% = aproximadamente 14,6 veces.
- La probabilidad de supervivencia se mantiene como N/D: estas cifras agregadas no contienen los resultados individuales de continuidad/cierre necesarios para estimar y validar una probabilidad. El simulador de ocho dimensiones sigue siendo un escenario ilustrativo, separado de los cálculos oficiales.


Actualización de interfaz: se eliminó el panel de filtros territoriales porque no alteraba la gráfica oficial agregada. El gráfico de DANE EMICRON 2024 se presenta como referencia fija; el gráfico radial sí responde a los controles del simulador.
