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
  
  var draggables = document.querySelectorAll(".draggable");
  [].forEach.call(draggables, function (draggable, indice) {
    new Draggable(draggable);
  });