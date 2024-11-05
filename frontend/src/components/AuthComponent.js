import React from "react";
import cbor from 'cbor';


function bufferDecode(value) {
    const padding = '='.repeat((4 - (value.length % 4)) % 4);
    const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function register() {
    const response = await fetch("/api/webauthn/register/options", { method: "POST" });
    const options = await response.json();

    // Преобразуем challenge обратно в Uint8Array
    options.challenge = bufferDecode(options.challenge);

    const credential = await navigator.credentials.create({ publicKey: options });

    await fetch("/api/webauthn/register/verify", {
        method: "POST",
        body: JSON.stringify({
            clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
            attestationObject: Array.from(new Uint8Array(credential.response.attestationObject))
        }),
        headers: { "Content-Type": "application/json" }
    });
}

async function authenticate() {
    const response = await fetch("/api/webauthn/authenticate/options", { method: "POST" });
    const options = await response.json();

    const assertion = await navigator.credentials.get({ publicKey: options });

    await fetch("/api/webauthn/authenticate/verify", {
        method: "POST",
        body: JSON.stringify({
            clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON)),
            authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData)),
            signature: Array.from(new Uint8Array(assertion.response.signature))
        }),
        headers: { "Content-Type": "application/json" }
    });
}


export default function AuthComponent() {
    return (
        <div>
            <button onClick={register}>Register with WebAuthn</button>
            <button onClick={authenticate}>Login with WebAuthn</button>
        </div>
    );
}
