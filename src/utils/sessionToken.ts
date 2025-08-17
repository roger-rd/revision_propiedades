export function newSessionToken() {
     // Suficiente para token de sesión (no criptográfico)
    return 'st_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}