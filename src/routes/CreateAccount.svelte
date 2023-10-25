<script>
    import { renderLoginView, sendRequest, ROUTES } from "./utils";

    let buttonDisable = false;

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

    async function registerAccount() {
        if (validateForm()) {
            buttonDisable = true;
            let user = {
                email: document.forms["myForm"]["email"].value,
                password: document.forms["myForm"]["pass"].value
            };

            let res = await sendRequest(ROUTES.REGISTER, user, 'POST');
            if (res.ok) {
                renderLoginView();
            }
        }
    }
</script>

<div class="login-container">
    
    <div class="login-box">
        <h1 style="margin-bottom: 50px">Register account</h1>
        <form name="myForm" class="login-form" on:submit={registerAccount}>
            <label for="email">Email:</label>
            <input type="text" id="email" name="email" on:click={removeInvalid}><br>
            <label for="pass">Password:</label>
            <input type="password" id="pass" name="pass" on:click={removeInvalid}><br>
            <input type="submit" value="Create Account" disabled={buttonDisable}>
        </form>
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

    input {
        padding: 5px;
        width: 100%;
    }
</style>