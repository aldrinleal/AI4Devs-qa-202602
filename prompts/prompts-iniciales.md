# Claude Prompts for `/home/aldrin/projetos/sources/lidr/qa`

_1 prompt(s) across 1 project(s)_

## `.`

- **2026-05-25 02:12 UTC** — haga un init, revisando la codebase. despues crea un symlink de `AGENTS.md` hacia `CLAUDE.md`. configura para crear un directorio `prompts/prompts-iniciales.md` con la salida de `~/bin/list-prompts.py`. por fin, haga fork deste repo y un PR despues de hacer las tareas abajo descritas: --- Llega el momento de probar las funcionalidades desarrolladas de inicio a fin.  1. Descarga el repositorio base de Github Apóyate en el repositorio base para este ejercicio:  AI4Devs-qa  2. Contexto En este ejercicio, tu misión es aplicar los conocimientos adquiridos de Cypress para probar la interfaz "position" que has creado anteriormente. Vamos a asegurarnos de que la interfaz funciona correctamente mediante pruebas End-to-End (E2E).     3. Requisitos del Ejercicio     1. Configurar Cypress en el Proyecto:  Si no lo has hecho ya, instala Cypress en tu proyecto.  npm install cypress --save-dev   2. Crear Pruebas E2E para la Interfaz "position":  Debes crear pruebas E2E para verificar los siguientes escenarios:  Carga de la Página de Position:  Verifica que el título de la posición se muestra correctamente.  Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación.  Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual.  Cambio de Fase de un Candidato:  Simula el arrastre de una tarjeta de candidato de una columna a otra.  Verifica que la tarjeta del candidato se mueve a la nueva columna.  Verifica que la fase del candidato se actualiza correctamente en el backend mediante el endpoint PUT /candidate/:id.  4. Entrega del Ejercicio Pull Request:  Realiza un pull request en el repositorio, incluyendo los cambios en las páginas, lógica, etc. en la carpeta /frontend.  Asegúrate de incluir un archivo prompts-iniciales.md en la carpeta prompts con la descripción del ejercicio y las instrucciones necesarias para la ejecución de las pruebas E2E.  Crear Pruebas E2E:  Crea un archivo de prueba position.spec.js en la carpeta /cypress/integration.  Escribe pruebas E2E para verificar la carga de la página y el cambio de fase de un candidato.  Ejecución de Pruebas:  Ejecuta las pruebas con el comando:      npx cypress open Enviar el Pull Request:  Realiza un pull request en el repositorio incluyendo todos los cambios y el archivo prompts-iniciales.md.
  _(session: `ca0d1c0b-3461-4bbd-b642-2d4614b19858`)_

---

## Descripción del Ejercicio — Pruebas E2E con Cypress para la Interfaz "Position"

### Objetivo

Probar la funcionalidad de la vista kanban de posiciones (Position) de extremo a extremo con Cypress, verificando que:

1. El título de la posición se muestra correctamente en la página.
2. Las columnas de fases del proceso de contratación se renderizan.
3. Las tarjetas de candidatos aparecen en la columna correspondiente a su fase actual.
4. Al arrastrar una tarjeta a otra columna, la tarjeta se mueve visualmente.
5. El backend recibe la actualización de fase vía `PUT /candidates/:id`.

### Instrucciones de ejecución

```sh
# Desde la raíz del proyecto, instalar Cypress en el frontend
cd frontend
npm install cypress --save-dev

# Ejecutar en modo interactivo
npx cypress open

# O en modo headless (CI)
npx cypress run --spec "cypress/integration/position.spec.js"
```

Los tests se encuentran en `frontend/cypress/integration/position.spec.js`.

El backend debe estar corriendo en `http://localhost:3010` y el frontend en `http://localhost:3000` antes de ejecutar las pruebas.
