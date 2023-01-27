//Practica 1 realizada por Arturo Requejo y Nacho Moreno el 7/10/22

const array = [200, 4, 3];
const array2 = [1, [ 1, 2, [3,4,[5,6, ['7']]] ]];
const array3 = ['1', '2', '3'];



 function convertiraInt(array: Array<Number|String> ){
        return array.flat(Number.MAX_SAFE_INTEGER).map((x) => {
            if(typeof x === 'string'){
                return parseInt(x);
            }else{
              return x
            }
       })
    
  }
 

function multiplicacion(a: Array<any>){
    try {
        return a.map((n, index) => {
            let multiplicacion = 1;
            a.forEach((elem, index2) => {
                if (index != index2) {
                    multiplicacion *= elem;
                }
            });
            return multiplicacion;
        });
    } catch (error) {
        console.log(error)
    }
    
}

function final(a2: Array<any>){
    const arraypasado = convertiraInt(a2);
    const multiplicacion2 = multiplicacion(arraypasado);
    return multiplicacion2;
}

console.log(final(array2));

export default final;


