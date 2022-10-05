//refatorar para varios arquivos

var mouse = 'mover'
var fluxograma = []
var figuraInicio = 'nenhuma'

//funcoes menu
function ativarAdicionar(){
  this.mouse = 'mover'
  zerarAssociacoes()

}

function ativarRemover(){
   this.mouse = 'remover'
   zerarAssociacoes()

}

function ativarAssociar(){
  this.mouse = 'associar'
  zerarAssociacoes()

}

function getMouseStatus(){
   return this.mouse
}

function zerarAssociacoes(){
   figuraInicio = 'nenhuma'
}

//regras de negocio
function impedirDuplicarInicio(){
  var inicio = document.getElementsByClassName("inicio")
  if(inicio.length > 0){
    return true
  }
  return false
}

function impedirDuplicarFim(){
  var inicio = document.getElementsByClassName("fim")
  if(inicio.length > 0){
    return true
  }
  return false
}

//funcoes linha
function criarLinha(elemento1, elemento2){
  var line = document.createElement("div")
  line.classList.add("ligacao")
  var area = document.getElementById("areaFiguras")
  area.appendChild(line)
  ajustarLinha(elemento1, elemento2, line)
  return line
}

function ajustarLinha(from, to, line){

  var fT = from.offsetTop  + from.offsetHeight/2;
  var tT = to.offsetTop    + to.offsetHeight/2;
  var fL = from.offsetLeft + from.offsetWidth/2;
  var tL = to.offsetLeft   + to.offsetWidth/2;
  
  var CA   = Math.abs(tT - fT);
  var CO   = Math.abs(tL - fL);
  var H    = Math.sqrt(CA*CA + CO*CO);
  var ANG  = 180 / Math.PI * Math.acos( CA/H );

  if(tT > fT){
      var top  = (tT-fT)/2 + fT;
  }else{
      var top  = (fT-tT)/2 + tT;
  }
  if(tL > fL){
      var left = (tL-fL)/2 + fL;
  }else{
      var left = (fL-tL)/2 + tL;
  }

  if(( fT < tT && fL < tL) || ( tT < fT && tL < fL) || (fT > tT && fL > tL) || (tT > fT && tL > fL)){
    ANG *= -1;
  }
  top-= H/2;

  line.style["-webkit-transform"] = 'rotate('+ ANG +'deg)';
  line.style["-moz-transform"] = 'rotate('+ ANG +'deg)';
  line.style["-ms-transform"] = 'rotate('+ ANG +'deg)';
  line.style["-o-transform"] = 'rotate('+ ANG +'deg)';
  line.style["-transform"] = 'rotate('+ ANG +'deg)';
  line.style.top    = top+'px';
  line.style.left   = left+'px';
  line.style.height = H + 'px';
}

//eventos figuras
function clickElemento(elemento){

  var Evento = function (elemento) {
     var that = this
     this.elemento = elemento
     this.elemento.addEventListener("click", function (event) { that.onClick(event) })
  }

  Evento.prototype.onClick = function (event){
    //evento de remover
    if (getMouseStatus() == 'remover'){
      var area = document.getElementById("areaFiguras")
      area.removeChild(this.elemento)
      fluxograma.forEach( element => {
        if(element.figuraDoInicio == this.elemento || element.figuraDoFim == this.elemento){
          area.removeChild(element.linha)
        }
      }) 
      fluxograma = fluxograma.filter( (element) => element.figuraDoInicio != this.elemento && element.figuraDoFim != this.elemento)
    }
    //evento de associar
    if(getMouseStatus() == 'associar'){
      if(figuraInicio == 'nenhuma'){
        figuraInicio = elemento
      }else if(figuraInicio != elemento){
        linha = criarLinha(figuraInicio, elemento)
        fluxograma[fluxograma.length] = {figuraDoInicio: figuraInicio, figuraDoFim: elemento, linha: linha}
        figuraInicio = 'nenhuma'
        console.log(fluxograma)
      }
    }

  }

  new Evento(elemento)
}

function moverElemento(elemento){
    var Draggable = function (elemento) {
      var that = this;
      this.elemento = elemento;
      this.posX = 0;
      this.posY = 0;
      this.top = 0;
      this.left = 0;
      
      this.refMouseUp = function (event) {
        that.onMouseUp(event);
      }
    
      this.refMouseMove = function (event) {
        that.onMouseMove(event);
      }
    
      this.elemento.addEventListener("mousedown", function (event) {
        that.onMouseDown(event);
      });
    }
    
    Draggable.prototype.onMouseDown = function (event) {
      this.posX = event.x;
      this.posY = event.y;
    
      this.elemento.classList.add("dragging");
      window.addEventListener("mousemove", this.refMouseMove);  
      window.addEventListener("mouseup", this.refMouseUp);  
    }
    
    Draggable.prototype.onMouseMove = function (event) {
      var diffX = event.x - this.posX;
      var diffY = event.y - this.posY;
      this.elemento.style.top = (this.top + diffY) + "px";
      this.elemento.style.left = (this.left + diffX) + "px";

      associacoes = fluxograma.filter((element) => element.figuraDoInicio == elemento || element.figuraDoFim == elemento)
      if(associacoes.length > 0){
        associacoes.forEach(element => {
          ajustarLinha(element.figuraDoInicio, element.figuraDoFim, element.linha)
        });
      }
      
    }
    
    Draggable.prototype.onMouseUp = function (event) {
      this.top = parseInt(this.elemento.style.top.replace(/\D/g, '')) || 0;
      this.left = parseInt(this.elemento.style.left.replace(/\D/g, '')) || 0;
      this.elemento.classList.remove("dragging");
      window.removeEventListener("mousemove", this.refMouseMove); 
      window.removeEventListener("mouseup", this.refMouseUp);  
    }
    
    new Draggable(elemento);
  }
  
//criar figuras

function ligarFuncoesFigura(figura){
  moverElemento(figura)
  clickElemento(figura)
}

function novaFigura(){
  var div = document.createElement("div")
  div.classList.add("draggable")
  return div
}

function novoElemento(div){
    var area = document.getElementById("areaFiguras")
    area.appendChild(div)
    ligarFuncoesFigura(div)
}

function novoInicio(){
  let bloquear = impedirDuplicarInicio()
  if(bloquear){
    alert('Permitido apenas um inicio no fluxograma.')
    return
  }
  div = novaFigura()
  div.classList.add("inicio")
  novoElemento(div)
}

function novoFim(){
  let bloquear = impedirDuplicarFim()
  if(bloquear){
    alert('Permitido apenas um fim no fluxograma.')
    return
  }
  div = novaFigura()
  div.classList.add("fim")
  novoElemento(div)
}

function novoEntrada(){
  div = novaFigura()
  div.classList.add("entrada")
  novoElemento(div)
}

function novoSaida(){
  div = novaFigura()
  div.classList.add("saida")
  novoElemento(div)
}

function novoDecisao(){
  div = novaFigura()
  div.classList.add("decisao")
  novoElemento(div)
}

function novoProcessamento(){
  div = novaFigura()
  div.classList.add("processamento")
  novoElemento(div)
}


