const { spawnSync } = require('child_process');

const fs = require('fs');

const path = require('path');



console.log('====================================================');

console.log('  EJECUTANDO PRUEBAS UNITARIAS Y ANÁLISIS DE COBERTURA');

console.log('====================================================\n');



// Ejecutar Jest forzando cobertura y formato JSON para análisis detallado

const result = spawnSync('npx', ['jest', '--coverage', '--coverageReporters=text', '--coverageReporters=json-summary'], {

  stdio: 'inherit',

  shell: true

});



console.log('\n====================================================');

console.log('      RESUMEN DE COBERTURA Y HALLAZGOS');

console.log('====================================================');



// Leer el resumen de cobertura generado por Jest

const summaryPath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');



if (fs.existsSync(summaryPath)) {

  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

  const total = summary.total;



  console.log('\nPORCENTAJE GLOBAL DE COBERTURA:');

  console.log(`- Líneas:    ${total.lines.pct}%`);

  console.log(`- Declaraciones: ${total.statements.pct}%`);

  console.log(`- Funciones:   ${total.functions.pct}%`);

  console.log(`- Ramas:     ${total.branches.pct}%`);



  console.log('\n--- ARCHIVOS O FUNCIONES DE src/ CON FALTA DE COBERTURA ---');

  let sinCoberturaTotal = false;



  for (const [file, metrics] of Object.entries(summary)) {

    if (file !== 'total' && (metrics.lines.pct < 100 || metrics.functions.pct < 100)) {

      sinCoberturaTotal = true;

      const relativePath = file.replace(process.cwd(), '');

      console.log(`\nArchivo: ${relativePath}`);

      console.log(` * Funciones sin cobertura: ${metrics.functions.total - metrics.functions.covered} de ${metrics.functions.total} (${metrics.functions.pct}%)`);

      console.log(` * Líneas sin cobertura:  ${metrics.lines.total - metrics.lines.covered} de ${metrics.lines.total} (${metrics.lines.pct}%)`);

    }

  }



  if (!sinCoberturaTotal) {

    console.log('Todos los archivos evaluados tienen 100% de cobertura.');

  }

} else {

  console.log('\n[AVISO] No se pudo leer coverage-summary.json. Revise la salida superior.');

}



console.log('\nEstado de salida de las pruebas:', result.status === 0 ? 'EXITOSO' : 'FALLARON PRUEBAS');

process.exit(result.status);