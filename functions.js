var mouse = 'mover'


function ativarAdicionar(){
  this.mouse = 'mover'

}

function ativarRemover(){
   this.mouse = 'remover'

}

function getMouseStatus(){
   return this.mouse
}

function ligarFuncoesFigura(figura){
  moverElemento(figura)
  removerElemento(figura)
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
  div = novaFigura()
  div.classList.add("inicio")
  novoElemento(div)
}

function novoFim(){
  div = novaFigura()
  div.classList.add("fim")
  novoElemento(div)
}

function novoEntrada(){
  div = novaFigura()
  div.classList.add("entrada")
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

function removerElemento(elemento){

  var Remove = function (elemento) {
     var that = this
     this.elemento = elemento
     this.elemento.addEventListener("click", function (event) { that.onClick(event) })
  }

  Remove.prototype.onClick = function (event){
    if (getMouseStatus() == 'remover'){
      var area = document.getElementById("areaFiguras")
      area.removeChild(this.elemento)
    }

  }

  new Remove(elemento)
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
  