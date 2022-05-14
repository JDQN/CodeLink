import './style.css'
import Split from 'split-grid'
import { encode, decode } from 'js-base64';


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



const $html = $('#html')
const $js = $('#js')
const $css = $('#css')


$html.addEventListener('input', update)
$js.addEventListener('input', update)
$css.addEventListener('input', update)


function init() {
   const { pathname } = window.location

   const [ rawHtml, rawCss, rawJs ] = pathname.slice(1).split('/&7C')

   const html = encode(rawHtml)
   const css = encode(rawCss)
   const js = encode(rawJs)

   $html.value = html
   $css.value = css
   $js.value = js
}


function update (){
   const html = $html.value
   const js = $js.value
   const css = $css.value

   const hashedCode = `${encode(html)}|${encode(js)}|${encode(css)}`

   window.history.replaceState(null, null, `/${hashedCode}`)
   

   const htmlForPreview = createHtml({html, js, css})
   $('iframe').setAttribute('srcdoc', htmlForPreview)
}


const createHtml = ({html, js, css}) => {
   
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

init()