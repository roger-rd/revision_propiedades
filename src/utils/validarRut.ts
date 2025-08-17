export function validarRut(rut: string): boolean {
    rut = rut.replace(/\./g, "").replace("-", "").toLowerCase();
  
    if (rut.length < 8) return false;
  
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
  
    let suma = 0;
    let multiplo = 2;
  
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
  
    const dvEsperado = 11 - (suma % 11);
    const dvReal = dv === "k" ? 10 : dv === "0" ? 11 : parseInt(dv);
  
    return dvEsperado === dvReal;
  }
  