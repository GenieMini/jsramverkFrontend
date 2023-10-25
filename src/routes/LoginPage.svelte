<script>
    import { renderMainView, renderRegisterView, sendRequest, ROUTES } from "./utils";
    import { TOKEN } from '$lib/stores/DelayStore';

    function removeInvalid() {
        let x = document.forms["myForm"]["email"];
        let y = document.forms["myForm"]["pass"];
        x.classList.remove("invalid-input");
        y.classList.remove("invalid-input");
    }

    function validateForm() {
        let valid = true
        let x = document.forms["myForm"]["email"];
        let y = document.forms["myForm"]["pass"];

        if (x.value == "") {
            x.classList.add("invalid-input");
            valid = false;
        }
        if (y.value == "") {
            y.classList.add("invalid-input");
            valid = false;
        }

        return valid;
    }

    async function attemptLogin() {
        if (validateForm()) {
            let user = {
                email: document.forms["myForm"]["email"].value,
                password: document.forms["myForm"]["pass"].value
            };

            let res = await sendRequest(ROUTES.LOGIN, user, 'POST');
            if (res.ok) {
                let data = await res.json()
                $TOKEN = data.data.token
                renderMainView();
            }
        }
    }
</script>

<div class="login-container">
    
    <div class="login-box">
        <h1 style="margin-bottom: 50px">Login</h1>
        <form name="myForm" class="login-form" on:submit={attemptLogin}>
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" on:click={removeInvalid}><br>
            <label for="pass">Password:</label>
            <input type="password" id="pass" name="pass" on:click={removeInvalid}><br>
            <input type="submit" value="Login"><br>
        </form>
        <button on:click={renderRegisterView}>
            Create new account
        </button>
    </div>

</div>

<style>
    .login-container {
        background-color: #151619;
        display: grid;
        align-content: center;
        text-align: center;
        width: 100vw;
        justify-content: center;
    }

    .login-box {
        background-color: #f1f1f1;
        padding: 50px;
        width: fit-content;
        border-radius: 15px;
    }

    .login-form {
        display: grid;
        justify-content: center;
    }

    :global(.invalid-input) {
        border: 2px solid red;
    }

    input, button {
        padding: 5px;
        width: 100%;
    }

    button {
        border: 2px solid #70d7ff;
        border-radius: 5px;
        background: #d2e9ff;
    }

    button:hover {
        background: #c6dcf0;
    }
</style>