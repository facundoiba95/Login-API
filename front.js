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

// variables de userProfile
const container_userProfile = document.querySelector('.container-userProfile');


// FUNCIONES PARA NEWUSER !!!!
const message = document.querySelector('.message-error')
//Array donde se guardan los usuarios nuevos y ya registrados
const saveLocalStorage = array => {
    localStorage.setItem('usuariosLocal', JSON.stringify(array))
}

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

//VALIDACIONES de Password, si se validan, retorna la contraseña validada.
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
        return;
    }
    if(!passwordValue.match(lowerCase)){
               message_password.innerHTML = 'Debe ingresar minuscula';
               message_passwordTimmer();
               message_password.style.display="block";
               return;
            } else if(!passwordValue.match(upperCase)){
                message_password.innerHTML = 'Debe ingresar mayuscula';
                message_passwordTimmer();
                message_password.style.display="block";
                return;
            } else if(!passwordValue.match(number)){
                message_password.innerHTML = 'Debe ingresar numero'
                message_passwordTimmer();
                message_password.style.display="block";
                return;
            } else if(!passwordValue.match(symbol)){
                message_password.innerHTML = 'Debe ingresar simbolo'
                message_passwordTimmer();
                message_password.style.display="block";
                return;
            } else if(passwordValue !== repeatPasswordValue){
                message_password.textContent= "Las contraseñas no coinciden! Porfavor, verifícalas.";
                message_passwordTimmer();
                message_password.style.display="block";
                return;
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
    let nuevoUser = JSON.parse(localStorage.getItem('usuariosLocal')) || [];

    const passwordValue= newUser__password.value.trim();
    const usernameValue = newUSer__username.value.trim()
    const emailValue = newUser__email.value.trim();

    if(nuevoUser.some(user => user.username.toLowerCase() === usernameValue.toLowerCase())){
        message_fail.textContent= "Este usuario ya se encuentra registrado!";
        message_failTimmer();
        message_fail.style.display="block"
       return;
    } else if(typeof validarPassword(e).toString()){
        nuevoUser = [... nuevoUser,{id: nuevoUser.length +1, username: usernameValue, password:passwordValue, email: emailValue, image: ''}]

        newUser__password.style.border="none"
        newUser__repeatPassword.style.border="none"
       
        await fetch('https://api-login-users.herokuapp.com/user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoUser),
        })

        saveLocalStorage(nuevoUser)
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
        const urlBase = `https://api-login-users.herokuapp.com/user`;
        const conexion = await fetch(urlBase);
        const json = await conexion.json();
        console.log(json)
        return json;
    } catch (error) {
        console.log(error)
    }
}

const iniciarSesion = async e => {
    e.preventDefault();
    const userValue = user.value.trim();
    const passwordValue = password.value.trim();
    const usuarios = await requestApi();
    let usuariosLogin = [];
    
    if(usuariosLogin = usuarios.filter(usuario => usuario.username === userValue)){
        if(!usuariosLogin.length) {
            alert('No se encontro usuario');
            return;
        }
        if(usuariosLogin[0].password === passwordValue){
        //aca va una funcion que muestra el perfil del usuario que inicio sesion.
            alert('Se inicio sesion !');
            cargarPerfil(usuariosLogin)
            return;
        }else {
            alert('Contraseña incorrecta');
            return;
        }
    } 
}

const createHTMLuserProfile = array => {
    const imagen = array[0].image ? array[0].image : `./user.jpg`
    return `
                <div class="userProfile">
                    <h3 class="title_profile">Bienvenido ${array[0].username}!</h3>
                    <div id="form_img_profile">
                       <img src="${imagen}" alt="" class="img_profile">
                       <input type="text" id="input_img_profile" placeholder="Inserta una URL de imagen">
                       <button type="click" class="btnImagen" onclick="cargarImagen()">Cargar Imagen</button>
                    </div>
                    <h2 class="username_profile">Username: ${array[0].username}</h2>
                    <h2 class="email_profile">Email: ${array[0].email}</h2>
                
                </div> 
    `
}
const rendercreateHTMLuserProfile = array => {
    container_userProfile.innerHTML = createHTMLuserProfile(array);
}
const cargarPerfil = async array => {
    container_login.style.display = "none";
    container_userProfile.style.display = "flex";
    rendercreateHTMLuserProfile(array)

}

//esta funcion carga la imagen segun el usuario que se inicie sesion y sube la imagen a la api.
//es llamada atraves de atributo OnClick en la clase "btnImagen"
const cargarImagen = async () => {
    const input_img_profile = document.getElementById('input_img_profile');
    const form_img_profile = document.getElementById('form_img_profile');
    const imgProfile = input_img_profile.value.trim()
    form_img_profile.innerHTML = `<img src="${imgProfile}" alt="Not Found" class="img_profile">`
    
    let perfilUsuario = JSON.parse(localStorage.getItem('usuariosLocal')) || [];
    let usuarios = await requestApi();

    perfilUsuario = usuarios.filter(usuario => usuario.username === user.value)
    console.log(perfilUsuario)

    perfilUsuarioMapeado = usuarios.map(user => {
        if(user.username === perfilUsuario[0].username){
            user.image = imgProfile
            return usuarios;
        } else {
           return usuarios;
        }
    })

    await fetch(`https://api-login-users.herokuapp.com/user`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(perfilUsuarioMapeado[0])
    })
    saveLocalStorage(perfilUsuarioMapeado[0])
    
}


const init = () => {
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