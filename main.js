import './style.css'
import Split from 'split-grid';
import { encode, decode } from 'js-base64';

import { expect } from 'chai'


import * as monaco from 'monaco-editor';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'



window.MonacoEnvironment = {
   getWorker(_, label){
      if (label === 'html') return new HtmlWorker()
      if (label === 'css') return new CssWorker()
      if (label === 'javascript') return new JsWorker()
   }
}



const $ = selector => document.querySelector(selector);

Split({
      columnGutters: [{
      track: 1,
      element: document.querySelector('.vertical-gutter'),
   }],
   rowGutters: [{
      track: 1,
      element: document.querySelector('.horizontal-gutter'),
   }]
})

const $js = $('#js')
const $css = $('#css')
const $html = $('#html')

const { pathname } = window.location 

const [ rawHtml, rawCss, rawJs ] = pathname.slice(1).split('%7C')

const html = rawHtml ? decode(rawHtml) : ''
const css = rawCss ? decode(rawCss) : ''
const js = rawJs ? decode(rawJs) : ''


const COMMON_EDITOR_OPTIONS = {
   automaticLayout: true,
   fontSize: 19,
   fixedOverride: true,
   scrollBeyondLastLine: false,
   roundedSelection: false,
   padding:{
      top: 16
   },
   lineNumbers: 'off',
   minimap: {
      enabled: false
   },
   theme: 'vs-dark'
}


const htmlEditor = monaco.editor.create($html, {
   value: html,
   language: 'html',
   ...COMMON_EDITOR_OPTIONS
})

const cssEditor = monaco.editor.create($css, {
   value: css,
   language: 'css',
   ...COMMON_EDITOR_OPTIONS
})

const jsEditor = monaco.editor.create($js, {
   value: js,
   language: 'javascript',
   ...COMMON_EDITOR_OPTIONS
})


htmlEditor.onDidChangeModelContent(update)
cssEditor.onDidChangeModelContent(update)
jsEditor.onDidChangeModelContent(update)



const htmlForPreview = createHtml({html, js, css})
   $('iframe').setAttribute('srcdoc', htmlForPreview)



function update (){
   const html = htmlEditor.getValue()
   const css = cssEditor.getValue()
   const js = jsEditor.getValue()

   const hashedCode = `${encode(html)}|${encode(css)}|${encode(js)}`
   console.log(hashedCode)

   window.history.replaceState(null, null, `/${hashedCode}`)
   
   const htmlForPreview = createHtml({html, js, css})
   $('iframe').setAttribute('srcdoc', htmlForPreview)
}

describe('htmlForPreview', () => {
   it('should have a main.js', () => {
      expect(htmlForPreview(1)).toBe(true)
   })
})


function createHtml ({html, js, css}){
   
   return `
      <!DOCTYPE html>
         <html lang="en">
            <head>
               <style>
                  ${css}
               </style>   
            </head>
            <body>
               ${html}
            <script>
               ${js}
            </script>
            </body>
         </html>          
   `
}

/*
   ENCODE Y DECODE son de la libreria base 64 de js la cual nos permite codificar 
   y decodificar un string en base 64 de js

   Split es una libreria que nos permite dividir un elemento en 2 partes 
   vertical y horizontal es el encargado de hacer la divicion de la pantalla

   La libreria Monaco editor nos perimite crear un editor de codigo
   en este caso el editor de html, css y js 

   onDidChangeModelContent es un evento que se dispara cuando el contenido del editor cambia
   update es una funcion que actualiza el contenido del iframe

   function update () es una funcion que actualiza el contenido del iframe
   createHtml es una funcion que crea el html para el iframe
   htmlForPreview es el html que se va a mostrar en el iframe

   Los workers se encargan de ejecutar el codigo de javascript 
   es basicamente poder ejecutar en otro hilos el codigo de js
   lo que ase es recuperar menajes como eventos de los hilos de javascript
   *https://developer.mozilla.org/es/docs/Web/API/Web_Workers_API/Using_web_workers

*/