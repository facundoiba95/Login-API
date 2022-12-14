/**
 Los arrays de usuarios fueron creados dentro de las funciones para evitar mostrar informacion en inspector de Google
 En la funcion requestApi, se hace un fetch tipo GET la API para traer los usuarios creados en la funcion addNewUser

 */
//variables de login
const user = document.querySelector('.user') //compartida en userProfile
const password = document.querySelector('.password') //compartida en userProfile
const linkCreateUser = document.querySelector('.link-createUser')
const form_login = document.getElementById('form_login')

/* variables de newUser*/
const form_newUser = document.getElementById('form_newUser')
const container_login = document.querySelector('.container-login')
const container_newUser = document.querySelector('.container-newUser')
const message_newUser = document.querySelector('.message-newUser')
const newUser__password = document.querySelector('.newUser__password')
const newUser__repeatPassword = document.querySelector('.newUser__repeatPassword')
const message_password= document.querySelector('.message-password')
const newUSer__username = document.querySelector('.newUser__username')
const newUser__email = document.querySelector('.newUser__email')
const message_okay = document.querySelector('.message-okay')
const message_fail = document.querySelector('.message-fail')
const btnSubmitNewUser = document.querySelector('.newUser__submit')
const irAinicio = document.querySelector('.irAinicio')

// variables de userProfile
const container_userProfile = document.querySelector('.container-userProfile');

//VARIABLES PARA INDICAR EL TIEMPO ACTUAL 
let fecha = new Date();
let fechadeAltaUsuario = new Date().toLocaleString(undefined,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric',minute:'numeric', second:'numeric' })

/////////////////



// FUNCIONES PARA NEWUSER !!!!
const message = document.querySelector('.message-error')
//Array donde se guardan los usuarios nuevos y ya registrados


//TIMERS para ocultar mensajes de alerta !
const message_passwordTimmer = () => {
    newUser__password.style.border="2px solid red"
    newUser__repeatPassword.style.border="2px solid red"
    setTimeout(()=>{
        message_password.style.display="none";
    },3000)
}
const message_userOkayTimmer =()=> {
    setTimeout(()=> {
        message_okay.style.display="none";
        form_newUser.reset()
    },3000)
    
}
const message_failTimmer =()=> {
    setTimeout(()=>{
        message_fail.style.display="none";
        form_newUser.reset()
    },3000)
}
const mostrarLogindesdeNewUser =()=>{
    container_newUser.style.display = "none"
    container_login.style.display = "flex";
    message_newUser.style.display="none"
}


//VALIDACIONES de Password, si se validan, retorna la contrase??a validada.
const validarPassword = e => {
    const passwordValue = newUser__password.value.trim();
    const repeatPasswordValue = newUser__repeatPassword.value.trim();
    const lowerCase = /[a-z]/g;
    const upperCase = /[A-Z]/g;
    const number = /[0-9]/g;
    const symbol = /[.*+\-?^${}()|[\]\\_@]/g;

    if(passwordValue == ''){
        message_password.innerHTML = 'El campo esta vacio !'
        message_passwordTimmer()
        return false;
    }
    if(!passwordValue.match(lowerCase)){
               message_password.innerHTML = 'Debe ingresar minuscula';
               message_passwordTimmer();
               message_password.style.display="block";
               return false;
            } else if(!passwordValue.match(upperCase)){
                message_password.innerHTML = 'Debe ingresar mayuscula';
                message_passwordTimmer();
                message_password.style.display="block";
                return false;
            } else if(!passwordValue.match(number)){
                message_password.innerHTML = 'Debe ingresar numero'
                message_passwordTimmer();
                message_password.style.display="block";
                return false;
            } else if(!passwordValue.match(symbol)){
                message_password.innerHTML = 'Debe ingresar simbolo'
                message_passwordTimmer();
                message_password.style.display="block";
                return false;
            } else if(passwordValue !== repeatPasswordValue){
                message_password.textContent= "Las contrase??as no coinciden! Porfavor, verif??calas.";
                message_passwordTimmer();
                message_password.style.display="block";
                return false;
            }else {
                message_okay.style.color="rgb(47, 255, 54)";
                message_okay.textContent= "Usuario creado correctamente!"
                message_userOkayTimmer();
                message_okay.style.display="block";
                return passwordValue;
            }

}

//FUNCION PARA AGREGAR NUEVO USUARIO
const addNewUser = async e => {
    e.preventDefault();
    let nuevoUser = [];

    const passwordValue= newUser__password.value.trim();
    const usernameValue = newUSer__username.value.trim()
    const emailValue = newUser__email.value.trim();
    const usuarios = await requestApi();
    
//la validacion se hace con la API, ya que si es con el local no todos los dispositivos podran hacer la validacion.
     if(!usuarios.length){
        if(!validarPassword(e)=== false){
                nuevoUser = JSON.stringify([... nuevoUser,{id: nuevoUser.length +1, username: usernameValue, password:passwordValue, email: emailValue, image: '',altaUsuario: fechadeAltaUsuario,ultimoLogin:''}]);             
                newUser__password.style.border="none"
                newUser__repeatPassword.style.border="none"
                           
                await fetch('https://api-login-production-0e46.up.railway.app/user/new', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // mode: "no-cors",
                    body: nuevoUser,
                })
                return;
            }
        } else if(usuarios.length){
            if(usuarios.some(user => user.username.toLowerCase() === usernameValue.toLowerCase())){
                message_fail.textContent= "Este usuario ya se encuentra registrado!";
                message_failTimmer();
                message_fail.style.display="block"
               return;
            }
            if(!validarPassword(e)===false){
                nuevoUser = [... nuevoUser,{id: usuarios.length +1, username: usernameValue, password:passwordValue, email: emailValue, image: '',altaUsuario: fechadeAltaUsuario,ultimoLogin:''}];
                let verificarPass = JSON.stringify(nuevoUser)
                newUser__password.style.border="none"
                newUser__repeatPassword.style.border="none"
              
                await fetch('https://api-login-production-0e46.up.railway.app/user/new', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // mode: "no-cors",
                    body: verificarPass,
                })
                return;
              
            } 
        }
}


//Se oculta formulario LOGIN y se muestra newUser
const mostrarNewUser = e => {
    e.preventDefault();
    container_login.style.display = "none";
    container_newUser.style.display = "flex"
    message_newUser.style.display="block"
}
///////////////////////////////////////////////////////////////////////////////////////////////

//FUNCIONES PARA LOGIN- usuario ya registrado.
const requestApi = async () => {
    try {
        const urlBase = `https://api-login-production-0e46.up.railway.app/user`;
        const conexion = await fetch(urlBase);
        const json = await conexion.json();
        let arrayRecortado = await json.flat().map(usuario => usuario)
        return arrayRecortado;
    } catch (error) {
        console.log(error)
    }
}

const iniciarSesion = async (e) => {
    e.preventDefault();
    const message_profile_error = document.querySelector('.message_profile_error')
    message_profile_error.style.color='red';
    const userValue = user.value.trim();
    const passwordValue = password.value.trim();

    const usuarios = await requestApi();
    let usuariosLogin = [];
    
    if(usuariosLogin= usuarios.filter(usuario => usuario.username === userValue)){
        if(!usuariosLogin.length) {
            message_profile_error.innerHTML = 'No existe este usuario!'
            return;
        }

        ultimoLogin = fechadeAltaUsuario.toLocaleString()
        const passwordValueJSON = JSON.stringify({pass: passwordValue, username: userValue, lastLogin: ultimoLogin})
    
        let autenticar = await fetch('https://api-login-production-0e46.up.railway.app/user/autenticacion',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: passwordValueJSON
    });
    
    autenticar.status === 200 ? 
      cargarPerfil(usuariosLogin)
      :
      message_profile_error.innerHTML = 'Contrase??a incorrecta!'

    } 

}

const createHTMLuserProfile = array => {
    const imagen = array[0].image ? array[0].image : `./user.jpg`
    return `
                <div class="userProfile" id="userProfile">
                    <h3 class="title_profile">Bienvenido ${array[0].username}!</h3>
                    <div id="form_img_profile">
                       <img src="${imagen}" alt="" class="img_profile">
                       <input type="text" id="input_img_profile" placeholder="Inserta una URL de imagen">
                       <button type="click" class="btnImagen" onclick="cargarImagen()">Cargar Imagen</button>
                    </div>
                    <h2 class="username_profile">Username: ${array[0].username}</h2>
                    <h2 class="email_profile">Email: ${array[0].email}</h2>
                    <a href="index.html" class="irAinicioProfile" onclick="mostrarLogindesdeProfile()">Ir a Inicio</a>

                </div> 
    `
}
const rendercreateHTMLuserProfile = array => {
    container_userProfile.innerHTML = createHTMLuserProfile(array);
}
const cargarPerfil = async array => {
    const message_profile_okay = document.querySelector('.message_profile_okay')
    container_login.style.display = "none";
    message_profile_okay.innerHTML='Iniciando sesion ...'
    setTimeout(()=>{
        container_userProfile.style.display = "flex";
        message_profile_okay.style.display="none"
        rendercreateHTMLuserProfile(array)
    },2000)
    message_profile_okay.style.display="block"

    
}


//esta funcion carga la imagen segun el usuario que se inicie sesion y sube la imagen a la api.
//es llamada atraves de atributo OnClick en la clase "btnImagen" de createHTMLUserProfile().
const cargarImagen = async () => {
    const input_img_profile = document.getElementById('input_img_profile');
    const form_img_profile = document.getElementById('form_img_profile');
    const imgProfile = input_img_profile.value.trim()
    form_img_profile.innerHTML = `<img src="${imgProfile}" alt="Not Found" class="img_profile">`
    
    let perfilUsuario = [];
    let usuarios = await requestApi();

    perfilUsuario = usuarios.filter(usuario => usuario.username === user.value)
    
    //se agrega la imagen a la api
    perfilUsuarioMapeado = usuarios.map(user => {
        if(user.username === perfilUsuario[0].username){
            user.image = imgProfile
            return user;
        } else {
           return user;;
        }
    })

    await fetch(`https://api-login-production-0e46.up.railway.app/user`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(perfilUsuarioMapeado)
    })
    
    
}
const mostrarLogindesdeProfile =()=>{
    container_userProfile.style.display="none"
    container_login.style.display = "flex";
}



 init = () => {
//eventos para newUser
form_newUser.addEventListener('submit', addNewUser)
linkCreateUser.addEventListener('click', mostrarNewUser)
message_password.style.color="red"
message_fail.style.color="red"
////////

//eventos para login
form_login.addEventListener('submit', iniciarSesion)

//eventos para userProfile
//el evento de cargar imagen se ejecuta atraves del atributo HTML "onclick" con la funcion, "cargarImagen()"

}

init();