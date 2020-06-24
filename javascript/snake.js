//Archivo

//Definimos la configuracion de faser y hacemos la instancia de nuestro lienzo de trabajo
var juego = new Phaser.Game(768,560,Phaser.CANVAS,"snake");

//Definimos las variables para nuestros objetos, como el fondo, la serpiente, las flechas y los tamaños entre otras
var fondo, serpiente=[], manzana, m1, m2, teclas=[],direccion=1,tamano=2,escala=64/tamano, counter=0, pause=false,gameOver=false;
var puntos=0, vidas=3, texto, buttonInicio, inicio=false, level=1, vel=10, muro=[], gameov, instr;
var one= true, unave=true, dve=true;
var pos={
    32:[192],64:[192],96:[192]
}

var jugando = {
    //funcion para cargar contenido
    preload: function(){
        //Cargamos el fondo
        juego.load.image("arena","assets/blue.jpg");
        //Cargamos el cuerpo de la serpiente
        juego.load.atlas("snake-parts",'assets/snake-graphics2.png', 'assets/snake.json');
        //cargamos los muros
        juego.load.atlas("wall", "assets/muro.jpg", "assets/wall.json")
        //cargamos el boton
        juego.load.spritesheet('button', 'assets/button.png');
        //Cargamos el instructivo
        juego.load.image("inst","assets/instructivo.png");
    },
    //funcion para inicializar todo en el phaser
    create: function(){
        //inicializamos el fondo
        juego.stage.backgroundColor = "#FCD770";
        fondo = juego.add.image(juego.world.centerX, juego.world.centerY-32, 'arena').anchor.set(0.5);
        //inicializamos la serpiente
        this.dibujarManzana();
        manzana = juego.add.sprite(m1,m2, 'snake-parts', 'snake0015');
        //inicializamos la serpiente
        serpiente.push(juego.add.sprite(escala, 192, 'snake-parts', 'snake0014'));
        serpiente.push(juego.add.sprite(escala*2, 192, 'snake-parts', 'snake0001'));
        serpiente.push(juego.add.sprite(escala*3, 192, 'snake-parts', 'snake0004'));
        manzana.scale.setTo(1/tamano);
        //declaramos las teclas para usarlas posteriormente como comandos de movimiento o pausa
        teclas.push(juego.input.keyboard.addKey(Phaser.Keyboard.UP));
        teclas.push(juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT));
        teclas.push(juego.input.keyboard.addKey(Phaser.Keyboard.DOWN));
        teclas.push(juego.input.keyboard.addKey(Phaser.Keyboard.LEFT));
        teclas.push(juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR));
        teclas.push(juego.input.keyboard.addKey(Phaser.Keyboard.ENTER));
        //dibujamos los muros
        muro.push(juego.add.sprite(0, 0, 'wall', "wall000",));
        muro.push(juego.add.sprite(0, 480, 'wall', "wall000",));
        muro.push(juego.add.sprite(0, 0, 'wall', "wall001",));
        muro.push(juego.add.sprite(736, 0, 'wall', "wall001",));
        // muro.push(juego.add.sprite(384, 96, 'wall', "wall002",));
        //declaramos el physics para activa la capacidad de reconocer coliciones, bordes, gravedad, etc.
        juego.physics.startSystem(Phaser.Physics.ARCADE);
        //definimos propiedades del cuerpo de la serpiente
        for(var s of serpiente){
            s.scale.setTo(1/tamano);
            juego.physics.arcade.enable(s);
            s.body.collideWorldBounds = true;
        }
        //inicializamos los botones
        buttonInicio = juego.add.button(95, 502, 'button', this.actionOnClick, this, 2, 1, 0);
        buttonInicio.scale.setTo(0.14);
        //iniciamos el instructivo
        
        instr = juego.add.tileSprite(juego.world.centerX, juego.world.centerY-32,400,300, 'inst').anchor.set(0.5);
        //inicializamos el texto
        var style = { font: "28px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };
        texto = juego.add.text(112, 518, "  Inicio               vidas: "+vidas+"\t\t\t \t\t\tpuntos: "+puntos+"\t\t\t \t\t\tnivel: "+level, style);
    },
    //funcion loop para los estados y demas acciones despues de iniciado el juego
    update: function(){
        //counter para controlar la velocidad y tiempo de nuestra serpiente
        counter+=1;
        //instruccion para definir subida de nivel a nivel 2
        if(puntos==10 && unave){
            level+=1;
            vel-=2;
            unave=false;
            this.reload(false);
        }
        //instruccion para definir subida de nivel a nivel 3
        if(puntos==20 && dve){
            level+=1;
            vel-=3;
            dve=false;
            this.reload(false);
        }
        //instruccion de inicio, oprimido el boton de inicio cobra vida el juego
        if(inicio){
            //instruccion cuando se pierde una vida
            if(gameOver && vidas>0){
                vidas-=1;
                this.reload(false);
            //instrucion cuando se pierde el juego
            }else if(gameOver){
                if(one){
                    var style2 = { font: "bold 72px Arial", fill: "#f00", boundsAlignH: "center", boundsAlignV: "middle" };
                    gameov=juego.add.text(200, 200, "Game Over", style2);
                    gameov.visible =true;
                    gameOver=true;
                    one=false;
                }
            }
            //control de velocidad de la serpiente
            if(counter%vel==0){
                if(!gameOver){
                    if(!pause){
                        //movimiento de la serpiente controlada por las flechas
                        if(teclas[0].isDown){
                            if(direccion!=2){
                                direccion=0;
                            }
                        }else if(teclas[1].isDown){
                            if(direccion!=3){
                                direccion=1;
                            }
                        }else if(teclas[2].isDown){
                            if(direccion!=0){
                                direccion=2;
                            }
                        }else if(teclas[3].isDown){
                            if(direccion!=1){
                                direccion=3;
                            }
                        }
                        //luego que el usuario defina la direccion movemos la serpiente
                        jugando.move(direccion);
                        //revisamos si la serpiente se cruza con la manzana y la "come"
                        if(this.comio()){
                            puntos+=1;
                            this.dibujarManzana();
                            manzana.position.x=m1;
                            manzana.position.y=m2;
                            this.crecer();
                            texto.text="Reinicio               vidas: "+vidas+"\t\t\t \t\t\tpuntos: "+puntos+"\t\t\t \t\t\tnivel: "+level;
                        }
                    }
                }
            }
            //se pausa el juego
            if(teclas[4].isDown){
                pause=true;
            }
            //se resume el juego
            if(teclas[5].isDown){
                pause=false;
            }
        }
    },

    //funcion para cuando se oprime el boton de inicio/reinicio
    actionOnClick: function(){
        //cuando se oprime el boton se inicia el juego o se reinicia
        console.log(instr)
        if(!inicio){
            instr.visible=false;
            this.reload(false);
            inicio=true;
        }else{
            inicio=false;
            vidas=3;
            vel=10;
            unave=true;
            dve=true;
            level=1;
            puntos=0;
            gameOver=false;
            pos={
                32:[192],64:[192],96:[192]
            }
            serpiente=[];
            this.reload(true);
        }
    },
    //funcion para cargar un estado inicial donde se pierde una vida o se pasa de nivel
    reload: function(reini){
        //inicializamos algunas variables
        one=true;
        direccion=1;
        serpiente=[];
        gameOver=false;
        pos={
            32:[192],64:[192],96:[192]
        }
        //limpiamos el tablero recreando el fondo
        fondo = juego.add.image(juego.world.centerX, juego.world.centerY-32, 'arena').anchor.set(0.5);
        //inicializamos la manzana
        this.dibujarManzana();
        manzana = juego.add.sprite(m1,m2, 'snake-parts', 'snake0015');
        manzana.scale.setTo(1/tamano);
        //inicializamos la serpiente
        serpiente.push(juego.add.sprite(escala, 192, 'snake-parts', 'snake0014'));
        serpiente.push(juego.add.sprite(escala*2, 192, 'snake-parts', 'snake0001'));
        serpiente.push(juego.add.sprite(escala*3, 192, 'snake-parts', 'snake0004'));
        for(var s of serpiente){
            s.scale.setTo(1/tamano);
            juego.physics.arcade.enable(s);
            s.body.collideWorldBounds = true;
        }
        //inializamos el muro
        muro.push(juego.add.sprite(0, 0, 'wall', "wall000",));
        muro.push(juego.add.sprite(0, 480, 'wall', "wall000",));
        muro.push(juego.add.sprite(0, 0, 'wall', "wall001",));
        muro.push(juego.add.sprite(736, 0, 'wall', "wall001",));
        if(reini){
            texto.text="  Inicio               vidas: "+vidas+"\t\t\t \t\t\tpuntos: "+puntos+"\t\t\t \t\t\tnivel: "+level;
        }else{
            texto.text="Reinicio               vidas: "+vidas+"\t\t\t \t\t\tpuntos: "+puntos+"\t\t\t \t\t\tnivel: "+level;
        }
    },
    
    //Funcion para mover la serpiente
    move: function(dir){
        //segun la direccion ubicamos la cabeza si esta dentro de los limites, movemos el cuerpo y dibujamos
        if(dir==0 && serpiente[serpiente.length-1].position.y-escala>0){
            this.moveBody();
            serpiente[serpiente.length-1].position.y -=escala;
            jugando.redibujar();
        }else if(dir==1 && serpiente[serpiente.length-1].position.x+escala<736){
            this.moveBody();
            serpiente[serpiente.length-1].position.x +=escala;
            jugando.redibujar();
        }else if(dir==2 && serpiente[serpiente.length-1].position.y+escala<480){
            this.moveBody();
            serpiente[serpiente.length-1].position.y +=escala;
            jugando.redibujar();
        }else if(dir==3 && serpiente[serpiente.length-1].position.x-escala>0){
            this.moveBody();
            serpiente[serpiente.length-1].position.x -=escala;
            jugando.redibujar();
        }else{
            //en caso de colision perdemos una vida o quizas el juego
            gameOver=true;
        }
        //verificamos que la serpiente no se coma una parte del cuerpo
        for(var p=0;p<serpiente.length-1;p+=1){
            if(serpiente[p].position.x==serpiente[serpiente.length-1].position.x && serpiente[p].position.y==serpiente[serpiente.length-1].position.y){
                gameOver=true;
            }
        }
    },
    //funcion para mover el cuerpo de la serpiente
    moveBody: function(){
        pos[serpiente[0].position.x] = pos[serpiente[0].position.x].filter(function(value, index, arr){ 
            return value != serpiente[0].position.y;
        });
        for (var part=0; part<serpiente.length-1;part+=1) {
            serpiente[part].position.x = serpiente[part+1].position.x;
            serpiente[part].position.y = serpiente[part+1].position.y;
        }
    },
    //funcion para dibujar la serpiente una vez ya se haya movido
    redibujar: function(){
        //redibujamos la cabeza
        if(direccion==0){
            serpiente[serpiente.length-1].loadTexture('snake-parts', 'snake0003');
            if(pos[serpiente[serpiente.length-1].position.x]==undefined)
            pos[serpiente[serpiente.length-1].position.x]=[]
            pos[serpiente[serpiente.length-1].position.x].push(serpiente[serpiente.length-1].position.y);
        }else if(direccion==1){
            serpiente[serpiente.length-1].loadTexture('snake-parts', 'snake0004');
            if(pos[serpiente[serpiente.length-1].position.x]==undefined)
            pos[serpiente[serpiente.length-1].position.x]=[]
            pos[serpiente[serpiente.length-1].position.x].push(serpiente[serpiente.length-1].position.y);
        }else if(direccion==2){
            serpiente[serpiente.length-1].loadTexture('snake-parts', 'snake0009');
            if(pos[serpiente[serpiente.length-1].position.x]==undefined)
            pos[serpiente[serpiente.length-1].position.x]=[]
            pos[serpiente[serpiente.length-1].position.x].push(serpiente[serpiente.length-1].position.y);
        }else if(direccion==3){
            serpiente[serpiente.length-1].loadTexture('snake-parts', 'snake0008');
            if(pos[serpiente[serpiente.length-1].position.x]==undefined)
            pos[serpiente[serpiente.length-1].position.x]=[]
            pos[serpiente[serpiente.length-1].position.x].push(serpiente[serpiente.length-1].position.y);
        }
        for (var part=0; part<serpiente.length-1;part+=1) {
            //redibujamos la cola
            if(part==0){
                if(serpiente[part+1].position.x<serpiente[part].position.x)
                serpiente[part].loadTexture('snake-parts', 'snake0018');
                else if(serpiente[part+1].position.x>serpiente[part].position.x)
                serpiente[part].loadTexture('snake-parts', 'snake0014');
                else if(serpiente[part+1].position.y<serpiente[part].position.y)
                serpiente[part].loadTexture('snake-parts', 'snake0013');
                else if(serpiente[part+1].position.y>serpiente[part].position.y)
                serpiente[part].loadTexture('snake-parts', 'snake0019');
            }else{
                //redubijamos el cuerpo
                if(serpiente[part+1].position.x==serpiente[part].position.x && serpiente[part-1].position.x==serpiente[part].position.x)
                serpiente[part].loadTexture('snake-parts', 'snake0007');
                else if(serpiente[part+1].position.y==serpiente[part].position.y && serpiente[part-1].position.y==serpiente[part].position.y)
                serpiente[part].loadTexture('snake-parts', 'snake0001');
                else if((serpiente[part+1].position.x<serpiente[part-1].position.x && serpiente[part+1].position.y<serpiente[part-1].position.y) || (serpiente[part+1].position.x>serpiente[part-1].position.x && serpiente[part+1].position.y>serpiente[part-1].position.y)){
                    if(serpiente[part+1].position.x<serpiente[part].position.x || serpiente[part-1].position.x<serpiente[part].position.x)
                    serpiente[part].loadTexture('snake-parts', 'snake0002');
                    else if(serpiente[part+1].position.y>serpiente[part].position.y || serpiente[part-1].position.y>serpiente[part].position.y){
                        serpiente[part].loadTexture('snake-parts', 'snake0002');
                    }else{
                        serpiente[part].loadTexture('snake-parts', 'snake0005');
                    }
                }else{
                    if(serpiente[part+1].position.x<serpiente[part].position.x || serpiente[part-1].position.x<serpiente[part].position.x)
                    serpiente[part].loadTexture('snake-parts', 'snake0012');
                    else serpiente[part].loadTexture('snake-parts', 'snake0000');
                }
            }
        }
    },

    //funcion para verificar si la serpiente se comio la manzana
    comio: function(){
        if(serpiente[serpiente.length-1].position.x==manzana.position.x && serpiente[serpiente.length-1].position.y==manzana.position.y)
        return true;
        else return false;
    },
    //funcion para dibujar la manzana una vez comida
    dibujarManzana:function(){
        m1=escala*Math.floor(Math.random()*704/escala)+32;
        m2=escala*Math.floor(Math.random()*448/escala)+32;
        var out=false;
        //dependiendo del lugar de la serpiente dibujamos una nueva manzana
        while(pos[m1]!=undefined && !out){
            if(pos[m1].length){
                m1=escala*Math.floor(Math.random()*704/escala)+32;
                m2=escala*Math.floor(Math.random()*448/escala)+32;
            }else{
                out=true;
            }
        }
    },
    //funcion para hacer crecer a la serpiente una vez comió
    crecer: function(){
        serpiente.splice(0,0,juego.add.sprite(serpiente[1].position.x, serpiente[1].position.y));
        serpiente[0].scale.setTo(1/tamano);
        juego.physics.arcade.enable(serpiente[0]);
        serpiente[0].body.collideWorldBounds = true;
    }
}

juego.state.add("activo", jugando);
juego.state.start("activo");